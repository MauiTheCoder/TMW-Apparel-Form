#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 Te Mata Wānanga Apparel Form Setup");
console.log("=====================================\n");

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

async function setup() {
  try {
    console.log(
      "This script will help you set up the environment variables.\n",
    );

    // Collect information
    const sendgridKey = await askQuestion(
      "📧 Enter your SendGrid API Key (starts with SG.): ",
    );
    const fromEmail =
      (await askQuestion(
        "📮 From email address (e.g., orders@twoa.ac.nz): ",
      )) || "orders@twoa.ac.nz";
    const sheetsId = await askQuestion("📊 Google Sheets ID (from the URL): ");

    console.log("\n🔐 For Google Sheets credentials, please:");
    console.log("1. Copy the entire service account JSON file content");
    console.log("2. Paste it as a single line below\n");

    const sheetsCredentials = await askQuestion(
      "📋 Google Sheets credentials (JSON): ",
    );

    // Create .env file for local development
    const envContent = `# Te Mata Wānanga Apparel Form Environment Variables
# ===============================================

# SendGrid Configuration
SENDGRID_API_KEY=${sendgridKey}
FROM_EMAIL=${fromEmail}

# Google Sheets Configuration
GOOGLE_SHEETS_ID=${sheetsId}
GOOGLE_SHEETS_CREDENTIALS=${sheetsCredentials}

# Environment
NODE_ENV=development
`;

    fs.writeFileSync(".env", envContent);
    console.log("\n✅ .env file created successfully!");

    // Create Netlify environment variables format
    const netlifyEnv = `
📋 NETLIFY ENVIRONMENT VARIABLES
================================

Copy these to your Netlify site settings (Settings → Environment variables):

SENDGRID_API_KEY
${sendgridKey}

FROM_EMAIL
${fromEmail}

GOOGLE_SHEETS_ID
${sheetsId}

GOOGLE_SHEETS_CREDENTIALS
${sheetsCredentials}

NODE_ENV
production
`;

    fs.writeFileSync("netlify-env-vars.txt", netlifyEnv);
    console.log(
      "📄 netlify-env-vars.txt created with your environment variables",
    );

    // Validate setup
    console.log("\n🔍 Validating setup...");

    const validations = [];

    if (sendgridKey.startsWith("SG.")) {
      validations.push("✅ SendGrid API key format looks correct");
    } else {
      validations.push('❌ SendGrid API key should start with "SG."');
    }

    if (fromEmail.includes("@")) {
      validations.push("✅ From email format looks correct");
    } else {
      validations.push("❌ From email should be a valid email address");
    }

    if (sheetsId.length > 20) {
      validations.push("✅ Sheets ID length looks correct");
    } else {
      validations.push("❌ Sheets ID seems too short");
    }

    try {
      JSON.parse(sheetsCredentials);
      validations.push("✅ Google credentials JSON format is valid");
    } catch {
      validations.push("❌ Google credentials JSON format is invalid");
    }

    console.log("\nValidation Results:");
    validations.forEach((v) => console.log(v));

    // Next steps
    console.log("\n🎯 NEXT STEPS:");
    console.log("==============");
    console.log("1. Install dependencies: npm install");
    console.log("2. Test locally: npm run dev");
    console.log(
      "3. Add environment variables to Netlify (see netlify-env-vars.txt)",
    );
    console.log("4. Deploy to Netlify: npm run deploy");
    console.log("5. Test the complete workflow");

    console.log("\n📚 For detailed instructions, see the Complete Setup Guide");
    console.log(
      "\n🎉 Setup complete! Your apparel order system is ready to deploy.",
    );
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
  } finally {
    rl.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setup();
}

module.exports = { setup };
