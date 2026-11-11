import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {gzipSync} from 'node:zlib';

test('analytics queues page views immediately but downloads only once after load/idle or interaction',async()=>{
 const html=await readFile('index.html','utf8');
 assert.doesNotMatch(html,/<script[^>]+src="https:\/\/www.googletagmanager.com/);
 const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const listeners=new Map(),scripts=[];let idle;
 const window={addEventListener:(type,callback)=>listeners.set(type,callback),removeEventListener:type=>listeners.delete(type),requestIdleCallback:callback=>{idle=callback}};
 const document={createElement:()=>({}),head:{appendChild:script=>scripts.push(script)}};
 const context={window,document,Date,setTimeout:callback=>callback()};
 Object.defineProperty(context,'dataLayer',{get:()=>window.dataLayer});
 runInNewContext(code,context);
 assert.equal(window.dataLayer.length,2);assert.equal(window.dataLayer[1][0],'config');
 assert.equal(window.dataLayer[1][1],'G-YE9KRXWKS9');assert.equal(scripts.length,0);
 listeners.get('load')();assert.equal(scripts.length,0);
 listeners.get('pointerdown')();idle();
 assert.equal(scripts.length,1);assert.equal(scripts[0].async,true);assert.match(scripts[0].src,/G-YE9KRXWKS9/);
});

test('landing static dependencies exclude admin, festival and animation code and stay within 100 KiB gzip',async()=>{
 const directory='dist/client/assets/';const files=await readdir(directory);
 const html=await readFile('dist/client/index.html','utf8');
 const entry=html.match(/<script[^>]+src="\/assets\/([^"]+\.js)"/)[1];
 const initial=[entry,files.find(name=>/^LandingPage-.*\.js$/.test(name))];
 const visited=new Map();
 async function visit(name){
  if(visited.has(name))return;
  const code=await readFile(directory+name,'utf8');visited.set(name,code);
  for(const match of code.matchAll(/(?:\bfrom\s*|\bimport\s*)["']\.\/([^"']+\.js)["']/g))await visit(match[1]);
 }
 for(const name of initial)await visit(name);
 assert.ok(![...visited.keys()].some(name=>/^(Admin|FestivalPage|ScrollTrigger|siteMotion)-/.test(name)));
 const bytes=[...visited.values()].reduce((total,code)=>total+gzipSync(code).length,0);
 assert.ok(bytes<100*1024,'Initial landing JavaScript exceeds 100 KiB gzip: '+bytes);
 for(const prefix of ['Admin','FestivalPage','siteMotion'])assert.ok(files.some(name=>name.startsWith(prefix+'-')));
});
