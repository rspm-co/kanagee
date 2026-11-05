import React from 'react';
import {ArrowRight,ArrowUpRight,Phone} from 'lucide-react';
import {event} from '../config/event.js';
import {stallIntroduction,stallTerms,stallNotice,stallFormUrl,stallFormEmbedUrl} from '../config/stalls.js';

export default function StallRegistration({header,footer}){
  return <>{header}<main id="main" className="stall-page" lang="mr">
    <section className="stall-intro section"><span className="eyebrow">KANAGEE · STALL REGISTRATION</span><h1>आपल्या हातची अस्सल चव,<br/><em>आपल्या जिल्ह्याची ओळख</em></h1><p className="stall-lead">महाराष्ट्राचा खाद्यमहोत्सव — ३६ जिल्हे, ३६ चवी आणि पारंपरिक खाद्यपदार्थांचा उत्सव!</p><div className="stall-event">{event.dates} · {event.dailyHours} · {event.venue}, {event.city}</div><div className="stall-intro-copy">{stallIntroduction.map(text=><p key={text}>{text}</p>)}</div><a href="#stall-form" className="button">स्टॉलसाठी नोंदणी करा<ArrowRight size={17}/></a></section>
    <div className="stall-layout section"><section className="stall-rules" aria-labelledby="stall-rules-title"><h2 id="stall-rules-title">स्टॉलधारकांसाठी नियम व अटी</h2><ol>{stallTerms.map(term=><li key={term.title}><h3>{term.title}</h3><p>{term.text}</p></li>)}</ol><p className="stall-notice"><strong>महत्त्वाची सूचना: </strong>{stallNotice}</p><a className="text-link" href={'tel:'+event.contact.tel}><Phone size={16}/>मदतीसाठी: {event.contact.telephone}</a></section>
    <section className="stall-form-card" id="stall-form" aria-labelledby="stall-form-title"><span className="eyebrow">आपली चव आमच्यापर्यंत पोहोचवा</span><h2 id="stall-form-title">स्टॉल नोंदणी अर्ज</h2><p>खालील Google Form मध्ये आपली माहिती भरा आणि अर्ज सादर करण्यासाठी Submit बटण निवडा. पुढील प्रक्रियेसाठी आयोजक आपल्याशी संपर्क साधतील.</p><a className="button stall-open-form" href={stallFormUrl} target="_blank" rel="noopener noreferrer">Open form<ArrowUpRight size={17}/><span className="sr-only"> — Google Form, opens in a new tab</span></a><p className="stall-form-note">फॉर्म दिसत नसल्यास किंवा Google खात्यात साइन इन करणे आवश्यक असल्यास, Open form बटण वापरा.</p><iframe className="stall-google-form" src={stallFormEmbedUrl} title="KANAGEE stall registration — Google Form" width="640" height="1200" loading="lazy" referrerPolicy="strict-origin-when-cross-origin">फॉर्म भरण्यासाठी Open form बटण वापरा.</iframe><p className="stall-form-note">अर्ज सादर केल्याने स्टॉलचे वाटप निश्चित होत नाही. अर्जातील माहिती Google Forms द्वारे आयोजकांपर्यंत पोहोचेल. <a href="/privacy/">गोपनीयता माहिती</a></p></section>
    </div>
  </main>{footer}</>;
}
