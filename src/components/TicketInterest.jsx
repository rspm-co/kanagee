import React, {useEffect, useId, useRef, useState} from 'react';
import {ArrowUpRight, Bell, Check, MapPin, X} from 'lucide-react';
import {saveTicketInterest} from '../data/ticketInterest.js';
import {event} from '../config/event';

let popupShownThisVisit=false;
const popupSessionKey='kanagee-ticket-popup-shown';
const signupEndpoint = import.meta.env.VITE_TICKET_INTEREST_URL?.trim() || '/api/ticket-interest';

export default function TicketInterest({label='We are interested',variant='default',onOpen,autoOpen=false}){
  const id=useId();
  const titleId=id+'-title',descriptionId=id+'-description',mobileId=id+'-mobile',errorId=id+'-error',consentId=id+'-consent',dialogId=id+'-dialog';
  const dialog=useRef(null);
  const [mobile,setMobile]=useState('');
  const [status,setStatus]=useState('idle');
  const [error,setError]=useState('');
  function open(){if(dialog.current.open)return;setMobile('');setStatus('idle');setError('');onOpen?.();dialog.current.showModal();popupShownThisVisit=true;try{sessionStorage.setItem(popupSessionKey,'true')}catch{}}
  useEffect(()=>{
    if(!autoOpen)return;
    let timer;
    function prompt(){
      if(popupShownThisVisit)return;
      try{if(sessionStorage.getItem(popupSessionKey)==='true')return}catch{}
      const typing=document.activeElement?.matches('input,textarea,[contenteditable="true"]');
      if(document.hidden||document.querySelector('dialog[open]')||typing){timer=setTimeout(prompt,2500);return}
      open();
    }
    timer=setTimeout(prompt,10000);
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
    }catch{setError('We could not save your interest. Please try again.');setStatus('idle')}
  }
  return <>
    <button type="button" className={(variant==='nav'?'nav-ticket':'button interest-button')+' ticket-spark'} onClick={open} aria-haspopup="dialog" aria-controls={dialogId}>{variant!=='nav'&&<Bell size={16}/>}<span>{label}</span>{variant==='nav'&&<ArrowUpRight size={14}/>}</button>
    <dialog ref={dialog} id={dialogId} className="interest-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={e=>{if(status==='submitting')e.preventDefault()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
      <button type="button" className="interest-close" aria-label="Close popup" onClick={close} disabled={status==='submitting'}><X size={20}/></button>
      <span className="interest-icon" aria-hidden="true">{status==='success'?<Check size={24}/>:<Bell size={24}/>}</span>
      {status==='success'?<div role="status">
        <span className="eyebrow">THANK YOU FOR YOUR INTEREST</span>
        <h2 id={titleId}>You’re on the list!</h2>
        <p id={descriptionId}>As soon as ticket sales open, we’ll notify you on your mobile number.</p>
        <button type="button" className="button interest-submit" onClick={close} autoFocus>Done</button>
      </div>:<>
        <span className="eyebrow">{event.bookingUrl?'YOUR TICKET TO KANAGEE':'TICKETS OPENING SOON'}</span>
        <h2 id={titleId}>Your next delicious plan.</h2>
        <p id={descriptionId}>Leave your mobile number. We’ll let you know as soon as tickets open.</p>
        <div className="popup-event"><strong>{event.name} · {event.dates}</strong><span><MapPin size={13}/>{event.venue}, {event.city}</span>{event.bookingUrl?<a href={event.bookingUrl} className="text-link">Book tickets <ArrowUpRight size={14}/></a>:<small>Ticket prices and daily opening times to be announced.</small>}</div>
        <form onSubmit={submit}>
          <label htmlFor={mobileId}>Mobile number</label>
          <div className="interest-phone"><span aria-hidden="true">+91</span><input id={mobileId} name="tel" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Enter mobile number" autoFocus required maxLength={18} value={mobile} onChange={e=>{setMobile(e.target.value);setError('')}} aria-invalid={!!error} aria-describedby={error?errorId:consentId} disabled={status==='submitting'}/></div>
          {error&&<p className="interest-error" id={errorId} role="alert">{error}</p>}
          <p id={consentId} className="interest-consent">By selecting “Notify me”, you agree to receive a ticket-opening update from KANAGEE.</p>
          <button type="submit" className="button interest-submit" disabled={status==='submitting'}>{status==='submitting'?'Saving…':'Notify me'}<Bell size={16}/></button>
        </form>
      </>}
    </dialog>
  </>
}
