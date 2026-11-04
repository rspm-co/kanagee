import React,{useEffect,useRef,useState} from 'react';
import {ArrowUpRight,CalendarDays,MapPin,Utensils,Users,Heart,Check,Pause,Play} from 'lucide-react';
import gsap from 'gsap';
import {event} from '../config/event';
import TicketInterest from './TicketInterest';
import SponsorStrip from './SponsorStrip';
import {mapsUrl} from '../config/site.js';


function EventMarquee({paused}){
 const [stopped,setStopped]=useState(false);
 return <div className="event-marquee" role="region" aria-label="Festival dates and venue" data-paused={paused||stopped}>
  <p className="sr-only">{event.dates}, {event.dailyHours} daily. {event.venue}, {event.city}.</p>
  <div className="event-marquee-window" aria-hidden="true"><div className="event-marquee-track">{[0,1].map(copy=><div className="event-marquee-group" key={copy}><CalendarDays size={18}/><strong>{event.dates}</strong><span className="event-marquee-star">✳</span><span>{event.dailyHours} DAILY</span><span className="event-marquee-star">✳</span><MapPin size={18}/><strong>{event.venue}, {event.city}</strong><span className="event-marquee-star">✳</span><span>36 DISTRICTS · 36 TASTES</span><span className="event-marquee-star">✳</span></div>)}</div></div>
  <button type="button" className="event-marquee-pause" onClick={()=>setStopped(value=>!value)} disabled={paused} aria-pressed={stopped} aria-label={paused?'Website animations are paused':stopped?'Resume event marquee':'Pause event marquee'}>{paused||stopped?<Play size={15}/>:<Pause size={15}/>}</button>
 </div>;
}

