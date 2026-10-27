import {mkdir,copyFile} from 'node:fs/promises';
// Package the PHP endpoint with the frontend for PHP-enabled hosting.
await mkdir(new URL('../dist/api/',import.meta.url),{recursive:true});
await copyFile(new URL('../server/ticket-interest.php',import.meta.url),new URL('../dist/api/ticket-interest.php',import.meta.url));
console.log('Deployment prepared: dist/ includes the frontend and PHP signup endpoint.');
