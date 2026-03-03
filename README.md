# Hack Engine

**Hack Engine** 是一个定位在**网络安全 / 伦理黑客**方向的一体化项目：前后端在同一仓库，后端负责认证与数据，前端提供统一入口与界面。

- **后端**：Spring Boot 3 + Spring Security + MySQL（BCrypt、Session）
- **前端**：React（`hack-engine-web` 目录），调用后端 API，含登录/注册、验证码与支付流程演示

---

## 功能（当前）

- **注册 / 登录**：用户名 + 密码，BCrypt 存库，Session 保持，前端带 Cookie 访问
- **访问控制**：未登录访问受保护页会跳转登录
- **安全仪表盘**：登录后进入终端风格仪表盘，展示上次登录时间与 IP、最近登录/登出记录、2FA 开关（演示）
- **密码强度**：注册时实时强度条与常见弱密码检测，弱密码禁止注册
- **安全日志**：后端记录每次登录/登出（IP、User-Agent、时间），仪表盘可查看最近活动
- **验证码 / 支付密码页**：演示流程（仅 UI 演示，演示用码由前端配置）
- **Google / Facebook 登录**：支持「使用 Google 继续」「使用 Facebook 继续」，需在后台配置 OAuth 客户端（见下方说明）

---

## 注册失败常见原因

- **「Username already exists」**：该用户名已被注册，请换一个或直接登录。
- **「This password is too common」**：密码在常见弱密码列表中，请使用更强密码（页面有强度条提示）。
- **「Server error」或「Network error」**：多为数据库连接失败。请确认：(1) MySQL 已启动；(2) 已在 MySQL 中创建数据库（如 `application.properties` 里 url 的 `system`）；(3) url/用户名/密码正确；(4) 后端已启动（http://localhost:8080）。**不想装 MySQL 时**：用 H2 配置启动，见上文「若暂时没有 MySQL」。

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

**运行前**：安装 Node.js。后端默认使用 MySQL，需先建库并在 `src/main/resources/application.properties` 中填写 url、用户名与密码。**若暂时没有 MySQL**，可用内存数据库 H2 启动：  
`mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"`（Windows）或 `./mvnw spring-boot:run -Dspring-boot.run.profiles=h2`（Linux/Mac），无需改配置即可注册/登录（数据重启后清空）。

**启动**：

- **一键脚本（推荐）**：在项目根目录执行  
  - Windows 双击或命令行：`start.bat`  
  - PowerShell：`.\start.ps1`  
  会分别打开两个窗口运行后端与前端，关闭对应窗口即可停止。

- **手动启动**：
1. 根目录启动后端：`./mvnw spring-boot:run`（Windows：`mvnw.cmd spring-boot:run`）
2. 新开终端进入前端：`cd hack-engine-web && npm install && npm start`
3. 浏览器打开 http://localhost:3000 ，注册/登录后即可使用

仅用后端时访问 http://localhost:8080 ，使用 Thymeleaf 的 `/login`、`/register`、`/welcome`。

---

## Google / Facebook 登录配置（可选）

要启用「使用 Google 继续」「使用 Facebook 继续」，需在后台配置 OAuth 客户端，并在前端同源或正确配置 Cookie 的情况下使用。

1. **Google**  
   - 打开 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 创建 OAuth 2.0 客户端 ID（类型：Web 应用）。  
   - 已授权重定向 URI 填写：`http://localhost:8080/login/oauth2/code/google`（生产环境改为你的后端域名）。  
   - 将客户端 ID、客户端密钥写入环境变量或 `application.properties`：
     - `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`，或  
     - `spring.security.oauth2.client.registration.google.client-id`、`spring.security.oauth2.client.registration.google.client-secret`。

2. **Facebook**  
   - 在 [Facebook 开发者](https://developers.facebook.com/apps/) 创建应用，在「Facebook 登录」里配置「有效 OAuth 重定向 URI」：`http://localhost:8080/login/oauth2/code/facebook`。  
   - 将应用 ID、应用密钥写入：
     - `FACEBOOK_APP_ID`、`FACEBOOK_APP_SECRET`，或  
     - `spring.security.oauth2.client.registration.facebook.client-id`、`spring.security.oauth2.client.registration.facebook.client-secret`。

3. **启用配置**  
   - 将 `src/main/resources/application-oauth.example.properties` 复制为 `application-oauth.properties`，填入真实的 client-id 与 client-secret（或通过环境变量传入）。  
   - 未创建 `application-oauth.properties` 或未填真实值时，后端仍可正常启动；点击「使用 Google/Facebook 继续」会跳转到后端，若未配置则可能返回错误，属正常现象。

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

已实现：安全仪表盘（终端风格）、密码强度与弱密码检测、安全日志（登录/登出）。可继续增加：

| 方向 | 示例 |
|------|------|
| **双因素认证（2FA）** | 验证码页改为真实 TOTP（如 Google Authenticator），后端校验；可选短信/邮箱验证码 |
| **安全日志扩展** | 改密、敏感操作记录；安全日志导出或审计页 |
| **漏洞/攻击演示（教学）** | SQL 注入 / XSS / CSRF 对比页（安全 vs 不安全写法），仅用于教育 |
| **CTF 小关卡** | 与安全相关的小题闯关，完成后解锁下一关或成就 |
| **API 安全** | rate limit、API Key 或 JWT；文档说明安全使用方式 |
| **漏洞扫描器（演示）** | 对指定 URL 简单爬取与基础检测（如 CSRF、HTTPS），仅展示不执行攻击 |

---

## API 说明（供前端调用）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/register` | Body: `{ "username", "password" }`，密码至少 6 位，建议使用强度条并避免弱密码 |
| POST | `/api/login`     | Body: `{ "username", "password" }`，成功写 Session 并记录安全日志，返回 `{ "username" }` |
| GET  | `/api/me`        | 需登录，返回当前用户 `{ "username" }` |
| POST | `/api/logout`    | 需登录，记录登出日志并销毁 Session |
| GET  | `/api/security/summary` | 需登录，返回 `{ lastLoginAt, lastLoginIp, twoFactorEnabled }` |
| GET  | `/api/security/logs`    | 需登录，返回最近登录/登出记录列表 |

请求需带 Cookie（`withCredentials: true`），前端通过 proxy 访问后端即可。

---

## 测试

- **后端**：项目根目录执行 `./mvnw test`（或 `mvnw.cmd test`），使用 H2 内存库。
- **前端**：`cd hack-engine-web && npm test`。
