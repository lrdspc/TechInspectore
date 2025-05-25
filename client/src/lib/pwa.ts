import { addToSyncQueue, getSyncQueue, removeFromSyncQueue, updateSyncQueueItem, clearAllData } from './db';

type ServiceWorkerMessage = {
  type: string;
  payload?: any;
};

// Re-export isOnline to avoid import errors
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === true;
}

// Re-export clearAllData function
export { clearAllData };

// Register service worker
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        type: 'module',
        scope: '/',
        updateViaCache: 'none',
      });
      
      console.log('ServiceWorker registered with scope:', registration.scope);
      
      // Configura os listeners de mensagens do service worker
      setupServiceWorkerListeners(registration);
      
      // Verifica atualizações periodicamente
      checkForServiceWorkerUpdates();
      
      // Configura sincronização periódica se suportado
      setupPeriodicSync();
      
      // Processa a fila de sincronização quando estiver online
      window.addEventListener('online', processSyncQueue);
      
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      throw error; // Propaga o erro para que o chamador saiba que falhou
    }
  }
  
  return null;
}

// Configura os listeners de mensagens do service worker
function setupServiceWorkerListeners(registration: ServiceWorkerRegistration) {
  // Listener para mensagens do service worker
  navigator.serviceWorker.addEventListener('message', (event: MessageEvent<ServiceWorkerMessage>) => {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'OFFLINE_READY':
        console.log('O aplicativo está pronto para uso offline');
        // Dispara um evento personalizado para notificar outros componentes
        window.dispatchEvent(new CustomEvent('offlineReady'));
        break;
        
      case 'UPDATE_AVAILABLE':
        console.log('Nova atualização disponível');
        // Dispara um evento personalizado para notificar sobre a atualização
        window.dispatchEvent(new CustomEvent('updateAvailable', { detail: payload }));
        break;
        
      case 'SYNC_STATUS':
        console.log('Status da sincronização:', payload);
        // Dispara um evento personalizado com o status da sincronização
        window.dispatchEvent(new CustomEvent('syncStatus', { detail: payload }));
        break;
        
      default:
        console.log('Mensagem do service worker não tratada:', type, payload);
    }
  });
  
  // Listener para atualizações do service worker
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    if (!newWorker) return;
    
    newWorker.addEventListener('statechange', () => {
      console.log('Estado do novo service worker:', newWorker.state);
      
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Novo service worker instalado, mas ainda não ativado
        window.dispatchEvent(new CustomEvent('updateReady'));
      }
    });
  });
  
  // Verifica se há um service worker esperando para ativar
  if (registration.waiting) {
    window.dispatchEvent(new CustomEvent('updateReady'));
  }
}

// Set up periodic background sync if supported
async function setupPeriodicSync() {
  if ('periodicSync' in navigator.serviceWorker) {
    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as any,
      });
      
      if (status.state === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        if ('periodicSync' in registration) {
          await (registration as any).periodicSync.register('sync-data', {
            minInterval: 15 * 60 * 1000, // 15 minutes
          });
          console.log('Periodic background sync registered');
        }
      }
    } catch (error) {
      console.error('Periodic background sync registration failed:', error);
    }
  }
}

// Process the sync queue when the device goes back online
export async function processSyncQueue() {
  if (!isOnline()) return;
  
  const queue = await getSyncQueue();
  if (queue.length === 0) return;
  
  console.log(`Processing ${queue.length} items in sync queue`);
  
  // Process items in order (oldest first)
  const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);
  
  for (const item of sortedQueue) {
    try {
      // Increment attempt count
      await updateSyncQueueItem(item.id, { attempts: item.attempts + 1 });
      
      // Make the request
      const response = await fetch(item.url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          // Include auth headers if needed
        },
        body: item.body ? JSON.stringify(item.body) : undefined,
        credentials: 'include',
      });
      
      if (response.ok) {
        // If successful, remove from queue
        await removeFromSyncQueue(item.id);
        console.log(`Successfully synced item: ${item.id}`);
      } else {
        // If max attempts reached (5), remove from queue
        if (item.attempts >= 5) {
          await removeFromSyncQueue(item.id);
          console.error(`Max attempts reached for sync item: ${item.id}, removing from queue`);
        } else {
          console.error(`Failed to sync item: ${item.id}, status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`Error syncing item: ${item.id}`, error);
    }
  }
}

// Add a fetch request to the sync queue
export async function queueRequest(method: string, url: string, body?: any) {
  await addToSyncQueue(method, url, body);
  
  // Try to process immediately if online
  if (isOnline()) {
    processSyncQueue();
  }
}

// Check if app needs update
export async function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version installed but waiting to activate
          if (confirm('Nova versão disponível! Recarregar para atualizar?')) {
            window.location.reload();
          }
        }
      });
    });
  }
}

// Manually check for service worker updates
export async function checkForServiceWorkerUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await registration.update();
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  }
}
