# OpenCC Web 開發指南

## 專案結構

### Git Submodule 架構
- **主專案**: `OpenCC-web` - 網頁服務應用
- **子模組**: `opencc/` - OpenCC 核心函式庫
- **倉庫**: https://github.com/anomixer/OpenCC-web

### 開發環境設定
```bash
# 克隆專案（包含 submodule）
git clone --recursive https://github.com/anomixer/OpenCC-web.git
cd OpenCC-web

# 如果忘記使用 --recursive，可以：
git submodule update --init --recursive

# 更新 submodule 到最新版本
git submodule update --remote

# 安裝依賴
npm install

# 啟動開發伺服器
npm start
```

### 專案目錄結構
```
OpenCC-web/
├── opencc/              # OpenCC 核心函式庫 (git submodule)
├── public/              # 靜態檔案
│   ├── index.html       # 主頁面
│   └── favicon.png      # 網站圖示
├── uploads/             # 暫存檔案目錄（自動建立）
├── server.js            # Express 伺服器主檔案
├── package.json         # Node.js 依賴設定
├── AGENTS.md           # 開發指南（本檔案）
└── README.md           # 專案說明文檔
```

## 開發指令

### Node.js 開發
- `npm start` - 啟動開發伺服器（預設 port 3000）
- `npm install` - 安裝依賴套件
- `npm test` - 執行測試（目前為空）

### Git 操作
- `git status` - 檢查主專案狀態
- `git submodule status` - 檢查 submodule 狀態
- `git add . && git commit -m "message"` - 提交主專案變更
- `git push` - 推送主專案到 GitHub

### OpenCC 核心開發（進階）
如需修改 OpenCC 核心函式庫：
```bash
# 進入 submodule 目錄
cd opencc

# 獨立操作 submodule
git checkout master
git pull origin master

# 建置 OpenCC（參考 OpenCC 專案說明）
# Windows: build.cmd
# Linux/macOS: make

# 回到主專案提交 submodule 更新
cd ..
git add opencc
git commit -m "Update OpenCC submodule"
git push
```

## 網頁服務開發

### 可用 API
- **Node.js API**: `node/opencc.js` - 高效能，支援 async/await
- **Python API**: `python/opencc/__init__.py` - 易於與網頁框架整合
- **C++ API**: 核心函式庫，提供最佳效能

### 推薦網頁架構
- 使用 Node.js + Express 處理檔案上傳與串流
- 對大型檔案實作分塊處理
- 使用 multer 處理檔案
- 支援長時間轉換的進度回報

