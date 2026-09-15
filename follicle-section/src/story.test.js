import test from 'node:test';
import assert from 'node:assert/strict';
import {pose,chapterAt} from './story.js';
test('every scroll position maps to a chapter and finite geometry',()=>{for(let i=0;i<=1000;i++){const p=i/1000;assert.ok(chapterAt(p)>=0);Object.values(pose(p)).forEach(v=>assert.ok(Number.isFinite(v)))}});
test('reverse scroll produces the same geometry without accumulated state',()=>{const values=Array.from({length:101},(_,i)=>pose(i/100));for(let i=100;i>=0;i--)assert.deepEqual(pose(i/100),values[i])});
test('graft releases, travels and returns to the skin at a 38 degree growth angle',()=>{assert.equal(pose(0).graftY,0);assert.equal(pose(.6).graftY,2.6);assert.equal(pose(.82).graftY,0);assert.ok(Math.abs((Math.PI/2-pose(.82).graftAngle)*180/Math.PI-38)<1)});
test('camera-driving geometry remains continuous throughout scene boundaries',()=>{for(const p of [.15,.35,.5,.65,.82,.95]){const a=pose(p-.00001),b=pose(p+.00001);for(const k of Object.keys(a))assert.ok(Math.abs(a[k]-b[k])<.003,k)}});
