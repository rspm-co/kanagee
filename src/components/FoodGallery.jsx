import React,{useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Expand,X} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {galleryFilters,galleryPhotos} from '../data/gallery';

export default function FoodGallery({paused=false}){
 const [filter,setFilter]=useState('All');const [selected,setSelected]=useState(null);
 const dialog=useRef(null);const grid=useRef(null);
 const photos=galleryPhotos.filter(photo=>filter==='All'||photo.tags.includes(filter));
 const current=galleryPhotos.find(photo=>photo.id===selected);
 const position=photos.findIndex(photo=>photo.id===selected);
 useEffect(()=>{
  const media=gsap.matchMedia();
  if(!paused)media.add('(prefers-reduced-motion: no-preference)',()=>gsap.fromTo(grid.current.children,{opacity:0,y:22},{opacity:1,y:0,stagger:.09,duration:.55,ease:'power2.out',scrollTrigger:{trigger:grid.current,start:'top 92%',once:true},clearProps:'all'}));
  ScrollTrigger.refresh();return()=>media.revert();
 },[filter,paused]);
 function open(photo){setSelected(photo.id);dialog.current.showModal()}
 function step(direction){const next=(position+direction+photos.length)%photos.length;setSelected(photos[next].id)}
 return <section className="food-gallery section" id="gallery" aria-labelledby="gallery-title">
  <div className="section-top"><span className="eyebrow">A FEAST FOR YOUR EYES</span><span lang="mr">आधी नजरेने, मग चवीने.</span></div>
  <div className="gallery-intro"><div><h2 id="gallery-title" className="marathi-title">What are you craving?</h2><p>Big flavours. Beautiful plates. A little taste of Maharashtra.</p></div><span className="gallery-photo-note">FOOD GALLERY</span></div>
  <div className="gallery-filters" role="group" aria-label="Filter food photos">{galleryFilters.map(label=><button key={label} type="button" aria-pressed={filter===label} onClick={()=>setFilter(label)}>{label}<span>{label==='All'?galleryPhotos.length:galleryPhotos.filter(photo=>photo.tags.includes(label)).length}</span></button>)}</div>
  <p className="gallery-count" role="status" aria-live="polite">{photos.length} photos · Select a plate to take a closer look.</p>
  <div className="food-gallery-grid" ref={grid}>{photos.map(photo=><button type="button" className="food-gallery-card" key={photo.id} onClick={()=>open(photo)} aria-label={'View '+photo.title+' photo'}>
    <span className={'gallery-food-image '+(photo.cutout?'gallery-cutout':'')}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"/><span className="gallery-expand" aria-hidden="true"><Expand size={17}/></span><span className="gallery-food-tag">{photo.tags.join(' · ')}</span></span>
    <span className="gallery-food-caption"><span className="gallery-food-mr" lang="mr">{photo.mr}</span><span className="gallery-food-title">{photo.title}</span><span className="gallery-food-description">{photo.description}</span></span>
  </button>)}</div>
  <p className="gallery-disclaimer">Food inspiration from our collection. Festival menu and participating kitchens will be announced.</p>
  <dialog ref={dialog} className="gallery-dialog" aria-labelledby="gallery-viewer-title" onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.current.close()}}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}}}>
    <div className="gallery-viewer-header"><div><span className="eyebrow">KANAGEE FOOD GALLERY</span><h2 id="gallery-viewer-title">{current?.title||'Food photo'}</h2></div><button className="gallery-close" type="button" onClick={()=>dialog.current.close()} aria-label="Close photo viewer" autoFocus><X size={22}/></button></div>
    {current&&<img className="gallery-viewer-image" src={current.src} alt={current.alt} width={current.width} height={current.height}/>}
    <div className="gallery-viewer-footer"><button className="gallery-viewer-arrow" type="button" onClick={()=>step(-1)} aria-label="Previous photo"><ArrowLeft size={19}/></button><div aria-live="polite"><span>{position+1} / {photos.length}</span><p>{current?.description}</p></div><button className="gallery-viewer-arrow" type="button" onClick={()=>step(1)} aria-label="Next photo"><ArrowRight size={19}/></button></div>
  </dialog>
 </section>
}
