import fs from 'node:fs';
const geo=JSON.parse(fs.readFileSync('src/assets/maps/maharashtra.geojson','utf8'));
const polygons=geo.features[0].geometry.coordinates;
const mercator=([lon,lat])=>[lon*Math.PI/180,Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))];
const points=polygons.flat(2).map(mercator);
const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
const bounds=[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];
const scale=Math.min(740/(bounds[2]-bounds[0]),530/(bounds[3]-bounds[1]));
const project=p=>{const [x,y]=mercator(p);return [+(30+(x-bounds[0])*scale).toFixed(2),+(30+(bounds[3]-y)*scale).toFixed(2)]};
function simplify(pts,tolerance=.65){if(pts.length<=2)return pts;const [a,b]=[pts[0],pts.at(-1)];let far=0,index=0;for(let i=1;i<pts.length-1;i++){const p=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));const distance=Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);if(distance>far){far=distance;index=i}}return far>tolerance?[...simplify(pts.slice(0,index+1),tolerance).slice(0,-1),...simplify(pts.slice(index),tolerance)]:[a,b]}
const paths=polygons.map(poly=>poly.map(ring=>{const pts=simplify(ring.map(project));return 'M'+pts.map(p=>p.join(',')).join('L')+'Z'}).join(''));
const cities=[{name:'Pune',nameMr:'पुणे',coordinates:[73.8567,18.5204],event:true},{name:'Mumbai',nameMr:'मुंबई',coordinates:[72.8777,19.076]},{name:'Nagpur',nameMr:'नागपूर',coordinates:[79.0882,21.1458]}].map(c=>({...c,point:project(c.coordinates)}));
fs.writeFileSync('src/data/maharashtraMap.js',`// Mercator-projected, simplified geographic boundary. Generated with scripts/prepare-map.mjs.\n// Source: datta07/INDIAN-SHAPEFILES (MIT). License in src/assets/maps/LICENSE.txt.\nexport const mapPaths=${JSON.stringify(paths)};\nexport const cities=${JSON.stringify(cities)};\nexport const mapViewBox='0 0 800 590';\n`);
