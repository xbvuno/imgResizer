if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let f={};const t=e=>n(e,o),d={module:{uri:o},exports:f,require:t};i[o]=Promise.all(s.map((e=>d[e]||t(e)))).then((e=>(r(...e),f)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DHWR7miv.js",revision:null},{url:"assets/index-P_DeeABh.css",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"index.html",revision:"06d92c84773564f806b35cf4415be27c"},{url:"media/icons/144x144.png",revision:"53bf84c749a6d0662b46f867010c9039"},{url:"media/icons/196x196.png",revision:"eddd22fbc8865da6e56aa44f00fc627d"},{url:"media/icons/48x48.png",revision:"a69296f24f7787f41b59d4323c0c275f"},{url:"media/icons/512x512.png",revision:"06a062c6a53f6190efe97c6faf7f43f8"},{url:"manifest.webmanifest",revision:"69bf43fd9513151cd8047283f68a9962"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
