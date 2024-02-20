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

    const domain = 'https://www.wgzimmer.ch';
    const fullLinks = links.map((relativeLink) => {
        const normalizedRelativeLink = relativeLink.startsWith('/') ? relativeLink : `/${relativeLink}`;
        return `${domain}${normalizedRelativeLink}`;
    });

    // Output the modified links with the domain
    console.log('\nModified Links with Domain:');
    console.log(fullLinks);

    // Format the data for Insomnia
    const concatenatedLinks = fullLinks.join(' and ');
    const jsonReady = { text: concatenatedLinks };

    // Convert the array to JSON
    const jsonData = JSON.stringify(jsonReady, null, 2);

    // Specify the path to the output JSON file
    const outputFilePath = path.join(__dirname, 'modifiedLinks.json');

    // Write the JSON data to the file
    fs.writeFile(outputFilePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return;
        }
        console.log(`JSON file written successfully at: ${outputFilePath}`);
    });

});

