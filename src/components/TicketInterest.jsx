import React, {useEffect, useId, useRef, useState} from 'react';
import {ArrowUpRight, Bell, Check, MapPin, X} from 'lucide-react';
import {saveTicketInterest} from '../data/ticketInterest.js';
import {event} from '../config/event';
import {createTicketPopupPolicy} from '../data/ticketPopup.js';

const popupPolicy=createTicketPopupPolicy();
const signupEndpoint = import.meta.env.VITE_TICKET_INTEREST_URL?.trim() || '/api/ticket-interest';

export default function TicketInterest({label='Get ticket updates',variant='default',onOpen,autoOpen=false}){
  const id=useId();
  const titleId=id+'-title',descriptionId=id+'-description',mobileId=id+'-mobile',errorId=id+'-error',consentId=id+'-consent',dialogId=id+'-dialog';
  const dialog=useRef(null);
  const [mobile,setMobile]=useState('');
  const [status,setStatus]=useState('idle');
  const [error,setError]=useState('');
  function open(){if(dialog.current.open)return;setMobile('');setStatus('idle');setError('');onOpen?.();dialog.current.showModal();popupPolicy.markShown();}
  useEffect(()=>{
    if(!autoOpen||!popupPolicy.canAutoOpen(window.location.pathname))return;
    let timer;
    function prompt(){
      if(!popupPolicy.canAutoOpen(window.location.pathname))return;
      const typing=document.activeElement?.matches('input,textarea,[contenteditable="true"]');
      if(document.hidden||document.querySelector('dialog[open]')||typing){timer=setTimeout(prompt,2500);return}
      open();
    }
    timer=setTimeout(prompt,800);
    return()=>clearTimeout(timer);
  },[autoOpen]);
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
    }catch{setError('We could not save your mobile number. Please try again.');setStatus('idle')}
  }
  return <>
    <button type="button" className={(variant==='nav'?'nav-ticket':'button interest-button')+' ticket-spark'} onClick={open} aria-haspopup="dialog" aria-controls={dialogId}>{variant!=='nav'&&<Bell size={16}/>}<span>{label}</span>{variant==='nav'&&<ArrowUpRight size={14}/>}</button>
    <dialog ref={dialog} id={dialogId} className="interest-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={e=>{if(status==='submitting')e.preventDefault()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
      <button type="button" className="interest-close" aria-label="Close popup" onClick={close} disabled={status==='submitting'} autoFocus><X size={20}/></button>
      <span className="interest-icon" aria-hidden="true">{status==='success'?<Check size={24}/>:<Bell size={24}/>}</span>
      {status==='success'?<div role="status">
        <span className="eyebrow">THANK YOU FOR YOUR INTEREST</span>
        <h2 id={titleId}>You’re on the list!</h2>
        <p id={descriptionId}>We’ll notify you about ticket availability at the mobile number you provided.</p>
        <button type="button" className="button interest-submit" onClick={close} autoFocus>Done</button>
      </div>:<>
        <span className="eyebrow">{event.bookingUrl?'YOUR TICKET TO KANAGEE':'KANAGEE TICKET UPDATES'}</span>
        <h2 id={titleId}>Plan your visit to KANAGEE</h2>
        <p id={descriptionId}>Book tickets through the Ladachi Kulfi mobile app or leave your mobile number for ticket updates.</p>
        <div className="popup-event"><strong>{event.name} · {event.dates}</strong><span><MapPin size={13}/>{event.venue}, {event.city}</span>{event.bookingUrl?<a href={event.bookingUrl} className="text-link">Book tickets <ArrowUpRight size={14}/></a>:<small>Open from {event.dailyHours.replace('–',' to ')}.</small>}</div>
        <div className="popup-stall"><div><strong>Share your regional speciality</strong><span>Apply for a food stall at KANAGEE.</span></div><a className="nav-ticket ticket-spark register-button" href="/register/"><span>Stall booking</span><ArrowUpRight size={17} aria-hidden="true"/></a></div>
        <form onSubmit={submit}>
          <label htmlFor={mobileId}>Mobile number</label>
          <div className="interest-phone"><span aria-hidden="true">+91</span><input id={mobileId} name="tel" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Enter your mobile number" required maxLength={18} value={mobile} onChange={e=>{setMobile(e.target.value);setError('')}} aria-invalid={!!error} aria-describedby={error?errorId:consentId} disabled={status==='submitting'}/></div>
          {error&&<p className="interest-error" id={errorId} role="alert">{error}</p>}
          <p id={consentId} className="interest-consent">By selecting “Notify me”, you agree to receive a ticket-availability update from KANAGEE.</p>
          <button type="submit" className="button interest-submit" disabled={status==='submitting'}>{status==='submitting'?'Saving…':'Notify me'}<Bell size={16}/></button>
        </form>
      </>}
    </dialog>
  </>
}
