import React,{useEffect,useRef} from 'react';
import {ArrowUpRight,CalendarDays,MapPin,Utensils,Users,Heart,Check} from 'lucide-react';
import gsap from 'gsap';
import {event} from '../config/event';
import TicketInterest from './TicketInterest';

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
  <header className="landing-header"><a className="official-brand landing-brand" href="/" aria-label="KANAGEE home"><img src="/kanagee-logo-transparent.png" width="1205" height="1306" alt="कणगी — KANAGEE"/><span>KANAGEE<small lang="mr">अस्सल महाराष्ट्राचा खाद्य महोत्सव</small></span></a><div className="landing-nav"><a href="/festival/">The festival</a><a href="/about/">About us</a><TicketAction compact/></div></header>
  <main id="main">
   <section className="landing-hero" id="home" aria-labelledby="landing-title">
    <div className="landing-copy"><span className="landing-date-pill"><span aria-hidden="true"/>{event.dates} · {event.city}</span><p className="eyebrow">MAHARASHTRA’S FOOD, TOGETHER.</p><h1 id="landing-title">A whole state.<br/><em>On your plate.</em></h1><p className="landing-marathi" lang="mr">३६ जिल्हे. ३६ चवी. एक महाराष्ट्र.</p><p className="landing-description">Four days of regional flavours, shared stories and the joy of eating together. Come hungry to KANAGEE.</p><div className="landing-primary-action"><TicketAction autoOpen/><a className="landing-quiet-link" href="/festival/">Take a little look<ArrowUpRight size={15}/></a></div><p className="landing-booking-note">{event.bookingUrl?'Choose your tickets through our booking partner.':'Bookings open soon. Leave your number for a heads-up.'}</p><div className="landing-venue"><MapPin size={16}/><span>{event.venue}, {event.city}</span></div></div>
    <div className="landing-visual"><div className="landing-photo-halo" aria-hidden="true"/><figure className="landing-plate"><img src="/heritage-thali-cutout.png" width="1254" height="1254" alt="A steel thali filled with rice, roti, regional dishes and sweets" fetchPriority="high" decoding="async"/></figure><div className="landing-photo-note"><span lang="mr">अस्सल चवींचा उत्सव</span><small>MADE FOR YOUR APPETITE.</small></div><span className="landing-photo-star" aria-hidden="true">✳</span></div>
   </section>
   <section className="landing-highlights" aria-label="A taste of the festival"><div><Utensils size={21}/><span><strong>36 districts. One table.</strong><small>A journey through Maharashtra’s flavours.</small></span></div><div><Users size={21}/><span><strong>Food with a human story.</strong><small>Celebrate the people behind every plate.</small></span></div><div><Heart size={21}/><span><strong>Bring your favourite people.</strong><small>Make a day of food and togetherness.</small></span></div></section>
   <section className="landing-booking" id="tickets" aria-labelledby="landing-ticket-title"><div className="landing-booking-copy"><span className="eyebrow">YOUR NEXT DELICIOUS PLAN</span><h2 id="landing-ticket-title">A date for<br/><em>your appetite.</em></h2><div className="landing-event-line"><CalendarDays size={19}/><div><strong>{event.dates}</strong><p>Four days to explore and savour.</p></div></div><div className="landing-event-line"><MapPin size={19}/><div><strong>{event.venue}</strong><p>{event.city}, Maharashtra</p></div></div><a href="/festival/#gallery" className="landing-quiet-link">See what’s on the table<ArrowUpRight size={15}/></a></div><div className="landing-ticket-panel"><span className="landing-ticket-status">{event.bookingUrl?'LET’S GET YOU THERE':'BOOKING OPENS SOON'}</span><h3>{event.bookingUrl?'Your seat at the celebration.':'Be first to book.'}</h3><p>{event.bookingUrl?'Your Maharashtra food journey starts here.':'Leave your mobile number and get a ticket-opening update from KANAGEE.'}</p>{event.ticketPrice!=null&&<p className="landing-ticket-price">₹{event.ticketPrice}</p>}<TicketAction/><span className="landing-ticket-reassurance"><Check size={14}/>{event.bookingUrl?'Continue to our official booking partner.':'A simple signup. No payment required.'}</span><small>Daily opening times{event.ticketPrice==null?' and ticket prices':''} to be announced.</small></div></section>
  </main>
  {footer}
  <div className="landing-mobile-ticket"><div><strong>{event.name} · {event.city}</strong><span>{event.dates}</span></div><TicketAction compact/></div>
 </div>
}
