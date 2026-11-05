import React,{useState} from 'react';
import {mapPaths,districtMarkers,mapViewBox} from '../data/maharashtraMap';
import {ArrowUpRight} from 'lucide-react';

export default function MaharashtraMap(){
 const [selectedId,setSelectedId]=useState('pune');
 const [hoveredId,setHoveredId]=useState(null);
 const [focusedId,setFocusedId]=useState(null);
 const selected=districtMarkers.find(district=>district.id===selectedId);
 const preview=districtMarkers.find(district=>district.id===(hoveredId||focusedId));
 return <section id="districts" className="maharashtra-section section">
  <div className="section-top"><span className="eyebrow">01 / THE SOUL OF MAHARASHTRA</span><span lang="mr">आपली माती. आपली माणसं.</span></div>
  <div className="geography-layout"><div className="geography-copy reveal"><span className="eyebrow">MANY FLAVOURS, ONE HOME</span><h2 lang="mr">माती वेगळी,<br/>चव वेगळी,<br/><em>महाराष्ट्र एकच!</em></h2><p>From the Konkan coast to Vidarbha, discover the recipes and regional flavours that bring Maharashtra together.</p><p lang="mr">३६ जिल्हे, ३६ चवी, एक महाराष्ट्र!</p><a className="text-link" href="#heritage">DISCOVER OUR FOOD HERITAGE <ArrowUpRight size={16}/></a></div>
   <div className="geographic-map district-map">
    <div className="district-map-heading"><span className="eyebrow">36 DISTRICTS · ONE MAHARASHTRA</span><span className="map-compass" aria-hidden="true"><span>N</span>↑</span></div>
    <div className="district-map-visual">
    <svg viewBox={mapViewBox} role="group" aria-labelledby="maharashtra-map-title maharashtra-map-description">
     <title id="maharashtra-map-title">All 36 districts of Maharashtra</title>
     <desc id="maharashtra-map-description">Numbered markers show all 36 district headquarters. Hover, focus, or tap a pin to see its district name. Pune is highlighted as the festival city. Mumbai City and Mumbai Suburban have separate markers.</desc>
     <defs><pattern id="map-texture" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".65" fill="#f7e8ab" opacity=".25"/></pattern></defs>
     <g className="state-geography">{mapPaths.map((d,i)=><path key={i} className="state-land" d={d}/>)}{mapPaths.map((d,i)=><path key={i} className="state-grain" d={d} fill="url(#map-texture)"/>)}{mapPaths.map((d,i)=><path key={i} className="state-border" d={d}/>)}</g>
     {districtMarkers.map(district=>{
      const [x,y]=district.point,[labelX,labelY]=district.labelPoint;
      const active=district.id===selectedId;
      return <g key={district.id} className={'district-marker'+(district.event?' festival-district':'')+(active?' is-selected':'')} role="button" tabIndex={0} aria-label={String(district.number).padStart(2,'0')+'. '+district.name+' — '+district.nameMr} aria-pressed={active} aria-describedby={preview?.id===district.id?'district-pin-tooltip':undefined} onMouseEnter={()=>setHoveredId(district.id)} onMouseLeave={()=>setHoveredId(null)} onFocus={()=>setFocusedId(district.id)} onBlur={()=>setFocusedId(null)} onClick={()=>{setSelectedId(district.id);setHoveredId(district.id)}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelectedId(district.id)}if(e.key==='Escape'){setHoveredId(null);setFocusedId(null)}}}>
       <circle className="district-hit-area" cx={labelX} cy={labelY} r="20"/>
       {(x!==labelX||y!==labelY)&&<><line className="district-leader" x1={x} y1={y} x2={labelX} y2={labelY}/><circle className="district-location" cx={x} cy={y} r="3"/></>}
       {district.event&&<circle className="city-halo" cx={labelX} cy={labelY} r="24"/>}
       <circle className="district-pin" cx={labelX} cy={labelY} r="15"/>
       <text className="district-number" x={labelX} y={labelY}>{String(district.number).padStart(2,'0')}</text>
       {district.event&&<text className="district-pune-label" x={labelX+28} y={labelY+5}>पुणे <tspan>· FESTIVAL CITY</tspan></text>}
      </g>;
     })}
    </svg>
    {preview&&<div id="district-pin-tooltip" className={'district-pin-tooltip'+(preview.labelPoint[1]<120?' district-pin-tooltip--below':'')} role="tooltip" style={{left:`clamp(110px, ${preview.labelPoint[0]/700*100}%, calc(100% - 110px))`,top:preview.labelPoint[1]/590*100+'%'}}><strong>{String(preview.number).padStart(2,'0')} · {preview.name}</strong><span lang="mr">{preview.nameMr}</span>{preview.event&&<small>Festival city</small>}</div>}
    </div>
    <div className="district-selection" aria-live="polite"><strong>{String(selected.number).padStart(2,'0')} · {selected.name}</strong><span lang="mr">{selected.nameMr}</span>{selected.event&&<small>Festival city</small>}</div>
    <details className="district-map-key"><summary>View all 36 district names <span aria-hidden="true">+</span></summary><ol aria-label="District map key">{districtMarkers.map(district=><li key={district.id}><button type="button" onClick={()=>setSelectedId(district.id)} aria-pressed={district.id===selectedId}><span className="district-key-number">{String(district.number).padStart(2,'0')}</span><span>{district.name}<small lang="mr">{district.nameMr}</small></span></button></li>)}</ol></details>
    <div className="geography-caption"><span>MAHARASHTRA / INDIA</span><span lang="mr">अस्सल चवींचा प्रवास</span></div>
   </div>
  </div>
 </section>;
}
