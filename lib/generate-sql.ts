import { ChatAnthropic } from "@langchain/anthropic";
import { AIMessageChunk } from "@langchain/core/messages";
import path from 'path';

const { readFileContents, writeToFile } = require('./utilities');

const procTypes = ["get", "ins", "upd", "del"];

const getFileName = (filePath: string) => {
    return path.basename(filePath, ".sql");
};

const generateFileName = (sqlFile: string, procedureType: string) => {
    const fileName = getFileName(sqlFile);
    return `prr_${fileName}_${procedureType}.sql`;
};

// procedure type: get, ins, upd, del
// tableFile: path to the table file
// storedProcFile: path to the stored procedure file
// * note - file paths are relative to the configured file path in the .env file
module.exports = async (model: ChatAnthropic, procedureType: string, tableFile: string, storedProcFile: string) => {
    
    return new Promise(async (resolve, reject) => {

        // get the file name from the given file paths
        const outputFileName = generateFileName(tableFile, procedureType);

        const procedureFileName = getFileName(storedProcFile);
        const tableFileName = getFileName(tableFile);

        // read the contents of the stored procedure and table files
        const storedProcContents = await readFileContents(storedProcFile);
        const tableContents = await readFileContents(tableFile);
    
        // generate prompt
        const prompt = `
        I want you to write a "${procedureType}" (types: ${procTypes}) SQL Server stored procedure. I want you to read the contents of the
        "${procedureFileName}" stored procedure and write a new stored procedure called "${outputFileName}" for
        the table "${tableFileName}". The new stored procedure should maintain the same styling, formatting, and
        naming conventions as the "${procedureFileName}" stored procedure.
    
        Don't return any text besides the contents of the SQL files.
    
        ${procedureFileName}:
        ${storedProcContents}
    
        ${tableFileName}:
        ${tableContents}
        `
        console.log("Prompt: ", prompt);

        try {
            // invoke the model
            const response: AIMessageChunk = await model.invoke(prompt);
            console.log(response);

            // write the response to a file
            await writeToFile(response.content as string, outputFileName);

            resolve("Success");
        }
        catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
};