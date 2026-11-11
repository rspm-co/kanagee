import React,{useEffect,useRef,useState} from 'react';
import {ArrowUpRight,CalendarDays,MapPin,Utensils,Users,Heart,Check,Pause,Play} from 'lucide-react';
import {event} from '../config/event';
import TicketInterest from './TicketInterest';
import SponsorStrip from './SponsorStrip';
import {mapsUrl,publicPages} from '../config/site.js';


function EventMarquee({paused}){
 const [stopped,setStopped]=useState(false);
 return <div className="event-marquee" role="region" aria-label="Festival dates and venue" data-paused={paused||stopped}>
  <p className="sr-only">KANAGEE runs from {event.dates} at {event.venue}, {event.city}. Open from {event.dailyHours.replace('–',' to ')}.</p>
  <div className="event-marquee-window" aria-hidden="true"><div className="event-marquee-track">{[0,1].map(copy=><div className="event-marquee-group" key={copy}><CalendarDays size={18}/><strong>{event.dates}</strong><span className="event-marquee-star">✳</span><span>{event.dailyHours} </span><span className="event-marquee-star">✳</span><MapPin size={18}/><strong>{event.venue}, {event.city}</strong><span className="event-marquee-star">✳</span><span>36 DISTRICTS · 36 TASTES</span><span className="event-marquee-star">✳</span></div>)}</div></div>
  <button type="button" className="event-marquee-pause" onClick={()=>setStopped(value=>!value)} disabled={paused} aria-pressed={stopped} aria-label={paused?'Website animations are paused':stopped?'Resume event marquee':'Pause event marquee'}>{paused||stopped?<Play size={15}/>:<Pause size={15}/>}</button>
 </div>;
}

