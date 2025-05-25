import { useState, useEffect, useCallback } from 'react';

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Verifica se há atualizações disponíveis
  const checkForUpdates = useCallback(async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers não são suportados neste navegador');
      }

      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        throw new Error('Nenhum service worker registrado');
      }

      setRegistration(reg);
      await reg.update();
      
      if (reg.waiting) {
        setIsUpdateAvailable(true);
      }

      return reg;
    } catch (err) {
      console.error('Erro ao verificar atualizações:', err);
      setError(err instanceof Error ? err : new Error('Erro ao verificar atualizações'));
      return null;
    }
  }, []);

  // Registra o service worker
  const registerSW = useCallback(async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers não são suportados neste navegador');
      }

      const reg = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        type: 'module',
      });

      setRegistration(reg);
      console.log('Service Worker registrado com sucesso:', reg);
      
      // Verifica atualizações imediatamente após o registro
      await checkForUpdates();
      
      return reg;
    } catch (err) {
      console.error('Falha ao registrar o Service Worker:', err);
      setError(err instanceof Error ? err : new Error('Falha ao registrar o Service Worker'));
      return null;
    }
  }, [checkForUpdates]);

  // Atualiza para a nova versão do service worker
  const updateServiceWorker = useCallback(async () => {
    if (!registration || !registration.waiting) {
      return false;
    }

    try {
      setIsUpdating(true);
      
      // Envia uma mensagem para o service worker pular a espera
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Atualiza a página após um curto atraso para garantir que a mensagem seja processada
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
      
      return true;
    } catch (err) {
      console.error('Falha ao atualizar o Service Worker:', err);
      setError(err instanceof Error ? err : new Error('Falha ao atualizar o Service Worker'));
      setIsUpdating(false);
      return false;
    }
  }, [registration]);

  // Efeito para configurar os listeners do service worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const handleControllerChange = () => {
      console.log('Novo Service Worker assumiu o controle');
      window.location.reload();
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Recebida mensagem para pular a espera');
        window.location.reload();
      }
    };

    const handleOfflineReady = () => {
      console.log('O aplicativo está pronto para uso offline');
      setIsOfflineReady(true);
    };

    // Configura os listeners
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    navigator.serviceWorker.addEventListener('message', handleMessage);
    window.addEventListener('offlineReady', handleOfflineReady as EventListener);

    // Registra o service worker
    registerSW();

    // Configura a verificação periódica de atualizações (a cada 1 hora)
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

    // Limpa os listeners e o intervalo quando o componente for desmontado
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      navigator.serviceWorker.removeEventListener('message', handleMessage);
      window.removeEventListener('offlineReady', handleOfflineReady as EventListener);
      clearInterval(interval);
    };
  }, [registerSW, checkForUpdates]);

  return {
    registration,
    isUpdateAvailable,
    isOfflineReady,
    isUpdating,
    error,
    checkForUpdates,
    updateServiceWorker,
  };
}
