import React from 'react';
import {sponsors} from '../data/sponsors';
import {event} from '../config/event';
import {ArrowUpRight} from 'lucide-react';

// Use 'app' or 'order' to restore a Ladachi Kulfi promotion.
const ladachiPromotion=null;

export default function SponsorStrip(){
  const groups=[...new Set(sponsors.map(sponsor=>sponsor.category))].map(category=>({category,logos:sponsors.filter(sponsor=>sponsor.category===category)}));
  const positions={'Presented By':0,'Associate Partner':1,'Promotional Partners':2};
  groups.sort((a,b)=>positions[a.category]-positions[b.category]);
  return <><section className="sponsor-strip" aria-label="KANAGEE sponsors">
    {groups.map(group=><div className={'sponsor-credit sponsor-credit--'+group.logos[0].order} key={group.category}>
      <span className="eyebrow">{group.category}</span>
      <div className="sponsor-logo-row">{group.logos.map(sponsor=><div className={'sponsor-logo'+(sponsor.style?' sponsor-logo--'+sponsor.style:'')} key={sponsor.name}><img src={sponsor.logo} width={sponsor.width} height={sponsor.height} alt={sponsor.name} decoding="async"/></div>)}</div>
    </div>)}
  </section>
  <section className="brand-ambassador" aria-labelledby="ambassador-title">
    {event.bookingUrl&&<a className="ambassador-book-circle" href={event.bookingUrl}><ArrowUpRight size={24} aria-hidden="true"/><span>Book Tickets</span><small>JOIN THE FESTIVAL</small></a>}
    <div className="ambassador-invitation" lang="mr"><p>महाराष्ट्राचा सर्वात मोठा<br/>खाद्यमहोत्सव</p><small>३६ जिल्हे, ३६ चवी, एकाच छताखाली</small></div>
    <div className="brand-ambassador-copy">
      <span className="eyebrow">OUR BRAND AMBASSADOR</span>
      <h2 id="ambassador-title">Madhura Bachal</h2>
      <div className="brand-ambassador-identity"><img src="/madhuras-recipe-logo.webp" width="381" height="391" alt="Madhuras Recipe" decoding="async"/><p className="brand-ambassador-name">Madhura’s Recipes</p></div>
      <p>Celebrating Maharashtra’s flavours together at KANAGEE.</p>
    </div>
    <figure className="brand-ambassador-portrait"><img src="/madhura-bachal-portrait-360w.webp" srcSet="/madhura-bachal-portrait-240w.webp 240w, /madhura-bachal-portrait-360w.webp 360w, /madhura-bachal-portrait-480w.webp 480w" sizes="(max-width: 600px) 112px, 148px" width="360" height="540" alt="Madhura Bachal, KANAGEE’s brand ambassador" decoding="async"/></figure>
    {ladachiPromotion&&<div className="ambassador-app-download">
      <span className="eyebrow">TAKE THE TASTE WITH YOU</span>
      {ladachiPromotion==='app'?<><h3>Download the Ladachi Kulfi app</h3>
      <p>Available on Google Play.</p>
      <a href="https://play.google.com/store/apps/details?id=com.zentosys.ladachikulfi&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" aria-label="Download Ladachi Kulfi on Google Play (opens in a new tab)"><img src="/google-play-badge.webp" alt="Get it on Google Play" width="646" height="250" decoding="async"/></a></>:<>
      <h3>Order Ladachi Kulfi now</h3>
      <p>Your favourite kulfi, a click away.</p>
      <a className="button ladachi-order-link" href="https://ladachikulfi.com" target="_blank" rel="noopener noreferrer" aria-label="Order from ladachikulfi.com (opens in a new tab)">Order now<ArrowUpRight size={17} aria-hidden="true"/></a>
      </>}
    </div>}
  </section></>;
}
