import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const TOKEN_PATH = path.join(process.cwd(), "token.json");

async function authorize() {
  console.log("Starting Google Gmail authorization...");

  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  console.log("Google authorization successful.");

  const credentials = auth.credentials;

  console.log("\n==============================");
  console.log("ACCESS TOKEN:");
  console.log(credentials.access_token);

  console.log("\nREFRESH TOKEN:");
  console.log(credentials.refresh_token);

  console.log("\nEXPIRY DATE:");
  console.log(credentials.expiry_date);
  console.log("==============================\n");

  if (credentials.refresh_token) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));

    console.log(`OAuth token information saved to: ${TOKEN_PATH}`);
  } else {
    console.log("No refresh token was returned.");
    console.log("If necessary, revoke the app's access and authorize again.");
  }

  return auth;
}

authorize().catch((error) => {
  console.error("\nGmail authorization failed:");
  console.error(error);
});
