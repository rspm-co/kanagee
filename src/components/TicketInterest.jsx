import React, {useEffect, useId, useRef} from 'react';
import {ArrowUpRight, CalendarDays, MapPin, X} from 'lucide-react';
import {event} from '../config/event';
import {createTicketPopupPolicy} from '../data/ticketPopup.js';
import FestivalProgramme from './FestivalProgramme';

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
    <dialog ref={dialog} className="interest-dialog ticket-booking-dialog experience-booking-popup" aria-labelledby={titleId} aria-describedby={descriptionId} onClick={closeOutside}>
      <button type="button" className="interest-close" aria-label="Close popup" onClick={close} autoFocus><X size={20}/></button>
      <span className="eyebrow">PLAN YOUR VISIT</span>
      <h2 id={titleId}>Events to Experience<br/><em>at KANAGEE</em></h2>
      <p id={descriptionId}>Choose your day and join the celebration in Pune.</p>
      <div className="experience-popup-layout">
        <FestivalProgramme/>
        <aside className="experience-popup-booking" aria-label="Book festival tickets">
          <h3>Book your tickets</h3>
          <p><CalendarDays size={16} aria-hidden="true"/><span>{event.dates}<small>{event.dailyHours.replace('–', ' to ')}</small></span></p>
          <p><MapPin size={16} aria-hidden="true"/><span>{event.venue}, {event.city}</span></p>
          <a className="button interest-submit ticket-spark" href={event.bookingUrl}>Book tickets <ArrowUpRight size={18}/></a>
          <small>View ticket options and prices with our official booking partner.</small>
        </aside>
      </div>
    </dialog>
  </>;
}
