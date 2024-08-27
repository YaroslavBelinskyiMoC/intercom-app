import * as fs from 'fs';
import csvParser from 'csv-parser';

interface CSVRow {
    link: string;
    content: string;
}

interface JSONOutput {
    pageContent: string;
    metadata: {
        link: string;
    };
}

const csvFilePaths = ['../../dataFiles/zipify-pages.csv', '../../dataFiles/OCU.csv']; // Paths to your CSV files
const outputFilePath = '../../dataFiles/output.ts';

const results: JSONOutput[] = [];

const parseCSVFile = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data: CSVRow) => {
                const jsonObject: JSONOutput = {
                    pageContent: data.content,
                    metadata: {
                        link: data.link,
                    },
                };
                results.push(jsonObject);
            })
            .on('end', () => {
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

const parseCSVFiles = async () => {
    try {
        for (const filePath of csvFilePaths) {
            await parseCSVFile(filePath);
        }

        const tsContent = `const articles = ${JSON.stringify(results, null, 2)};\n\nexport default articles;`;

        fs.writeFile(outputFilePath, tsContent, (err) => {
            if (err) {
                console.error('Error writing TypeScript file:', err);
            } else {
                console.log('TypeScript file has been saved successfully.');
            }
        });
    } catch (err) {
        console.error('Error parsing CSV files:', err);
    }
};

parseCSVFiles();
