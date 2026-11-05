import test from 'node:test';
import assert from 'node:assert/strict';
import {districts} from './districts.js';
import {districtMarkers} from './maharashtraMap.js';

test('district map represents every current district exactly once',()=>{
 assert.equal(districtMarkers.length,36);
 assert.deepEqual(districtMarkers.map(marker=>marker.id),districts.map(district=>district.id));
 assert.equal(new Set(districtMarkers.map(marker=>marker.number)).size,36);
 for(const marker of districtMarkers){
  assert.equal(marker.nameMr,districts.find(district=>district.id===marker.id).nameMr);
  for(const point of [marker.point,marker.labelPoint])assert.ok(point.every(Number.isFinite));
  assert.ok(marker.labelPoint[0]>=15&&marker.labelPoint[0]<=685);
  assert.ok(marker.labelPoint[1]>=15&&marker.labelPoint[1]<=575);
 }
});
test('district map keeps both Mumbai districts distinct and highlights only Pune',()=>{
 const city=districtMarkers.find(marker=>marker.id==='mumbai-city');
 const suburban=districtMarkers.find(marker=>marker.id==='mumbai-suburban');
 assert.notDeepEqual(city.point,suburban.point);
 assert.ok(Math.hypot(city.labelPoint[0]-suburban.labelPoint[0],city.labelPoint[1]-suburban.labelPoint[1])>=30);
 assert.deepEqual(districtMarkers.filter(marker=>marker.event).map(marker=>marker.id),['pune']);
});
