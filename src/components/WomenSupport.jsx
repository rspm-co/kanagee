import React from 'react';
import {Store,TrendingUp,ArrowUpRight} from 'lucide-react';

export default function WomenSupport(){
  return <div className="women-art women-support">
    <span className="eyebrow">HER SKILL. HER OPPORTUNITY.</span>
    <div className="woven" lang="mr">परंपरेतून<br/>स्वावलंबनाकडे.</div>
    <div className="women-support-grid">
      <div className="women-support-card"><Store size={22} aria-hidden="true"/><span className="women-support-amount">₹0</span><strong lang="mr">स्टॉल भाडे</strong><span>No stall rent</span></div>
      <div className="women-support-card"><TrendingUp className="women-support-growth" size={54} strokeWidth={1.5} aria-hidden="true"/><strong lang="mr">आर्थिक बळ</strong><span>A platform to grow<br/>your food business</span></div>
    </div>
    <p className="women-support-note" lang="mr">स्टॉलचं भाडं नाही. टेबल, वीज व हाऊसकीपिंगचे शुल्क लागू असतील; शुल्काची माहिती लवकरच कळवली जाईल.</p>
    <a className="women-support-link" href="/register/">Stall booking<ArrowUpRight size={17} aria-hidden="true"/></a>
  </div>;
}
