import test from 'node:test';
import assert from 'node:assert/strict';
import {saveTicketInterest} from './ticketInterest.js';

const record={mobile:'+919876543210',consent:true,purpose:'ticket-launch'};
test('signup posts to the server and requires confirmation',async()=>{
  await saveTicketInterest('/api/ticket-interest.php',record,async(url,options)=>{
    assert.equal(url,'/api/ticket-interest.php');
    assert.equal(options.method,'POST');
    assert.deepEqual(JSON.parse(options.body),record);
    assert.ok(options.signal instanceof AbortSignal);
    return {ok:true,json:async()=>({ok:true})};
  });
});
test('signup rejects server errors, false confirmations, HTML fallbacks, and network failure',async()=>{
  for(const request of [
    async()=>({ok:false}),
    async()=>({ok:true,json:async()=>({ok:false})}),
    async()=>({ok:true,json:async()=>null}),
    async()=>({ok:true,json:async()=>{throw new SyntaxError('HTML instead of JSON')}}),
    async()=>{throw new TypeError('Network error')},
  ]) await assert.rejects(saveTicketInterest('/api/ticket-interest.php',record,request));
});
