import { chromium, firefox, webkit } from 'playwright';
const which = process.argv[2] || 'chromium';
const b = await ({chromium,firefox,webkit})[which].launch();
const p = await b.newPage();
await p.goto('file:///' + process.argv[3]);
const h = () => p.evaluate(() => [...document.querySelectorAll('#a .ui-accordion__content')].map(e => Math.round(e.getBoundingClientRect().height)));
console.log(which, 'start', await h());
await p.click('#a details:nth-child(2) summary');
const samples = [];
for (let i = 0; i < 8; i++) { samples.push(await h()); await p.waitForTimeout(30); }
console.log('during swap', JSON.stringify(samples));
await p.waitForTimeout(300);
console.log('end', await h());
await p.screenshot({ path: process.argv[3].replace('.html', `-${which}.png`) });
await b.close();
