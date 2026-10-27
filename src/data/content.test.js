import test from 'node:test';
import assert from 'node:assert/strict';
import {districts,verifiedDish} from './districts.js';
import {eventState,event} from '../config/event.js';
test('36 unique districts, with Mumbai districts separate',()=>{assert.equal(districts.length,36);assert.equal(new Set(districts.map(d=>d.id)).size,36);assert.ok(districts.find(d=>d.name==='Mumbai City'));assert.ok(districts.find(d=>d.name==='Mumbai Suburban'))});
test('unverified dishes cannot be presented as verified',()=>{assert.equal(verifiedDish({dishName:'Unverified',verificationStatus:'pending'}),'Regional specialty to be announced.')});
test('countdown observes IST festival date boundaries',()=>{assert.equal(eventState(Date.parse(event.startDate)-1).status,'upcoming');assert.equal(eventState(Date.parse(event.startDate)).status,'live');assert.equal(eventState(Date.parse(event.endDate)-1).status,'live');assert.equal(eventState(Date.parse(event.endDate)).status,'ended');assert.equal(eventState(Date.parse(event.endDate)).remaining,0)});