function TicketAction({compact=false,autoOpen=false}){
 return event.bookingUrl?<a href={event.bookingUrl} className={'button ticket-spark '+(compact?'nav-ticket':'landing-book-button')}>Book tickets<ArrowUpRight size={17}/></a>:<TicketInterest label={compact?'TICKET INFO':'Get ticket updates'} variant={compact?'nav':'default'} autoOpen={autoOpen}/>;
}
export default function LandingPage({paused=false,footer}){
 const root=useRef(null);
 useEffect(()=>{
  document.title='KANAGEE — Festival Tickets · 3–6 December, Pune';
  const media=gsap.matchMedia();
  const context=gsap.context(()=>{
   if(paused)return;
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.from('.landing-copy > *',{y:22,opacity:0,stagger:.08,duration:.8,ease:'power3.out',clearProps:'all'});
    gsap.from('.landing-plate',{scale:.9,rotation:-6,opacity:0,duration:1.15,ease:'power3.out',clearProps:'all'});
    gsap.from('.landing-highlights > div',{y:18,opacity:0,stagger:.12,duration:.7,scrollTrigger:{trigger:'.landing-highlights',start:'top 94%',once:true},clearProps:'all'});
    gsap.from('.landing-ticket-panel',{y:24,opacity:0,duration:.8,scrollTrigger:{trigger:'.landing-ticket-panel',start:'top 94%',once:true},clearProps:'all'});
   });
  },root);
  return()=>{media.revert();context.revert()};
 },[paused]);
 return <div className="landing-page" ref={root}>
  <a className="skip" href="#main">Skip to content</a>
  <header className="landing-header"><a className="official-brand landing-brand" href="/" aria-label="KANAGEE home"><img src="/kanagee-logo-transparent-256w.webp" srcSet="/kanagee-logo-transparent-128w.webp 128w, /kanagee-logo-transparent-256w.webp 256w" sizes="80px" width="1205" height="1306" alt="कणगी — KANAGEE"/><span>KANAGEE<small lang="mr">अस्सल महाराष्ट्राचा खाद्य महोत्सव</small></span></a><div className="landing-nav"><a href="/festival/">The festival</a><a href="/about/">About us</a><div className="header-actions"><TicketAction compact/><a className="nav-ticket ticket-spark register-button" href="/register/"><span>Register Here</span><ArrowUpRight size={17} aria-hidden="true"/></a></div></div></header>
  <main id="main">
   <SponsorStrip/>
   <EventMarquee paused={paused}/>
   <section className="landing-hero" id="home" aria-labelledby="landing-title">
    <div className="landing-copy"><span className="landing-date-pill"><CalendarDays size={17} aria-hidden="true"/><strong>{event.dates}</strong> · {event.city}</span><p className="eyebrow">MAHARASHTRA’S FOOD, TOGETHER.</p><h1 id="landing-title"><span className="sr-only">KANAGEE — </span>Maharashtra’s Biggest<br/><em>Food Festival</em></h1><p className="landing-marathi" lang="mr">३६ जिल्हे. ३६ चवी. एक महाराष्ट्र.</p><p className="landing-description">Four days of regional flavours, shared stories and the joy of eating together. Come hungry to KANAGEE.</p><div className="landing-primary-action"><TicketAction autoOpen/><a className="landing-explore-button ticket-spark" href="/festival/" aria-label="Explore the full KANAGEE festival website"><span>Explore the Festival</span><ArrowUpRight size={18} aria-hidden="true"/></a></div><p className="landing-booking-note">{event.bookingUrl?'Choose your tickets through our booking partner.':'Book tickets through the Ladachi Kulfi mobile app.'}</p><a className="landing-venue landing-venue-highlight" href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={21} aria-hidden="true"/><span><small>MEET US HERE</small><strong>{event.venue}, {event.city}</strong><small>{event.dailyHours} daily · Open in Google Maps</small></span><ArrowUpRight size={17} aria-hidden="true"/></a></div>
    <div className="landing-visual"><div className="landing-photo-halo" aria-hidden="true"/><figure className="landing-plate"><img src="/heritage-thali-cutout.webp" srcSet="/heritage-thali-cutout-480w.webp 480w, /heritage-thali-cutout-800w.webp 800w, /heritage-thali-cutout.webp 1254w" sizes="(max-width: 386px) 88vw, (max-width: 760px) 340px, (max-width: 1300px) 43vw, 558px" width="1254" height="1254" alt="A steel thali filled with rice, roti, regional dishes and sweets" fetchPriority="high" decoding="async"/></figure><div className="landing-photo-note"><span lang="mr">अस्सल चवींचा उत्सव</span><small>MADE FOR YOUR APPETITE.</small></div><span className="landing-photo-star" aria-hidden="true">✳</span></div>
   </section>
   <section className="landing-highlights" aria-label="A taste of the festival"><div><Utensils size={21}/><span><strong>36 districts. One table.</strong><small>A journey through Maharashtra’s flavours.</small></span></div><div><Users size={21}/><span><strong>Food with a human story.</strong><small>Celebrate the people behind every plate.</small></span></div><div><Heart size={21}/><span><strong>Bring your favourite people.</strong><small>Make a day of food and togetherness.</small></span></div></section>
   <section className="landing-booking" id="tickets" aria-labelledby="landing-ticket-title"><div className="landing-booking-copy"><span className="eyebrow">YOUR NEXT DELICIOUS PLAN</span><h2 id="landing-ticket-title">A date for<br/><em>your appetite.</em></h2><div className="landing-event-line"><CalendarDays size={19}/><div><strong>{event.dates}</strong><p>Four days to explore and savour.</p></div></div><div className="landing-event-line"><MapPin size={19}/><div><strong>{event.venue}</strong><p>{event.city}, Maharashtra</p></div></div><a href="/festival/#gallery" className="landing-quiet-link">See what’s on the table<ArrowUpRight size={15}/></a></div><div className="landing-ticket-panel"><span className="landing-ticket-status">{event.bookingUrl?'LET’S GET YOU THERE':'BOOK THROUGH LADACHI KULFI'}</span><h3>{event.bookingUrl?'Your seat at the celebration.':'Your ticket to KANAGEE.'}</h3><p>{event.bookingUrl?'Your Maharashtra food journey starts here.':'Book tickets through the Ladachi Kulfi mobile app, or leave your number for ticket updates.'}</p>{event.ticketPrice!=null&&<p className="landing-ticket-price">₹{event.ticketPrice}</p>}<TicketAction/><span className="landing-ticket-reassurance"><Check size={14}/>{event.bookingUrl?'Continue to our official booking partner.':'A simple signup. No payment required.'}</span><small>Open daily {event.dailyHours}.{event.ticketPrice==null?' Check the app for ticket prices.':''}</small></div></section>
  </main>
  {footer}
  <div className="landing-mobile-ticket"><div><strong>{event.name} · {event.city}</strong><span>{event.dates}</span></div><div className="header-actions"><TicketAction compact/><a className="nav-ticket ticket-spark register-button" href="/register/"><span>Register Here</span><ArrowUpRight size={17} aria-hidden="true"/></a></div></div>
 </div>
}
