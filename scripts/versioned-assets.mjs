import {readdirSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const publicDirectory=new URL('../public/',import.meta.url);
export const imageAssets=readdirSync(publicDirectory).filter(name=>/\.(webp|svg|jpg)$/i.test(name)).map(name=>{
  const source=readFileSync(new URL(name,publicDirectory));
  const hash=createHash('sha256').update(source).digest('hex').slice(0,12);
  return {name,fileName:name.replace(/(\.[^.]+)$/,'.'+hash+'$1'),source};
});
export function versionImageUrls(code){
  for(const {name,fileName} of imageAssets){
    code=code.replaceAll('/'+name,'/'+fileName);
  }
  return code;
}
