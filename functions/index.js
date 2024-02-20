const cheerio = require('cheerio');
const getUrls = require('get-urls');
const fetch = require('node-fetch');

const scrapeMetatags = (text) => {



    const urls = Array.from( getUrls(text) );

    // Define a delay function
    // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const requests = urls.map(async (url, index) => {
        //sdelay does not work on async, consider using proxy when running
        //if (index > 0) {
        //    await delay(2000);
        //}

        console.log('pagescrape', url)

        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);
        
        const getMetatag = (name) =>  
            $(`meta[name=${name}]`).attr('content') ||  
            $(`meta[name="og:${name}"]`).attr('content') ||  
            $(`meta[name="twitter:${name}"]`).attr('content');

        // Extract data

        return { 
            url,
            monthlyRent: $('div.date-cost p:contains("Monthly rent")').text().replace('Monthly rent', '').trim(),
            startingFrom: $('div.date-cost p:contains("Starting from")').text().replace('Starting from', '').trim(),
            until: $('div.date-cost p:contains("Until")').text().replace('Until', '').trim(),
            streetAddress: $('div.adress-region p:contains("Address")').text().replace('Address', '').trim(),
            city: $('div.adress-region p:contains("City")').text().replace('City', '').trim(),
            neighbourhood: $('div.adress-region p:contains("Neighbourhood")').text().replace('Neighbourhood', '').trim(),
            nearby: $('div.adress-region p:contains("Nearby")').text().replace('Nearby', '').trim(),
            //title: $('title').first().text(),
            description: $('div.mate-content h3:contains("Description")').next('p').text().trim(),
            lookingFor: $('div.room-content h3:contains("We are looking for")').next('p').text().trim(),
            weAre: $('div.person-content h3:contains("We are")').next('p').text().trim(),
            description: getMetatag('description'),
        }

    });


    return Promise.all(requests);

}


const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});


exports.scraper = functions.https.onRequest( async (request, response) => {
    cors(request, response, async () => {

        console.log(request.body); 
        //apparently dont need to pasre the json it is coming in as an object already?
        // const body = JSON.parse(request.body);
        //so just
        const body = request.body;
        const data = await scrapeMetatags(body.text);

        response.send(data)

    });
});