import React from 'react';
import {sponsors} from '../data/sponsors';

export default function SponsorStrip(){
  const groups=[...new Set(sponsors.map(sponsor=>sponsor.category))].map(category=>({category,logos:sponsors.filter(sponsor=>sponsor.category===category)}));
  const positions={'Title Sponsor':0,'Associate Partner':1,'Branding Partner':2};
  groups.sort((a,b)=>positions[a.category]-positions[b.category]);
  return <section className="sponsor-strip" aria-label="KANAGEE sponsors">
    {groups.map(group=><div className={'sponsor-credit sponsor-credit--'+group.logos[0].order} key={group.category}>
      <span className="eyebrow">{group.category}</span>
      <div className="sponsor-logo-row">{group.logos.map(sponsor=><div className={'sponsor-logo'+(sponsor.style?' sponsor-logo--'+sponsor.style:'')} key={sponsor.name}><img src={sponsor.logo} width={sponsor.width} height={sponsor.height} alt={sponsor.name} decoding="async"/></div>)}</div>
    </div>)}
  </section>;
}
