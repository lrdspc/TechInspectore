import { useEffect, useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Download, RefreshCw, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PWAInstallButton } from './PWAInstallButton';

type PWANotificationType = 'update' | 'offline' | 'install' | 'installed' | null;

export function PWAStatus() {
  const { isInstallable, isInstalled } = usePWAInstall();
  const { isUpdateAvailable, isOfflineReady, updateServiceWorker } = useServiceWorker();
  
  const [notification, setNotification] = useState<{
    type: PWANotificationType;
    visible: boolean;
  }>({ type: null, visible: false });

  // Efeito para gerenciar notificações
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isUpdateAvailable) {
      setNotification({ type: 'update', visible: true });
    } else if (isOfflineReady) {
      setNotification({ type: 'offline', visible: true });
      timeoutId = setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 5000);
    } else if (isInstallable && !isInstalled) {
      setNotification({ type: 'install', visible: true });
    } else if (isInstalled) {
      setNotification({ type: 'installed', visible: true });
      timeoutId = setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isUpdateAvailable, isOfflineReady, isInstallable, isInstalled]);

  // Mapeamento de ícones para cada tipo de notificação
  const notificationIcons = {
    update: <RefreshCw className="h-5 w-5" />,
    offline: <WifiOff className="h-5 w-5" />,
    install: <Download className="h-5 w-5" />,
    installed: <CheckCircle className="h-5 w-5" />,
  };

  // Mapeamento de títulos para cada tipo de notificação
  const notificationTitles = {
    update: 'Atualização disponível',
    offline: 'Pronto para uso offline',
    install: 'Instalar aplicativo',
    installed: 'Aplicativo instalado!',
  };

  // Mapeamento de descrições para cada tipo de notificação
  const notificationDescriptions = {
    update: 'Uma nova versão do aplicativo está disponível.',
    offline: 'Agora você pode usar o aplicativo offline.',
    install: 'Instale o aplicativo para uma melhor experiência.',
    installed: 'O aplicativo foi instalado com sucesso!',
  };

  // Ações para cada tipo de notificação
  const notificationActions = {
    update: (
      <div className="flex space-x-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
        >
          Depois
        </Button>
        <Button 
          size="sm" 
          onClick={updateServiceWorker}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Atualizar agora
        </Button>
      </div>
    ),
    offline: null,
    install: (
      <div className="mt-2">
        <PWAInstallButton size="sm" variant="outline" />
      </div>
    ),
    installed: null,
  };

  if (!notification.type || !notification.visible) {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50 w-full max-w-sm transition-all duration-300',
      notification.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    )}>
      <Alert className="shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {notificationIcons[notification.type]}
          </div>
          <div className="ml-3 flex-1">
            <AlertTitle className="font-medium">
              {notificationTitles[notification.type]}
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              {notificationDescriptions[notification.type]}
            </AlertDescription>
            {notificationActions[notification.type]}
          </div>
          <button
            onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
            className="ml-4 -my-1.5 -mr-1.5 p-1.5 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <span className="sr-only">Fechar</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </Alert>
    </div>
  );
}

export default PWAStatus;
