# Enterprise Portal Design System (v2.0)

## 1. 色彩规范 (Color Palette)

### 主色调 (Primary)
用于核心行动点、链接、强调元素。
- **Primary Blue**: `#2563eb` (Tailwind Blue 600) - 主按钮、激活状态
- **Primary Dark**: `#1e40af` (Tailwind Blue 800) - 悬停状态、深色背景
- **Primary Light**: `#dbeafe` (Tailwind Blue 100) - 浅色背景、选中态

### 中性色 (Neutral)
用于文本、背景、边框。
- **Text Dark**: `#0f172a` (Slate 900) - 主标题
- **Text Body**: `#334155` (Slate 700) - 正文
- **Text Muted**: `#64748b` (Slate 500) - 次要信息
- **Border**: `#e2e8f0` (Slate 200) - 边框、分割线
- **Background**: `#f8fafc` (Slate 50) - 页面背景
- **Surface**: `#ffffff` (White) - 卡片、导航栏

### 功能色 (Functional)
- **Success**: `#10b981` - 成功状态
- **Warning**: `#f59e0b` - 警告信息
- **Error**: `#ef4444` - 错误提示

---

## 2. 字体层次系统 (Typography Hierarchy)

### 字体栈 (Font Stack)
优先使用系统字体，确保最佳渲染性能。
`font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`

### 排版比例 (Type Scale)
- **H1 (Display)**: `2.5rem` (40px) / 700 Bold / Line-height 1.2
- **H2 (Section)**: `2rem` (32px) / 700 Bold / Line-height 1.3
- **H3 (Card Title)**: `1.5rem` (24px) / 600 SemiBold / Line-height 1.4
- **H4 (Subtitle)**: `1.25rem` (20px) / 600 SemiBold / Line-height 1.4
- **Body (Regular)**: `1rem` (16px) / 400 Regular / Line-height 1.6
- **Small (Caption)**: `0.875rem` (14px) / 500 Medium / Line-height 1.5

---

## 3. 组件样式指南 (Component Style Guide)

### 按钮 (Buttons)
- **圆角**: `0.5rem` (8px)
- **内边距**: `0.75rem 1.5rem` (12px 24px)
- **字体**: Weight 600, Letter-spacing 0.025em
- **阴影**: 
  - Default: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
  - Hover: `0 4px 6px -1px rgba(37, 99, 235, 0.2)`

### 卡片 (Cards)
- **背景**: `#ffffff`
- **边框**: `1px solid #e2e8f0` (可选，推荐无边框仅阴影模式)
- **圆角**: `1rem` (16px)
- **阴影**: 
  - Default: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
  - Hover: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

### 导航栏 (Navbar)
- **高度**: `80px`
- **背景**: `rgba(255, 255, 255, 0.9)` + Backdrop Filter (Glassmorphism)
- **阴影**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`

---

## 4. 交互动效说明 (Interaction & Animation)

### 微交互 (Micro-interactions)
- **过渡 (Transition)**: 所有可交互元素 `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **悬停 (Hover)**: 
  - 按钮：轻微上浮 `transform: translateY(-1px)`
  - 卡片：上浮 + 阴影加深 `transform: translateY(-4px)`
- **点击 (Active)**: `transform: scale(0.98)`

### 页面动效 (Page Transitions)
- **进入**: Fade In Up (透明度 0->1, Y轴偏移 20px->0)
- **时长**: `0.6s ease-out`
