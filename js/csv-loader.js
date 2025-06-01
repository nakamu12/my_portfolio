/**
 * CSV Loader Module
 * Handles loading and parsing CSV files for dynamic content
 */

const CSVLoader = {
    /**
     * Load and parse a CSV file
     * @param {string} filepath - Path to the CSV file
     * @returns {Promise<Array>} Array of objects representing CSV rows
     */
    async load(filepath) {
        try {
            const response = await fetch(filepath);
            const text = await response.text();
            return this.parse(text);
        } catch (error) {
            console.error(`Error loading CSV file ${filepath}:`, error);
            return [];
        }
    },

    /**
     * Parse CSV text into array of objects
     * @param {string} text - CSV text content
     * @returns {Array} Array of objects
     */
    parse(text) {
        const lines = text.trim().split('\n');
        if (lines.length === 0) return [];

        // Parse headers
        const headers = this.parseCSVLine(lines[0]);
        
        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        
        return data;
    },

    /**
     * Parse a single CSV line handling quoted values
     * @param {string} line - CSV line
     * @returns {Array} Array of values
     */
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of field
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add last field
        values.push(current.trim());
        
        return values;
    },

    /**
     * Load multiple CSV files
     * @param {Object} files - Object mapping names to file paths
     * @returns {Promise<Object>} Object with loaded data
     */
    async loadMultiple(files) {
        const data = {};
        const promises = Object.entries(files).map(async ([name, path]) => {
            data[name] = await this.load(path);
        });
        await Promise.all(promises);
        return data;
    }
};

// Make it globally available
window.CSVLoader = CSVLoader;