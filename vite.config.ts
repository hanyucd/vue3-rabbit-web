import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
    // host: true,
    // proxy: {
    //   '/api': {
    //     target: 'https://consult-api.itheima.net',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   }
    // },
  },
  plugins: [
    vue(),
    Components({
      // dirs: ['src/components'], // 指定需要自动导入组件的目录列表, 默认值：['src/components']
      dts: 'src/components.d.ts',  // 生成类型声明文件
    }),
    AutoImport({
      imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
      dts: 'src/auto-imports.d.ts',  // 生成类型声明文件
      eslintrc: {
        enabled: true,
      },
    }),
  ],
});
