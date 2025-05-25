import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function PWAUpdater() {
  const [showReload, setShowReload] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  
  const {
    isUpdateAvailable,
    isOfflineReady,
    isUpdating,
    updateServiceWorker,
    checkForUpdates,
  } = useServiceWorker();

  // Atualiza o estado quando uma atualização estiver disponível
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowReload(true);
    }
  }, [isUpdateAvailable]);

  // Atualiza o estado quando o aplicativo estiver pronto para uso offline
  useEffect(() => {
    if (isOfflineReady) {
      setOfflineReady(true);
      setShowReload(true);
    }
  }, [isOfflineReady]);

  // Verifica atualizações quando o componente for montado
  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  // Lida com a atualização do service worker
  const handleUpdate = useCallback(async () => {
    await updateServiceWorker();
  }, [updateServiceWorker]);

  // Fecha o diálogo
  const handleClose = useCallback(() => {
    setShowReload(false);
  }, []);

  // Se não houver atualizações disponíveis e o app não estiver pronto para offline, não renderiza nada
  if (!isUpdateAvailable && !isOfflineReady) {
    return null;
  }

  return (
    <Dialog open={showReload} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {offlineReady ? 'Pronto para uso offline' : 'Atualização disponível'}
          </DialogTitle>
          <DialogDescription>
            {offlineReady
              ? 'O aplicativo agora está pronto para uso offline!'
              : 'Uma nova versão do aplicativo está disponível. Deseja atualizar agora?'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {!offlineReady && (
            <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              Depois
            </Button>
          )}
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating 
              ? 'Atualizando...' 
              : offlineReady 
                ? 'Fechar' 
                : 'Atualizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
