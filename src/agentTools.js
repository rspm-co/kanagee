import {festivalFacts} from './config/site.js';

export async function registerAgentTools(context=globalThis.navigator?.modelContext){
  if(!context?.registerTool||globalThis.location?.pathname.startsWith('/admin'))return;
  const facts=festivalFacts();
  for(const tool of [
    {name:'kanagee_festival_details',description:'Read confirmed KANAGEE dates, opening hours, venue, organisers, programme and contact details.',result:facts},
    {name:'kanagee_booking_info',description:'Read ticket-booking guidance for the Ladachi Kulfi mobile app. This does not book tickets or submit contact details.',result:{tickets:facts.tickets,telephone:facts.telephone}},
  ]){
    try{await context.registerTool({name:tool.name,description:tool.description,inputSchema:{type:'object',properties:{},additionalProperties:false},execute:async()=>({content:[{type:'text',text:JSON.stringify(tool.result)}]})})}catch{
      // Experimental browser APIs must never prevent the visitor site from loading.
    }
  }
}
