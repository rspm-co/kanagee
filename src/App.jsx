import React from 'react';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowDown,Menu,X,MapPin,Plus} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {event,eventState} from './config/event';
import MaharashtraMap from './components/MaharashtraMap';
import {experiences} from './data/experiences';
import {foodStories} from './data/foodStories';
import {womenStories} from './data/womenStories';
import {sponsors} from './data/sponsors';
import TicketInterest from './components/TicketInterest';
import {OurIntent,OrganisedBy} from './components/Organisers';
import {campaign} from './config/campaign';
gsap.registerPlugin(ScrollTrigger);
const links=[['Explore','districts'],['Our story','heritage'],['Women & food','women'],['Experiences','experiences'],['Visit','location']];
function Button({children,href='#tickets',light=false}){return <a className={'button '+(light?'light':'')} href={href}>{children}<ArrowUpRight size={17}/></a>}
function Countdown(){const [state,setState]=useState(()=>eventState());useEffect(()=>{const id=setInterval(()=>setState(eventState()),1000);return()=>clearInterval(id)},[]);const seconds=Math.floor(state.remaining/1000);return <section className="countdown" aria-label="Festival countdown"><div><span className="eyebrow">SAVE THE DATES · {event.timezone}</span><h2>{state.status==='live'?'The celebration is here.':state.status==='ended'?'Until we meet again.':'See you in December.'}</h2><p>{state.status==='live'?'Festival dates are underway. Check confirmed opening times before visiting.':state.status==='ended'?'The 2026 festival dates have concluded. Thank you for sharing the journey.':'3–6 December 2026 · Pune'}</p></div>{state.status==='upcoming'&&<div className="digits">{[[Math.floor(seconds/86400),'DAYS'],[Math.floor(seconds/3600)%24,'HOURS'],[Math.floor(seconds/60)%60,'MINUTES'],[seconds%60,'SECONDS']].map(([v,l])=><div key={l}><b>{String(v).padStart(2,'0')}</b><span>{l}</span></div>)}</div>}</section>}
function HomePage(){const root=useRef();const [active,setActive]=useState('home');useEffect(()=>{
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:'-15% 0px -65% 0px'});
[['Home','home'],...links].forEach(([,id])=>{const el=document.getElementById(id);if(el)observer.observe(el)});
const mm=gsap.matchMedia();
const ctx=gsap.context(()=>{
mm.add('(prefers-reduced-motion: no-preference)',()=>{
const entrance=gsap.timeline({defaults:{ease:'power3.out'}});
entrance.from('.debut-label, .hero-name',{y:16,opacity:0,stagger:.12,duration:.6})
.from('.headline-line',{yPercent:115,rotation:3,stagger:.13,duration:.95,clearProps:'transform'},.15)
.from('.hero-copy > p, .hero-actions',{y:22,opacity:0,stagger:.1,duration:.7,clearProps:'all'},.65)
.from('.headline-star',{scale:0,rotation:-65,duration:.8,clearProps:'all'},.7);
gsap.from('.hero-plate',{y:24,opacity:0,duration:.8,ease:'power3.out',clearProps:'all'});
gsap.utils.toArray('.reveal, .story, .experience-grid details').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.75,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'all'}));
gsap.utils.toArray('.state-border').forEach(path=>{const length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.geographic-map',start:'top 85%',end:'center 50%',scrub:1}})});
gsap.from('.state-land, .state-grain',{opacity:0,duration:1,scrollTrigger:{trigger:'.geographic-map',start:'top 80%',once:true},clearProps:'opacity'});
gsap.from('.city-marker',{opacity:0,stagger:.15,duration:.8,scrollTrigger:{trigger:'.geographic-map',start:'top 65%',once:true},clearProps:'opacity'});
});
mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)',()=>{

gsap.from('.woven',{y:45,ease:'none',scrollTrigger:{trigger:'.women',start:'top bottom',end:'bottom top',scrub:1}});
});
},root);
return()=>{observer.disconnect();mm.revert();ctx.revert()};
},[]);return <div ref={root}><a className="skip" href="#main">Skip to content</a><SiteHeader active={active}/><main id="main"><section className="hero campaign-hero" id="home"><div className="hero-top"><span>अस्सल महाराष्ट्राचा खाद्य महोत्सव</span><span>3–6 DECEMBER 2026 <i/> {event.venue}, {event.city}</span></div><div className="hero-copy"><div className="debut-label"><span className="debut-star" aria-hidden="true">✳</span><span lang="mr">{campaign.debutMr}</span><span className="debut-en">A NEW CELEBRATION BEGINS</span></div><span className="hero-name">KANAGEE PRESENTS</span><h1 className="campaign-headline"><span className="headline-mask"><span className="headline-line">{campaign.firstLine}</span></span><span className="headline-mask"><em className="headline-line unique-line">{campaign.featureLine}<span className="headline-star" aria-hidden="true">✳</span></em></span><span className="headline-mask"><span className="headline-line">{campaign.closingLine}</span></span></h1><p className="hero-marathi" lang="mr">{campaign.heritageMr}</p><p>36 districts. 36 tastes. One Maharashtra.<br/>Food, people & traditions. Together in Pune.</p><div className="hero-actions"><TicketInterest/><a href="#districts" className="under-link">Explore the festival <ArrowDown size={15}/></a></div></div><div className="hero-plate hero-food-photo"><img className="supplied-thali" src="/maharashtrian-thali.png" width="541" height="430" alt="Maharashtrian thali with rice on a banana leaf, bhakri and a selection of dishes in steel bowls" fetchPriority="high"/><div className="plate-badge">३६ जिल्हे<br/><b>एक महाराष्ट्र!</b><span>ONE DELICIOUS JOURNEY</span></div></div><div className="hero-bottom"><span>FOOD · PEOPLE · CULTURE · CONNECTION</span><span>SCROLL TO SAVOUR <ArrowDown size={14}/></span></div></section><div className="ticker" aria-hidden="true">चव महाराष्ट्राची <span>✳</span> 36 DISTRICTS <span>✳</span> 36 TASTES <span>✳</span> ONE MAHARASHTRA <span>✳</span> परंपरा महाराष्ट्राची <span>✳</span></div><MaharashtraMap/><section className="heritage section" id="heritage"><div className="section-top"><span className="eyebrow">02 / MORE THAN A MEAL</span><span>चवीमागची गोष्ट</span></div><h2 className="reveal marathi-title" lang="mr">प्रत्येक पदार्थाची एक गोष्ट.<br/><em>प्रत्येक चवीची एक ओळख.</em></h2><p className="section-translation">EVERY DISH HAS A STORY. EVERY TASTE HAS A ROOT.</p><div className="heritage-layout"><figure className="heritage-photo"><img src="/seafood-platter.png" width="1024" height="1536" alt="Seafood platter with fried fish, prawns, vegetables and dipping sauces, served on a banana leaf" loading="lazy" decoding="async"/></figure><div>{foodStories.map(s=><article key={s.number} className="story reveal"><span className="eyebrow">{s.number} / FOOD & MEMORY</span><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></div></section><section id="women" className="women section"><div className="women-art" aria-hidden="true"><div className="woven">परंपरा<br/>चव<br/>स्वाभिमान</div><span>KNOWLEDGE. CRAFT. POSSIBILITY.</span></div><div className="reveal"><span className="eyebrow">03 / THE HEART OF THE KITCHEN</span><h2 className="marathi-title" lang="mr">तिच्या हातची चव.<br/><em>तिच्या स्वप्नांना बळ.</em></h2><p className="section-translation">EMPOWERING WOMEN. CELEBRATING TASTE.</p><h3>36 districts. 36 tastemakers.</h3>{womenStories.map(s=><div key={s.title}><h4>{s.title}</h4><p>{s.text}</p></div>)}<span className="tiny">PARTICIPANT STORIES TO BE ANNOUNCED</span></div></section><section className="experiences section" id="experiences"><div className="section-top"><span className="eyebrow">04 / MAKE A DAY OF IT</span><span className="tiny">FOR EVERY GENERATION</span></div><h2 className="reveal marathi-title" lang="mr">चवीसाठी या.<br/><span>आठवणी घेऊन जा.</span></h2><p className="section-translation">COME FOR THE FOOD. STAY FOR THE FEELING.</p><p className="intro">A celebration imagined around the things that bring us together.</p><div className="experience-grid">{experiences.map(e=><details key={e.icon}><summary><span className="experience-number">{e.icon}</span><span lang="mr">{e.mr}</span><h3>{e.title}</h3><Plus size={22}/></summary><p>{e.text}</p><small>Planned experience · programme details to be confirmed.</small></details>)}</div></section><Countdown/><section id="tickets" className="tickets section"><span className="eyebrow">YOUR SEAT AT THE CELEBRATION</span><h2 className="marathi-title" lang="mr">अस्सल चवींची मेजवानी.<br/><span>भेटूया कणगीत!</span></h2><div className="booking"><div><h3>{event.name}</h3><p>{event.dates} <span> / </span> {event.city}, Maharashtra</p><p className="booking-venue">{event.venue}, {event.city}</p><p className="tiny">DAILY OPENING TIMES TO BE ANNOUNCED</p></div><div>{event.bookingUrl?<Button href={event.bookingUrl}>TICKET INFO</Button>:<><TicketInterest/><p className="tiny">Tickets open soon. Get a heads-up when booking begins.</p></>}</div></div></section>{sponsors.length>0&&<section className="section"><h2>OUR PARTNERS</h2>{[...sponsors].sort((a,b)=>a.order-b.order).map(s=><a key={s.name} href={s.url}><img src={s.logo} alt={s.name}/><span>{s.category}</span></a>)}</section>}<section id="location" className="location section"><span className="eyebrow">MEET US IN PUNE</span><h2>A CITY WITH TASTE.<br/>A STATE WITH HEART.</h2><div><MapPin/><p><b>{event.city}, Maharashtra</b><br/>{event.venue||'Exact venue and directions to be announced.'}</p></div><div className="faq"><h3>Before you visit</h3><details><summary>When is KANAGEE?</summary><p>{event.dates}, at {event.venue}, {event.city}. Daily opening times will be confirmed here.</p></details><details><summary>Where can I book tickets?</summary><p>{event.bookingUrl?'Use the booking link above.':'Booking details and prices have not yet been announced. This website does not take payments.'}</p></details><details><summary>What experiences are confirmed?</summary><p>The experience gallery describes the festival’s planned themes. The detailed programme, participants and facilities will be published once confirmed.</p></details></div></section></main><SiteFooter/></div>}









function SiteHeader({active='',about=false}){const [menu,setMenu]=useState(false);return <header><a className="brand official-brand" href="/#home" aria-label="KANAGEE — Home"><img src="/kanagee-logo-transparent.png" width="1205" height="1306" alt="कणगी — ३६ जिल्हे, ३६ चवी, अस्सल महाराष्ट्राचा खाद्योत्सव"/><span className="brand-name">KANAGEE<small>अस्सल महाराष्ट्राचा खाद्य महोत्सव</small></span></a><nav id="main-navigation" className={menu?'open':''} aria-label="Main navigation">{links.map(([label,id])=><a key={id} href={(about?'/':'')+'#'+id} className={active===id?'active':''} onClick={()=>setMenu(false)}>{label}</a>)}<a href="/about/" className={about?'active':''} aria-current={about?'page':undefined} onClick={()=>setMenu(false)}>About KANAGEE</a></nav><a className="nav-ticket" href="/#tickets">TICKET INFO <ArrowUpRight size={14}/></a><button className="menu-toggle" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} aria-controls="main-navigation" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>}
function SiteFooter(){return <footer><div className="footer-top"><a className="brand official-brand" href="/#home" aria-label="KANAGEE — Home"><img src="/kanagee-logo-transparent.png" width="1205" height="1306" alt="कणगी — KANAGEE" loading="lazy"/></a><p lang="mr">चव महाराष्ट्राची.<br/>परंपरा महाराष्ट्राची.<br/><span>उत्सव आपल्या सगळ्यांचा!</span></p><a href="/#home" className="back-top" aria-label="Back to top"><ArrowUpRight/></a></div><div className="footer-bottom"><span>© 2026 KANAGEE</span><a href="/about/">About KANAGEE · Our organisers</a><span>{event.dates} · {event.venue}, {event.city}</span></div></footer>}

