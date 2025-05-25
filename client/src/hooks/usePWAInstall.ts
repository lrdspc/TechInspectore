import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
  
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent;
  }
}

type UsePWAInstallResult = {
  isInstalled: boolean;
  isInstallable: boolean;
  isStandalone: boolean;
  install: () => Promise<boolean>;
};

export function usePWAInstall(): UsePWAInstallResult {
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  // Verifica se o PWA já está instalado
  const checkIfPWAInstalled = useCallback((): boolean => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.location.search.includes('source=pwa')
    );
  }, []);

  const [isInstalled, setIsInstalled] = useState<boolean>(checkIfPWAInstalled());

  // Efeito para verificar o modo standalone
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneCheck = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneCheck);
      
      // Se estiver em modo standalone, considera como instalado
      if (isStandaloneCheck) {
        setIsInstalled(true);
      }
    };

    // Verifica imediatamente
    checkStandalone();

    // Configura um listener para mudanças no modo de exibição
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    return () => {
      mediaQuery.removeEventListener('change', checkStandalone);
    };
  }, []);

  // Efeito para lidar com o evento beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Previne o comportamento padrão
      e.preventDefault();
      
      // Armazena o evento para ser usado posteriormente
      deferredPrompt.current = e;
      
      // Atualiza o estado para indicar que o PWA pode ser instalado
      setIsInstallable(true);
      
      // Se o PWA já estiver instalado, limpa o prompt
      if (checkIfPWAInstalled()) {
        setIsInstallable(false);
        window.deferredPrompt = undefined;
      }
    };

    const handleAppInstalled = () => {
      // Limpa o prompt após a instalação
      setIsInstallable(false);
      setIsInstalled(true);
      window.deferredPrompt = undefined;
      
      // Rastreia a instalação se necessário
      if (process.env.NODE_ENV === 'production') {
        // Aqui você pode adicionar seu código de rastreamento
        console.log('PWA instalado com sucesso!');
      }
    };

    // Adiciona os listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verifica se o evento beforeinstallprompt já foi disparado
    if (window.deferredPrompt) {
      handleBeforeInstallPrompt(window.deferredPrompt as BeforeInstallPromptEvent);
    }

    // Limpeza
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkIfPWAInstalled]);

  // Função para acionar a instalação
  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt.current) {
      console.warn('O prompt de instalação não está disponível');
      return false;
    }

    try {
      // Mostra o prompt de instalação
      deferredPrompt.current.prompt();
      
      // Aguarda a resposta do usuário
      const { outcome } = await deferredPrompt.current.userChoice;
      
      // Limpa o prompt após o uso
      deferredPrompt.current = null;
      window.deferredPrompt = undefined;
      
      // Retorna true se o usuário aceitou a instalação
      return outcome === 'accepted';
    } catch (error) {
      console.error('Erro ao instalar o PWA:', error);
      return false;
    }
  }, []);

  return {
    isInstalled,
    isInstallable,
    isStandalone,
    install,
  };
}
