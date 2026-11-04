const sessionKey='kanagee-ticket-popup-shown-v2';

export function createTicketPopupPolicy(getStorage=()=>globalThis.sessionStorage){
  let shown=false;
  return {
    canAutoOpen(pathname){
      const path=pathname.replace(/\/$/,'')||'/';
      if(!['/','/festival'].includes(path)||shown)return false;
      try{return getStorage()?.getItem(sessionKey)!=='true'}catch{return true}
    },
    markShown(){shown=true;try{getStorage()?.setItem(sessionKey,'true')}catch{}},
  };
}
