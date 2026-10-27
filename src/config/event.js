export const event = { name:'KANAGEE', taglineMr:'अस्सल महाराष्ट्राचा खाद्य महोत्सव', startDate:'2026-12-03T00:00:00+05:30', endDate:'2026-12-07T00:00:00+05:30', timezone:'Asia/Kolkata', city:'Pune', venue:'P L Deshpande (Kalagram)', bookingUrl:null, ticketPrice:null, contact:null, socials:[], dates:'3–6 December 2026', startTimeConfirmed:false };
export function eventState(now=Date.now()){const start=Date.parse(event.startDate),end=Date.parse(event.endDate);return {status:now>=end?'ended':now>=start?'live':'upcoming',remaining:Math.max(0,start-now)}}

