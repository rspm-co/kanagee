import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=new URL('../',import.meta.url);
if(existsSync(new URL('src/main.jsx',root))){
  console.log('Building KANAGEE frontend during dependency installation.');
  const npmCli=process.env.npm_execpath;
  if(!npmCli)throw new Error('Run this lifecycle through npm install or npm ci.');
  execFileSync(process.execPath,[npmCli,'run','build'],{cwd:fileURLToPath(root),stdio:'inherit'});
}else if(existsSync(new URL('client/index.html',root))){
  console.log('Packaged frontend already present; no source build needed.');
}else{
  throw new Error('Deployment has neither frontend source nor built client files. Deploy the complete repository or dist package.');
}
