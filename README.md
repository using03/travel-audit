# Travel Audit

一个旅行游记审核系统，基于 React + TypeScript 开发，提供高效的游记内容管理和审核功能。

## 功能特点

- 旅行游记管理
- 高级搜索和筛选
- 自适应布局（基于 Ant Design）
- 用户认证和授权
- 美观的 UI 界面（基于 Ant Design）

## 技术栈

- React 19
- TypeScript 5.7
- Vite 6.3
- Ant Design 5.24
- Axios
- SASS
- ESLint 9.22

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/using03/travel-audit.git

# 进入项目目录
cd travel-audit

# 安装依赖
npm install
# 或
yarn install
```

### 开发

```bash
# 启动开发服务器
npm run dev
# 或
yarn dev
```

### 构建

```bash
# 构建生产版本
npm run build
# 或
yarn build
```

### 代码检查

```bash
# 运行 ESLint 检查
npm run lint
# 或
yarn lint
```

## 项目结构

```
travel-audit/
├── src/                # 源代码目录
│   ├── assets/        # 静态资源
│   ├── components/    # 组件
│   ├── pages/         # 页面组件
│   ├── services/      # API 服务
│   ├── App.tsx        # 应用入口
│   └── main.tsx       # 主入口文件
├── public/            # 公共资源
├── package.json       # 项目配置
└── vite.config.ts     # Vite 配置
```

## 开发指南

### 代码规范

项目使用 ESLint 进行代码规范检查，确保代码质量。主要规则包括：

- React Hooks 规则
- TypeScript 类型检查
- 代码格式化

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request
