import fs from 'fs';
import colors from 'colors/safe.js';
import * as cheerio from 'cheerio';
import axios from 'axios';

const linkToScrape = "https://www.formula1.com/en/drivers.html";

async function getFormulaOneData() {
    try {
        console.log(colors.cyan("Welcome In My Small Web Scrapping Tool"));
        console.log(colors.cyan(`We'll Scrape ${linkToScrape}, Just for Testing Purpose`));
        console.log(colors.green('* -- Starting The Script Now, Please Wait ...'));
        console.log(colors.yellow('-----------------------------------------------'));

        const response = await axios.get(linkToScrape);
        const body = await response.data;

        const $ = cheerio.load(body);

        const drivers = [];

        $('.listing-items--wrapper > .row > .col-12').map((index, element) => {
            let instanceInfo = {
                id: index,
                points: $(element).find('.f1-wide--s').text().trim(),
                firstName: $(element).find(".listing-item--name span:first").text().trim(),
                lastName: $(element).find(".listing-item--name span:last").text().trim(),
                country: $(element).find(".coutnry-flag--photo img").attr('data-src').split("flags/")[1].split(".jpg")[0],
                team: $(element).find('.listing-item--team').text().trim(),
                photo: $(element).find('.listing-item--photo img').attr('data-src'),
                number: $(element).find('.listing-item--number img').attr('data-src')
            }

            drivers.push(instanceInfo);
        });

        fs.writeFileSync('drivers.json', JSON.stringify(drivers), { encoding: 'utf-8' });

        console.log(colors.green('* -- Data Extracted Successfully on Drivers.json File...'));
        console.log(colors.yellow('---------------------------------------------------------'));
    } catch (error) {
        console.log(colors.underline.red(error));
    }
}

getFormulaOneData();
