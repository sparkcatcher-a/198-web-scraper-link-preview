const fs = require('fs');
const path = require('path');

// Specify the directory containing JSON files
const jsonDirectory = path.join(__dirname, 'JSONinsomniatoMerge');

// Function to read and merge JSON files
const mergeJSONFiles = (directoryPath) => {
  // Read all files in the directory
  const fileNames = fs.readdirSync(directoryPath);

  // Filter JSON files
  const jsonFiles = fileNames.filter((fileName) => path.extname(fileName) === '.json');

  // Initialize an empty array to store merged data
  let mergedData = [];

  // Loop through each JSON file
  jsonFiles.forEach((fileName) => {
    console.log('reading ',fileName)
    const filePath = path.join(directoryPath, fileName);

    // Read the content of the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse the JSON content
    const jsonData = JSON.parse(fileContent);

    // Concatenate the data to the merged array
    mergedData = mergedData.concat(jsonData);
  });

  return mergedData;
};

// Call the function and get the merged data
const mergedData = mergeJSONFiles(jsonDirectory);

// Specify the output file path
const outputPath = path.join(__dirname, 'merged_output.json');

// Write the merged data to the output file
fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));

console.log('Merging completed. Merged data saved to:', outputPath);
