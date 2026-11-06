import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {versionImageUrls} from './versioned-assets.mjs';
import {createServer} from 'vite';
import {event,venueFullAddress} from '../src/config/event.js';
import {publicPages,siteUrl,structuredData,pageMarkdown,festivalFacts} from '../src/config/site.js';
await mkdir(new URL('../dist/server/',import.meta.url),{recursive:true});
await mkdir(new URL('../dist/scripts/',import.meta.url),{recursive:true});
for(const file of ['server.js','server/app.js','server/admin.js','server/interestReport.js','server/agents.js','package.json','package-lock.json','scripts/hostinger-build.mjs']){
  await mkdir(new URL('./',new URL('../dist/'+file,import.meta.url)),{recursive:true});
  await copyFile(new URL('../'+file,import.meta.url),new URL('../dist/'+file,import.meta.url));
}
const output=new URL('../dist/client/',import.meta.url);
// Standalone unlisted display: intentionally excluded from all public discovery lists.
const countdownUrl=new URL('countdown/index.html',output);
await writeFile(countdownUrl,versionImageUrls(await readFile(countdownUrl,'utf8')));
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
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
// Render the actual React pages at build time so content is available without JavaScript.
const renderer=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom',ssr:{noExternal:['gsap']}});
let stopBuildMotion;
try{
  const rendering=await renderer.ssrLoadModule('/src/build-render.jsx');
  stopBuildMotion=rendering.stopBuildMotion;
  for(const page of [...publicPages,{path:'/admin/',title:'KANAGEE Admin',description:'Private KANAGEE administration.'}]){
    const admin=page.path==='/admin/';
    let document=page.path==='/'?html:html.replace(/<link\b[^>]*\bdata-landing-hero\b[^>]*>/g,'');
    document=document.replace(/<title>[^<]*<\/title>/,'<title>'+escape(page.title)+'</title>').replace(/<meta name="description"[^>]*>/,'<meta name="description" content="'+escape(page.description)+'"/>');
    const canonical=siteUrl+page.path;
    document=document.replace('</head>','<link rel="canonical" href="'+canonical+'"/>'+(admin?'<meta name="robots" content="noindex,nofollow"/>':'<link rel="alternate" type="text/markdown" href="'+canonical+'index.md"/><script type="application/ld+json">'+JSON.stringify(structuredData(page)).replaceAll('<','\\u003c')+'</script>')+'</head>');
    if(page.path==='/festival/')document=document.replace('</head>','<link rel="preload" as="image" type="image/webp" href="/festival-thali.webp" imagesrcset="/festival-thali-480w.webp 480w, /festival-thali-800w.webp 800w, /festival-thali.webp 1254w" imagesizes="(max-width: 760px) 88vw, (max-width: 1350px) 43vw, 580px" fetchpriority="high"></head>');
    if(!admin)document=document.replace('<div id="root"></div>','<div id="root">'+rendering.renderPage(page.path)+'</div>');
    const directory=new URL('.'+page.path,output);await mkdir(directory,{recursive:true});
    await writeFile(new URL('index.html',directory),versionImageUrls(document));
    if(!admin)await writeFile(new URL('index.md',directory),pageMarkdown(page));
  }
}finally{stopBuildMotion?.();await renderer.close()}
await writeFile(new URL('sitemap.xml',output),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+publicPages.map(p=>'<url><loc>'+siteUrl+p.path+'</loc></url>').join('')+'</urlset>\n');
await writeFile(new URL('robots.txt',output),'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nContent-Signal: search=yes, ai-input=yes, ai-train=no\n\nSitemap: '+siteUrl+'/sitemap.xml\n');
await writeFile(new URL('llms.txt',output),'# KANAGEE\n\n> Maharashtra food festival organised by Ladachi Kulfi — R S Papal Group.\n\n'+event.dates+', '+event.dailyHours+', '+venueFullAddress+'. Toll-free: 1800 210 3696. Book through the Ladachi Kulfi mobile app.\n\n## Official pages\n\n'+publicPages.map(p=>'- ['+p.title+']('+siteUrl+p.path+'): '+p.description).join('\n')+'\n\n## Agent resources\n\n- [Markdown home]('+siteUrl+'/index.md)\n- [MCP server card]('+siteUrl+'/.well-known/mcp/server-card.json)\n\nPublic MCP tools only provide festival information; they cannot access signups, administer the site, or book tickets.\n');
console.log('Deployment prepared: inlined '+inlineBytes+' bytes of site CSS; fonts load without blocking first paint.');
await writeFile(new URL('agent-data.json',output),JSON.stringify(festivalFacts()));
