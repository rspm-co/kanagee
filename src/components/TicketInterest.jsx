import React, {useEffect, useId, useRef} from 'react';
import {ArrowUpRight, CalendarDays, MapPin, Ticket, X} from 'lucide-react';
import {event} from '../config/event';
import {createTicketPopupPolicy} from '../data/ticketPopup.js';

const popupPolicy = createTicketPopupPolicy();

export default function TicketInterest({label = 'Book tickets', variant = 'default', onOpen, autoOpen = false}) {
  const id = useId();
  const titleId = id + '-title';
  const descriptionId = id + '-description';
  const dialog = useRef(null);
  const bookable = event.ticketBookingEnabled && Boolean(event.bookingUrl);

  useEffect(() => {
    if (!bookable || !autoOpen || !popupPolicy.canAutoOpen(window.location.pathname)) return;
    let timer;
    function prompt() {
      if (!popupPolicy.canAutoOpen(window.location.pathname)) return;
      const typing = document.activeElement?.matches('input,textarea,[contenteditable="true"]');
      const launching = document.documentElement.dataset.ticketLaunch === 'pending';
      const celebrating = document.querySelector('.ticket-live-celebration');
      if (document.hidden || launching || celebrating || document.querySelector('dialog[open]') || typing) {
        timer = setTimeout(prompt, 2500);
        return;
      }
      onOpen?.();
      dialog.current.showModal();
      popupPolicy.markShown();
    }
    timer = setTimeout(prompt, 800);
    return () => clearTimeout(timer);
  }, [autoOpen, bookable]);

  if (!bookable) return null;
  function close() { dialog.current.close(); }
  function closeOutside(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  }

  return <>
    <a href={event.bookingUrl} className={(variant === 'nav' ? 'nav-ticket' : 'button interest-button') + ' ticket-spark'}>
      <span>{label === 'Get ticket updates' ? 'Book tickets' : label}</span><ArrowUpRight size={14}/>
    </a>
    <dialog ref={dialog} className="interest-dialog ticket-booking-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onClick={closeOutside}>
      <button type="button" className="interest-close" aria-label="Close popup" onClick={close} autoFocus><X size={20}/></button>
      <span className="interest-icon" aria-hidden="true"><Ticket size={24}/></span>
      <span className="eyebrow">TICKETS ARE LIVE</span>
      <h2 id={titleId}>Book your KANAGEE tickets</h2>
      <p id={descriptionId}>Discover Maharashtra’s regional flavours, food traditions, and the people behind them. Join us in Pune.</p>
      <div className="popup-event">
        <strong><CalendarDays size={15} aria-hidden="true"/> {event.dates}</strong>
        <span><MapPin size={15} aria-hidden="true"/> {event.venue}, {event.city}</span>
        <small>Open from {event.dailyHours.replace('–', ' to ')}.</small>
      </div>
      <a className="button interest-submit ticket-spark" href={event.bookingUrl}>Book tickets <ArrowUpRight size={18}/></a>
      <p className="ticket-booking-note">Continue to our official booking partner for ticket options and prices.</p>
    </dialog>
  </>;
}
