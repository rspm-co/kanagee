import React,{useEffect} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {publicPages} from '../config/site.js';
import {OrganisedBy,OurIntent} from './Organisers';
import {SiteHeader,SiteFooter} from './SiteChrome';
export default function AboutPage(){
  useEffect(()=>{document.title=publicPages.find(page=>page.path==='/about/').title;return()=>{document.title='KANAGEE — A Taste of Maharashtra'}},[]);
  return <><a className="skip" href="#main">Skip to content</a><SiteHeader about/><main id="main" className="about-page">
    <section className="about-intro section" aria-labelledby="about-title">
      <a href="/" className="text-link">← Back to KANAGEE home</a>
      <span className="eyebrow">ABOUT KANAGEE · कणगीविषयी</span>
      <h1 id="about-title">A celebration with purpose,<br/><em>people at its heart</em></h1>
      <p className="about-business-description">KANAGEE is a food and catering brand that also organises food festivals and events. Rooted in Maharashtra’s culinary heritage, we bring people together through regional flavours, traditional recipes, and shared food experiences.</p>
      <p lang="mr">आपली माती, आपली चव, आपली माणसं.<br/>कणगीमागची माणसं आणि हा उत्सव घडवण्यामागचा विचार.</p>
    </section>
    <OrganisedBy/><OurIntent/>
    <section className="about-invitation section"><div><span className="eyebrow">36 DISTRICTS, ONE MAHARASHTRA</span><h2 lang="mr" className="marathi-title">या, हा उत्सव आपला करूया</h2></div><a href="/festival/#experiences" className="button">Explore the festival<ArrowUpRight size={17}/></a></section>
  </main><SiteFooter/></>;
}
