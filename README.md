# PC端: rabbit-web

技术栈：Vue3 + Typescript + Pinia + Vite + Axios + Less + Pnpm + Husky + Eslint

次要：
- pinia-plugin-persistedstate 适用于 Pinia 的持久化存储插件
- unplugin-vue-components 按需自动导入组件
- unplugin-auto-import 按需自动导入 API


### 组合式函数 hooks

**实现步骤：**

- 按照业务以 `use` 开头的逻辑函数

- 把独立的业务逻辑封装成各个函数内部

- 函数内部把组件中需要用到的数据和方法 return 出去

- 在组件中调用函数把数据和方法组合回来使用
