import React, {useRef, useState} from 'react';
import {Bell, Check, X} from 'lucide-react';
import {saveTicketInterest} from '../data/ticketInterest.js';

const signupEndpoint = import.meta.env.VITE_TICKET_INTEREST_URL?.trim() || '/api/ticket-interest';

export default function TicketInterest(){
  const dialog=useRef(null);
  const [mobile,setMobile]=useState('');
  const [status,setStatus]=useState('idle');
  const [error,setError]=useState('');
  function open(){setMobile('');setStatus('idle');setError('');dialog.current.showModal()}
  function close(){if(status!=='submitting')dialog.current.close()}
  async function submit(e){
    e.preventDefault();
    const digits=mobile.replace(/[\s()-]/g,'').replace(/^\+91/,'').replace(/^91(?=\d{10}$)/,'');
    if(!/^[6-9]\d{9}$/.test(digits)){setError('Please enter a valid 10-digit Indian mobile number.');return}
    setError('');setStatus('submitting');
    try{
      const record={mobile:`+91${digits}`,consent:true,purpose:'ticket-launch',createdAt:new Date().toISOString()};
      await saveTicketInterest(signupEndpoint,record);
      setStatus('success');
    }catch{setError('We could not save your interest. Please try again.');setStatus('idle')}
  }
  return <>
    <button type="button" className="button interest-button" onClick={open}><Bell size={16}/>We are interested</button>
    <dialog ref={dialog} className="interest-dialog" aria-labelledby="interest-title" aria-describedby="interest-description" onCancel={e=>{if(status==='submitting')e.preventDefault()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
      <button type="button" className="interest-close" aria-label="Close popup" onClick={close} disabled={status==='submitting'}><X size={20}/></button>
      <span className="interest-icon" aria-hidden="true">{status==='success'?<Check size={24}/>:<Bell size={24}/>}</span>
      {status==='success'?<div role="status">
        <span className="eyebrow">THANK YOU FOR YOUR INTEREST</span>
        <h2 id="interest-title">You’re on the list!</h2>
        <p id="interest-description">As soon as ticket sales open, we’ll notify you on your mobile number.</p>
        <button type="button" className="button interest-submit" onClick={close} autoFocus>Done</button>
      </div>:<>
        <span className="eyebrow">BE FIRST TO KNOW</span>
        <h2 id="interest-title">A little heads-up.<br/>A lot to look forward to.</h2>
        <p id="interest-description">Leave your mobile number. We’ll let you know as soon as tickets open.</p>
        <form onSubmit={submit}>
          <label htmlFor="interest-mobile">Mobile number</label>
          <div className="interest-phone"><span aria-hidden="true">+91</span><input id="interest-mobile" name="tel" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Enter mobile number" autoFocus required maxLength={18} value={mobile} onChange={e=>{setMobile(e.target.value);setError('')}} aria-invalid={!!error} aria-describedby={error?'interest-error':'interest-consent'} disabled={status==='submitting'}/></div>
          {error&&<p className="interest-error" id="interest-error" role="alert">{error}</p>}
          <p id="interest-consent" className="interest-consent">By selecting “Notify me”, you agree to receive a ticket-opening update from KANAGEE.</p>
          <button type="submit" className="button interest-submit" disabled={status==='submitting'}>{status==='submitting'?'Saving…':'Notify me'}<Bell size={16}/></button>
        </form>
      </>}
    </dialog>
  </>
}
