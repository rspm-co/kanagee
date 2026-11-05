// This applies only to the unlisted office countdown, never the public site.
export function setupKeepAwake({document,navigator,button,status}){
  let wanted=true,lock=null,pending=false;
  const supported=typeof navigator.wakeLock?.request==='function';
  function show(message){
    const active=!!lock&&!lock.released;
    button.setAttribute('aria-pressed',String(active));
    button.textContent=active?'Allow screen to sleep':'Keep screen awake';
    button.disabled=!supported||pending;
    status.textContent=message;
  }
  async function acquire(){
    if(!supported||!wanted||pending||document.visibilityState!=='visible'||(lock&&!lock.released))return;
    pending=true;show('Enabling screen-awake mode…');
    try{
      const next=await navigator.wakeLock.request('screen');
      if(!wanted||document.visibilityState!=='visible'){
        await next.release();
        return;
      }
      lock=next;
      next.addEventListener('release',()=>{
        if(lock!==next)return;
        lock=null;
        show(wanted?'Screen-awake mode was released. Select Keep screen awake to retry.':'Screen may sleep normally.');
      });
    }catch{
      show('The browser could not keep the screen awake. Select the button to retry.');
    }finally{
      pending=false;
      if(lock&&!lock.released)show('Screen-awake mode is active. Keep this page open on screen.');
      else button.disabled=!supported;
    }
  }
  button.addEventListener('click',async()=>{
    if(lock&&!lock.released){
      wanted=false;
      const current=lock;
      try{await current.release()}catch{wanted=true;show('Could not release screen-awake mode. Please try again.')}
    }else{wanted=true;await acquire()}
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible')void acquire();
  });
  if(!supported){
    show('This TV browser does not support screen-awake mode. Use a compatible browser or an external display player.');
  }else void acquire();
}
