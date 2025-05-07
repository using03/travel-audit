# HttpOnly Cookie 认证服务说明

本服务模块提供了基于 HttpOnly Cookie 的 JWT 认证系统，更安全地管理用户会话和身份验证。同时支持与多个不同端口的服务进行通信。

## 文件结构

- `auth.ts` - 提供核心认证功能：登录、登出、验证状态，以及多端口 API 通信支持
- `ajax.ts` - 通用的 axios 请求实例，配置为支持跨域 Cookie
- `admin.ts` - 管理员相关的 API 服务，包括认证功能的重导出

## 多端口 API 通信

本服务支持同时与两个不同端口的服务通信：

- **NestJS 后端**：使用 3001 端口进行身份验证等操作
- **第二服务**：使用 3000 端口访问其他数据

### 使用多端口 API 示例

```typescript
import { secondaryApi } from "../services/auth";

// 从3000端口获取数据示例
const fetchDataFromSecondService = async () => {
  try {
    const data = await secondaryApi.get("/some-endpoint");
    console.log("从3000端口获取的数据:", data);
    return data;
  } catch (error) {
    console.error("获取数据失败:", error);
    throw error;
  }
};
```

## 主要功能

### 1. 登录认证

```typescript
import { adminLoginService } from "../services/admin";

// 使用示例
const handleLogin = async (adminname, password) => {
  try {
    const userInfo = await adminLoginService(adminname, password);
    // 登录成功，获取到用户信息
    console.log("登录成功:", userInfo);
  } catch (error) {
    console.error("登录失败:", error);
  }
};
```

### 2. 验证登录状态

```typescript
import { checkAdminAuthStatus } from "../services/admin";

// 使用示例
const checkStatus = async () => {
  const { isAuthenticated, userInfo } = await checkAdminAuthStatus();
  if (isAuthenticated) {
    console.log("已登录用户:", userInfo);
  } else {
    console.log("未登录");
  }
};
```

### 3. 登出

```typescript
import { adminLogoutService } from "../services/admin";

// 使用示例
const handleLogout = async () => {
  try {
    await adminLogoutService();
    console.log("已成功登出");
  } catch (error) {
    console.error("登出失败:", error);
  }
};
```

## 安全特性

- **HttpOnly Cookie**: JWT 令牌存储在 HttpOnly Cookie 中，客户端 JavaScript 无法访问
- **自动请求处理**: 所有 API 请求自动包含 Cookie 凭证（withCredentials: true）
- **状态同步**: 提供检查认证状态的 API，可用于同步前端状态
- **错误处理**: 内置 401 未授权处理逻辑

## 使用建议

1. 在组件初始化时检查认证状态
2. 登录成功后不需要手动存储 token
3. 使用 ajax.ts 导出的实例进行其他 API 请求，会自动携带 Cookie
4. 根据需要选择合适的 API 实例（authInstance 或 secondaryApi）

## 注意事项

- 确保后端 CORS 设置允许 credentials（已配置）
- 身份验证使用 3001 端口，其他数据使用 3000 端口
- 使用该服务前确保 cookie-parser 中间件已在后端配置
