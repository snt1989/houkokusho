// 親フォルダのWebアプリ本体を native/www にコピーする（Capacitor が読み込む場所）。
// Service Worker（sw.js）はネイティブアプリでは使わないのでコピーしない。
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const out = path.resolve(__dirname, "..", "www");

const files = [
  "index.html",
  "manifest.webmanifest",
  "favicon.ico",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-512.png",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of files) {
  const src = path.join(root, f);
  if (!fs.existsSync(src)) {
    console.error("見つかりません: " + f);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(out, f));
}
console.log("www を作成しました（" + files.length + " ファイル）");
