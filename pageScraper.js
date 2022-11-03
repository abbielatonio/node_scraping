const scraperObject = {
  url: "https://www.deped.gov.ph/category/procurement/notices-of-award/",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);
    let scrapedData = [];

    // Wait for the required DOM to be rendered
    await page.waitForSelector("#content .post-box");
    // Get the link to all the required projects
    let urls = await page.$$eval(".entry-title", (links) => {
      links = links.map((el) => el.querySelector("a").href);
      return links;
    });
    // console.log(urls);
    // }
    //}

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = (link) =>
      new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        dataObj["projName"] = await newPage.$eval(
          "table tr:nth-child(2)",
          (text) => text.textContent
        );
        dataObj["projAbc"] = await newPage.$eval(
          "table tr:nth-child(3)",
          (text) => text.textContent
        );

        resolve(dataObj);
        await newPage.close();
      });

    for (link in urls) {
      let currentPageData = await pagePromise(urls[link]);
      scrapedData.push(currentPageData);
      console.log(currentPageData);
    }
    await page.close();
    return scrapedData;
  },
};
module.exports = scraperObject;