function TicketAction({compact=false,autoOpen=false}){
 if(!event.ticketBookingEnabled)return null;
 return event.bookingUrl?<a href={event.bookingUrl} className={'button ticket-spark '+(compact?'nav-ticket':'landing-book-button')}>{compact?'Book Ticket':'Book tickets'}<ArrowUpRight size={17}/></a>:<TicketInterest label={compact?'Book Ticket':'Get ticket updates'} variant={compact?'nav':'default'} autoOpen={autoOpen}/>;
}
export default function LandingPage({paused=false,footer}){
 const root=useRef(null);
 useEffect(()=>{
  document.title=publicPages.find(page=>page.path==='/').title;

 },[paused]);
 return <div className="landing-page" ref={root}>
  <a className="skip" href="#main">Skip to content</a>
  <header className="landing-header"><a className="official-brand landing-brand" href="/" aria-label="KANAGEE home"><img src="/kanagee-logo-transparent-256w.webp" srcSet="/kanagee-logo-transparent-128w.webp 128w, /kanagee-logo-transparent-256w.webp 256w" sizes="80px" width="1205" height="1306" alt="कणगी — KANAGEE"/><span>KANAGEE<small lang="mr">अस्सल महाराष्ट्राचा खाद्यमहोत्सव</small></span></a><a className="landing-organiser" href="/about/#organisers" aria-label="Ladachi Kulfi — organiser of KANAGEE"><span className="header-organiser-label">Organised by</span><img src="/ladachi-kulfi-logo.webp" width="256" height="256" alt="Ladachi Kulfi" decoding="async"/></a><div className="landing-nav"><a href="/festival/">The festival</a><a href="/about/">About KANAGEE</a><div className="header-actions"><TicketAction compact/><a className="nav-ticket ticket-spark register-button" href="/register/"><span>Stall booking</span><ArrowUpRight size={17} aria-hidden="true"/></a></div></div></header>
  <main id="main">
   <SponsorStrip/>
   <EventMarquee paused={paused}/>
   <section className="landing-hero" id="home" aria-labelledby="landing-title">
    <div className="landing-copy"><span className="landing-date-pill"><CalendarDays size={17} aria-hidden="true"/><strong>{event.dates}</strong> · {event.city}</span><p className="eyebrow">A CELEBRATION OF MAHARASHTRA’S FLAVOURS</p><h1 id="landing-title"><span className="sr-only">KANAGEE — </span>Maharashtra’s Biggest<br/><em>Food Festival</em></h1><p className="landing-marathi" lang="mr">३६ जिल्हे, ३६ चवी, एक महाराष्ट्र!</p><p className="landing-description">Discover Maharashtra’s regional flavours, traditional recipes, and the people who keep them alive. Join us in Pune for four days of food and culture.</p><div className="landing-primary-action"><TicketAction autoOpen/><a className="landing-explore-button ticket-spark" href="/festival/" aria-label="Explore the full KANAGEE festival website"><span>Explore the festival</span><ArrowUpRight size={18} aria-hidden="true"/></a></div>{event.ticketBookingEnabled&&<p className="landing-booking-note">{event.bookingUrl?'Book your tickets through our official booking partner.':'Book tickets through the Ladachi Kulfi mobile app.'}</p>}<a className="landing-venue landing-venue-highlight" href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={21} aria-hidden="true"/><span><small>MEET US HERE</small><strong>{event.venue}, {event.city}</strong><small>{event.dailyHours} · Open in Google Maps</small></span><ArrowUpRight size={17} aria-hidden="true"/></a></div>
    <div className="landing-visual"><div className="landing-photo-halo" aria-hidden="true"/><figure className="landing-plate"><img src="/heritage-thali-cutout.webp" srcSet="/heritage-thali-cutout-480w.webp 480w, /heritage-thali-cutout-640w.webp 640w, /heritage-thali-cutout-800w.webp 800w, /heritage-thali-cutout.webp 1254w" sizes="(max-width: 386px) 88vw, (max-width: 760px) 340px, (max-width: 1300px) 43vw, 558px" width="1254" height="1254" alt="A steel thali filled with rice, roti, regional dishes, and sweets" fetchPriority="high" decoding="async"/></figure><div className="landing-photo-note"><span lang="mr">अस्सल चवींचा उत्सव</span><small>ROOTED IN TRADITION</small></div><span className="landing-photo-star" aria-hidden="true">✳</span></div>
   </section>
   <section className="landing-highlights" aria-label="A taste of the festival"><div><Utensils size={21}/><span><strong>36 districts, one table</strong><small>A journey through Maharashtra’s flavours.</small></span></div><div><Users size={21}/><span><strong>Meet the makers</strong><small>Discover the stories and skills behind each dish.</small></span></div><div><Heart size={21}/><span><strong>Bring your favourite people</strong><small>Share good food and make lasting memories.</small></span></div></section>
   <section className="landing-booking" id="tickets" aria-labelledby="landing-ticket-title"><div className="landing-booking-copy"><span className="eyebrow">PLAN YOUR VISIT</span><h2 id="landing-ticket-title">Four days of food,<br/><em>a world of flavour</em></h2><div className="landing-event-line"><CalendarDays size={19}/><div><strong>{event.dates}</strong><p>Four days to explore and savour.</p></div></div><div className="landing-event-line"><MapPin size={19}/><div><strong>{event.venue}</strong><p>{event.city}, Maharashtra</p></div></div><a href="/festival/#gallery" className="landing-quiet-link">Explore the food gallery<ArrowUpRight size={15}/></a></div>{event.ticketBookingEnabled&&<div className="landing-ticket-panel"><span className="landing-ticket-status">{event.bookingUrl?'LET’S GET YOU THERE':'BOOK THROUGH LADACHI KULFI'}</span><h3>{event.bookingUrl?'Join the celebration':'Your ticket to KANAGEE'}</h3><p>{event.bookingUrl?'Discover regional flavours and food traditions at KANAGEE.':'Book tickets through the Ladachi Kulfi mobile app or register your interest for ticket updates.'}</p>{event.ticketPrice!=null&&<p className="landing-ticket-price">₹{event.ticketPrice}</p>}<TicketAction/><span className="landing-ticket-reassurance"><Check size={14}/>{event.bookingUrl?'Continue to our official booking partner.':'Registering your interest is free. This does not book a ticket.'}</span><small>Open from {event.dailyHours.replace('–',' to ')}.{event.ticketPrice==null?' View ticket prices and admission details in the app.':''}</small></div>}</section>
  </main>
  {footer}
  <div className="landing-mobile-ticket"><div><strong>{event.name} · {event.city}</strong><span>{event.dates}</span></div><div className="header-actions"><TicketAction compact/><a className="nav-ticket ticket-spark register-button" href="/register/"><span>Stall booking</span><ArrowUpRight size={17} aria-hidden="true"/></a></div></div>
 </div>
}
