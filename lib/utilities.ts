import fs from 'fs';
import { NodeFileStore } from "langchain/stores/file/node";
import { ReadFileTool } from "langchain/tools";

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// read file contents
const readFileContents = async (filePath: string) => {
    // Initialize the store with a specific path
    const store = new NodeFileStore(process.env.DIRECTORY_PATH);
    const readFileTool = new ReadFileTool({ store: store });

    const fileContent = await readFileTool.invoke({ file_path: filePath });
  
    return fileContent;
};

// write to file
const writeToFile = async (content: string, filepath: string) => {
    try {
        const outputPath = process.env.DIRECTORY_PATH;
        await fs.promises.writeFile(`${outputPath}/${filepath}`, content, 'utf-8');
        console.log(`Successfully wrote to ${filepath}`);
    } catch (error) {
        console.error('Error writing to file:', error);
    }
};

module.exports = {
    readFileContents,
    writeToFile
};