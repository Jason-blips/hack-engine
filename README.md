# Hack Engine

**Hack Engine** 是一个定位在**网络安全 / 伦理黑客**方向的一体化项目：前后端在同一仓库，后端负责认证与数据，前端提供统一入口与界面。

- **后端**：Spring Boot 3 + Spring Security + MySQL（BCrypt、Session）
- **前端**：React（`hack-engine-web` 目录），调用后端 API，含登录/注册、验证码与支付流程演示

---

## 功能（当前）

- **注册 / 登录**：用户名 + 密码，BCrypt 存库，Session 保持，前端带 Cookie 访问
- **访问控制**：未登录访问受保护页会跳转登录
- **验证码 / 支付密码页**：演示流程（仅 UI 演示，演示用码由前端配置）

---

## 技术栈

| 部分 | 技术 |
|------|------|
| 后端 | Spring Boot 3.5、Spring Security、JPA、MySQL、Thymeleaf |
| 前端 | React 18、React Router、styled-components、axios |
| 认证 | Session + Cookie，CORS 允许 `http://localhost:3000` |

---

## 克隆与运行

```bash
git clone <你的仓库 URL> hack-engine
cd hack-engine
```

**运行前**：配置 MySQL（建库，在 `src/main/resources/application.properties` 中填写 url、用户名与密码），并安装 Node.js。

**启动**：

1. 根目录启动后端：`./mvnw spring-boot:run`（Windows：`mvnw.cmd spring-boot:run`）
2. 新开终端进入前端：`cd hack-engine-web && npm install && npm start`
3. 浏览器打开 http://localhost:3000 ，注册/登录后即可使用

仅用后端时访问 http://localhost:8080 ，使用 Thymeleaf 的 `/login`、`/register`、`/welcome`。

---

## 项目结构

```
hack-engine/
├── pom.xml
├── src/main/java/.../          # 后端（认证、API、安全配置）
├── src/main/resources/         # 配置、Thymeleaf 模板、静态资源
└── hack-engine-web/            # 前端
    ├── package.json
    └── src/                    # React 页面、API 调用、主题等
```

---

## 后续可扩展方向（网络安全 / 黑客向）

在现有登录与演示流程基础上，可逐步增加：

| 方向 | 示例 |
|------|------|
| **安全仪表盘** | 登录后首页：密码强度、最近登录记录、异常 IP 提示、双因素开关（2FA 预留） |
| **密码与账户安全** | 注册/改密时强度条、弱密码检测；可选：泄露检查（如 Have I Been Pwned API）、历史密码不可重复 |
| **双因素认证（2FA）** | 验证码页改为真实 TOTP（如 Google Authenticator），后端校验；可选短信/邮箱验证码 |
| **安全日志与审计** | 记录登录/登出、改密、敏感操作；安全日志页或导出 |
| **漏洞/攻击演示（教学）** | SQL 注入 / XSS / CSRF 对比页（安全 vs 不安全写法），仅用于教育 |
| **CTF 小关卡** | 与安全相关的小题闯关，完成后解锁下一关或成就 |
| **API 安全** | rate limit、API Key 或 JWT；文档说明安全使用方式 |
| **终端/黑客风格 UI** | 深色+绿色主题、终端风格仪表盘、等宽字体、打字机效果 |
| **漏洞扫描器（演示）** | 对指定 URL 简单爬取与基础检测（如 CSRF、HTTPS），仅展示不执行攻击 |

---

## API 说明（供前端调用）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/register` | Body: `{ "username", "password" }`，密码至少 6 位 |
| POST | `/api/login`     | Body: `{ "username", "password" }`，成功写 Session，返回 `{ "username" }` |
| GET  | `/api/me`        | 需登录，返回当前用户 `{ "username" }` |
| POST | `/api/logout`    | 需登录，销毁 Session |

请求需带 Cookie（`withCredentials: true`），前端通过 proxy 访问后端即可。

---

## 测试

- **后端**：项目根目录执行 `./mvnw test`（或 `mvnw.cmd test`），使用 H2 内存库。
- **前端**：`cd hack-engine-web && npm test`。
