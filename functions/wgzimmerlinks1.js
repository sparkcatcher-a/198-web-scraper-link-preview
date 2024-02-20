const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Specify the path to your local HTML file
const htmlFilePath = path.join(__dirname, 'manualsave.html');
//console.log(htmlFilePath);

// Function to extract links from HTML
const extractLinks = (html) => {
    const $ = cheerio.load(html);

   // Select all anchor tags within li elements with specific classes and ul with specific ID
   const links = $('ul#search-result-list li.search-result-entry a').map((_, element) => {
    const href = $(element).attr('href');
    return href;
}).get();
    return links;
};

// Read the HTML file
fs.readFile(htmlFilePath, (err, data) => {
    if (err) {
        console.error('Error reading HTML file:', err);
        return;
    }
    //console.log('File Content:', data);
    // Extract links from the HTML content
    const links = extractLinks(data);

    // Output the links
    console.log('output');
    console.log(links);
});

