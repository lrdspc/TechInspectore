/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

declare module 'virtual:pwa-register/react' {
  import type { Dispatch, SetStateAction } from 'react';
  import type { RegisterSWOptions } from 'virtual:pwa-register';

  export interface RegisterSWOptionsReact extends RegisterSWOptions {
    onRegisterError?: (error: any) => void;
  }

  export function useRegisterSW(
    options?: RegisterSWOptionsReact
  ):
    | {
        needRefresh: [boolean, () => void];
        offlineReady: [boolean, () => void];
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
      }
    | undefined;
}

declare global {
  interface Window {
    workbox?: {
      messageSkipWaiting(): void;
      messageSW(sw: ServiceWorker, data: any): Promise<any>;
    };
  }

  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
      getTags(): Promise<string[]>;
    };
  }
}
