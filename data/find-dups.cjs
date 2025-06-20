const fs = require('fs');
const path = require('path');

class TermsDuplicateFinder {
    constructor() {
        this.terms = [];
        this.duplicateGroups = [];
        this.toRemove = [];
    }

    /**
     * Load terms from JSON files
     * @param {string[]} filePaths - Array of JSON file paths
     */
    loadTermsFromFiles(filePaths) {
        this.terms = [];
        
        filePaths.forEach(filePath => {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const termsData = JSON.parse(data);
                
                // Find line numbers for each term in the original file
                const lines = data.split('\n');
                const termLineNumbers = this.findTermLineNumbers(lines, termsData);
                
                // Add file source info and line numbers to each term
                termsData.forEach((term, index) => {
                    term._source = path.basename(filePath);
                    term._sourcePath = filePath;
                    term._lineNumber = termLineNumbers[index];
                    term._arrayIndex = index;
                });
                
                this.terms.push(...termsData);
                console.log(`✓ Loaded ${termsData.length} terms from ${filePath}`);
            } catch (error) {
                console.error(`✗ Error loading ${filePath}:`, error.message);
            }
        });
        
        console.log(`\n📊 Total terms loaded: ${this.terms.length}\n`);
    }

    /**
     * Find line numbers where each term starts in the JSON file
     * @param {string[]} lines - Array of file lines
     * @param {Object[]} terms - Array of term objects
     * @returns {number[]} Array of line numbers
     */
    findTermLineNumbers(lines, terms) {
        const lineNumbers = [];
        
        // Find all opening braces that start new objects in the array
        const objectStartLines = [];
        let braceDepth = 0;
        let inArray = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Track when we enter the main array
            if (line === '[' || line.startsWith('[')) {
                inArray = true;
                continue;
            }
            
            // Track when we exit the main array
            if (line === ']' || line.endsWith(']')) {
                inArray = false;
                continue;
            }
            
            if (inArray) {
                // Count opening and closing braces
                const openBraces = (line.match(/\{/g) || []).length;
                const closeBraces = (line.match(/\}/g) || []).length;
                
                // If we're at depth 0 and find an opening brace, it's a new object
                if (braceDepth === 0 && openBraces > 0) {
                    objectStartLines.push(i + 1); // Convert to 1-based line numbering
                }
                
                braceDepth += openBraces - closeBraces;
            }
        }
        
        // Match the number of terms with object start lines
        // If counts don't match, fall back to a simpler approach
        if (objectStartLines.length === terms.length) {
            return objectStartLines;
        } else {
            // Fallback: try to find each term by its "term" field
            console.warn(`⚠️  Object count mismatch. Using fallback method for line detection.`);
            
            terms.forEach((term, index) => {
                // Look for the exact term name in quotes
                const escapedTerm = term.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const termPattern = new RegExp(`"term"\\s*:\\s*"${escapedTerm}"`);
                
                let foundLine = -1;
                for (let i = 0; i < lines.length; i++) {
                    if (termPattern.test(lines[i])) {
                        // Look backwards for the nearest opening brace
                        for (let j = i; j >= Math.max(0, i - 10); j--) {
                            if (lines[j].trim() === '{' || lines[j].trim().startsWith('{')) {
                                foundLine = j + 1;
                                break;
                            }
                        }
                        break;
                    }
                }
                lineNumbers.push(foundLine > 0 ? foundLine : (index + 2)); // Rough estimate if not found
            });
            
            return lineNumbers;
        }
    }

    /**
     * Load terms from a single JSON array (for testing)
     * @param {Array} termsArray - Array of term objects
     */
    loadTermsFromArray(termsArray) {
        this.terms = termsArray.map((term, index) => ({
            ...term, 
            _source: 'direct',
            _sourcePath: 'sample_data',
            _lineNumber: index + 1,
            _arrayIndex: index
        }));
        console.log(`📊 Loaded ${this.terms.length} terms\n`);
    }

    /**
     * Normalize text for comparison (remove special chars, lowercase, etc.)
     * @param {string} text 
     * @returns {string}
     */
    normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Calculate similarity between two strings using Jaccard similarity
     * @param {string} str1 
     * @param {string} str2 
     * @returns {number} Similarity score between 0 and 1
     */
    calculateSimilarity(str1, str2) {
        const words1 = new Set(this.normalizeText(str1).split(' '));
        const words2 = new Set(this.normalizeText(str2).split(' '));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    /**
     * Check if two terms are absolute duplicates (exact term name match)
     * @param {Object} term1 
     * @param {Object} term2 
     * @returns {Object} Analysis result
     */
    isDuplicate(term1, term2) {
        const analysis = {
            isDuplicate: false,
            confidence: 0,
            reasons: []
        };

        // Only check for exact term name matches (case-insensitive)
        const term1Name = term1.term.toLowerCase().trim();
        const term2Name = term2.term.toLowerCase().trim();
        
        if (term1Name === term2Name) {
            analysis.isDuplicate = true;
            analysis.confidence = 1.0;
            analysis.reasons.push('Exact term name match');
            return analysis;
        }

        return analysis;
    }

    /**
     * Calculate a quality score for a term to determine which one to keep
     * @param {Object} term 
     * @returns {number} Quality score
     */
    calculateQualityScore(term) {
        let score = 0;

        // Definition quality (length and detail)
        const defLength = term.definition.length;
        score += Math.min(defLength / 200, 2); // Max 2 points for detailed definition

        // Number of aliases
        score += (term.aliases || []).length * 0.3;

        // Number of related terms (shows interconnectedness)
        score += (term.related || []).length * 0.2;

        // Number of tags
        score += (term.tags || []).length * 0.1;

        // Number of references
        score += (term.references || []).length * 0.5;

        // Bonus for comprehensive coverage
        if (term.definition.includes('machine learning') || 
            term.definition.includes('artificial intelligence') ||
            term.definition.includes('AI')) {
            score += 0.5;
        }

        // Penalty for very short definitions
        if (defLength < 100) {
            score -= 1;
        }

        return score;
    }

    /**
     * Find all absolute duplicate groups (exact term name matches)
     */
    findDuplicates() {
        console.log('🔍 Analyzing terms for absolute duplicates (exact term name matches)...\n');
        
        // Group terms by normalized term name
        const termGroups = new Map();
        
        this.terms.forEach((term, index) => {
            const normalizedTerm = term.term.toLowerCase().trim();
            
            if (!termGroups.has(normalizedTerm)) {
                termGroups.set(normalizedTerm, []);
            }
            
            termGroups.get(normalizedTerm).push({
                index,
                term: term,
                qualityScore: this.calculateQualityScore(term)
            });
        });
        
        // Find groups with more than one term (duplicates)
        this.duplicateGroups = [];
        
        termGroups.forEach((group, termName) => {
            if (group.length > 1) {
                // Sort by quality score (highest first)
                group.sort((a, b) => b.qualityScore - a.qualityScore);
                this.duplicateGroups.push(group);
                
                console.log(`📍 Found ${group.length} duplicates for "${termName}"`);
            }
        });
        
        console.log(`\n✅ Analysis complete. Found ${this.duplicateGroups.length} duplicate term names.\n`);
    }

    /**
     * Generate removal recommendations
     */
    generateRemovalRecommendations() {
        this.toRemove = [];

        this.duplicateGroups.forEach((group, groupIndex) => {
            const keepTerm = group[0]; // Highest quality score
            const removeTerms = group.slice(1); // Rest to be removed

            removeTerms.forEach(item => {
                this.toRemove.push({
                    term: item.term.term,
                    file: item.term._sourcePath || item.term._source,
                    lineNumber: item.term._lineNumber,
                    arrayIndex: item.term._arrayIndex,
                    location: `${item.term._source}:${item.term._lineNumber} (array index ${item.term._arrayIndex})`,
                    reason: `Absolute duplicate - exact term name match (keeping the one with higher quality score: ${keepTerm.qualityScore.toFixed(2)} vs ${item.qualityScore.toFixed(2)})`,
                    keepInstead: keepTerm.term.term,
                    keepLocation: `${keepTerm.term._source}:${keepTerm.term._lineNumber} (array index ${keepTerm.term._arrayIndex})`,
                    qualityDifference: keepTerm.qualityScore - item.qualityScore
                });
            });
        });
    }

    /**
     * Display detailed analysis results for absolute duplicates
     */
    displayResults() {
        console.log('📋 ABSOLUTE DUPLICATE ANALYSIS RESULTS');
        console.log('='.repeat(50));

        if (this.duplicateGroups.length === 0) {
            console.log('✅ No absolute duplicates found! All term names are unique.\n');
            return;
        }

        console.log(`\n🔍 Found ${this.duplicateGroups.length} sets of absolute duplicates:\n`);

        this.duplicateGroups.forEach((group, index) => {
            console.log(`\n📁 DUPLICATE SET ${index + 1}: "${group[0].term.term}"`);
            console.log('─'.repeat(60));
            
            group.forEach((item, itemIndex) => {
                const isKeep = itemIndex === 0;
                const status = isKeep ? '✅ KEEP' : '❌ REMOVE';
                const term = item.term;
                const location = term._lineNumber > 0 ? 
                    `${term._source}:${term._lineNumber} (index ${term._arrayIndex})` : 
                    `${term._source} (index ${term._arrayIndex})`;
                
                console.log(`${status} "${term.term}"`);
                console.log(`   📍 Location: ${location}`);
                console.log(`   📊 Quality Score: ${item.qualityScore.toFixed(2)}`);
                console.log(`   📂 Category: ${term.category}`);
                console.log(`   🏷️  Aliases: ${(term.aliases || []).join(', ') || 'None'}`);
                console.log(`   📝 Definition: ${term.definition.substring(0, 100)}...`);
                console.log('');
            });
        });

        console.log('\n📋 SUMMARY OF ABSOLUTE DUPLICATES TO REMOVE:');
        console.log('='.repeat(50));
        
        if (this.toRemove.length === 0) {
            console.log('✅ No terms need to be removed.\n');
        } else {
            this.toRemove.forEach((item, index) => {
                console.log(`${index + 1}. Remove: "${item.term}"`);
                console.log(`   📍 Location: ${item.location}`);
                console.log(`   ✅ Keep instead: "${item.keepInstead}" at ${item.keepLocation}`);
                console.log(`   📊 Quality difference: ${item.qualityDifference.toFixed(2)}`);
                console.log(`   💡 Reason: Absolute duplicate - exact term name match\n`);
            });
        }

        console.log(`\n📊 FINAL STATISTICS:`);
        console.log(`Total terms analyzed: ${this.terms.length}`);
        console.log(`Absolute duplicate sets found: ${this.duplicateGroups.length}`);
        console.log(`Terms to remove: ${this.toRemove.length}`);
        console.log(`Final unique terms: ${this.terms.length - this.toRemove.length}`);
    }

    /**
     * Export removal list to JSON file
     * @param {string} outputPath 
     */
    exportRemovalList(outputPath = 'terms_to_remove.json') {
        const removalData = {
            analysisDate: new Date().toISOString(),
            totalTermsAnalyzed: this.terms.length,
            duplicateGroupsFound: this.duplicateGroups.length,
            termsToRemove: this.toRemove,
            duplicateGroups: this.duplicateGroups.map(group => ({
                keep: {
                    term: group[0].term.term,
                    location: `${group[0].term._source}:${group[0].term._lineNumber}`,
                    arrayIndex: group[0].term._arrayIndex,
                    qualityScore: group[0].qualityScore
                },
                remove: group.slice(1).map(item => ({
                    term: item.term.term,
                    location: `${item.term._source}:${item.term._lineNumber}`,
                    arrayIndex: item.term._arrayIndex,
                    qualityScore: item.qualityScore
                }))
            })),
            quickRemovalList: this.toRemove.map(item => ({
                term: item.term,
                file: item.file,
                lineNumber: item.lineNumber,
                arrayIndex: item.arrayIndex
            }))
        };

        fs.writeFileSync(outputPath, JSON.stringify(removalData, null, 2));
        console.log(`\n💾 Detailed analysis exported to: ${outputPath}`);
    }

    /**
     * Run complete analysis for absolute duplicates
     * @param {string[]|Array} input - File paths array or terms array
     * @param {string} outputPath - Optional output file path
     */
    analyze(input, outputPath) {
        console.log('🚀 Starting AI Terms ABSOLUTE DUPLICATE Analysis\n');
        console.log('🎯 Looking for exact term name matches only\n');

        // Load terms
        if (typeof input[0] === 'string') {
            this.loadTermsFromFiles(input);
        } else {
            this.loadTermsFromArray(input);
        }

        // Find absolute duplicates
        this.findDuplicates();

        // Generate recommendations
        this.generateRemovalRecommendations();

        // Display results
        this.displayResults();

        // Export results
        if (outputPath) {
            this.exportRemovalList(outputPath);
        }

        return {
            totalTerms: this.terms.length,
            duplicateGroups: this.duplicateGroups.length,
            toRemove: this.toRemove,
            finalCount: this.terms.length - this.toRemove.length
        };
    }
}

