# 天气查询网站

这是一个简单的天气查询网站，用户可以输入城市名称，查看该城市的天气信息。

## 功能

- 用户输入城市名称，查询天气信息
- 显示当前天气、温度、湿度、风速等信息
- 显示未来几天的天气预报
- 天气预警功能
- 响应式设计，适配不同设备

## 技术栈

- 前端：React、CSS
- API：OpenWeatherMap

## 本地开发

1. 克隆项目到本地
2. 安装依赖：`npm install`
3. 配置环境变量：
   - 复制 `.env.example` 为 `.env`
   - 在 `.env` 文件中设置你的 OpenWeatherMap API 密钥
4. 启动开发服务器：`npm run dev`
5. 在浏览器中访问：`http://localhost:5173`

## 部署网站（让所有人都能访问）

要让所有人都能访问这个天气查询网站，你需要将其部署到公共可访问的服务器上：

1. 构建项目：`npm run build`
2. 将生成的 `dist` 目录部署到以下推荐的平台之一：
   - [Vercel](https://vercel.com/)（推荐，简单易用）
   - [Netlify](https://www.netlify.com/)（也很简单）
   - [GitHub Pages](https://pages.github.com/)（免费托管）

详细的部署步骤请参考项目中的 `DEPLOYMENT.md` 文件。

## 注意事项

- 部署时必须正确设置环境变量 `VITE_APP_WEATHER_API_KEY`
- 不要在代码中硬编码 API 密钥
- 注意 OpenWeatherMap API 的使用限制