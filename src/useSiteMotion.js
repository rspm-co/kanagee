import {useEffect,useRef} from 'react';
export default function useSiteMotion(path,paused){
 const scope=useRef(null);
 useEffect(()=>{
  if(path==='/admin'||paused||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let disposed=false,started=false,cleanup;
  const events=['scroll','pointerdown','keydown'];
  const start=()=>{
   if(started)return;started=true;
   events.forEach(type=>window.removeEventListener(type,start));
   clearTimeout(timer);
   import('./siteMotion.js').then(({setupSiteMotion})=>{if(!disposed&&scope.current)cleanup=setupSiteMotion(scope.current,path)}).catch(()=>{});
  };
  const timer=setTimeout(start,4000);
  events.forEach(type=>window.addEventListener(type,start,{once:true,passive:true}));
  return()=>{disposed=true;clearTimeout(timer);events.forEach(type=>window.removeEventListener(type,start));cleanup?.()};
 },[path,paused]);
 return scope;
}
