# 🌐 部署到 Cloudflare Pages

本 Web 界面是一个纯静态应用，可以免费部署到 Cloudflare Pages。

## 📋 前提条件

1. **Cloudflare 账号** - 注册免费的 Cloudflare 账号
2. **GitHub 账号** - 用于存储代码和触发 Actions
3. **Fork 本仓库** - 将代码 Fork 到你自己的 GitHub 账号

## 🚀 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 登录你的账号

2. **创建 Pages 项目**
   - 点击左侧菜单 **Workers & Pages**
   - 点击 **Create application**
   - 选择 **Connect to Git**

3. **连接 GitHub 仓库**
   - 点击 **Authorize Cloudflare Pages**（如果首次使用）
   - 选择你 Fork 的仓库
   - 点击 **Begin setup**

4. **配置构建设置**
   - **Project name**: 自定义项目名称（如 `openwrt-builder`）
   - **Production branch**: `main`
   - **Build settings**: 
     - Framework preset: `None`
     - Build command: **留空**（不需要构建）
     - Build output directory: `web`
   - 点击 **Save and Deploy**

5. **等待部署完成**
   - Cloudflare 会自动部署，通常 1-2 分钟完成
   - 部署成功后会获得一个 `https://xxx.pages.dev` 域名

### 方法二：通过 Wrangler CLI（高级）

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 进入项目目录
cd web

# 部署
wrangler pages deploy . --project-name=openwrt-builder
```

## 🔧 自定义域名（可选）

1. 在 Cloudflare Pages Dashboard 选择你的项目
2. 点击 **Custom domains**
3. 点击 **Add custom domain**
4. 输入你的域名（需要在 Cloudflare 管理）
5. Cloudflare 会自动配置 DNS 和 SSL

## 🔐 安全提示

### GitHub Token 权限

创建 GitHub Token 时需要以下权限：
- ✅ `repo` - 完全控制私有仓库（用于触发 Actions）
- ✅ `workflow` - 更新 GitHub Actions 工作流

**Token 创建步骤：**
1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 填写备注（如 `OpenWrt Builder`）
4. 勾选权限：`repo` 和 `workflow`
5. 点击 **Generate token**
6. **立即复制 Token**（只显示一次）

### 安全最佳实践

⚠️ **重要：**
- **永远不要**将 GitHub Token 提交到代码仓库
- **永远不要**将 Token 硬编码在前端代码中
- 本应用通过表单让用户输入自己的 Token，**不会存储或传输到任何服务器**
- Token 仅用于浏览器直接调用 GitHub API

## 📱 使用流程

1. **访问部署的网页**
   - 打开 `https://your-project.pages.dev`

2. **填写配置**
   - 输入你的 GitHub Token
   - 输入你的 GitHub 仓库（如 `your-username/op`）
   - 选择固件类型、版本、大小等
   - 勾选需要的插件（iStore、Docker、PPPoE）

3. **触发构建**
   - 点击 **开始构建**
   - 页面会显示构建任务已成功触发

4. **查看进度和下载**
   - 点击提供的链接跳转到 GitHub Actions
   - 等待构建完成（通常 10-20 分钟）
   - 在 Artifacts 区域下载固件

## 🛠️ 故障排除

### 问题：触发构建时显示 404

**原因：**
- 仓库名称填写错误
- 仓库不存在或没有访问权限
- Token 权限不足

**解决方案：**
- 确认仓库格式为 `username/repo-name`
- 确认已 Fork 本仓库
- 重新生成 Token 并确保有 `workflow` 权限

### 问题：触发构建时显示 403

**原因：**
- Token 权限不足
- 仓库是私有的但没有正确授权

**解决方案：**
- 重新生成 Token，确保勾选 `repo` 和 `workflow` 权限
- 确认仓库已启用 GitHub Actions

### 问题：Cloudflare 部署失败

**原因：**
- 构建输出目录配置错误

**解决方案：**
- 确认 Build output directory 设置为 `web`
- 确认 `web/index.html` 和 `web/app.js` 文件存在

## 📊 成本说明

- **Cloudflare Pages**: 完全免费（包括自定义域名和 SSL）
- **GitHub Actions**: 每月 2000 分钟免费额度（通常足够个人使用）
- **GitHub 存储**: 免费额度内足够存储固件

## 🎯 优化建议

1. **减少构建频率** - 固件构建耗时较长，建议批量配置后一次性构建
2. **使用合适的大小** - 根据实际需求选择固件大小，避免浪费
3. **定期清理 Release** - 如果启用自动发布，定期清理旧的 Release 释放空间

## 📞 支持

如有问题，请查看：
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [OpenWrt Image Builder 文档](https://openwrt.org/docs/guide-user/additional-software/imagebuilder)
