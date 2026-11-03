import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
await mkdir(new URL('../dist/server/',import.meta.url),{recursive:true});
await mkdir(new URL('../dist/scripts/',import.meta.url),{recursive:true});
for(const file of ['server.js','server/app.js','server/admin.js','server/interestReport.js','package.json','package-lock.json','scripts/hostinger-build.mjs']){
  await copyFile(new URL('../'+file,import.meta.url),new URL('../dist/'+file,import.meta.url));
}
// Each route gets the correct early image request; admin and About preload no food.
const html=await readFile(new URL('../dist/client/index.html',import.meta.url),'utf8');
const secondaryHtml=html.replace(/<link\b[^>]*\bdata-landing-hero\b[^>]*>/g,'');
for(const route of ['about','admin','festival']){
  await mkdir(new URL('../dist/client/'+route+'/',import.meta.url),{recursive:true});
  const page=route==='festival'?secondaryHtml.replace('</head>','<link rel="preload" as="image" type="image/webp" href="/maharashtrian-thali.webp" fetchpriority="high"></head>'):secondaryHtml;
  await writeFile(new URL('../dist/client/'+route+'/index.html',import.meta.url),page);
}
console.log('Deployment prepared: frontend, route-specific image hints and Node.js server.');
