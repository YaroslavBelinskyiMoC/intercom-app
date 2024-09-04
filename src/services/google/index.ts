import { google } from "googleapis";
import fs from "fs";

async function getGoogleSheetData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./project-for-tests-361918-5eb0d4b7f58a.json", // Path to your credentials.json file
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1vE9u6qiubddBEANeApPj8yvYU57hkKmMCBynCqvNsv8"; // Your spreadsheet ID

  try {
    // Fetching the sheet names to ensure the correct one is used
    const sheetMetadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetName = sheetMetadata.data.sheets?.[0].properties?.title; // Assuming the first sheet
    if (!sheetName) {
      throw new Error("Sheet name could not be determined");
    }

    const range = `${sheetName}!A:B`; // Adjust the range if necessary

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      // Checking if there are more than just a header row
      console.log("No data found.");
      return;
    }

    // Skipping the first row
    const jsonResult = rows.slice(1).map((row) => {
      const question = row[0] || "";
      const supportAnswer = row[1] || "";

      return {
        pageContent: `${question}: ${supportAnswer}`,
        metadata: {
          link: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`,
        },
      };
    });
    console.log(jsonResult.length);
    fs.writeFileSync("output.json", JSON.stringify(jsonResult, null, 2));
    console.log("Data saved to output.json");
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
  }
}

export default getGoogleSheetData;
