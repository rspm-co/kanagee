import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {ticketLaunchRemaining} from '../config/ticketLaunch';
import {event} from '../config/event';

const storageKey = 'kanagee-ticket-launch-celebrated-2026-11-21-0815';
const colours = ['#e2b54e', '#922420', '#ed7796', '#c77c2f'];
const fireworks = [
  {left: '14%', top: '24%', delay: '.2s'},
  {left: '83%', top: '20%', delay: '1.5s'},
  {left: '24%', top: '58%', delay: '3s'},
  {left: '78%', top: '62%', delay: '4.5s'},
  {left: '50%', top: '16%', delay: '6s'},
];
let celebratedThisVisit = false;

export default function TicketLaunchCelebration() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!event.ticketBookingEnabled || window.location.pathname !== '/') return;
    let expiry;
    function celebrate() {
      if (celebratedThisVisit) return;
      try {
        if (localStorage.getItem(storageKey)) return;
        localStorage.setItem(storageKey, 'true');
      } catch {
        // Browsers that block storage still get one celebration per page visit.
      }
      celebratedThisVisit = true;
      setActive(true);
      expiry = setTimeout(() => setActive(false), 12000);
    }
    let start = setTimeout(celebrate, ticketLaunchRemaining() + 300);
    function onLaunch() {
      clearTimeout(start);
      start = setTimeout(celebrate, 300);
    }
    window.addEventListener('kanagee-ticket-launch-open', onLaunch);
    return () => {
      clearTimeout(start);
      clearTimeout(expiry);
      window.removeEventListener('kanagee-ticket-launch-open', onLaunch);
    };
  }, []);

  if (!active) return null;
  return <><span className="ticket-live-celebration">
    <span className="ticket-live-callout" role="status">Tickets are live!</span>
    <span className="ticket-live-confetti" aria-hidden="true">
      {Array.from({length: 24}, (_, index) => <i key={index} style={{
        '--confetti-x': `${(index * 47) % 320 - 160}px`,
        '--confetti-turn': `${index * 71}deg`,
        '--confetti-delay': `${index % 6 * 0.08}s`,
        '--confetti-colour': colours[index % 4],
      }}/>) }
    </span>
  </span>
    {createPortal(<div className="ticket-launch-party" aria-hidden="true">
      <div className="ticket-launch-lights"/>
      {fireworks.map((burst, index) => <div className="ticket-launch-firework" key={index} style={{left: burst.left, top: burst.top, '--burst-delay': burst.delay, '--burst-colour': colours[index % 4]}}>
        {Array.from({length: 16}, (_, ray) => <i key={ray} style={{'--ray-angle': `${ray * 22.5}deg`}}/>)}
      </div>)}
      <div className="ticket-launch-shower">
        {Array.from({length: 56}, (_, index) => <i key={index} style={{
          left: `${index * 37 % 100}%`,
          '--fall-delay': `${index % 14 * .25}s`,
          '--fall-duration': `${4 + index % 3}s`,
          '--fall-drift': `${index % 2 ? 65 : -65}px`,
          '--fall-turn': `${index * 53}deg`,
          background: colours[index % 4],
        }}/>) }
      </div>
    </div>, document.body)}
  </>;
}
