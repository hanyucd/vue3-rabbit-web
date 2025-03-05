module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  // parser 是 ESLint 配置文件的顶级选项，用于指定整个 ESLint 配置使用的解析器。这是设置解析器的主要方式
  parser: 'vue-eslint-parser',
  parserOptions: {
    // https://www.cnblogs.com/sincisco/articles/18200878
    // 用于指定在某些解析器（如 vue-eslint-parser）中嵌套使用的解析器
    parser: '@typescript-eslint/parser', // 对 <script lang="ts"> 使用 TS 解析器
    ecmaVersion: 'latest',
  },
  // 要注意 eslint 和 @typescript-eslint 版本不兼容的问题，因为不同的ESLint版本可能需要不同版本的插件支持
  // 继承已有的规则
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    './.eslintrc-auto-import.json'
  ],
  // https://juejin.cn/post/7230838101076459557
  // plugins: ['vue', '@typescript-eslint'],
  rules: {
    // eslint (http://eslint.cn/docs/rules)
    semi: ['error', 'always'], // 强制在语句末尾使用分号
    quotes: ['error', 'single', { allowTemplateLiterals: true }], // 强制使用单引号 & 允许字符串使用反勾号

    // typeScript (https://typescript-eslint.io/rules)
    '@typescript-eslint/semi': 'error', // 强制在语句末尾使用分号
    '@typescript-eslint/quotes': ['error', 'single', { allowTemplateLiterals: true }], // 强制使用单引号 & 允许字符串使用反勾号
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // 接口和类型别名中的成员之间分隔符
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': { 'delimiter': 'semi', 'requireLast': true },
        'singleline': { 'delimiter': 'semi', 'requireLast': false },
        'multilineDetection': 'brackets'
      }
    ],

    'no-multiple-empty-lines': ['error', { 'max': 1 }], // 空行最多不能超过 1 行

    // vue (https://eslint.vuejs.org/rules)
    'vue/singleline-html-element-content-newline': 'off', // 在单行元素的内容前后需要换行符
    'vue/require-default-prop': 'off', // 关闭 props 需要默认值
    'vue/no-v-html': 'off', // 关闭 Disallow use of v-html to prevent XSS attack
    'vue/multi-word-component-names': 'off', // 关闭 组件名称始终是多个单词
    'no-unused-vars': 'off', // 禁止使用未声明的变量
    'vue/v-on-event-hyphenation': 'off', // 禁止对模板中的自定义组件强制执行 v-on 事件命名样式
    // 控制一/多行可接受的属性量
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 10 },
        multiline: { max: 1 },
      },
    ],
    // 空标签需要自闭合
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  }
};
