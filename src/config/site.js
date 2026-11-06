import {event,venueFullAddress} from './event.js';
import {organiser} from './organiser.js';
import {stallIntroduction,stallTerms,stallNotice,stallFormUrl} from './stalls.js';

export const siteUrl='https://kanagee.com';
export const mapsUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(venueFullAddress);
export const publicPages=[
  {path:'/register/',title:'KANAGEE — Stall Registration · स्टॉल नोंदणी',description:'Apply for a traditional Maharashtrian food stall at KANAGEE. Read the participation requirements, service-charge information, and application details.'},
  {path:'/',title:'KANAGEE — Maharashtra Food Festival · Plan Your Visit',description:'Explore Maharashtra’s flavours at KANAGEE from '+event.dates+' at '+event.venue+', Pune. Open 12 PM–9 PM . Book through the Ladachi Kulfi mobile app.'},
  {path:'/festival/',title:'Explore KANAGEE — Food, Culture & Experiences',description:'Discover regional food, women-led kitchens, the gallery, and confirmed business talks and conferences at KANAGEE in Pune.'},
  {path:'/about/',title:'About KANAGEE — Our Organisers & Vision',description:'Discover the vision behind KANAGEE, organised by Ladachi Kulfi — R S Papal Group to celebrate Maharashtra’s food heritage.'},
  {path:'/contact/',title:'Contact KANAGEE — Help & Venue',description:'Call KANAGEE toll-free on 1800 210 3696. Find the festival venue, visiting hours, and official Instagram profile.'},
  {path:'/terms/',title:'KANAGEE — Website & Booking Information',description:'Website information, app booking guidance, and content-use terms for KANAGEE visitors.'},
  {path:'/privacy/',title:'KANAGEE — Privacy Information',description:'How the KANAGEE website uses ticket-interest mobile numbers, analytics, and browser storage.'},
];

export const informationPages={
  '/contact':{heading:'Contact KANAGEE',intro:'Planning your visit or looking for booking information? Get in touch with the KANAGEE team.',sections:[
    {title:'Call us toll-free',text:event.contact.telephone,href:'tel:'+event.contact.tel},
    {title:'Find KANAGEE in Pune',text:venueFullAddress+' · '+event.dates+' · '+event.dailyHours+' ',href:mapsUrl,linkLabel:'Open in Google Maps'},
    {title:'Follow the festival',text:'Official Instagram: @kanagee_',href:event.socials[0].url,linkLabel:'Visit @kanagee_'},
    {title:'Ticket bookings',text:'Book through the '+event.bookingPlatform+'. For booking help, call the toll-free number above.'},
  ]},
  '/terms':{heading:'Website & booking information',intro:'Information for visitors using the KANAGEE website.',sections:[
    {title:'Who organises KANAGEE?',text:'The festival is organised by '+organiser.name+' — '+organiser.group+'.'},
    {title:'Tickets and payments',text:'Tickets are booked through the Ladachi Kulfi mobile app. This website collects ticket-interest requests and does not process ticket payments. Review ticket prices and admission conditions in the app before paying. Check the cancellation and refund information there as well.'},
    {title:'Programme information',text:'The festival takes place at '+event.venue+', '+event.city+', from '+event.dates+'. It is open from '+event.dailyHours.replace('–',' to ')+'. Business talks and conferences are confirmed. Speakers and session timings will be announced. Experiences marked as planned are subject to confirmation.'},
    {title:'Content use',text:'Search indexing and AI use to answer questions are permitted. AI training use is not permitted, as declared in robots.txt. Logos and photographs remain the property of their respective owners.'},
    {title:'Questions',text:'For festival or booking questions, call '+event.contact.telephone+'.',href:'tel:'+event.contact.tel,linkLabel:'Call KANAGEE'},
  ]},
  '/privacy':{heading:'Privacy information',intro:'How this website handles visitor information.',sections:[
    {title:'Ticket-update registrations',text:'When you register for ticket updates, we store your mobile number and consent in the organiser’s database. We also record when you register, when you give consent, and the status of your notification. These details are used for ticket updates. Registering your interest does not book a ticket or involve a payment.'},
    {title:'Stall applications',text:'The stall-registration page contains a Google Form managed by the organiser. Information submitted through this form is processed by Google Forms and made available to the organiser, separately from the website’s ticket-update records. Organisers use applications to review participation and contact applicants. Read the form’s questions and notices before submitting. An application does not confirm a stall allocation.'},
    {title:'Access and requests',text:'Access to the contact dashboard is restricted to signed-in administrators. To request access to, correction of, or deletion of your registration details, contact the organiser on '+event.contact.telephone+'.',href:'tel:'+event.contact.tel,linkLabel:'Call about your information'},
    {title:'Analytics',text:'This website uses Google Analytics to understand how visitors use the site. Google may use cookies and process device and browsing information. Hosting or Cloudflare services may also collect operational or analytics information.',href:'https://policies.google.com/privacy',linkLabel:'Google privacy information'},
    {title:'Browser storage',text:'The site stores the animation preference in local storage. Administrator sign-in uses a secure session cookie. Session storage remembers whether the ticket popup has been shown, so it does not automatically repeat on refresh during the same browsing session.'},
    {title:'External services',text:'Instagram, Google Maps, and the Ladachi Kulfi booking app have their own privacy policies. Review their policies when using those services.'},
  ]},
};

