import * as fs from 'fs';
import * as path from 'path';
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

const directoryPath = path.resolve(__dirname, '../../dataFiles');
const ocuPath = path.join(directoryPath, 'OCU.csv');
const pagesPath = path.join(directoryPath, 'zipify-pages.csv');
const outputFilePath = path.join(directoryPath, 'output.ts');

const csvFilePaths = [ocuPath, pagesPath];

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

        // Construct the TypeScript content
        const tsContent = `const articles = ${JSON.stringify(results, null, 2)};\n\nexport default articles;`;

        // Write to the TypeScript file asynchronously
        await fs.promises.writeFile(outputFilePath, tsContent);
        console.log('TypeScript file has been saved successfully.');

    } catch (err) {
        console.error('Error during processing:', err);
    }
};

export default parseCSVFiles;
