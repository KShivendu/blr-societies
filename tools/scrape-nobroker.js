const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com', {
    waitUntil: 'networkidle2',
  });
  let pdf = await page.pdf({ path: 'test.pdf', format: 'a4' });
  console.log('PDF generated');
  console.log(pdf);

  await browser.close();
})();
