import { google } from "googleapis";
import "dotenv/config";

const OAuth2 = google.auth.OAuth2;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("\n====================================");
console.log("OPEN THIS URL IN YOUR BROWSER");
console.log("====================================\n");
console.log(authUrl);
console.log("\n====================================");
console.log("After authorization, copy the code");
console.log("====================================\n");
