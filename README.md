# OpenCC Web

Open Chinese Convert 網頁介面 - 支援繁簡中文轉換的線上服務

## 🚀 功能特色

- **14種轉換模式**：s2t, t2s, s2hk, hk2s, s2tw, tw2s, s2twp, tw2sp, t2tw, tw2t, hk2t, t2hk, t2jp, jp2t
- **無檔案大小限制**：串流處理大型檔案
- **批次檔案處理**：同時處理多個檔案
- **即時文字轉換**：支援複製結果
- **響應式設計**：支援桌面和行動裝置
- **多語言支援**：繁體中文/簡體中文介面
- **主題切換**：明亮/深色模式

## 🛠️ 技術架構

- **後端**：Node.js + Express + OpenCC
- **前端**：原生 HTML/CSS/JavaScript
- **檔案處理**：Multer + 串流處理
- **部署**：支援 Railway/Render/Vercel

## 📦 安裝與使用

### 使用者安裝
```bash
# 克隆專案（包含 submodule）
git clone --recursive https://github.com/anomixer/OpenCC-web.git
cd OpenCC-web

# 安裝依賴
npm install

# 啟動服務
npm start
```

### 開發者設定
```bash
# 如果忘記使用 --recursive，可以：
git submodule update --init --recursive

# 更新 submodule
git submodule update --remote
```

## 🌐 部署

### 🚀 線上展示
- **部署網站**: https://opencc-web.onrender.com/
- **平台限制**: 檔案大小 80MB（Render 免費版限制）
- **功能完整**: 支援所有 14 種轉換模式

### 推薦部署平台

#### Railway (最推薦)
- **優點**：無檔案限制，支援 Node.js 完整功能
- **免費額度**：$5/月
- **部署**：連接 GitHub 即可自動部署

#### Render
- **優點**：免費版支援完整功能
- **限制**：檔案上傳 100MB（建議設定 80MB）
- **部署**：自動部署，支援自訂域名
- **環境變數**：需設定 `RENDER=true`
- **實例**: https://opencc-web.onrender.com/

#### Vercel
- **優點**：部署簡單，全球 CDN
- **限制**：函式執行時間 10 秒，檔案 4.5MB
- **注意**：需優化大型檔案處理

#### Cloudflare Workers
- **優點**：極致效能，邊緣計算
- **限制**：
  - 請求體大小：100MB (免費版)
  - 響應體大小：25MB
  - 執行時間：10ms (免費版) / 30ms (付費版)
- **注意**：需重構為 Workers API 格式

### 部署平台比較表

| 平台 | 檔案限制 | 執行時間 | 免費額度 | 適合性 | 實例 |
|------|----------|----------|----------|--------|------|
| Railway | 無限制 | 無限制 | $5/月 | ⭐⭐⭐⭐⭐ | - |
| Render | 100MB* | 無限制 | 無限請求 | ⭐⭐⭐⭐ | [✅](https://opencc-web.onrender.com/) |
| Vercel | 4.5MB | 10秒 | 100GB | ⭐⭐ | - |
| Cloudflare Workers | 100MB | 10ms | 100萬請求 | ⭐ | - |

*建議設定 80MB 以避免觸及平台限制，不適合無檔案限制場景

### 環境變數
- `PORT`：服務端口（預設 3000）
- `RENDER`：Render 平台偵測（設為 `true`）

## 📁 專案結構

```
OpenCC-web/
├── opencc/              # OpenCC 核心函式庫 (git submodule)
├── public/              # 靜態檔案
│   ├── index.html
│   └── favicon.png
├── uploads/             # 暫存檔案目錄
├── server.js            # 主伺服器檔案
├── package.json         # 專案依賴
├── AGENTS.md           # 開發指南
└── README.md           # 專案說明
```

## 🎯 核心功能

### 文字轉換
- 即時轉換輸入文字
- 支援所有 OpenCC 轉換配置
- 一鍵複製轉換結果

### 檔案轉換
- 支援所有文字格式檔案
- 串流處理無檔案大小限制（本地開發）
- 智能限制提示：僅在部署平台顯示檔案限制
- Render 部署版本：80MB 檔案限制
- 即時進度顯示
- 自動檔案清理

### 使用者介面
- 現代化響應式設計
- 明亮/深色主題切換
- 繁體/簡體中文介面
- 拖放檔案上傳
- 智能平台偵測：動態顯示部署資訊和檔案限制

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

本專案基於 Apache 2.0 授權條款。

## 🙏 致謝

感謝 [BYVoid](https://github.com/BYVoid) 開發的 [OpenCC](https://github.com/BYVoid/OpenCC) 核心函式庫。