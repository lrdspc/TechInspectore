import { Workbox } from 'workbox-window';

declare global {
  interface Window {
    workbox: Workbox;
    __WB_DISABLE_DEV_LOGS?: boolean;
  }

  // Extende a interface WindowEventMap para incluir os eventos personalizados
  interface WindowEventMap {
    'offlineReady': CustomEvent;
    'updateAvailable': CustomEvent<{ version: string }>;
    'updateReady': CustomEvent;
    'syncStatus': CustomEvent<{ status: string; timestamp: number }>;
  }

  // Extende a interface ServiceWorkerRegistration para incluir métodos do Workbox
  interface ServiceWorkerRegistration {
    navigationPreload?: {
      enable: () => Promise<void>;
      disable: () => Promise<void>;
      setHeaderValue: (value: string) => Promise<void>;
      getState: () => Promise<{ enabled: boolean }>;
    };
  }
}

// Declara os módulos para os quais não temos tipos
declare module 'workbox-window';
declare module 'workbox-core';
declare module 'workbox-expiration';
declare module 'workbox-precaching';
declare module 'workbox-routing';
declare module 'workbox-strategies';
