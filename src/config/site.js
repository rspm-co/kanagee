import {event} from './event.js';
import {organiser} from './organiser.js';
import {stallIntroduction,stallTerms,stallNotice,stallFormUrl} from './stalls.js';

export const siteUrl='https://kanagee.com';
export const mapsUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(event.venue+', '+event.city+', Maharashtra');
export const publicPages=[
  {path:'/register/',title:'KANAGEE — Stall Registration · स्टॉल नोंदणी',description:'Apply for a traditional Maharashtrian food stall at KANAGEE. Read the stall rules, proposed service charges and registration details.'},
  {path:'/',title:'KANAGEE — Maharashtra Food Festival · Tickets & Visit',description:'Explore Maharashtra’s flavours at KANAGEE, 3–6 December 2026 at P L Deshpande (Kalagram), Pune. Open 12 PM–9 PM daily. Book via the Ladachi Kulfi app.'},
  {path:'/festival/',title:'Explore KANAGEE — Food, Culture & Experiences',description:'Discover regional food, women-led kitchens, the gallery and confirmed business speeches and conferences at KANAGEE in Pune.'},
  {path:'/about/',title:'About KANAGEE — Our Organisers & Vision',description:'Meet Ladachi Kulfi — R S Papal Group, the organisers behind KANAGEE, and explore the Chairman’s vision for Maharashtra’s food heritage.'},
  {path:'/contact/',title:'Contact KANAGEE — Help & Venue',description:'Call KANAGEE toll-free on 1800 210 3696. Find the festival venue, visiting hours and official Instagram profile.'},
  {path:'/terms/',title:'KANAGEE — Website & Booking Information',description:'Website information, app booking guidance and content-use terms for KANAGEE visitors.'},
  {path:'/privacy/',title:'KANAGEE — Privacy Information',description:'How the KANAGEE website uses ticket-interest mobile numbers, analytics and browser storage.'},
];

export const informationPages={
  '/contact':{heading:'Contact KANAGEE',intro:'Planning your visit or need help? Reach the festival team.',sections:[
    {title:'Call us toll-free',text:event.contact.telephone,href:'tel:'+event.contact.tel},
    {title:'Where KANAGEE is happening',text:event.venue+', '+event.city+'. '+event.dates+' · '+event.dailyHours+' daily.',href:mapsUrl,linkLabel:'Open in Google Maps'},
    {title:'Follow the festival',text:'Official Instagram: @kanagee_',href:event.socials[0].url,linkLabel:'Visit @kanagee_'},
    {title:'Ticket bookings',text:'Book through the '+event.bookingPlatform+'. For booking help, call the toll-free number above.'},
  ]},
  '/terms':{heading:'Website & booking information',intro:'Information for visitors using the KANAGEE website.',sections:[
    {title:'Who organises KANAGEE?',text:organiser.name+' — '+organiser.group+' organises the festival.'},
    {title:'Tickets and payments',text:'Tickets are booked through the Ladachi Kulfi mobile app. This website collects ticket-interest requests and does not process ticket payments. Review the prices, admission conditions, cancellation and refund information displayed in the app before paying.'},
    {title:'Programme information',text:'The festival runs '+event.dates+', '+event.dailyHours+' daily, at '+event.venue+', '+event.city+'. Business speeches and conferences are confirmed; speakers and session timings will be announced. Other experiences remain labelled as planned where applicable.'},
    {title:'Content use',text:'Search indexing and AI use to answer questions are permitted. AI training use is not permitted, as declared in robots.txt. Logos and photographs remain the property of their respective owners.'},
    {title:'Questions',text:'For festival or booking questions, call '+event.contact.telephone+'.',href:'tel:'+event.contact.tel,linkLabel:'Call KANAGEE'},
  ]},
  '/privacy':{heading:'Privacy information',intro:'How this website handles visitor information.',sections:[
    {title:'Ticket-interest requests',text:'When you submit the interest form, the website records your mobile number, your consent and signup times, and the notification status in the organiser’s database. These details are used for ticket updates. Signup does not itself book a ticket or take payment.'},
    {title:'Stall applications',text:'The stall-registration page embeds the organiser’s existing Google Form. Information submitted there is sent to Google Forms and the organiser’s configured response destination, rather than this website’s ticket-interest database. Review the form’s questions and notices before submitting. Organisers use applications to review stall participation and contact applicants. Submission does not itself confirm a stall allocation.'},
    {title:'Access and requests',text:'The contact dashboard requires an authenticated administrator session. To request access to, correction of, or deletion of your signup details, contact the organiser on '+event.contact.telephone+'.',href:'tel:'+event.contact.tel,linkLabel:'Call about your information'},
    {title:'Analytics',text:'This website loads Google Analytics (measurement ID G-YE9KRXWKS9) to measure site use. Google may use cookies and process device and browsing information. Hosting or Cloudflare services may also collect operational or analytics information.',href:'https://policies.google.com/privacy',linkLabel:'Google privacy information'},
    {title:'Browser storage',text:'The site stores the animation preference in local storage. Administrator sign-in uses a secure session cookie. Session storage remembers whether the ticket popup has been shown, so it does not automatically repeat on refresh during the same browsing session.'},
    {title:'External services',text:'Instagram, Google Maps and the Ladachi Kulfi booking app operate under their own privacy information. Follow those services’ notices when you use them.'},
  ]},
};

