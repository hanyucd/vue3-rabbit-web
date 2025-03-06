/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用端口 */
  VITE_APP_PORT: number;
  /** API 地址 */
  VITE_APP_API_URL: string;
  /** 应用 名称 */
  VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
