import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {versionImageUrls} from './versioned-assets.mjs';
await mkdir(new URL('../dist/server/',import.meta.url),{recursive:true});
await mkdir(new URL('../dist/scripts/',import.meta.url),{recursive:true});
for(const file of ['server.js','server/app.js','server/admin.js','server/interestReport.js','package.json','package-lock.json','scripts/hostinger-build.mjs']){
  await copyFile(new URL('../'+file,import.meta.url),new URL('../dist/'+file,import.meta.url));
}
const output=new URL('../dist/client/',import.meta.url);
let html=await readFile(new URL('index.html',output),'utf8');
// Inline Vite's exact compiled stylesheet: no duplicate rules or unstyled first paint.
const styles=[...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)];
let inlineBytes=0;
for(const match of styles){
  const href=match[0].match(/\bhref="([^"]+)"/)?.[1];
  if(!href?.startsWith('/assets/')||!href.endsWith('.css'))continue;
  const root=fileURLToPath(output);
  const stylesheet=resolve(root,'.'+href);
  if(relative(root,stylesheet).startsWith('..'))throw new Error('Stylesheet outside build output');
  const css=await readFile(stylesheet,'utf8');
  if(/@import\s/i.test(css))throw new Error('Render-blocking CSS import found');
  html=html.replace(match[0],'<style data-site-styles>'+css.replace(/<\/style/gi,'<\\/style')+'</style>');
  inlineBytes+=Buffer.byteLength(css);
}
if(!inlineBytes)throw new Error('Compiled stylesheet was not found for inlining');
await writeFile(new URL('index.html',output),html);
// Each route gets the correct early image request; admin and About preload no food.
const secondaryHtml=html.replace(/<link\b[^>]*\bdata-landing-hero\b[^>]*>/g,'');
for(const route of ['about','admin','festival']){
  await mkdir(new URL(route+'/',output),{recursive:true});
  const page=route==='festival'?secondaryHtml.replace('</head>','<link rel="preload" as="image" type="image/webp" href="/maharashtrian-thali.webp" fetchpriority="high"></head>'):secondaryHtml;
  await writeFile(new URL(route+'/index.html',output),versionImageUrls(page));
}
console.log('Deployment prepared: inlined '+inlineBytes+' bytes of site CSS; fonts load without blocking first paint.');
