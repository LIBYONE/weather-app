# 简易部署指南：让其他设备访问您的天气查询网站

这个指南提供了几种简单的方法，让您的天气查询网站能够被其他设备访问。

## 方法一：使用 Vercel 部署（最推荐）

[Vercel](https://vercel.com/) 是一个免费且易用的平台，特别适合部署 React 应用。

### 步骤：

1. 注册 Vercel 账号（可以使用 GitHub 账号直接登录）
2. 安装 Git（如果尚未安装）
3. 将您的项目上传到 GitHub：
   ```bash
   # 在项目根目录下初始化 Git 仓库
   git init
   git add .
   git commit -m "初始提交"
   
   # 在 GitHub 创建仓库后，关联并推送
   git remote add origin https://github.com/您的用户名/weather-app.git
   git push -u origin main
   ```
4. 在 Vercel 中导入您的 GitHub 仓库
5. 在部署设置中添加环境变量：
   - 名称：`VITE_APP_WEATHER_API_KEY`
   - 值：`ceff502997c2ac12cd9da434279f8aa1`（您的 API 密钥）
6. 点击部署，几分钟后您将获得一个公开的 URL（例如：`https://weather-app-your-username.vercel.app`）

## 方法二：使用 Netlify 部署

[Netlify](https://www.netlify.com/) 也是一个优秀的静态网站托管平台。

### 步骤：

1. 注册 Netlify 账号
2. 点击 "Add new site" > "Deploy manually"
3. 将 `dist` 目录拖放到上传区域
4. 在站点设置中添加环境变量：
   - 名称：`VITE_APP_WEATHER_API_KEY`
   - 值：`ceff502997c2ac12cd9da434279f8aa1`（您的 API 密钥）
5. 部署完成后，您将获得一个公开的 URL（例如：`https://your-site-name.netlify.app`）

## 方法三：使用 GitHub Pages 部署

### 步骤：

1. 修改 `vite.config.js` 文件，添加正确的 base 配置：
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/weather-app/', // 替换为您的仓库名
     // 其他配置...
   })
   ```

2. 重新构建项目：
   ```bash
   npm run build
   ```

3. 将项目上传到 GitHub 仓库

4. 在仓库设置中启用 GitHub Pages，选择 gh-pages 分支或 main 分支的 docs 文件夹

5. 您的网站将在 `https://您的用户名.github.io/weather-app/` 可访问

## 方法四：使用临时公网映射工具（适合临时分享）

如果您只是想临时让他人访问您的网站，可以使用以下工具：

1. [ngrok](https://ngrok.com/)：
   - 注册并下载 ngrok
   - 运行您的本地开发服务器：`npm run dev`
   - 在新终端中运行：`ngrok http 5174`（使用您的本地端口）
   - ngrok 将提供一个公网可访问的 URL

2. [localtunnel](https://localtunnel.github.io/www/)：
   - 安装：`npm install -g localtunnel`
   - 运行您的本地开发服务器：`npm run dev`
   - 在新终端中运行：`lt --port 5174`
   - 获得一个公网可访问的 URL

## 注意事项

1. **API 密钥安全**：
   - 在生产环境中，考虑使用代理服务器转发 API 请求，以进一步保护 API 密钥
   - 永远不要在公开的代码仓库中暴露您的 API 密钥

2. **CORS 问题**：
   - 如果部署后遇到 CORS 问题，可能需要设置代理服务器或使用 CORS 代理服务

3. **API 使用限制**：
   - 注意 OpenWeatherMap 免费计划的 API 调用限制
   - 考虑实现缓存机制减少 API 调用次数

## 故障排除

如果部署后网站无法正常工作：

1. 检查环境变量是否正确设置
2. 查看浏览器控制台是否有错误信息
3. 确认 API 密钥是否有效
4. 检查构建日志是否有错误