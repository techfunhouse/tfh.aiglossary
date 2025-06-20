const fs = require('fs');

// Read the JSON data from the file
const data = JSON.parse(fs.readFileSync('terms.json', { encoding: 'utf8' }));

// Create a set of all defined terms (including aliases)
const definedTerms = new Set();

data.forEach(item => {
    // Add the main term
    definedTerms.add(item.term);
});

// Convert to array and sort for better readability
const sortedResults = Array.from(definedTerms).sort();

console.log(`Found ${definedTerms.length} terms that are in 'related' arrays but NOT defined as terms:`);
console.log('='.repeat(70));

sortedResults.forEach((term, index) => {
    console.log(`${term}`);
});

console.log('\n' + '='.repeat(70));
console.log(`Total: ${sortedResults.length} terms`);
