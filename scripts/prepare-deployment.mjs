import {mkdir,copyFile} from 'node:fs/promises';
await mkdir(new URL('../dist/server/',import.meta.url),{recursive:true});
for(const file of ['server.js','server/app.js','package.json','package-lock.json']){
  await copyFile(new URL('../'+file,import.meta.url),new URL('../dist/'+file,import.meta.url));
}
console.log('Deployment prepared: dist/ includes the frontend and Node.js server.');
