import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {createApp} from './app.js';

test('production images use WebP and each page preloads only its own hero',async()=>{
 const directory=process.cwd()+'/dist/client';
 assert.equal((await readdir(directory)).filter(name=>name.endsWith('.png')).length,0);
 const app=createApp({pool:null,origin:'https://kanagee.test',staticDirectory:directory});
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const landing=await(await fetch(base+'/')).text();assert.match(landing,/data-landing-hero/);assert.match(landing,/imagesrcset=/);assert.match(landing,/heritage-thali-cutout-480w\.webp/);
  for(const path of ['/about/','/admin/']){const html=await(await fetch(base+path)).text();assert.doesNotMatch(html,/data-landing-hero/);assert.doesNotMatch(html,/rel="preload"[^>]+as="image"/)}
  const festival=await(await fetch(base+'/festival/')).text();assert.match(festival,/rel="preload"[^>]+maharashtrian-thali\.webp/);assert.doesNotMatch(festival,/data-landing-hero/);
  for(const name of ['heritage-thali-cutout.webp','heritage-thali-cutout-480w.webp','heritage-thali-cutout-800w.webp','kanagee-logo-transparent-128w.webp','chairman-portrait.webp','ladachi-kulfi-logo.webp','rs-papal-logo.webp']){
   const response=await fetch(base+'/'+name);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/image\/webp/);const bytes=Buffer.from(await response.arrayBuffer());assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  }
 }finally{await new Promise(resolve=>server.close(resolve))}
});
