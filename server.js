import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import mysql from 'mysql2/promise';
import {createApp} from './server/app.js';

const configured=process.env.DB_NAME&&process.env.DB_USER&&process.env.DB_PASSWORD;
const pool=configured?mysql.createPool({
  host:process.env.DB_HOST||'127.0.0.1',
  port:Number(process.env.DB_PORT||3306),
  database:process.env.DB_NAME,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  waitForConnections:true,connectionLimit:5,queueLimit:20,connectTimeout:10000,timezone:'Z',
}):null;
const origin=process.env.APP_ORIGIN;
if(!origin||new URL(origin).origin!==origin)throw new Error('APP_ORIGIN must be the exact website origin, without a trailing slash.');
if(!configured)console.warn('Database environment variables are missing. Signups will return an error.');
const staticDirectory=fileURLToPath(new URL(existsSync(new URL('./dist/index.html',import.meta.url))?'./dist/':'./',import.meta.url));
const app=createApp({pool,origin,staticDirectory});
const server=app.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('KANAGEE web app started.'));
async function stop(){server.close(async()=>{if(pool)await pool.end();process.exit(0)})}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