export function festivalFacts(){return {
  name:event.name,description:'A celebration of Maharashtra’s regional food, people and cultural heritage.',
  dates:event.dates,dailyHours:event.dailyHours,timezone:event.timezone,
  venue:event.venue,city:event.city,country:'India',mapsUrl,
  organiser:organiser.name+' — '+organiser.group,
  tickets:{platform:event.bookingPlatform,url:event.bookingUrl,price:event.ticketPrice},
  confirmedExperiences:['Business speeches','Business conferences'],
  programmeNote:'Speakers and session schedules are to be announced. Other experiences are planned where labelled.',
  telephone:event.contact.telephone,instagram:event.socials[0].url,
  pages:publicPages.map(page=>({title:page.title,url:siteUrl+page.path})),
};}

export function structuredData(page){
  const organization={ '@type':'Organization','@id':siteUrl+'/#organization',name:'KANAGEE',url:siteUrl+'/',logo:siteUrl+'/kanagee-logo-transparent-256w.webp',telephone:event.contact.telephone,sameAs:event.socials.map(s=>s.url),contactPoint:{'@type':'ContactPoint',telephone:event.contact.telephone,contactType:'customer support',areaServed:'IN',contactOption:'TollFree'},parentOrganization:{'@id':siteUrl+'/#organiser'}};
  return {'@context':'https://schema.org','@graph':[
    organization,
    {'@type':'Organization','@id':siteUrl+'/#organiser',name:organiser.name,parentOrganization:{'@type':'Organization',name:organiser.group},url:siteUrl+'/about/',telephone:event.contact.telephone},
    {'@type':'WebSite','@id':siteUrl+'/#website',url:siteUrl+'/',name:'KANAGEE',publisher:{'@id':siteUrl+'/#organization'},inLanguage:['en','mr']},
    {'@type':page.path==='/about/'?'AboutPage':page.path==='/contact/'?'ContactPage':'WebPage','@id':siteUrl+page.path+'#webpage',url:siteUrl+page.path,name:page.title,description:page.description,isPartOf:{'@id':siteUrl+'/#website'},about:{'@id':siteUrl+'/#festival'}},
    {'@type':'FoodEvent','@id':siteUrl+'/#festival',name:'KANAGEE — Maharashtra Food Festival',description:festivalFacts().description+' Open daily '+event.dailyHours+'.',url:siteUrl+'/festival/',startDate:'2026-12-03T12:00:00+05:30',endDate:'2026-12-06T21:00:00+05:30',eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',location:{'@type':'Place',name:event.venue,address:{'@type':'PostalAddress',addressLocality:event.city,addressRegion:'Maharashtra',addressCountry:'IN'},hasMap:mapsUrl},organizer:{'@id':siteUrl+'/#organiser'},image:[siteUrl+'/festival-thali.webp'],eventSchedule:{'@type':'Schedule',startDate:'2026-12-03',endDate:'2026-12-06',startTime:'12:00:00',endTime:'21:00:00',repeatFrequency:'P1D',scheduleTimezone:event.timezone}},
  ]};
}

export function pageMarkdown(page){
  if(page.path==='/register/')return '# KANAGEE — स्टॉल नोंदणी\n\n'+stallIntroduction.join('\n\n')+'\n\n## स्टॉलधारकांसाठी नियम व अटी\n\n'+stallTerms.map((term,i)=>(i+1)+'. **'+term.title+'** — '+term.text).join('\n\n')+'\n\n'+stallNotice+'\n\n## Apply\n\nComplete the existing Google Form at '+stallFormUrl+'. It is also embedded at '+siteUrl+'/register/. Follow the questions and consent instructions in the Google Form. Service charges will be announced. Submission does not confirm a stall. Toll-free: '+event.contact.telephone+'.\n';
  const key=page.path.replace(/\/$/,'');const info=informationPages[key];
  const intro=info?'# '+info.heading+'\n\n'+info.intro+'\n\n'+info.sections.map(s=>'## '+s.title+'\n\n'+s.text+(s.href?'\n\n['+(s.linkLabel||s.text)+']('+s.href+')':'')).join('\n\n'):
    '# '+page.title+'\n\n'+page.description+'\n\n## Visit\n\n'+event.dates+' · '+event.dailyHours+' daily (Asia/Kolkata).\n\n'+event.venue+', '+event.city+', Maharashtra, India.\n\n[Google Maps]('+mapsUrl+')\n\n## Tickets\n\nBook through the '+event.bookingPlatform+'. Prices and admission conditions are available in the app. No booking URL has been supplied for this website.\n\n## Organisers and programme\n\nOrganised by '+organiser.name+' — '+organiser.group+'.\n\nBusiness speeches and business conferences are confirmed. Speakers and session schedules will be announced. The festival celebrates regional food from all 36 districts and rural women-led kitchens.\n\n## Contact\n\n[Toll-free: '+event.contact.telephone+'](tel:'+event.contact.tel+') · [Instagram @kanagee_]('+event.socials[0].url+')';
  return intro+'\n\n## Official pages\n\n'+publicPages.map(p=>'- ['+p.title+']('+siteUrl+p.path+')').join('\n')+'\n';
}
