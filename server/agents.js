import {Router,json} from 'express';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import rateLimit from 'express-rate-limit';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {z} from 'zod';

export function agentRoutes({staticDirectory,origin}){
  const router=Router();
  // Only build-generated public content is available here; no database connection.
  const facts=JSON.parse(readFileSync(join(staticDirectory,'agent-data.json'),'utf8'));
  const serverInfo={name:'kanagee-festival',title:'KANAGEE Public Festival Information',version:'1.0.0'};
  const tools=[
    {name:'kanagee_festival_details',description:'Read confirmed KANAGEE dates, hours, venue, organisers, experiences and contact details.',result:()=>facts},
    {name:'kanagee_booking_info',description:'Read official ticket-booking guidance and contact details. Does not book tickets or collect personal information.',result:()=>({tickets:facts.tickets,telephone:facts.telephone,website:'https://kanagee.com/'})},
  ];
  router.get('/.well-known/mcp/server-card.json',(_req,res)=>res.set({'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'public, max-age=3600'}).json({
    '$schema':'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json',version:'1.0',protocolVersion:'2025-11-25',serverInfo,
    description:'Public read-only KANAGEE festival information. No bookings, signups or admin access.',documentationUrl:'https://kanagee.com/llms.txt',
    transport:{type:'streamable-http',endpoint:'https://kanagee.com/mcp'},capabilities:{tools:{}},authentication:{required:false},
    tools:tools.map(({name,description})=>({name,description,inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false}})),
  }));
  router.use('/mcp',rateLimit({windowMs:60_000,limit:60,standardHeaders:'draft-7',legacyHeaders:false}),(_req,res,next)=>{res.set('Cache-Control','no-store');next()});
  router.post('/mcp',json({limit:'16kb'}),async(req,res)=>{
    if(req.get('origin')&&req.get('origin')!==origin)return res.status(403).json({error:'Origin not allowed'});
    const server=new McpServer(serverInfo);
    for(const tool of tools)server.registerTool(tool.name,{description:tool.description,inputSchema:z.object({}).strict(),annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false}},async()=>({content:[{type:'text',text:JSON.stringify(tool.result())}]}));
    const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
    res.on('close',()=>{void transport.close();void server.close()});
    try{await server.connect(transport);await transport.handleRequest(req,res,req.body)}catch{
      if(!res.headersSent)res.status(500).json({jsonrpc:'2.0',id:null,error:{code:-32603,message:'Unable to read festival information.'}});
    }
  });
  router.all('/mcp',(_req,res)=>res.set('Allow','POST').status(405).json({error:'Use MCP Streamable HTTP POST; no SSE stream or persistent sessions.'}));
  for(const page of facts.pages){
    const path=new URL(page.url).pathname;
    const directory=path==='/'?'':path.slice(1);
    const markdown=readFileSync(join(staticDirectory,directory,'index.md'),'utf8');
    const link='</llms.txt>; rel="describedby"; type="text/plain", <'+path+'index.md>; rel="alternate"; type="text/markdown", </.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"';
    router.get([path,path+'index.html'],(req,res,next)=>{
      res.vary('Accept');res.set('Link',link);
      if(req.accepts(['html','text/markdown'])==='text/markdown')return res.set('Cache-Control','no-cache').type('text/markdown').send(markdown);
      next();
    });
    router.get(path+'index.md',(_req,res)=>res.set({'Cache-Control':'no-cache','Link':link}).type('text/markdown').send(markdown));
  }
  router.use(['/admin','/admin/'],(_req,res,next)=>{res.set('X-Robots-Tag','noindex, nofollow');next()});
  return router;
}
