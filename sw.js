// 写真報告書作成アプリ：ホーム画面に追加できる（PWA）ための Service Worker。
// ・アプリ本体（HTML）は「ネット優先」：常に最新版を取り、オフライン時だけ保存済みを使う
//   → 更新を公開したのに古い画面が出続ける、という事態を避ける
// ・アイコンなどの静的ファイルと、外部の部品（PDF作成ライブラリ・フォント）は保存して高速化
// ・Firebase など、データの読み書きの通信には一切関与しない
var CACHE = "houkokusho-v1";
var SHELL = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/favicon-32.png"];
var RUNTIME_HOSTS = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

function networkFirst(req){
  return fetch(req).then(function(res){
    if(res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
    return res;
  }).catch(function(){
    return caches.match(req).then(function(hit){ return hit || caches.match("/"); });
  });
}

function staleWhileRevalidate(req){
  return caches.match(req).then(function(hit){
    var fresh = fetch(req).then(function(res){
      if(res && (res.ok || res.type === "opaque")){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
      return res;
    }).catch(function(){ return hit; });
    return hit || fresh;
  });
}

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);

  if(url.origin === self.location.origin){
    if(req.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html")){
      e.respondWith(networkFirst(req));
    } else {
      e.respondWith(staleWhileRevalidate(req));
    }
    return;
  }
  if(RUNTIME_HOSTS.indexOf(url.hostname) !== -1){
    e.respondWith(staleWhileRevalidate(req));
  }
  // それ以外（Firebase など）は通常どおりネットワークへ
});
