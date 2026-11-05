import {writeFileSync} from 'node:fs';
import {mapPaths,districtMarkers} from '../src/data/maharashtraMap.js';

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const pins=districtMarkers.map(d=>{
 const [x,y]=d.point,[px,py]=d.labelPoint;
 return `<g><title>${escape(d.name)}</title>${x!==px||y!==py?`<path d="M${x},${y}L${px},${py}" stroke="#bc8c4b" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3" fill="#f7e7a6"/>`:''}${d.event?`<circle cx="${px}" cy="${py}" r="24" fill="#f7e7a644" stroke="#e4b650"/>`:''}<circle cx="${px}" cy="${py}" r="15" fill="${d.event?'#fffdf7':'#f7e7a6'}" stroke="#922420" stroke-width="2"/><text x="${px}" y="${py+6}" text-anchor="middle" fill="#6c1d1a" font-size="17" font-weight="700">${String(d.number).padStart(2,'0')}</text>${d.event?`<text x="${px+28}" y="${py+5}" fill="#f7e7a6" font-size="11" font-weight="700">PUNE · FESTIVAL CITY</text>`:''}</g>`;
}).join('');
const key=districtMarkers.map((d,i)=>{
 const x=i<18?730:950,y=133+(i%18)*30;
 const words=d.name.split(' ');const lines=d.name.length>24?[words[0],words.slice(1).join(' ')]:[d.name];
 return `<g><circle cx="${x}" cy="${y-4}" r="11" fill="#922420"/><text x="${x}" y="${y}" text-anchor="middle" fill="#fffdf7" font-size="10" font-weight="700">${String(d.number).padStart(2,'0')}</text><text x="${x+19}" y="${y}" font-size="12" fill="#422720">${lines.map((line,j)=>`<tspan x="${x+19}" dy="${j?13:0}">${escape(line)}</tspan>`).join('')}</text></g>`;
}).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img" aria-labelledby="title desc"><title id="title">Maharashtra’s 36 districts</title><desc id="desc">Numbered district headquarters, with Pune highlighted as the festival city. A key lists all 36 current district names.</desc><rect x="1" y="1" width="1198" height="758" rx="28" fill="#f7f3e9" stroke="#e8dfd1"/><g font-family="Arial, sans-serif"><text x="36" y="51" font-size="23" font-weight="700" fill="#922420">36 districts, one Maharashtra</text><text x="1140" y="38" font-size="12" text-anchor="middle" fill="#922420">N</text><path d="M1140,78V48M1129,59L1140,48L1151,59" stroke="#922420" stroke-width="2.5" fill="none"/><g transform="translate(30 92) scale(.92)">${mapPaths.map(d=>`<path d="${d}" fill="#922420"/>`).join('')}${pins}</g><text x="718" y="96" font-size="12" font-weight="700" letter-spacing="2" fill="#922420">DISTRICT KEY</text>${key}<path d="M36,701H1164" stroke="#e8dfd1"/><text x="36" y="729" font-size="12" fill="#78675d">MAHARASHTRA / INDIA</text><text x="1164" y="729" text-anchor="end" font-size="12" fill="#78675d">District headquarters marked · Pune is the festival city</text></g></svg>`;
writeFileSync('public/maharashtra-36-districts.svg',svg);
