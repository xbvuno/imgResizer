if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const d=e=>s(e,o),c={module:{uri:o},exports:t,require:d};i[o]=Promise.all(n.map((e=>c[e]||d(e)))).then((e=>(r(...e),t)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DEYyURb2.css",revision:null},{url:"assets/index-DFAOjf3X.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"index.html",revision:"efa572058a4d8cb4a386433cb56bc1d1"},{url:"media/icons/144x144.png",revision:"53bf84c749a6d0662b46f867010c9039"},{url:"media/icons/48x48.png",revision:"a69296f24f7787f41b59d4323c0c275f"},{url:"media/icons/icon.svg",revision:"98ab3cb0e65dbd0d607183350c359a3d"},{url:"manifest.webmanifest",revision:"1c8043e2b8bea1dd3f4ef4a0716c1def"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
