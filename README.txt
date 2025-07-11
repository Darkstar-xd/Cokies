# Facebook Messenger Auto-Sender (Termux + Node.js)
## ⚙️ Requirements
- Termux (Android)
- nodejs, npm, puppeteer

## 📦 Install Dependencies
```bash
pkg update
pkg install nodejs
npm install express multer puppeteer
```

## ▶️ Run Server
```bash
node server.js
```

## 🧪 Open in Browser
Visit: http://localhost:3000/

Fill in:
- Facebook Cookies (c_user, xs)
- Thread ID
- Delay (ms)
- Haters Name (prefix)
- Last Name (suffix)
- Upload messages.txt file (one message per line)

✅ Messages will be sent via browser automation (headless = false).
