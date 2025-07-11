const express = require('express');
const multer = require('multer');
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/send', upload.single('messages'), async (req, res) => {
  const { cookies, thread_id, delay, haters, last_name } = req.body;
  const messagesFilePath = req.file.path;

  // Respond immediately and process in background
  res.send(`<script>alert("✅ Messages are being sent in background!"); window.location.href = "/";</script>`);

  // Continue processing
  const messages = fs.readFileSync(messagesFilePath, 'utf8')
    .split('\n')
    .map(m => m.trim())
    .filter(m => m.length > 0);
  fs.unlinkSync(messagesFilePath);

  const c_user = /c_user=(\d+)/.exec(cookies)[1];
  const xs = /xs=([^;]+)/.exec(cookies)[1];
  const msgDelay = parseInt(delay) || 3000;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setCookie(
    { name: 'c_user', value: c_user, domain: '.facebook.com' },
    { name: 'xs', value: xs, domain: '.facebook.com' }
  );

  await page.goto(`https://www.facebook.com/messages/t/${thread_id}`, {
    waitUntil: 'networkidle2'
  });

  await page.waitForSelector('[contenteditable="true"]');

  // 🔁 Infinite message loop
  while (true) {
    for (let i = 0; i < messages.length; i++) {
      const fullMsg = `${haters} ${messages[i]} ${last_name}`.trim();
      console.log(`📤 Sending: ${fullMsg}`);
      await page.type('[contenteditable="true"]', fullMsg);
      await page.keyboard.press('Enter');
      await new Promise(res => setTimeout(res, msgDelay));
    }
  }
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
