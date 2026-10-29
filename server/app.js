import express from 'express';
import rateLimit from 'express-rate-limit';

export function createApp({pool, origin, staticDirectory}) {
  const app=express();
  app.disable('x-powered-by');
  app.use('/api', (_req,res,next)=>{res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');next()});
  app.use('/api',rateLimit({windowMs:60_000,limit:15,standardHeaders:'draft-7',legacyHeaders:false,message:{ok:false,message:'Please try again in a minute.'}}));
  app.use('/api',express.json({limit:'2kb'}));
  app.get('/api/health',(_req,res)=>res.json({ok:true}));
  const register=async(req,res)=>{
    if(req.get('origin')&&req.get('origin')!==origin)return res.status(403).json({ok:false});
    if(!req.is('application/json'))return res.status(415).json({ok:false});
    const {mobile,consent,purpose}=req.body??{};
    if(typeof mobile!=='string'||!/^\+91[6-9]\d{9}$/.test(mobile)||consent!==true||purpose!=='ticket-launch')return res.status(422).json({ok:false});
    if(!pool)return res.status(503).json({ok:false,message:'Registration is not configured yet.'});
    try{
      await pool.execute("INSERT INTO ticket_interests (mobile,purpose,consent_at,created_at) VALUES (?, 'ticket-launch', UTC_TIMESTAMP(), UTC_TIMESTAMP()) ON DUPLICATE KEY UPDATE id=id",[mobile]);
      return res.json({ok:true});
    }catch{
      console.error('Ticket interest registration failed.');
      return res.status(503).json({ok:false,message:'Unable to save right now. Please try again.'});
    }
  };
  // Preserve the previous endpoint for frontend builds already deployed.
  app.post(['/api/ticket-interest','/api/ticket-interest.php'],register);
  app.use('/api',(_req,res)=>res.status(404).json({ok:false}));
  app.use(express.static(staticDirectory,{dotfiles:'deny',index:'index.html'}));
  app.use((error,_req,res,_next)=>res.status(error.status===413?413:400).json({ok:false,message:'Invalid request.'}));
  return app;
}
