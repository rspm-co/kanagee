import express from 'express';
import rateLimit from 'express-rate-limit';
import {createHmac,createHash,timingSafeEqual,randomBytes} from 'node:crypto';

const cookieName='__Host-kanagee_admin';
const ttl=3600;
const equal=(a,b)=>timingSafeEqual(createHash('sha256').update(String(a)).digest(),createHash('sha256').update(String(b)).digest());
export function adminRoutes({pool,origin,admin={}}){
  const router=express.Router();
  const ready=typeof admin.password==='string'&&admin.password.length>=12&&typeof admin.secret==='string'&&admin.secret.length>=32;
  const sign=value=>createHmac('sha256',admin.secret).update(value).digest('base64url');
  const cookie=(value,age=ttl)=>`${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
  router.use((_req,res,next)=>{res.set('Cache-Control','no-store');res.set('Vary','Cookie');next()});
  router.post('/login',rateLimit({windowMs:15*60_000,limit:5,standardHeaders:'draft-7',legacyHeaders:false,message:{ok:false,message:'Too many login attempts. Try again in 15 minutes.'}}), (req,res)=>{
    if(!ready)return res.status(503).json({ok:false,message:'Admin access has not been configured.'});
    if(req.get('origin')!==origin)return res.status(403).json({ok:false});
    const {username,password}=req.body??{};
    if(typeof username!=='string'||typeof password!=='string'||!equal(username,admin.username||'admin')||!equal(password,admin.password))return res.status(401).json({ok:false,message:'Incorrect username or password.'});
    const payload=Buffer.from(JSON.stringify({exp:Date.now()+ttl*1000,nonce:randomBytes(16).toString('hex')})).toString('base64url');
    res.set('Set-Cookie',cookie(payload+'.'+sign(payload)));return res.json({ok:true});
  });
  router.post('/logout',(req,res)=>{
    if(req.get('origin')!==origin)return res.status(403).json({ok:false});
    res.set('Set-Cookie',cookie('',0));res.json({ok:true});
  });
  router.use((req,res,next)=>{
    if(!ready)return res.status(503).json({ok:false,message:'Admin access has not been configured.'});
    try{
      const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';
      const parts=token.split('.');
      if(parts.length!==2||!equal(parts[1],sign(parts[0])))throw Error('Unauthorized');
      const data=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));
      if(!Number.isFinite(data.exp)||data.exp<=Date.now())throw Error('Expired');
      next();
    }catch{return res.status(401).json({ok:false,message:'Please sign in again.'})}
  });
  router.get('/session',(_req,res)=>res.json({ok:true}));
  router.get('/interests',async(req,res)=>{
    if(!pool)return res.status(503).json({ok:false,message:'Database is not configured.'});
    const page=Math.max(1,Math.min(100000,Number.parseInt(req.query.page,10)||1));
    const search=typeof req.query.search==='string'?req.query.search.replace(/\D/g,'').slice(0,12):'';
    const filter="purpose='ticket-launch'"+(search?' AND mobile LIKE ?':'');
    const values=search?['%'+search+'%']:[];
    try{
      const [counts]=await pool.execute('SELECT COUNT(*) AS total FROM ticket_interests WHERE '+filter,values);
      const [rows]=await pool.execute('SELECT id,mobile,consent_at,created_at,notification_status,notified_at FROM ticket_interests WHERE '+filter+' ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET '+((page-1)*25),values);
      res.json({ok:true,total:Number(counts[0].total),page,pageSize:25,rows});
    }catch{console.error('Admin contact list query failed.');res.status(503).json({ok:false,message:'Unable to load contacts. Check the database connection and table setup.'})}
  });
  return router;
}