export function festivalFacts(){return {
  name:event.name,description:'A celebration of Maharashtra’s regional food, people, and cultural heritage.',
  dates:event.dates,dailyHours:event.dailyHours,timezone:event.timezone,
  venue:event.venue,address:event.address,fullAddress:venueFullAddress,city:event.city,country:'India',mapsUrl,
  organiser:organiser.name+' — '+organiser.group,
  tickets:{platform:event.bookingPlatform,url:event.bookingUrl,price:event.ticketPrice},
  confirmedExperiences:['Business talks','Business conferences'],
  programmeNote:'Speakers and session schedules are to be announced. Experiences marked as planned are subject to confirmation.',
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
    {'@type':'FoodEvent','@id':siteUrl+'/#festival',name:'KANAGEE — Maharashtra Food Festival',description:festivalFacts().description+' Open '+event.dailyHours+'.',url:siteUrl+'/festival/',startDate:'2026-12-03T12:00:00+05:30',endDate:'2026-12-06T21:00:00+05:30',eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',location:{'@type':'Place',name:event.venue,address:{'@type':'PostalAddress',...event.address},hasMap:mapsUrl},organizer:{'@id':siteUrl+'/#organiser'},image:[siteUrl+'/festival-thali.webp'],eventSchedule:{'@type':'Schedule',startDate:'2026-12-03',endDate:'2026-12-06',startTime:'12:00:00',endTime:'21:00:00',repeatFrequency:'P1D',scheduleTimezone:event.timezone}},
  ]};
}

export function pageMarkdown(page){
  if(page.path==='/register/')return '# KANAGEE — स्टॉल नोंदणी\n\n'+stallIntroduction.join('\n\n')+'\n\n## स्टॉलधारकांसाठी नियम व अटी\n\n'+stallTerms.map((term,i)=>(i+1)+'. **'+term.title+'** — '+term.text).join('\n\n')+'\n\n'+stallNotice+'\n\n## Apply\n\nComplete the Google Form at '+stallFormUrl+'. It is also embedded at '+siteUrl+'/register/. Follow the questions and consent instructions in the Google Form. Service charges will be announced. Submitting an application does not confirm a stall allocation. Toll-free: '+event.contact.telephone+'.\n';
  const key=page.path.replace(/\/$/,'');const info=informationPages[key];
  const intro=info?'# '+info.heading+'\n\n'+info.intro+'\n\n'+info.sections.map(s=>'## '+s.title+'\n\n'+s.text+(s.href?'\n\n['+(s.linkLabel||s.text)+']('+s.href+')':'')).join('\n\n'):
    '# '+page.title+'\n\n'+page.description+'\n\n## Visit\n\n'+event.dates+' · '+event.dailyHours+' (Asia/Kolkata).\n\n'+venueFullAddress+'.\n\n[Google Maps]('+mapsUrl+')\n\n## Tickets\n\nBook through the '+event.bookingPlatform+'. Prices and admission conditions are available in the app. For booking assistance, call 1800 210 3696.\n\n## Organisers and programme\n\nOrganised by '+organiser.name+' — '+organiser.group+'.\n\nBusiness talks and conferences are confirmed. Speakers and session schedules will be announced. The festival celebrates regional food from all 36 districts and rural women-led kitchens.\n\n## Contact\n\n[Toll-free: '+event.contact.telephone+'](tel:'+event.contact.tel+') · [Instagram @kanagee_]('+event.socials[0].url+')';
  return intro+'\n\n## Official pages\n\n'+publicPages.map(p=>'- ['+p.title+']('+siteUrl+p.path+')').join('\n')+'\n';
}
