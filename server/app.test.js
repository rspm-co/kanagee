import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './app.js';

async function withServer(pool,run){
  const app=createApp({pool,origin:'https://kanagee.test',staticDirectory:process.cwd()+'/dist'});
  const server=app.listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  try{await run('http://127.0.0.1:'+server.address().port)}finally{await new Promise(resolve=>server.close(resolve))}
}
const valid={mobile:'+919876543210',consent:true,purpose:'ticket-launch'};
const post=(base,body,origin='https://kanagee.test',path='/api/ticket-interest')=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
test('registration persists normalized contact using parameterized SQL',async()=>{
  let count=0;
  await withServer({execute:async(sql,values)=>{assert.match(sql,/ON DUPLICATE KEY UPDATE/);assert.deepEqual(values,[valid.mobile]);count++}},async base=>{
    const response=await post(base,valid);assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true});
    assert.equal((await post(base,valid,undefined,'/api/ticket-interest.php')).status,200);
  });assert.equal(count,2);
});
test('invalid input and foreign origins never reach the database',async()=>{
  await withServer({execute:async()=>assert.fail('must not write')},async base=>{
    assert.equal((await post(base,{...valid,mobile:'123'})).status,422);
    assert.equal((await post(base,{...valid,consent:false})).status,422);
    assert.equal((await post(base,valid,'https://other.test')).status,403);
    const response=await fetch(base+'/api/ticket-interest',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});assert.equal(response.status,400);
  });
});
test('missing database and failed writes cannot confirm registration',async()=>{
  for(const pool of [null,{execute:async()=>{throw new Error('database unavailable')}}])await withServer(pool,async base=>{
    const response=await post(base,valid);assert.equal(response.status,503);assert.equal((await response.json()).ok,false);
  });
});
test('built frontend is served and unknown API routes return JSON errors',async()=>{
  await withServer(null,async base=>{
    const page=await fetch(base+'/');assert.equal(page.status,200);assert.match(await page.text(),/<div id="root"><\/div>/);
    const response=await fetch(base+'/api/unknown');assert.equal(response.status,404);assert.deepEqual(await response.json(),{ok:false});
  });
});
