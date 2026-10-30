import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {createApp} from './app.js';
const origin='https://kanagee.test';
const admin={username:'admin',password:'test-password-long-enough',secret:'test-session-secret-at-least-32-characters'};
async function runServer(config,run){const app=createApp({origin,staticDirectory:process.cwd()+'/dist/client',...config});const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));try{await run('http://127.0.0.1:'+server.address().port)}finally{await new Promise(resolve=>server.close(resolve))}}
const login=(base,body={username:admin.username,password:admin.password},requestOrigin=origin)=>fetch(base+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:requestOrigin},body:JSON.stringify(body)});
test('admin contacts are private and disabled until configured',async()=>{
 await runServer({pool:{execute:()=>assert.fail('No unauthenticated database access')}},async base=>{assert.equal((await fetch(base+'/api/admin/interests')).status,503)});
 await runServer({admin,pool:{execute:()=>assert.fail('No unauthenticated database access')}},async base=>{assert.equal((await fetch(base+'/api/admin/interests')).status,401);assert.equal((await fetch(base+'/api/admin/interests',{headers:{Cookie:'__Host-kanagee_admin=forged.token'}})).status,401)});
});
test('login, contact search, pagination and logout require authentication',async()=>{
 const calls=[];const pool={execute:async(sql,values)=>{calls.push({sql,values});return sql.includes('COUNT(*)')?[[{total:27}]]:[[{id:1,mobile:'+919876543210',notification_status:'pending'}]]}};
 await runServer({admin,pool},async base=>{
  assert.equal((await login(base,{username:'admin',password:'incorrect'})).status,401);
  assert.equal((await login(base,undefined,'https://other.test')).status,403);
  const response=await login(base);assert.equal(response.status,200);const cookie=response.headers.get('set-cookie');assert.match(cookie,/HttpOnly/);assert.match(cookie,/Secure/);assert.match(cookie,/SameSite=Strict/);const headers={Cookie:cookie.split(';')[0]};
  assert.equal((await fetch(base+'/api/admin/session',{headers})).status,200);
  const contacts=await fetch(base+'/api/admin/interests?page=2&search=9876',{headers});assert.equal(contacts.status,200);const data=await contacts.json();assert.equal(data.total,27);assert.equal(data.rows[0].mobile,'+919876543210');assert.equal(data.pageSize,25);assert.deepEqual(calls[0].values,['%9876%']);assert.match(calls[1].sql,/OFFSET 25$/);assert.match(contacts.headers.get('cache-control'),/no-store/);
  const logout=await fetch(base+'/api/admin/logout',{method:'POST',headers:{...headers,Origin:origin}});assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
 });
});
test('expired cookies and brute force login attempts are rejected',async()=>{
 await runServer({admin},async base=>{
  const payload=Buffer.from(JSON.stringify({exp:Date.now()-1000})).toString('base64url');const signed=payload+'.'+createHmac('sha256',admin.secret).update(payload).digest('base64url');
  assert.equal((await fetch(base+'/api/admin/interests',{headers:{Cookie:'__Host-kanagee_admin='+signed}})).status,401);
  for(let i=0;i<5;i++)assert.equal((await login(base,{username:'admin',password:'bad'})).status,401);
  assert.equal((await login(base)).status,429);
 });
});
test('admin page opens directly and includes the compiled dashboard',async()=>{
 await runServer({admin},async base=>{
  const r=await fetch(base+'/admin/');assert.equal(r.status,200);const html=await r.text();const asset=html.match(/src="([^"]+\.js)"/)[1];
  const js=await (await fetch(base+asset)).text();assert.match(js,/Interested visitors/);assert.match(js,/\/api\/admin/);
 });
});
