import React from 'react';
import SiteShell from './components/SiteShell';
import {SiteHeader,SiteFooter} from './components/SiteChrome';
import HomePage from './components/FestivalPage';
import AboutPage from './components/AboutPage';
import LandingPage from './components/LandingPage';
import Admin from './components/Admin';
import StallRegistration from './components/StallRegistration';
import InformationPage from './components/InformationPage';
import {informationPages} from './config/site.js';
export default function App({routePath}={}){
 const path=(routePath??window.location.pathname).replace(/\/$/,'');
 return <SiteShell path={path}>{paused=>path==='/admin'?<Admin/>:path==='/register'?<StallRegistration header={<SiteHeader/>} footer={<SiteFooter/>}/>:informationPages[path]?<InformationPage path={path} header={<SiteHeader/>} footer={<SiteFooter/>}/>:path==='/about'?<AboutPage/>:path==='/festival'?<HomePage paused={paused}/>:<LandingPage paused={paused} footer={<SiteFooter/>}/>}</SiteShell>;
}
