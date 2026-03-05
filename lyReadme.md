# 📚 前端开发规范文档

---

### 🌈 代码规范

```markdown
<!-- 组件命名：大驼峰，模板标签：闭合/小写 -->
<template>
  <!-- 属性换行对齐 -->
  <RemarkTemplate 
    class="select-style"
    v-model="count" 
    :options="props.userOptions"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
// ░█ 顺序建议：ts类型 → refs → computed → watch → lifecycle → methods
interface IUser {
  id: number
  name: string
}

// 定义的Props必须加类型
const props = defineProps<{
  userOptions: IUser
  isActive?: boolean
}>()

const count = ref(0)
const doubleCount = computed(() => count.value \* 2)
</script>

<style scoped lang="less">
/* 必须加scoped 避免污染全局*/

/* 优先使用项目基色变量 */
.select-style {
 background: @app-main-background  
}
</style>
```

---

### TypeScript 开发规范

#### 1.  基础类型规范

##### 类型定义

- 优先使用 type 定义简单类型，interface 用于对象结构

```javascript
type TStatus = 'pending' | 'success'; // ✅ 联合类型
interface IUser {                     // ✅ 对象结构
  id: number;
} 
```

##### 泛型使用

- 必须显式声明泛型类型参数

```javascript
function identity<T>(arg: T): T { ... } // ✅ 显式声明

// 例子1：编译器无法自动推断类型
// 当函数参数的类型信息不足以让 TypeScript 自动推断泛型类型时，必须显式声明。例如
declare function combine<T>(arr1: T[], arr2: T[]): T[];
const arr = combine([1, 2, 3], ["hello"]); // ❌ 编译错误

const arr = combine<string | number>([1, 2, 3], ["hello"]); // ✅ 显式声明
//  [[10]]

-------------------------------------------------------------------------

// 例子2： 确保类型约束
// 当泛型需要满足特定类型约束时（例如实现某个接口或继承类），显式声明可避免类型不匹配。例如：
interface Lengthwise { length: number }
function logLength<T extends Lengthwise>(arg: T): void { console.log(arg.length); }

logLength(3); // ❌ number 不满足 Lengthwise
logLength<{ length: number }>({ length: 5 }); // ✅ 显式声明 [[9, 15]]

-------------------------------------------------------------------------

// 例子3：避免歧义
// 当参数类型存在多种可能时，显式声明可消除歧义。例如：
function parseValue<T>(input: string): T {
  return JSON.parse(input) as T;
}

// 显式声明期望的返回类型
const value = parseValue<number>("123"); // ✅ [[6, 10]]

```

##### 类型推断

- 禁止滥用 any，优先使用 unknown 处理不确定类型 |

```javascript
const data: unknown = fetchData() // ✅ 安全处理未知类型
if (isValid(data)) { ... }        // ✅ 配合类型守卫
```

#### 2. 复杂类型处理

```javascript
// 避免深层嵌套，使用工具类型简化
type TProductList = Array<{
  id: number
  specs: Pick<IProductSpec, 'color' | 'size'> // ✅ 精准提取属性
}>

// 使用类型别名提升可读性
type TApiResponse<T> = {
  code: number
  data: T
  error?: string
}

```

#### 3. 组件类型规范

- Props 声明必须使用严格类型:

```javascript
// 组件Props声明规范
interface IProps {
  title: string
  items: Array<{ id: string; label: string }>
  onConfirm?: (payload: TPayload) => void
}

// 带默认值的可选参数
withDefaults(defineProps<IProps>(), {
  items: () => []
})
```

#### 4.类型文件管理规范

- 全局类型: types/global.d.ts (系统级类型定义)
- 模块类型: 就近存放 + 全局导出 (组件类型在组件目录内定义)
- 第三方扩展: types 中新建拖拽类型文件 (扩展库类型声明)
 

#### 5.禁止模式

```javascript
// ❌ 禁止隐式 any
function sum(a, b) { return a + b }

// ✅ 必须显式类型标注
function sum(a: number, b: number): number {
  return a + b
}

// ❌ 禁止非空断言（除非明确可控）
const el = document.getElementById('foo')!

// ✅ 优先使用可选链和类型守卫
if (el?.classList) { ... }

```

#### 6.类型注释规范

