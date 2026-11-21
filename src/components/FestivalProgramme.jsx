import React from 'react';
import {festivalProgramme} from '../data/festivalProgramme';

export default function FestivalProgramme() {
  return <ol className="festival-programme" aria-label="KANAGEE events by day">
    {festivalProgramme.map(item => <li key={item.date}>
      <time dateTime={item.date}><strong>{item.day}</strong><span>{item.month}</span></time>
      <div className="festival-programme-details" lang={item.language}>
        <h3>{item.title}</h3>
        <p className="festival-programme-artist">{item.artist}</p>
        {item.subtitle && <p className="festival-programme-subtitle">{item.subtitle}</p>}
        {item.additional && <p className="festival-programme-additional">{item.additional}</p>}
      </div>
    </li>)}
  </ol>;
}
