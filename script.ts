import { ChatAnthropic } from "@langchain/anthropic";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize the model
const model = new ChatAnthropic({
    model: process.env.CLAUDE_MODEL, // Choose your preferred Claude model
    temperature: 0.9,
    maxTokens: 1024,
    apiKey: process.env.ANTHROPIC_API_KEY
});


// execute the model
function executeModel() {

    const generateSQL = require('./lib/generate-sql');
    generateSQL(model, "get", "MarkClass.sql", "prr_CertificationTypes_get.sql")
        .then(() => {
            console.log("Successfully generated SQL");
        })
        .catch((error: any) => {
            console.error("Error generating SQL:", error);
        });
    
    generateSQL(model, "ins", "MarkClass.sql", "prr_CertificationType_ins.sql")
        .then(() => {
            console.log("Successfully generated SQL");
        })
        .catch((error: any) => {
            console.error("Error generating SQL:", error);
        });
    
    generateSQL(model, "upd", "MarkClass.sql", "prr_CertificationType_upd.sql")
        .then(() => {
            console.log("Successfully generated SQL");
        })
        .catch((error: any) => {
            console.error("Error generating SQL:", error);
        });


}

executeModel();