### 關鍵實作注意事項
- 原始網站 (https://opencc.byvoid.com/) 有檔案長度限制
- OpenCC 僅提供轉換函式庫，不包含網頁伺服器實作
- 需要圍繞 API 建構自訂網頁服務
- 使用串流避免大型檔案的記憶體限制

### Web Service 功能
- **專案**: OpenCC-web (https://github.com/anomixer/OpenCC-web)
- **本地網址**: http://localhost:3000
- **生產部署**: Railway/Render/Vercel
- **標題**: 開放中文轉換 (Open Chinese Convert)
- **核心功能**:
  - 文字轉換即時處理與複製按鈕
  - 檔案轉換無檔案大小限制（串流處理）
  - 多檔案批次處理與個別狀態追蹤
  - 拖放檔案上傳支援
  - 14 種 OpenCC 轉換模式（s2t, t2s, s2hk, hk2s, s2tw, tw2s, s2twp, tw2sp, t2tw, tw2t, hk2t, t2hk, t2jp, jp2t）
- **使用者介面功能**:
  - 響應式設計與現代漸層樣式
  - 明暗主題切換與動畫背景
    - 明亮模式：晴朗天空與飄浮雲朵動畫
    - 深色模式：夜空與閃爍星星動畫
  - 繁體中文/簡體中文語言切換
  - 統一檔案介面（單檔/多檔使用相同介面模式）
  - 即時進度報告與 100% 完成保證
  - 下載狀態追蹤（下載 → 已下載）
  - 文字轉換結果複製按鈕
  - GitHub 儲存庫連結頁尾
  - 網站圖示支援（PNG 格式）
- **技術實作**:
  - 後端：Node.js + Express + Multer + OpenCC 函式庫
  - 前端：原生 HTML/CSS/JavaScript 與 CSS 變數
  - 儲存：暫存檔案系統與自動清理（每 30 分鐘）
  - 國際化：客戶端翻譯系統
  - 主題：CSS 自訂屬性與資料屬性及動畫
  - 檔案處理：支援所有文字格式檔案
  - 進度追蹤：個別檔案狀態與批次進度
- **語言偵測**:
  - 簡體中文：zh-CN, zh-SG, zh-MY
  - 繁體中文：zh-TW, zh-HK, zh-MO, zh-BN, zh-ID
  - 預設：非中文地區使用繁體中文
- **視覺設計**:
  - 明亮主題：天藍色漸層（#87CEEB → #98D8E8 → #B0E0E6）與飄浮雲朵
  - 深色主題：深空漸層（#0f0c29 → #24243e → #302b63）與閃爍星星
  - 動畫背景：明亮模式 20 秒飄浮循環，深色模式 5 秒閃爍循環
  - 改進分頁樣式與滑入動畫
  - 增強兩種主題的佔位符可見性

## 部署指南

### 🚀 線上展示網站
- **網址**: https://opencc-web.onrender.com/
- **平台**: Render (Free Tier)
- **檔案限制**: 80MB（為避免觸及平台 100MB 限制）
- **功能**: 完整 14 種轉換模式
- **限制**: 15分鐘無活動後自動休眠，再次訪問需等待啟動

### 推薦部署平台

#### Railway (最推薦)
```bash
# 1. 連接 GitHub 帳號到 Railway
# 2. 選擇 OpenCC-web repo
# 3. Railway 自動偵測 Node.js 專案
# 4. 設定環境變數（可選）
# 5. 部署完成，取得 Railway URL
```
**優點**: 無檔案大小限制、支援 Node.js 完整功能、免費額度 $5/月

#### Render
```bash
# 1. 連接 GitHub 帳號到 Render
# 2. 選擇 "New Web Service"
# 3. 選擇 OpenCC-web repo
# 4. 設定建置指令：npm install
# 5. 設定啟動指令：node server.js
# 6. 設定環境變數：RENDER=true
# 7. 部署完成
```
**優點**: 免費版支援完整功能、自動部署
**限制**: 檔案上傳 100MB（建議設定 80MB）
**實例**: https://opencc-web.onrender.com/
**注意**: 15分鐘無活動後自動休眠

#### Vercel (需優化)
```bash
# 1. 安裝 Vercel CLI
# 2. 執行 vercel --prod
# 3. 按提示設定專案
```
**優點**: 部署簡單、全球 CDN
**限制**: 
- 函式執行時間：10秒
- 檔案大小：4.5MB
- 需優化大型檔案處理

#### Cloudflare Workers (純 Serverless)
```bash
# 需重構為 Workers 格式
# 1. 建立 wrangler.toml
# 2. 重構 server.js 為 Workers API
# 3. 使用 Durable Objects 處理狀態
# 4. 部署：wrangler deploy
```
**優點**: 極致效能、邊緣計算
**限制**:
- 請求體大小：100MB (免費版)
- 響應體大小：25MB
- 執行時間：10ms (免費版) / 30ms (付費版)
- **需大幅重構代碼，不適合無檔案限制場景**

### 部署平台比較表

| 平台 | 檔案限制 | 執行時間 | 免費額度 | 適合性 | 實例 |
|------|----------|----------|----------|--------|------|
| Railway | 無限制 | 無限制 | $5/月 | ⭐⭐⭐⭐⭐ | - |
| Render | 100MB* | 無限制 | 無限請求 | ⭐⭐⭐⭐ | [✅](https://opencc-web.onrender.com/) |
| Vercel | 4.5MB | 10秒 | 100GB | ⭐⭐ | - |
| Cloudflare Workers | 100MB | 10ms | 100萬請求 | ⭐ | - |

*建議設定 80MB 以避免觸及平台限制

### 環境變數設定
- `PORT`: 服務端口（預設 3000）
- `NODE_ENV`: 生產環境設為 production

### 部署優化建議

#### Render 檔案大小限制優化
```javascript
// 在 server.js 中根據平台動態設定檔案限制
const isRender = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';
const maxFileSize = isRender ? 80 * 1024 * 1024 : 100 * 1024 * 1024; // Render: 80MB, 本地: 100MB

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: maxFileSize
  }
});
```

#### Vercel 檔案大小限制優化
```javascript
// 在 server.js 中加入檔案大小檢查
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024 // 4MB 限制（適合 Vercel）
  }
});
```

#### 分塊處理方案
```javascript
// 將大檔案分割為小塊處理
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
```

#### 外部儲存方案
```javascript
// 使用 AWS S3 或其他雲端儲存大檔案
// 僅在應用伺服器處理轉換邏輯
```

### 實際部署經驗分享

#### Render 部署要點
1. **Start Command**: 使用 `node server.js` 而非 `npm start`
2. **環境變數**: 設定 `RENDER=true` 供程式偵測平台
3. **檔案限制**: 建議 80MB，避免觸及平台 100MB 硬限制
4. **休眠問題**: 免費版 15分鐘無活動後休眠，首次訪問需等待
5. **自動部署**: GitHub 推送自動觸發重新部署

### Docker 部署（可選）
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 開發歷史
- 2025-11-12：分析專案結構的網頁服務部署選項
- 識別 Node.js、Python 和 C++ API 作為網頁服務基礎
- 設計無檔案大小限制的串流架構
- 2025-11-12：使用 Express 建置完整 Node.js 網頁服務
- 實作大型檔案的檔案上傳與串流支援
- 建立具有 14 種轉換模式的響應式網頁介面
- 新增自動檔案清理與進度報告
- 成功部署至 http://localhost:3000 並支援無檔案大小限制
- 2025-11-12：增強主題與語言切換功能的 UI
- 新增明暗主題切換器與瀏覽器系統偏好偵測
- 實作繁體中文/簡體中文語言切換與瀏覽器語言偵測
- 修正語言切換按鈕顯示目前語言狀態而非目標語言
- 新增智慧語言偵測：zh-CN, zh-SG, zh-MY → 簡體；zh-TW, zh-HK, zh-MO, zh-BN, zh-ID → 繁體
- 新增瀏覽器系統主題偏好偵測用於初始主題選擇
- 2025-11-12：實作拖放與多檔案批次處理
- 新增拖放檔案上傳與視覺回饋
- 實作多檔案批次轉換與個別狀態追蹤
- 建立單檔與多檔操作的統一檔案介面
- 新增下載狀態管理（下載 → 已下載狀態）
- 修正進度條達到批次操作的 100% 完成
- 移除檔案副檔名限制以支援所有文字格式
- 2025-11-12：增強 UI/UX 與視覺設計
- 新增文字轉換結果的複製按鈕與成功通知
- 修正深色模式的佔位符可見性
- 改進分頁樣式與滑入動畫及穩定底部邊框
- 增強明亮模式的標題文字可見性（藍色漸層上的黑色文字）
- 新增動畫背景：晴朗天空（明亮模式）與夜空（深色模式）
- 實作網站圖示支援（PNG 格式）
- 更新網站標題為「開放中文轉換 (Open Chinese Convert)」
- 新增選擇新檔案時的自動進度重置
- 改進下載功能以避免開啟新分頁
- 2025-11-13：建立 GitHub 專案與 Git Submodule 架構
- 設定 OpenCC 核心函式庫為 submodule
- 上傳至 GitHub (https://github.com/anomixer/OpenCC-web)
- 完成完整文檔與部署指南
- 更新開發指南為現代化 Git Submodule 工作流程