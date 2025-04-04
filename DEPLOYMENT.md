# 天气应用部署指南

本文档提供了将天气查询网站部署到公共可访问服务器的详细步骤，让所有人都能使用这个应用。

## 前期准备

1. 确保你有一个有效的 OpenWeatherMap API 密钥
   - 如果没有，请前往 [OpenWeatherMap](https://openweathermap.org/) 注册并获取免费的 API 密钥

2. 确保你的项目已经完成开发并能在本地正常运行

## 环境变量配置

我们已经将 API 密钥从代码中移到环境变量中，这样可以更安全地部署应用：

1. 本地开发时：
   - 使用项目根目录下的 `.env` 文件（已创建）
   - 确保 `.env` 文件包含你的 API 密钥：`VITE_APP_WEATHER_API_KEY=你的密钥`

2. 部署到服务器时：
   - 不要上传 `.env` 文件（已添加到 `.gitignore`）
   - 在部署平台上设置环境变量 `VITE_APP_WEATHER_API_KEY`

## 构建项目

在部署前，需要构建项目生成静态文件：

```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

构建完成后，`dist` 目录中将包含所有需要部署的静态文件。

## 部署选项

### 1. Vercel（推荐）

Vercel 是一个免费且易用的静态网站托管平台，特别适合 React 应用：

1. 注册 [Vercel](https://vercel.com/) 账号
2. 安装 Vercel CLI 或直接使用 GitHub 集成
3. 部署步骤：
   ```bash
   # 安装 Vercel CLI
   npm install -g vercel
   
   # 登录
   vercel login
   
   # 部署（在项目根目录下运行）
   vercel
   ```
4. 在 Vercel 项目设置中添加环境变量 `VITE_APP_WEATHER_API_KEY`

### 2. Netlify

Netlify 也是一个优秀的静态网站托管平台：

1. 注册 [Netlify](https://www.netlify.com/) 账号
2. 可以通过 GitHub 集成或手动上传 `dist` 目录
3. 在 Netlify 项目设置中添加环境变量 `VITE_APP_WEATHER_API_KEY`

### 3. GitHub Pages

GitHub Pages 是另一个免费的静态网站托管选项：

1. 创建一个 GitHub 仓库
2. 修改 `vite.config.js` 添加 base 配置（如果部署到非根目录）
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',  // 替换为你的仓库名
     // 其他配置...
   })
   ```
3. 使用 GitHub Actions 自动部署，创建 `.github/workflows/deploy.yml` 文件：
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
           env:
             VITE_APP_WEATHER_API_KEY: ${{ secrets.WEATHER_API_KEY }}
         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@4.1.4
           with:
             branch: gh-pages
             folder: dist
   ```
4. 在 GitHub 仓库设置中添加 Secret `WEATHER_API_KEY`

## 注意事项

1. **API 密钥安全**：
   - 永远不要在前端代码中硬编码 API 密钥
   - 在生产环境中，考虑使用代理服务器转发 API 请求，以进一步保护 API 密钥

2. **CORS 问题**：
   - 如果部署后遇到 CORS 问题，可能需要设置代理服务器或使用 CORS 代理服务

3. **API 使用限制**：
   - 注意 OpenWeatherMap 免费计划的 API 调用限制
   - 考虑实现缓存机制减少 API 调用次数

## 访问网站

部署完成后，你将获得一个公开的 URL，任何人都可以通过这个 URL 访问你的天气查询网站。

例如：
- Vercel: `https://your-app-name.vercel.app`
- Netlify: `https://your-app-name.netlify.app`
- GitHub Pages: `https://username.github.io/your-repo-name/`

## 故障排除

如果部署后网站无法正常工作：

1. 检查环境变量是否正确设置
2. 查看浏览器控制台是否有错误信息
3. 确认 API 密钥是否有效
4. 检查构建日志是否有错误