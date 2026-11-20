import {defineConfig} from 'vite';
import {imageAssets,versionImageUrls} from './scripts/versioned-assets.mjs';
import {ticketLaunchAt} from './src/config/ticketLaunch.js';

export default defineConfig({plugins:[{
  name:'ticket-launch-clock',
  transformIndexHtml:{order:'pre',handler(html){
    const deadline=Date.parse(ticketLaunchAt);
    const script=`<script data-ticket-launch-clock>(function(){var deadline=${deadline};var root=document.documentElement;function update(){root.dataset.ticketLaunch=location.pathname==='/'&&Date.now()<deadline?'pending':'open'}update();if(root.dataset.ticketLaunch==='pending'){var timer=setInterval(function(){update();if(root.dataset.ticketLaunch==='open')clearInterval(timer)},1000);document.addEventListener('visibilitychange',update)}})();</script>`;
    return html.replace('<head>','<head>'+script);
  }},
},{
  name:'version-public-images',
  apply:'build',
  enforce:'pre',
  transform(code,id){
    if(id.replaceAll('\\','/').includes('/src/'))return versionImageUrls(code);
  },
  transformIndexHtml:{order:'pre',handler:versionImageUrls},
  generateBundle(){
    for(const {fileName,source} of imageAssets)this.emitFile({type:'asset',fileName,source});
  }
}]});
