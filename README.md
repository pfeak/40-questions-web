# 40 个问题 - 深度自我反思工具

一个基于 Next.js 的网页应用，帮助用户通过回答 40 个深度问题进行自我反思和记录。

## 功能特点

- 📝 **两套问题集**：年度问题和十年问题，适合不同时间维度的反思
- 💾 **自动保存**：使用浏览器 localStorage 自动保存答案，无需担心数据丢失
- 📊 **进度跟踪**：实时显示完成进度，激励用户完成所有问题
- 📄 **Markdown 导出**：支持将答案导出为 Markdown 格式，便于保存和分享
- 🎨 **美观界面**：使用 Tailwind CSS 设计的现代化界面
- 📱 **响应式设计**：支持桌面和移动设备

## 问题集内容

### 年度问题（40个）
适合每年年末进行回顾，包含：
- 个人成长和成就
- 人际关系变化
- 生活体验和感悟
- 未来规划和期望

### 十年问题（40个）
适合每十年进行深度反思，包含：
- 人生重大转折点
- 价值观的变化
- 长期目标的实现
- 人生经验总结

## 技术栈

- **框架**：Next.js 14
- **样式**：Tailwind CSS
- **语言**：JavaScript (React)
- **存储**：浏览器 localStorage
- **部署**：支持 Vercel、Netlify 等平台

## 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd 40-questions-web
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:3000`

## 使用方法

1. **选择问题集**：在首页选择"年度问题"或"十年问题"
2. **填写答案**：在文本框中输入你的答案，系统会自动保存
3. **查看进度**：页面顶部显示当前完成进度
4. **导出答案**：点击"下载为 Markdown"按钮导出所有答案
5. **清空重新开始**：如需重新填写，可点击"清空所有答案"

## 数据存储

- 所有答案都存储在浏览器的 localStorage 中
- 数据仅在本地保存，不会上传到服务器
- 清除浏览器数据会导致答案丢失，建议定期导出备份

## 导出格式

导出的 Markdown 文件包含：
- 问题集标题
- 填写日期
- 所有问题和对应答案
- 清晰的格式分隔

## 项目结构

```
40-questions-web/
├── app/
│   ├── components/
│   │   └── QuestionnaireForm.js    # 问答表单组件
│   ├── utils/
│   │   └── loadQuestions.js        # 问题加载工具
│   ├── year/
│   │   └── page.js                 # 年度问题页面
│   ├── decade/
│   │   └── page.js                 # 十年问题页面
│   ├── layout.js                   # 根布局
│   ├── page.js                     # 首页
│   └── globals.css                 # 全局样式
├── public/
│   └── zh-hans/
│       ├── year.md                 # 年度问题文件
│       └── decade.md               # 十年问题文件
└── package.json
```

## 自定义问题

如需修改问题内容，可以编辑以下文件：
- `public/zh-hans/year.md` - 年度问题
- `public/zh-hans/decade.md` - 十年问题

每行一个问题，格式为：`序号. 问题内容`

## 部署

### Vercel 部署
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### 其他平台
项目是标准的 Next.js 应用，支持大多数现代部署平台。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License