```javascript
/**
 * 用户信息实体
 * @typedef {Object} IUser
 * @property {number} id - 用户唯一标识
 * @property {string} name - 用户显示名称
 */
interface IUser {
  /** 用户唯一标识 */
  id: number
  /** @default '无名氏' */
  name?: string
}
```

#### 7.配置相关

```javascript
{
  "compilerOptions": {
    "strict": true,          // 开启所有严格检查
    "noImplicitAny": true,   // 强化类型声明
    "strictNullChecks": true // 强化空安全
  }
}
```

> ---
>
> 1、类型安全最大化：代码中所有类型必须明确定义 
2、空值防御：强制处理可能的 null/undefined 
3、错误前置：在编译阶段捕获类型问题，而非运行时 
**_目的：大幅减少 Cannot read property 'xxx' of undefined 等运行时错误_**
>
> ---


### 🌳 重要目录结构

```markdown
src/ 
├─ 📁 api # api 接口 
├─ 📁 assets # 静态资源（图片/icon） 
├─ 📁 components # 公共组件（按功能分类） 
├─ 📁 directives # 全局指令 
├─ 📁 views # 页面级组件 
    ├─ 📁 page 
        ├─ 📁 component # 私有组件目录 
            ├─ 📁 addModal 
                ├─ index.vue 
├─ 📁 router # 路由文件 
├─ 📁 stores # Pinia 状态管理 
├─ 📁 utils # 工具函数库

# 全局 TS 类型声明

types/
```

### :green_book: 前端命名规范

#### 1.变量命名

```js
// 推荐camelCase ✅
let userName = "John";
const maxCount = 100;

// 布尔值前缀
const isVisible = true;
const hasPermission = false;
// 常量
const API_ENDPOINT = "https://api.example.com";


// 禁止缩写 如: usrNm → userName❌
```

#### 2.函数命名

```js
// 小驼峰式 + 动词前缀（描述动作）✅
function getUserInfo() { ... }
const calculateTotal = () => { ... };

// 类构造命名
class UserAccount { ... }
function DatabaseConnection() { ... }
```

#### 3.Vue专属命名

```js
<!-- PascalCase✅ -->
import UserProfile from 'UserProfile.vue'
import TodoList from 'TodoList.vue'
```

#### 4.Props命名

```html
<UserProfile :userName="currentUser" />
```

```ts
// 自Vue3.5之后支持props解构响应式
const { userName } = defineProps({
    userName: {
        type: String,
        default: ''
    }
})
```

#### 5.自定义事件

```js
// kebab-case（全小写 + 连字符）
const emit = defineEmits(['update-user', 'close'])

<UserForm @update-user="handleUpdate" @close="handleClose"/>
```

#### 6.样式

- :o: 客制化组件禁止不加`scoped`

```html
<!--> 推荐使用import引入样式 <-->
<template>
    ...
</template>

<style lang="less" scoped>
@import './style.less'
.active{
    ...    
}
<style>
```

### 🔖 Git 提交规范

## 分类列表：

| 类别     | 描述                                                             |
| -------- | ---------------------------------------------------------------- |
| feat     | 提交新功能                                                       |
| fix      | 修复了 bug                                                       |
| docs     | 只修改了文档                                                     |
| style    | 调整代码格式，未修改代码逻辑（比如修改空格、格式化、缺少分号等） |
| refactor | 代码重构，既没修复 bug 也没有添加新功能                          |
| perf     | 性能优化，提高性能的代码更改                                     |
| test     | 添加或修改代码测试                                               |
| chore    | 对构建流程或辅助工具和依赖库（如文档生成等）的更改               |

#### feat(user): 添加注册功能

---

### 🚀 Git 分支说明

| 环境      | 分支    | 说明                 |
| --------- | ------- | -------------------- |
| 开发/测试 | dev     | (临时测试分支)       |
| 预发布    | test    | (保护分支)           |
| 生产      | release | 线上环境（保护分支） |


### 【Git操作指南】
***以下操作基于目前无预发布环境前提：***

<!-- ### 🌱 功能开发 -->

