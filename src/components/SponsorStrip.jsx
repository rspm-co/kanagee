import React from 'react';
import {sponsors} from '../data/sponsors';

export default function SponsorStrip(){
  return <section className="sponsor-strip" aria-label="KANAGEE sponsors">
    {sponsors.map(sponsor=><div className={'sponsor-credit sponsor-credit--'+sponsor.order} key={sponsor.name}>
      <span className="eyebrow">{sponsor.category}</span>
      <div className="sponsor-logo"><img src={sponsor.logo} width={sponsor.width} height={sponsor.height} alt={sponsor.name} decoding="async"/></div>
    </div>)}
  </section>;
}
