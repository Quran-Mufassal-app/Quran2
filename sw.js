/* Hızlı açılış: uygulama dosyalarını telefonda saklar (önce kayıtlı kopya, arkada güncelle) */
const C="quran-v1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url),same=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font)return;
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:same});
    const net=fetch(r).then(n=>{if(n&&(n.ok||n.type==="opaque"))c.put(r,n.clone());return n}).catch(()=>hit);
    return hit||net}))});
