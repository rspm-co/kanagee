import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {createApp} from './app.js';
import {imageAssets} from '../scripts/versioned-assets.mjs';

test('versioned assets cache for a year while pages revalidate and APIs never cache',async()=>{
 const app=createApp({pool:null,origin:'https://kanagee.test',staticDirectory:process.cwd()+'/dist/client'});
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const files=await readdir('dist/client/assets');
  for(const path of ['/assets/'+files.find(name=>name.endsWith('.js')), ...imageAssets.map(asset=>'/'+asset.fileName)]){
   const response=await fetch(base+path);assert.equal(response.status,200,path);assert.equal(response.headers.get('cache-control'),'public, max-age=31536000, immutable',path);
  }
  for(const path of ['/','/about/','/admin/','/festival/','/heritage-thali-cutout.webp'])assert.equal((await fetch(base+path)).headers.get('cache-control'),'no-cache',path);
  for(const path of ['/api/health','/api/admin/session','/api/missing'])assert.equal((await fetch(base+path)).headers.get('cache-control'),'no-store',path);
  const js=await readFile('dist/client/assets/'+files.find(name=>name.endsWith('.js')),'utf8');
  const html=await readFile('dist/client/index.html','utf8');
  for(const asset of imageAssets){assert.ok(!js.includes('/'+asset.name),'Unversioned JS reference: '+asset.name);assert.ok(!html.includes('/'+asset.name),'Unversioned HTML reference: '+asset.name)}
 }finally{await new Promise(resolve=>server.close(resolve))}
});