// Example usage and main execution
function main() {
    const finder = new TermsDuplicateFinder();

    // Example: Analyze JSON files
    // Uncomment and modify these paths to point to your actual JSON files
    // /*
    const jsonFiles = [
        './terms.json',
        // './ai_terms_additional.json', 
        // './ai_terms_final_batch.json'
    ];
    finder.analyze(jsonFiles, 'duplicate_analysis_results.json');
    // */

    // Example: Test with sample data including absolute duplicates
    // const sampleTerms = [
    //     {
    //         "term": "Artificial Intelligence",
    //         "category": "AI Fundamentals",
    //         "aliases": ["AI", "Machine Intelligence"],
    //         "definition": "The simulation of human intelligence in machines that are programmed to think and learn like humans.",
    //         "related": ["Machine Learning", "Deep Learning"],
    //         "tags": ["ai", "intelligence", "automation"],
    //         "references": ["https://example1.com", "https://example2.com"]
    //     },
    //     {
    //         "term": "artificial intelligence",
    //         "category": "AI Fundamentals", 
    //         "aliases": ["AI System"],
    //         "definition": "A shorter definition of AI systems.",
    //         "related": ["ML", "Neural Networks"],
    //         "tags": ["artificial-intelligence"],
    //         "references": ["https://example3.com"]
    //     },
    //     {
    //         "term": "Machine Learning",
    //         "category": "Machine Learning Algorithms",
    //         "aliases": ["ML", "Statistical Learning"],
    //         "definition": "A subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.",
    //         "related": ["Artificial Intelligence", "Deep Learning", "Neural Networks"],
    //         "tags": ["ml", "learning", "algorithms", "statistics"],
    //         "references": ["https://example4.com", "https://example5.com", "https://example6.com"]
    //     },
    //     {
    //         "term": "Machine Learning",
    //         "category": "Machine Learning Algorithms",
    //         "aliases": ["ML"],
    //         "definition": "Another definition of machine learning with less detail.",
    //         "related": ["AI"],
    //         "tags": ["ml"],
    //         "references": ["https://example7.com"]
    //     }
    // ];

    // console.log('🧪 Running demonstration with sample data (including absolute duplicates):\n');
    // finder.analyze(sampleTerms);
}

// Export for use as module
module.exports = TermsDuplicateFinder;

// Run if this file is executed directly
if (require.main === module) {
    main();
}