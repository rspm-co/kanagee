import test from 'node:test';
import assert from 'node:assert/strict';
import {setupKeepAwake} from '../public/countdown/keep-awake.js';

const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(request){
  const document=new EventTarget();document.visibilityState='visible';
  const button=new EventTarget();button.setAttribute=(key,value)=>{button[key]=value};
  const status={textContent:''};
  const navigator=request?{wakeLock:{request}}:{};
  setupKeepAwake({document,navigator,button,status});
  return {document,button,status};
}
function sentinel(){
  const value=new EventTarget();value.released=false;
  value.release=async()=>{value.released=true;value.dispatchEvent(new Event('release'))};
  return value;
}
test('office display reports unsupported browsers without claiming to be awake',()=>{
  const {button,status}=fixture();
  assert.equal(button.disabled,true);
  assert.equal(button['aria-pressed'],'false');
  assert.match(status.textContent,/does not support/);
});
test('office display acquires wake lock, restores it on return, and respects turning it off',async()=>{
  const locks=[];
  const {document,button,status}=fixture(async type=>{assert.equal(type,'screen');const lock=sentinel();locks.push(lock);return lock});
  await flush();assert.equal(button['aria-pressed'],'true');
  document.visibilityState='hidden';await locks[0].release();
  document.visibilityState='visible';document.dispatchEvent(new Event('visibilitychange'));
  await flush();assert.equal(locks.length,2);assert.match(status.textContent,/is active/);
  button.dispatchEvent(new Event('click'));await flush();
  assert.equal(button['aria-pressed'],'false');assert.equal(locks[1].released,true);
  document.dispatchEvent(new Event('visibilitychange'));await flush();
  assert.equal(locks.length,2);
});
test('a denied wake lock leaves a working retry button',async()=>{
  let calls=0;
  const {button,status}=fixture(async()=>{if(++calls===1)throw new Error('Denied');return sentinel()});
  await flush();assert.equal(button.disabled,false);assert.match(status.textContent,/could not/);
  button.dispatchEvent(new Event('click'));await flush();
  assert.equal(button['aria-pressed'],'true');assert.equal(calls,2);
});
test('a lock resolving after the page is hidden is released and never reported active',async()=>{
  let resolve;
  const next=sentinel();
  const {document,button}=fixture(()=>new Promise(done=>{resolve=done}));
  document.visibilityState='hidden';resolve(next);await flush();
  assert.equal(next.released,true);assert.equal(button['aria-pressed'],'false');
});
