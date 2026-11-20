import React, {useEffect, useState} from 'react';
import {ticketLaunchRemaining, ticketLaunchLabel} from '../config/ticketLaunch';

export default function TicketLaunchGate({children}) {
  const [remaining, setRemaining] = useState(() => ticketLaunchRemaining());

  useEffect(() => {
    function update() {
      const next = ticketLaunchRemaining();
      setRemaining(next);
      if (next === 0) {
        document.documentElement.dataset.ticketLaunch = 'open';
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('kanagee-ticket-launch-open'));
        clearInterval(timer);
      }
    }
    const timer = setInterval(update, 1000);
    const refresh = () => update();
    document.addEventListener('visibilitychange', refresh);
    update();
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const seconds = Math.ceil(remaining / 1000);
  const units = [
    [Math.floor(seconds / 86400), 'Days'],
    [Math.floor(seconds / 3600) % 24, 'Hours'],
    [Math.floor(seconds / 60) % 60, 'Minutes'],
    [seconds % 60, 'Seconds'],
  ];

  return <>
    <section className="ticket-launch-screen" aria-labelledby="ticket-launch-title">
      <img src="/kanagee-logo-transparent-256w.webp" width="256" height="277" alt="KANAGEE"/>
      <p className="eyebrow">MAHARASHTRA’S BIGGEST FOOD FESTIVAL</p>
      <h2 id="ticket-launch-title">Ticket bookings<br/><em>go live soon</em></h2>
      <p className="ticket-launch-date">{ticketLaunchLabel}</p>
      <div className="ticket-launch-timer" role="timer" aria-label="Time until ticket bookings open" aria-live="off">
        {units.map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}
      </div>
      <p>The website will open automatically when the countdown ends.</p>
    </section>
    <div className="ticket-launch-content">{children}</div>
  </>;
}
