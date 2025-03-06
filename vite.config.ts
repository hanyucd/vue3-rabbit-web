import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import eslintPlugin from 'vite-plugin-eslint2';
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
  },
  css: {
    // https://cn.vitejs.dev/config/#css-preprocessoroptions
    preprocessorOptions: {
      less: {
        // 将 less/scss 代码注入到每个组件的样式中，因此（变量、混入、函数）等可以在组件样式中直接使用
        additionalData: `
          @import "@/styles/var.less";
          @import "@/styles/mixins.less";
        `,
      },
    },
  },
  plugins: [
    vue(),
    eslintPlugin(),
    Components({
      // dirs: ['src/components'], // 指定需要自动导入组件的目录列表, 默认值：['src/components']
      dts: 'src/components.d.ts',  // 生成类型声明文件
    }),
    AutoImport({
      imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
      dts: 'src/auto-imports.d.ts',  // 生成类型声明文件
      // 问题？：unplugin-auto-import 自动导入的变量在代码中被使用，但 ESLint 并没有检测到相应的import语句 | 插件冲突错误
      // 解决：如果使用了 eslint, 则会在项目根目录生成类型文件 .eslintrc-auto-import.json ，*并且确保该文件在 eslint 配置中 extends 属性中被继承*
      eslintrc: {
        enabled: true,
      },
    }),
  ],
});
