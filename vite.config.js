import {defineConfig} from 'vite';
import {imageAssets,versionImageUrls} from './scripts/versioned-assets.mjs';

export default defineConfig({plugins:[{
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
