import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {createApp} from './app.js';
import {publicPages,siteUrl} from '../src/config/site.js';
import {registerAgentTools} from '../src/agentTools.js';

async function withServer(run){
 const app=createApp({pool:null,origin:'https://kanagee.test',staticDirectory:process.cwd()+'/dist/client'});
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
 try{await run('http://127.0.0.1:'+server.address().port)}finally{await new Promise(resolve=>server.close(resolve))}
}

test('every public page has rendered content, one H1, canonical metadata and linked entities',async()=>{
 for(const page of publicPages){
  const html=await readFile('dist/client'+page.path+'index.html','utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,page.path);
  assert.ok(html.includes('rel="canonical" href="'+siteUrl+page.path+'"'));
  assert.ok(html.includes('<title>'+page.title.replaceAll('&','&amp;')+'</title>'));
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const organization=schema['@graph'].find(node=>node['@id']===siteUrl+'/#organization');
  assert.equal(organization.telephone,'1800 210 3696');assert.deepEqual(organization.sameAs,['https://www.instagram.com/kanagee_/']);
  assert.ok(schema['@graph'].some(node=>node['@type']==='FoodEvent'));assert.ok(schema['@graph'].some(node=>node['@type']==='WebSite'));
  for(const route of ['/about/','/contact/','/terms/','/privacy/'])assert.ok(html.includes('href="'+route+'"'));
  assert.match(html,/href="tel:18002103696"/);
 }
 const sitemap=await readFile('dist/client/sitemap.xml','utf8');assert.match(sitemap,/xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
 assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),publicPages.map(p=>siteUrl+p.path));assert.doesNotMatch(sitemap,/admin|api\//);
 const robots=await readFile('dist/client/robots.txt','utf8');assert.match(robots,/Content-Signal: search=yes, ai-input=yes, ai-train=no/);assert.match(robots,/Sitemap: https:\/\/kanagee.com\/sitemap.xml/);assert.match(robots,/Disallow: \/admin/);
});

test('HTTP advertises and negotiates Markdown while retaining normal HTML and private admin behavior',async()=>withServer(async base=>{
 for(const page of publicPages){
  const response=await fetch(base+page.path,{headers:{Accept:'text/markdown'}});assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/text\/markdown/);assert.match(response.headers.get('vary'),/Accept/);assert.match(response.headers.get('link'),/llms.txt/);
  assert.equal(await response.text(),await(await fetch(base+page.path+'index.md')).text());
 }
 const html=await fetch(base+'/',{headers:{Accept:'text/html'}});assert.match(html.headers.get('content-type'),/text\/html/);assert.match(await html.text(),/<h1\b/);
 const preferred=await fetch(base+'/',{headers:{Accept:'text/markdown;q=0.2, text/html;q=0.9'}});assert.match(preferred.headers.get('content-type'),/text\/html/);
 for(const path of ['/robots.txt','/sitemap.xml','/llms.txt'])assert.equal((await fetch(base+path)).status,200);
 const admin=await fetch(base+'/admin/',{headers:{Accept:'text/markdown'}});assert.equal(admin.headers.get('x-robots-tag'),'noindex, nofollow');assert.match(admin.headers.get('content-type'),/text\/html/);assert.equal((await fetch(base+'/admin/index.md')).status,404);
 assert.equal((await fetch(base+'/.env')).status,404);
}));

test('MCP card describes working public tools and SDK clients can initialize and call them',async()=>withServer(async base=>{
 const response=await fetch(base+'/.well-known/mcp/server-card.json');assert.equal(response.status,200);assert.equal(response.headers.get('access-control-allow-origin'),'*');const card=await response.json();assert.equal(card.transport.endpoint,'https://kanagee.com/mcp');assert.equal(card.authentication.required,false);
 const client=new Client({name:'kanagee-integration-test',version:'1.0.0'});
 try{
  await client.connect(new StreamableHTTPClientTransport(new URL(base+'/mcp')));
  const {tools}=await client.listTools();assert.deepEqual(tools.map(t=>t.name).sort(),card.tools.map(t=>t.name).sort());
  const result=await client.callTool({name:'kanagee_festival_details',arguments:{}});const facts=JSON.parse(result.content[0].text);assert.equal(facts.name,'KANAGEE');assert.equal(facts.telephone,'1800 210 3696');assert.equal(facts.dailyHours,'12 PM–9 PM');assert.equal(facts.tickets.url,'https://booking.kanagee.com/e/kanagee');
  const booking=await client.callTool({name:'kanagee_booking_info',arguments:{}});assert.equal(JSON.parse(booking.content[0].text).tickets.platform,'Ladachi Kulfi mobile app');
  const invalid=await client.callTool({name:'kanagee_festival_details',arguments:{mobile:'+919876543210'}});assert.equal(invalid.isError,true);
 }finally{await client.close()}
 const denied=await fetch(base+'/mcp',{method:'POST',headers:{Origin:'https://other.test','Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list'})});assert.equal(denied.status,403);
 assert.equal((await fetch(base+'/mcp')).status,405);
}));

test('WebMCP registration is optional and exposes only public information',async()=>{
 const tools=[];await registerAgentTools({registerTool:tool=>tools.push(tool)});assert.equal(tools.length,2);
 const result=await tools[0].execute({});assert.equal(JSON.parse(result.content[0].text).name,'KANAGEE');
 assert.ok(tools.every(tool=>tool.inputSchema.additionalProperties===false));await registerAgentTools({});
});
