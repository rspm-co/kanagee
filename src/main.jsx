import React from 'react';
import {createRoot} from 'react-dom/client';
import SiteShell from './components/SiteShell';
import {SiteHeader,SiteFooter} from './components/SiteChrome';
import './styles/main.css';

async function start(){
 const path=window.location.pathname.replace(/\/$/,'');
 let Page,chrome=false;
 if(path==='/admin')Page=(await import('./components/Admin')).default;
 else if(path==='/register'){Page=(await import('./components/StallRegistration')).default;chrome=true}
 else if(path==='/about')Page=(await import('./components/AboutPage')).default;
 else if(path==='/festival')Page=(await import('./components/FestivalPage')).default;
 else if(['/contact','/terms','/privacy'].includes(path)){Page=(await import('./components/InformationPage')).default;chrome=true}
 else Page=(await import('./components/LandingPage')).default;
 createRoot(document.getElementById('root')).render(<React.StrictMode><SiteShell path={path}>{paused=><Page path={path} paused={paused} {...(chrome?{header:<SiteHeader/>,footer:<SiteFooter/>}:path===''?{footer:<SiteFooter/>}:{})}/>}</SiteShell></React.StrictMode>);
 if(navigator.modelContext?.registerTool)void import('./agentTools.js').then(({registerAgentTools})=>registerAgentTools());
}
void start().catch(()=>{
 // Retain the prerendered content and working links if a chunk cannot download.
 console.error('Interactive features could not load. Please refresh the page.');
});
