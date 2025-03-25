/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_SPLASH_BACKGROUND: string;
  readonly VITE_SPLASH_LOGO_TEXT: string;
  readonly VITE_SPLASH_DURATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