function AboutPage(){
  useEffect(()=>{document.title='About KANAGEE — Our Organisers & Purpose';return()=>{document.title='KANAGEE — A Taste of Maharashtra'}},[]);
  return <><a className="skip" href="#main">Skip to content</a><SiteHeader about/><main id="main" className="about-page">
    <section className="about-intro section" aria-labelledby="about-title">
      <a href="/" className="text-link">← Back to the festival</a>
      <span className="eyebrow">ABOUT KANAGEE · कणगीविषयी</span>
      <h1 id="about-title">A celebration with purpose.<br/><em>People at its heart.</em></h1>
      <p lang="mr">आपली माती. आपली चव. आपली माणसं.<br/>कणगीमागची माणसं आणि आमच्या मनातला विचार.</p>
    </section>
    <OrganisedBy/><OurIntent/>
    <section className="about-invitation section"><div><span className="eyebrow">36 DISTRICTS. ONE MAHARASHTRA.</span><h2 lang="mr" className="marathi-title">या, हा उत्सव आपला करूया.</h2></div><a href="/#experiences" className="button">Explore the festival<ArrowUpRight size={17}/></a></section>
  </main><SiteFooter/></>;
}
export default function App(){return window.location.pathname.replace(/\/$/,'')==='/about'?<AboutPage/>:<HomePage/>}
