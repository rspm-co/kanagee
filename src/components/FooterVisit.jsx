import React from 'react';
import {ArrowUpRight,Instagram,MapPin,Phone} from 'lucide-react';
import {event} from '../config/event';

export default function FooterVisit(){
  const mapsUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(event.venue+', '+event.city+', Maharashtra');
  return <section className="footer-visit" aria-labelledby="footer-visit-title">
    <div className="footer-venue"><MapPin size={25} aria-hidden="true"/><div>
      <h2 id="footer-visit-title">Where KANAGEE is happening</h2>
      <p>{event.venue}, {event.city}<br/><span>{event.dates} · {event.dailyHours} daily</span></p>
      <a className="footer-map-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps<ArrowUpRight size={16} aria-hidden="true"/></a>
    </div></div>
    <div className="footer-social"><span className="eyebrow">A TASTE OF WHAT’S COMING</span><p>Follow the festival on Instagram.</p>
      <a className="footer-phone" href={'tel:'+event.contact.tel}><Phone size={18} aria-hidden="true"/><span>Toll-free: {event.contact.telephone}</span></a>
      {event.socials.map(social=><a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={'Follow KANAGEE on '+social.name+' (opens in a new tab)'}><Instagram size={20} aria-hidden="true"/><span>{social.handle}</span><ArrowUpRight size={16} aria-hidden="true"/></a>)}
    </div>
  </section>;
}
