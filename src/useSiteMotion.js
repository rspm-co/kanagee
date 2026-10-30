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
    gsap.utils.toArray('.about-intro h1, .about-intro p, .chairman-vision-content > h2, .chairman-introduction, .intent-value, .booking, .faq details, .footer-brand-pair, .footer-organisers',root).forEach(el=>{
     gsap.from(el,{y:22,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'});
    });
    // Coordinate grids as a sequence rather than revealing every card at once.
    gsap.utils.toArray('.experience-grid, .vision-points',root).forEach(grid=>{
     gsap.from([...grid.children],{y:30,opacity:0,rotationX:6,stagger:.12,duration:.8,ease:'power3.out',scrollTrigger:{trigger:grid,start:'top 88%',once:true},clearProps:'all'});
    });
    gsap.utils.toArray('.section-top',root).forEach(sectionTop=>{
     gsap.from([...sectionTop.children],{x:18,opacity:0,stagger:.12,duration:.65,scrollTrigger:{trigger:sectionTop,start:'top 92%',once:true},clearProps:'all'});
     gsap.fromTo(sectionTop,{'--divider-scale':0},{'--divider-scale':1,ease:'none',scrollTrigger:{trigger:sectionTop,start:'top 94%',end:'top 55%',scrub:.6}});
    });
    const digits=root.querySelector('.digits');
    if(digits)gsap.from([...digits.children],{y:24,opacity:0,rotationX:-35,transformOrigin:'center bottom',stagger:.13,duration:.8,ease:'back.out(1.2)',scrollTrigger:{trigger:digits,start:'top 90%',once:true},clearProps:'all'});
    const ticker=root.querySelector('.ticker-track');
    if(ticker)gsap.fromTo(ticker,{xPercent:0},{xPercent:-25,ease:'none',scrollTrigger:{trigger:'.ticker',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.utils.toArray('.section-translation, .location > h2',root).forEach(el=>gsap.from(el,{x:-16,opacity:0,duration:.75,scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'}));
    // Move the image inside its frame, leaving the section's layout stationary.
    // About page does not use the homepage's reveal timeline.
    if(path==='/about')gsap.utils.toArray('.about-page .reveal',root).forEach(el=>gsap.from(el,{y:25,opacity:0,duration:.8,scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'}));
   });
    media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)',()=>{
     gsap.utils.toArray('.heritage-photo img, .chairman-portrait img',root).forEach(img=>{
      gsap.fromTo(img,{yPercent:-3,scale:1.07},{yPercent:3,scale:1.07,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:1.2}});
     });
     const thali=root.querySelector('.experience-thali img');
     if(thali)gsap.fromTo(thali,{yPercent:5,rotation:-5},{yPercent:-5,rotation:5,ease:'none',scrollTrigger:{trigger:thali.parentElement,start:'top bottom',end:'bottom top',scrub:1.3}});
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
