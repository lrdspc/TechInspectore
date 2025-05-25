import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useEffect, useState } from 'react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function PWAInstallButton({
  className = '',
  variant = 'default',
  size = 'default',
  children = 'Instalar App',
}: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isJustInstalled, setIsJustInstalled] = useState(false);

  // Mostra o botão apenas se for instalável e não estiver instalado
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      setShowInstallButton(true);
    } else {
      setShowInstallButton(false);
    }
  }, [isInstallable, isInstalled]);

  // Lida com o clique no botão de instalação
  const handleInstallClick = async () => {
    if (!isInstallable || isInstalled) return;

    try {
      setIsInstalling(true);
      const installed = await install();
      
      if (installed) {
        setIsJustInstalled(true);
        // Esconde o botão após 3 segundos
        setTimeout(() => {
          setShowInstallButton(false);
          setIsJustInstalled(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao instalar o aplicativo:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Se não for para mostrar o botão, retorna null
  if (!showInstallButton) {
    return null;
  }

  return (
    <Button
      className={`pwa-install-button ${className}`}
      onClick={handleInstallClick}
      disabled={isInstalling || isJustInstalled}
      variant={variant}
      size={size}
    >
      {isInstalling ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Instalando...
        </>
      ) : isJustInstalled ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Instalado!
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {children}
        </>
      )}
    </Button>
  );
}

export default PWAInstallButton;
