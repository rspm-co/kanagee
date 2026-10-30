import React,{useEffect,useState} from 'react';
import {LockKeyhole,LogOut,Search,RefreshCw,ArrowLeft,ArrowRight,Users} from 'lucide-react';

async function request(path,options={}){
  const response=await fetch('/api/admin'+path,{credentials:'same-origin',...options});
  let data;try{data=await response.json()}catch{throw new Error('Admin server is unavailable. Please check the deployment.')}
  if(!response.ok){const error=new Error(data.message||'Unable to complete this request.');error.status=response.status;throw error}
  return data;
}
const date=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(value)):'—';

export default function Admin(){
  const [auth,setAuth]=useState('checking');
  const [username,setUsername]=useState('');const [password,setPassword]=useState('');
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  const [page,setPage]=useState(1);const [search,setSearch]=useState('');const [filter,setFilter]=useState('');
  const [data,setData]=useState({total:0,rows:[],pageSize:25});const [loading,setLoading]=useState(false);const [refresh,setRefresh]=useState(0);
  useEffect(()=>{document.title='Admin — KANAGEE';const controller=new AbortController();request('/session',{signal:controller.signal}).then(()=>setAuth('signedin')).catch(e=>{if(controller.signal.aborted)return;setAuth('login');if(e.status!==401)setError(e.message)});return()=>controller.abort()},[]);
  useEffect(()=>{
    if(auth!=='signedin')return;
    const controller=new AbortController();setLoading(true);setError('');
    request('/interests?page='+page+'&search='+encodeURIComponent(filter),{signal:controller.signal}).then(setData).catch(e=>{if(controller.signal.aborted)return;setData({total:0,rows:[],pageSize:25});setError(e.message);if(e.status===401){setAuth('login');setPassword('')}}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});
    return()=>controller.abort();
  },[auth,page,filter,refresh]);
  async function login(e){e.preventDefault();setBusy(true);setError('');try{await request('/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});setPassword('');setAuth('signedin')}catch(e){setError(e.message)}finally{setBusy(false)}}
  async function logout(){setBusy(true);setError('');try{await request('/logout',{method:'POST'});setAuth('login');setData({total:0,rows:[],pageSize:25});setSearch('');setFilter('');setPage(1)}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="admin-page"><header className="admin-header"><a href="/" className="admin-brand">KANAGEE <span>Admin</span></a>{auth==='signedin'&&<button className="admin-secondary" onClick={logout} disabled={busy}><LogOut size={16}/>Sign out</button>}</header>
    <main className="admin-main">
      {auth==='checking'?<p role="status">Checking your session…</p>:auth==='login'?<section className="admin-login" aria-labelledby="admin-login-title"><span className="interest-icon" aria-hidden="true"><LockKeyhole size={24}/></span><span className="eyebrow">PRIVATE ACCESS</span><h1 id="admin-login-title">Welcome back.</h1><p>Sign in to view your festival interest list.</p>
        <form onSubmit={login}><label htmlFor="admin-user">Username</label><input id="admin-user" autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required maxLength={100}/><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required maxLength={500}/>{error&&<p className="admin-error" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy?'Signing in…':'Sign in'}<ArrowRight size={16}/></button></form><a href="/" className="text-link">← Back to the festival</a>
      </section>:<>
        <div className="admin-heading"><div><span className="eyebrow">YOUR FESTIVAL COMMUNITY</span><h1>Interested visitors</h1><p>Mobile numbers submitted through “We are interested”.</p></div><div className="admin-count"><Users size={19}/><strong>{loading?'—':data.total}</strong><span>{filter?'matching contacts':'registered contacts'}</span></div></div>
        <div className="admin-toolbar"><form onSubmit={e=>{e.preventDefault();setPage(1);setFilter(search.trim())}}><label className="admin-sr-only" htmlFor="admin-search">Search mobile number</label><div className="admin-search"><Search size={17}/><input id="admin-search" type="search" inputMode="tel" placeholder="Search mobile number" value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="admin-secondary" disabled={loading}>Search</button>{filter&&<button type="button" className="admin-secondary" onClick={()=>{setSearch('');setFilter('');setPage(1)}}>Clear</button>}</form><button className="admin-secondary" onClick={()=>setRefresh(v=>v+1)} disabled={loading}><RefreshCw size={15}/>Refresh</button></div>
        {error&&<p className="admin-error" role="alert">{error}</p>}
        <div className="admin-table-wrap" aria-busy={loading}><table><caption className="admin-sr-only">Interested visitors, newest first. Dates are in India Standard Time.</caption><thead><tr><th scope="col">Mobile number</th><th scope="col">Signed up · IST</th><th scope="col">Consent recorded · IST</th><th scope="col">Notification</th></tr></thead><tbody>{loading?<tr><td colSpan="4" className="admin-empty" role="status">Loading contacts…</td></tr>:data.rows.length?data.rows.map(row=><tr key={row.id}><td className="admin-mobile">{row.mobile}</td><td>{date(row.created_at)}</td><td>{date(row.consent_at)}</td><td><span className="admin-status">{row.notification_status}</span></td></tr>):<tr><td colSpan="4" className="admin-empty">{error?'Contacts could not be loaded.':filter?'No contacts match this number.':'No signups yet. New registrations will appear here.'}</td></tr>}</tbody></table></div>
        <div className="admin-pagination"><span>Page {page} of {Math.max(1,Math.ceil(data.total/data.pageSize))}</span><div><button className="admin-secondary" disabled={loading||page<=1} onClick={()=>setPage(v=>v-1)}><ArrowLeft size={15}/>Previous</button><button className="admin-secondary" disabled={loading||page*data.pageSize>=data.total} onClick={()=>setPage(v=>v+1)}>Next<ArrowRight size={15}/></button></div></div><p className="admin-note">Newest first · 25 contacts per page · Notification delivery is not connected yet.</p>
      </>}
    </main>
  </div>
}
