# OpenCC 開發指南

## 建置指令

### CMake (主要)
- `make` - 建置發行版本
- `make test` - 建置並執行所有測試
- `make benchmark` - 建置並執行效能測試
- `make format` - 使用 clang-format 格式化程式碼

### Bazel
- `bazel build //:opencc` - 建置函式庫
- `bazel test --test_output=all //src/... //data/... //test/...` - 執行所有測試
- `bazel test //test:target_name` - 執行單一測試

### Windows
- `build.cmd` - 使用 Visual Studio 建置
- `test.cmd` - 在 Windows 上執行測試

## 程式碼風格

### 格式化
- 使用 LLVM 風格與左指標對齊
- 執行 `make format` 套用 clang-format
- 需要 C++14 標準

### 命名慣例
- 類別: PascalCase (例如: `Conversion`, `DictGroup`)
- 函式: 公開方法使用 PascalCase (例如: `Convert()`, `MatchPrefix()`)
- 變數: 區域變數使用 camelCase
- 常數: UPPER_SNAKE_CASE (例如: `OPENCC_DEFAULT_CONFIG_SIMP_TO_TRAD`)
- 檔案: 類別檔案使用 PascalCase (例如: `Conversion.cpp`, `DictGroup.hpp`)

### 標頭檔與引入
- 所有原始檔案包含 Apache 2.0 授權標頭
- 使用 `#pragma once` 作為標頭檔保護
- 引入順序: 系統標頭檔，然後是專案標頭檔
- 在實作檔案中使用 `using namespace opencc;`

### 錯誤處理
- 對可能失敗的操作使用 `Optional<T>`
- 對嚴重錯誤拋出例外
- 對預期失敗回傳 null/空值

### 測試
- 使用 Google Test 框架
- 測試檔案以 `Test.cpp` 結尾
- 將測試放在 `test/` 目錄中，與原始碼結構並列

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
- **位置**: `C:\dev\OpenCC-web\`
- **網址**: http://localhost:3000
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

### 開發歷史
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