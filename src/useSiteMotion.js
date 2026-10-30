import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function useSiteMotion(path,paused){
 const scope=useRef(null);
 useEffect(()=>{
  if(path==='/admin'||paused)return;
  const root=scope.current;
  const media=gsap.matchMedia();
  const context=gsap.context(()=>{
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    const progress=root.querySelector('.site-scroll-progress');
    if(progress)gsap.fromTo(progress,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.25}});
    gsap.utils.toArray('.heritage-photo, .chairman-portrait, .experience-thali',root).forEach((photo,i)=>{
     gsap.from(photo,{y:38,autoAlpha:0,rotation:i%2?2:-2,clipPath:'inset(6% 0% 6% 0% round 18px)',duration:1.1,ease:'power3.out',scrollTrigger:{trigger:photo,start:'top 92%',once:true},clearProps:'all'});
    });
    gsap.utils.toArray('.about-intro h1, .about-intro p, .chairman-vision-content > h2, .chairman-introduction, .vision-points li, .intent-value, .booking, .faq details, .footer-brand-pair, .footer-organisers',root).forEach(el=>{
     gsap.from(el,{y:22,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'});
    });
    // About page does not use the homepage's reveal timeline.
    if(path==='/about')gsap.utils.toArray('.about-page .reveal',root).forEach(el=>gsap.from(el,{y:25,opacity:0,duration:.8,scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'}));
   });
  },root);
  const floating=root.querySelectorAll('.supplied-thali, .experience-thali img, .heritage-half-plate, .plate-badge, .debut-star, .headline-star');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('motion-visible',entry.isIntersecting)),{rootMargin:'80px'});
  floating.forEach(el=>observer.observe(el));
  const visibility=()=>root.classList.toggle('document-hidden',document.hidden);
  document.addEventListener('visibilitychange',visibility);visibility();
  const refresh=()=>ScrollTrigger.refresh();
  const images=[...root.querySelectorAll('img')];images.forEach(img=>img.addEventListener('load',refresh,{once:true}));
  return()=>{document.removeEventListener('visibilitychange',visibility);root.classList.remove('document-hidden');observer.disconnect();floating.forEach(el=>el.classList.remove('motion-visible'));images.forEach(img=>img.removeEventListener('load',refresh));media.revert();context.revert()};
 },[path,paused]);
 return scope;
}