```GIT
# 1、从 test 创建功能分支（临时）
$ git checkout test && git pull
$ git checkout -b feat/mouldProcess-20250101

# 2、开发完成后提交（触发 ESLint 校验）
$ git add .
$ git commit -m "feat(user): 新增个人主页模块"
$ git push --set-upstream origin feat/mouldProcess-20250101

# 3、合并到 dev 环境（目前当测试环境用）
$ git checkout dev && git pull
$ git merge --no-ff feat/mouldProcess-20250101

# 4、dev 测试通过后，合并到 test【不上线的不要提交到 test！】
// 1、先从 test 拉一个分支出来 ，确保为最新的
$ git checkout test && git pull
$ git checkout -b feat/mouldProcess-20250102

// 2、合并自己的分支，必须--no-ff 保留历史轨迹
$ git merge feat/mouldProcess-20250102 --no-ff
（如遇到冲突，截图到群里问一下）

$ git add .
$ git commit -m "feat(merge): 合并 v1.1.1 到 test"
$ git push --set-upstream origin feat/mouldProcess-20250102

# 5、gitlab创建合并请求

创建合并请求，指派合并人并将链接发给对应的合并人进行审核合并
管理者：[梁豪、冯荣、黄伟航]
``` 

### 🚨 紧急修复

```git
# 从 release 创建热修复分支

$ git checkout release && git pull
$ git checkout -b hotfix/payment-20250101
$ git add .
$ git commit -m "fix(payment): 修复金额计算错误"
$ git push --set-upstream origin hotfix/payment-20250101
- :提交后创建合并请求并同步到test以及dev,避免再次出现此bug!

```
<!-- # ![merge](./image/git-merge.png)

# ![merge](./image/git-merge2.png) -->

### 常用 git 命令

```git
# 查看工作区和暂存区的状态
$ git status
# 将工作区的文件提交到暂存区
$ git add .
# 提交到本地仓库
$ git commit -m "本次提交说明"
# 撤销提交，并保留文件到暂存区
$ git reset --soft HEAD~1
# 查看本地拥有哪些分支
$ git branch
# 查看所有分支（包括远程分支和本地分支）
$ git branch -a
# 切换分支
$ git checkout branchName
# 临时将工作区文件的修改保存至堆栈中
$ git stash
# 将之前保存至堆栈中的文件取出来
$ git stash pop
# 取消合并
$ git merge --abort
# 查看操作记录，找到合并前的提交哈希
$ git reflog
# 重置 dev 分支到合并前的状态（替换为实际哈希值）
$ git checkout dev
$ git reset --hard HEAD@{1}   # 或 git reset --hard <commit-hash>
# 强制推送到远程
$ git push --force origin branch 
# 删除本地分支
$ git branch -D fix/bug-20250101
# 删除远端仓库分支
$ git push origin --delete fix/bug-20250101
 
```

---

### 🎨 UI 设计规范

**_[为统一系统风格及样式，开发时尽量使用已有组件] !_**

```markdown
1.不允许直接在 HTML 中直接使用 CSS，推荐使用 class 或 Tailwind-ui 的 class 

<span style="color:red">不允许在 HTML 中直接使用 CSS</span>


2.基础样式优先使用变量，避免影响主题颜色变更。

3.局部修改公共组件样式必须自定义 class,避免影响全局

<style lang="less" scoped>
  .relation-radio {
    margin-top: 10px;
    :deep(.ant-radio-wrapper) {
      display: block;
    }
  }
</style>
```

### 🛠️ 开发工具:  (***VSCode***)

必装插件:
| 拓展插件      | 🎨说明     | 
| --------- | -------------- | 
| ESLint | 代码质检           | 
| Prettier    | 自动格式化    | 

### 开发须知

#### 18国际化配置
一、默认方案

| 应用范围（组件）   | 国际化默认字段| 配置说明                 |
| --------- |------|------------------------- |
| BasicTable | dateIndex|以columns中的dateIndex默认国际化字段       |
| VxeTable    | field|以columns中的field默认国际化字段  |     
| BasicForm | schemas i18nField>field>fieldName|以schme中的i18nField>field>fieldName默认国际化字段   |
 
 默认只需要在字典添加dict.CommonCol.xxx即可
 --更新ing...

### ✨ 特别提示

> ---
>
> 为避免仓库分支冗余,请大家定期删除不用的开发分支。
>
> ---

###### <span style="color:green">本规范由领益智造前端开发团队共同维护，持续迭代优化 💫</span>
