import test from 'node:test';
import assert from 'node:assert/strict';
import {createTicketPopupPolicy} from './ticketPopup.js';

test('popup automatically opens only on the home and festival pages',()=>{
  const policy=createTicketPopupPolicy(()=>({getItem:()=>null}));
  for(const path of ['/','/festival','/festival/'])assert.equal(policy.canAutoOpen(path),true);
  for(const path of ['/about/','/contact/','/terms/','/privacy/','/register/','/admin/'])assert.equal(policy.canAutoOpen(path),false);
});
test('popup stays dismissed across refreshes and navigation in the same session',()=>{
  const values=new Map();const storage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
  const policy=createTicketPopupPolicy(()=>storage);assert.equal(policy.canAutoOpen('/'),true);policy.markShown();assert.equal(policy.canAutoOpen('/'),false);
  const refreshed=createTicketPopupPolicy(()=>storage);assert.equal(refreshed.canAutoOpen('/'),false);assert.equal(refreshed.canAutoOpen('/festival/'),false);
  const newSession=createTicketPopupPolicy(()=>({getItem:()=>null}));assert.equal(newSession.canAutoOpen('/'),true);
});
test('unavailable browser storage never crashes the popup',()=>{
  const policy=createTicketPopupPolicy(()=>{throw Error('Storage disabled')});assert.equal(policy.canAutoOpen('/'),true);policy.markShown();assert.equal(policy.canAutoOpen('/'),false);assert.equal(policy.canAutoOpen('/register/'),false);
});
