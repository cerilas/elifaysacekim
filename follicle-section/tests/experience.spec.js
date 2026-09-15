import {test,expect} from '@playwright/test';
test('all chapters, backward scroll, resize, and WebGL loading',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await expect(page.locator('canvas')).toBeVisible();
 for(const [p,label] of [[.08,'Beginning'],[.25,'Selection'],[.42,'Extraction'],[.57,'Journey'],[.73,'Placement'],[.89,'Growth'],[.99,'Result'],[.25,'Selection'],[.08,'Beginning']]){
  await page.evaluate(p=>scrollTo(0,innerHeight*4*p),p);await expect(page.locator('[aria-current="step"]')).toContainText(label);await page.waitForTimeout(850);
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await expect(page.locator('[aria-current="step"]')).toContainText('Beginning');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Skip to result'}).click();await expect(page.locator('[aria-current="step"]')).toContainText('Result');await expect(page.getByRole('link',{name:'Get Your Hair Analysis'})).toBeVisible();expect(errors).toEqual([]);
});
test('reduced motion shows a static result and permits chapter selection',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('[aria-current="step"]')).toContainText('Result');await page.getByRole('button',{name:'Chapter 2: The donor area',exact:true}).click();await expect(page.locator('[aria-current="step"]')).toContainText('Selection');await expect(page.getByRole('heading',{name:'Healthy graft selection'})).toBeVisible();expect(await page.locator('.pin-spacer').count()).toBe(0)});
