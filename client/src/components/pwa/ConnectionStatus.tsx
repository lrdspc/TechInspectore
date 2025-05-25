import { useEffect, useState } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ConnectionStatus = 'online' | 'offline' | 'reconnecting';

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>('online');
  const [showStatus, setShowStatus] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Efeito para monitorar o status da conexão
  useEffect(() => {
    const handleOnline = () => {
      if (wasOffline) {
        setStatus('reconnecting');
        setShowStatus(true);
        
        // Esconde a notificação após 3 segundos
        const timer = setTimeout(() => {
          setStatus('online');
          setTimeout(() => setShowStatus(false), 500);
          setWasOffline(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setStatus('offline');
      setShowStatus(true);
      setWasOffline(true);
    };

    // Verifica o status inicial
    if (navigator.onLine) {
      setStatus('online');
      setShowStatus(false);
    } else {
      handleOffline();
    }

    // Adiciona os listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Limpa os listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Mapeamento de ícones para cada status
  const statusIcons = {
    online: <Wifi className="h-4 w-4" />,
    offline: <WifiOff className="h-4 w-4" />,
    reconnecting: <AlertCircle className="h-4 w-4 animate-pulse" />,
  };

  // Mapeamento de mensagens para cada status
  const statusMessages = {
    online: 'Você está online',
    offline: 'Você está offline. Alguns recursos podem não estar disponíveis.',
    reconnecting: 'Reconectando...',
  };

  // Classes CSS para cada status
  const statusClasses = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-red-100 text-red-800 border-red-200',
    reconnecting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  if (!showStatus) {
    return null;
  }

  return (
    <div 
      className={cn(
        'fixed bottom-4 left-4 z-50 px-4 py-2 rounded-md border flex items-center space-x-2 shadow-md transition-all duration-300',
        statusClasses[status],
        showStatus ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <span className="flex-shrink-0">
        {statusIcons[status]}
      </span>
      <span className="text-sm font-medium">
        {statusMessages[status]}
      </span>
    </div>
  );
}

export default ConnectionStatus;
