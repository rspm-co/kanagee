import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import {createApp} from './app.js';
const admin={username:'admin',password:'test-password-long-enough',secret:'test-session-secret-at-least-32-characters'};
const origin='https://kanagee.test';
async function run(pool,action){const app=createApp({pool,origin,admin,staticDirectory:process.cwd()+'/dist/client'});const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));try{await action('http://127.0.0.1:'+server.address().port)}finally{await new Promise(resolve=>server.close(resolve))}}
async function cookie(base){const response=await fetch(base+'/api/admin/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({username:admin.username,password:admin.password})});assert.equal(response.status,200);return response.headers.get('set-cookie').split(';')[0]}
const contact=id=>({id,mobile:'+919876543210',created_at:new Date('2026-11-01T00:00:00Z'),consent_at:new Date('2026-11-01T00:00:00Z'),notification_status:'pending',notified_at:null});

test('Excel export requires an admin session before accessing contacts',async()=>{await run({execute:()=>assert.fail('must not query')},async base=>{assert.equal((await fetch(base+'/api/admin/interests/export')).status,401)})});
test('Excel exports all pages, applies search, preserves phone text and IST dates',async()=>{
 const calls=[];const pool={execute:async(sql,values)=>{calls.push({sql,values});return calls.length===1?[Array.from({length:500},(_,i)=>contact(501-i))]:[[{...contact(1),mobile:'=1+1'}]]}};
 await run(pool,async base=>{
  const response=await fetch(base+'/api/admin/interests/export?search=9876&page=2',{headers:{Cookie:await cookie(base)}});assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/spreadsheetml/);assert.match(response.headers.get('content-disposition'),/attachment; filename="kanagee.*\.xlsx"/);assert.match(response.headers.get('cache-control'),/no-store/);
  const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(Buffer.from(await response.arrayBuffer()));const sheet=workbook.getWorksheet('Interested visitors');
  assert.equal(sheet.getCell('A6').value,1);assert.equal(sheet.getCell('A506').value,501);assert.equal(sheet.getCell('B6').value,'+919876543210');assert.equal(sheet.getCell('B6').type,ExcelJS.ValueType.String);assert.equal(sheet.getCell('B506').value,'=1+1');assert.equal(sheet.getCell('B506').type,ExcelJS.ValueType.String);
  assert.equal(sheet.getCell('C6').value.toISOString(),'2026-11-01T05:30:00.000Z');assert.equal(sheet.getCell('F6').value,null);assert.equal(sheet.getCell('A5').value,'No.');assert.equal(sheet.getCell('B508').value,501);assert.match(sheet.getCell('A3').value,/9876/);assert.equal(sheet.views[0].ySplit,5);assert.ok(sheet.autoFilter);
 });
 assert.equal(calls.length,2);assert.deepEqual(calls[0].values,['%9876%']);assert.equal(calls[1].values[3],2);assert.match(calls[1].sql,/created_at < \?/);assert.doesNotMatch(calls[0].sql,/LIMIT 25/);
});
test('empty Excel report is readable and database errors do not download a false report',async()=>{
 await run({execute:async()=>[[]]},async base=>{const r=await fetch(base+'/api/admin/interests/export',{headers:{Cookie:await cookie(base)}});const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(Buffer.from(await r.arrayBuffer()));assert.equal(workbook.worksheets[0].getCell('B7').value,0)});
 await run({execute:async()=>{throw new Error('unavailable')}},async base=>{const r=await fetch(base+'/api/admin/interests/export',{headers:{Cookie:await cookie(base)}});assert.equal(r.status,503);assert.equal((await r.json()).ok,false);assert.equal(r.headers.get('content-disposition'),null)});
});
