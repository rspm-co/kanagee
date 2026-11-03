import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';

test('all production pages inline the complete stylesheet and defer external fonts',async()=>{
 const assets=await readdir('dist/client/assets');const files=assets.filter(name=>name.endsWith('.css'));assert.equal(files.length,1);
 const css=await readFile('dist/client/assets/'+files[0],'utf8');assert.doesNotMatch(css,/@import\s/i);
 for(const route of ['index.html','about/index.html','festival/index.html','admin/index.html']){
  const html=await readFile('dist/client/'+route,'utf8');
  const style=html.match(/<style data-site-styles>([\s\S]*?)<\/style>/)?.[1];assert.equal(style,css,route+' must retain the full compiled styles');
  const normal=html.replace(/<noscript>[\s\S]*?<\/noscript>/g,'');
  const links=[...normal.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)].map(m=>m[0]);
  assert.equal(links.length,1);assert.match(links[0],/fonts.googleapis.com/);assert.match(links[0],/media="print"/);assert.match(links[0],/onload="this.media='all'"/);assert.doesNotMatch(normal,/<link\b[^>]*rel="stylesheet"[^>]*href="\/assets\//);
 }
});
