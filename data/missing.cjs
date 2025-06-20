const fs = require('fs');

// Read the JSON data from the file
const data = JSON.parse(fs.readFileSync('terms.json', { encoding: 'utf8' }));

// Create a set of all defined terms (including aliases)
const definedTerms = new Set();

data.forEach(item => {
    // Add the main term
    definedTerms.add(item.term);
});

// Find terms that appear in "related" arrays but are NOT defined
const relatedButNotDefined = new Set();

data.forEach(item => {
    if (item.related) {
        item.related.forEach(relatedTerm => {
            if (!definedTerms.has(relatedTerm)) {
                relatedButNotDefined.add(relatedTerm);
            }
        });
    }
});

// Convert to array and sort for better readability
const sortedResults = Array.from(relatedButNotDefined).sort();

console.log(`Found ${sortedResults.length} terms that are in 'related' arrays but NOT defined as terms:`);
console.log('='.repeat(70));

sortedResults.forEach((term, index) => {
    console.log(`${term}`);
});

console.log('\n' + '='.repeat(70));
console.log(`Total: ${sortedResults.length} terms`);
