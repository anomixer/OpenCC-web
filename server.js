const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');
const OpenCC = require('opencc');

const app = express();
const PORT = process.env.PORT || 3000;

// 中介軟體設定
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 檔案上傳設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB 限制
  }
});

// 確保上傳目錄存在
fs.ensureDirSync('uploads/');

// 轉換設定對應
const conversionConfigs = {
  's2t': 's2t.json',        // 簡體到繁體
  't2s': 't2s.json',        // 繁體到簡體
  's2hk': 's2hk.json',      // 簡體到香港繁體
  'hk2s': 'hk2s.json',      // 香港繁體到簡體
  's2tw': 's2tw.json',      // 簡體到臺灣正體
  'tw2s': 'tw2s.json',      // 臺灣正體到簡體
  's2twp': 's2twp.json',    // 簡體到繁體（臺灣）並轉換爲臺灣用詞
  'tw2sp': 'tw2sp.json',    // 繁體（臺灣）到簡體並轉換爲中國大陸用詞
  't2tw': 't2tw.json',      // 繁體（OpenCC 標準）到臺灣正體
  'tw2t': 'tw2t.json',      // 臺灣正體到繁體（OpenCC 標準）
  'hk2t': 'hk2t.json',      // 香港繁體到繁體（OpenCC 標準）
  't2hk': 't2hk.json',      // 繁體（OpenCC 標準）到香港繁體
  't2jp': 't2jp.json',      // 繁體（OpenCC 標準，舊字體）到日文新字體
  'jp2t': 'jp2t.json'       // 日文新字體到繁體（OpenCC 標準，舊字體）
};

// API 路由：取得可用的轉換設定
app.get('/api/configs', (req, res) => {
  res.json(Object.keys(conversionConfigs));
});

// API 路由：文字轉換
app.post('/api/convert/text', async (req, res) => {
  try {
    const { text, config = 's2t' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: '請提供要轉換的文字' });
    }
    
    const configFile = conversionConfigs[config];
    if (!configFile) {
      return res.status(400).json({ error: '不支援的轉換設定' });
    }
    
    const opencc = new OpenCC(configFile);
    const converted = await new Promise((resolve, reject) => {
      opencc.convertPromise(text)
        .then(resolve)
        .catch(reject);
    });
    
    res.json({ 
      original: text,
      converted: converted,
      config: config 
    });
    
  } catch (error) {
    console.error('轉換錯誤:', error);
    res.status(500).json({ error: '轉換失敗: ' + error.message });
  }
});

// API 路由：檔案轉換（支援大檔案）
app.post('/api/convert/file', upload.single('file'), async (req, res) => {
  // 設定 SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  try {
    if (!req.file) {
      res.write(`data: {"type": "error", "error": "請上傳檔案"}\n\n`);
      return res.end();
    }
    
    const config = req.body.config || 's2t';
    const configFile = conversionConfigs[config];
    
    if (!configFile) {
      res.write(`data: {"type": "error", "error": "不支援的轉換設定"}\n\n`);
      return res.end();
    }
    
    const opencc = new OpenCC(configFile);
    const inputPath = req.file.path;
    
    // 生成輸出檔案名：原始檔名 + .converted
    const originalName = req.file.originalname;
    const convertedFilename = originalName + '.converted';
    const outputPath = path.join('uploads', convertedFilename);
    
    // 讀取檔案內容
    const content = await fs.readFile(inputPath, 'utf8');
    
    // 分批處理大檔案（每 10000 字符一批）
    const chunkSize = 10000;
    const chunks = [];
    
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.substring(i, i + chunkSize);
      const converted = await new Promise((resolve, reject) => {
        opencc.convertPromise(chunk)
          .then(resolve)
          .catch(reject);
      });
      chunks.push(converted);
      
      // 發送進度更新
      const progress = Math.round((i + chunkSize) / content.length * 100);
      if (progress <= 100) {
        res.write(`data: {"type": "progress", "progress": ${progress}}\n\n`);
      }
    }
    
    // 寫入轉換後的內容
    await fs.writeFile(outputPath, chunks.join(''), 'utf8');
    
    // 清理原始檔案
    await fs.remove(inputPath);
    
    // 發送完成訊息
    res.write(`data: {"type": "complete", "filename": "${convertedFilename}"}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('檔案轉換錯誤:', error);
    res.write(`data: {"type": "error", "error": "${error.message}"}\n\n`);
    res.end();
  }
});

// API 路由：下載轉換後的檔案
app.get('/api/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('uploads', filename);
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ error: '檔案不存在' });
    }
    
    res.download(filePath, (err) => {
      if (err) {
        console.error('下載錯誤:', err);
      }
      // 下載後清理檔案
      setTimeout(() => {
        fs.remove(filePath).catch(console.error);
      }, 1000);
    });
    
  } catch (error) {
    console.error('下載錯誤:', error);
    res.status(500).json({ error: '下載失敗' });
  }
});

// 清理臨時檔案的定時任務
setInterval(async () => {
  try {
    const files = await fs.readdir('uploads/');
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join('uploads', file);
      const stats = await fs.stat(filePath);
      
      // 刪除超過 1 小時的檔案
      if (now - stats.mtime.getTime() > 60 * 60 * 1000) {
        await fs.remove(filePath);
        console.log('已清理舊檔案:', file);
      }
    }
  } catch (error) {
    console.error('清理檔案錯誤:', error);
  }
}, 30 * 60 * 1000); // 每 30 分鐘執行一次

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 OpenCC 網站服務已啟動`);
  console.log(`📍 網址: http://localhost:${PORT}`);
  console.log(`📁 上傳目錄: uploads/`);
  console.log(`⏰ 清理任務: 每 30 分鐘`);
});

module.exports = app;