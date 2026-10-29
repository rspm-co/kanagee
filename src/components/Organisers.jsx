import React from 'react';
import {Heart, Sprout, Users} from 'lucide-react';
import {organiser} from '../config/organiser';

const intentions=[
  {icon:Sprout,title:'मुळाशी नातं',text:'महाराष्ट्राच्या स्थानिक चवी, पारंपरिक पाककृती आणि त्यामागच्या माणसांना एकत्र आणण्याचा प्रयत्न.'},
  {icon:Users,title:'माणसांना मान',text:'घरगुती स्वयंपाक करणाऱ्या महिला, लघुउद्योजक आणि स्थानिक खाद्यपरंपरा जपणाऱ्या हातांना व्यासपीठ देण्याची इच्छा.'},
  {icon:Heart,title:'मनापासून केलेला प्रयत्न',text:'दिखाव्यापेक्षा चवीला, संवादाला आणि आपलेपणाला महत्त्व देणारा उत्सव घडवण्याचा आमचा संकल्प.'},
];

export function OurIntent(){
  return <section id="our-intent" className="our-intent section" aria-labelledby="intent-title">
    <div className="intent-heading reveal">
      <span className="eyebrow">OUR INTENT · आमची भूमिका</span>
      <h2 id="intent-title" className="marathi-title" lang="mr">चव अस्सल.<br/><em>प्रयत्न प्रामाणिक.</em></h2>
      <p lang="mr">कणगी हा केवळ खाद्यमहोत्सव नाही; आपल्या मातीची चव आणि ती जपणारी माणसं यांच्याशी नातं जोडण्याचा एक मनापासून केलेला प्रयत्न आहे.</p>
    </div>
    <div className="intent-values">{intentions.map(({icon:Icon,title,text})=><article className="intent-value reveal" key={title}>
      <span className="intent-icon" aria-hidden="true"><Icon size={19}/></span>
      <div lang="mr"><h3>{title}</h3><p>{text}</p></div>
    </article>)}</div>
  </section>
}

export function OrganisedBy(){
  const chairman=organiser.chairman;
  const showChairman=chairman.name.trim()&&chairman.photo.trim()&&chairman.message.trim();
  return <section id="organisers" className="organisers section" aria-labelledby="organiser-title">
    <div className="organiser-intro reveal">
      <span className="eyebrow">THE PEOPLE BEHIND KANAGEE</span>
      <h2 id="organiser-title">Organised with heart.</h2>
      <p lang="mr">आपल्या चवींचा उत्सव. आपल्या माणसांसोबत.</p>
    </div>
    <div className="organiser-identity reveal">
      <span className="eyebrow">ORGANISED BY</span>
      <h3>{organiser.name}</h3>
      <span className="organiser-group">{organiser.group}</span>
      <p lang="mr">महाराष्ट्राच्या खाद्यपरंपरेचा उत्सव साजरा करण्यासाठी एकत्र.</p>
    </div>
    {showChairman&&<article className="chairman-message" aria-labelledby="chairman-heading">
      <img src={chairman.photo} alt={chairman.name} loading="lazy" decoding="async" width="400" height="500"/>
      <div><span className="eyebrow">A NOTE FROM OUR CHAIRMAN</span><h3 id="chairman-heading">{chairman.name}</h3><p className="chairman-role">{chairman.designation} · {organiser.group}</p><p className="chairman-copy">{chairman.message}</p></div>
    </article>}
  </section>
}
