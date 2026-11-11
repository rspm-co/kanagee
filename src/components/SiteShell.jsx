import React,{useState} from 'react';
import {Play,Pause} from 'lucide-react';
import useSiteMotion from '../useSiteMotion';
export default function SiteShell({path,children}){
 const [paused,setPaused]=useState(()=>{try{return localStorage.getItem('kanagee-motion-paused')==='true'}catch{return false}});
 const scope=useSiteMotion(path,paused);
 function toggleMotion(){setPaused(value=>{const next=!value;try{localStorage.setItem('kanagee-motion-paused',String(next))}catch{}return next})}
 return <div ref={scope} className="site-shell" data-motion={paused?'paused':'playing'}>{path!=='/admin'&&<><div className="site-scroll-progress" aria-hidden="true"/><button className="site-motion-toggle" onClick={toggleMotion} aria-pressed={paused} aria-label={paused?'Resume website animations':'Pause website animations'} title={paused?'Resume motion':'Pause motion'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button></>}{children(paused)}</div>;
}
