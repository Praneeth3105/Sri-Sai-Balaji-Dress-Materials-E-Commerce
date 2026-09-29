import "dotenv/config";
import { google } from "googleapis";

/*
====================================================
GOOGLE OAUTH2
====================================================
*/

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

/*
====================================================
SET REFRESH TOKEN
====================================================
*/

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

/*
====================================================
GMAIL API
====================================================
*/

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

/*
====================================================
ENCODE EMAIL FOR GMAIL API
====================================================
*/

const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/*
====================================================
SEND EMAIL
====================================================
*/

export const sendGmail = async ({ to, subject, html }) => {
  try {
    /*
    -----------------------------------------------
    ENCODE SUBJECT
    -----------------------------------------------
    */

    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, "utf8").toString(
      "base64",
    )}?=`;

    /*
    -----------------------------------------------
    CREATE EMAIL
    -----------------------------------------------
    */

    const message = [
      `From: Sri Sai Balaji Dress Materials <${process.env.GMAIL_SENDER}>`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      html,
    ].join("\r\n");

    /*
    -----------------------------------------------
    ENCODE MESSAGE
    -----------------------------------------------
    */

    const encodedMessage = encodeMessage(message);

    /*
    -----------------------------------------------
    SEND THROUGH GMAIL API
    -----------------------------------------------
    */

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("======================================");
    console.log("GMAIL EMAIL SENT SUCCESSFULLY");
    console.log("To:", to);
    console.log("Gmail Message ID:", response.data.id);
    console.log("======================================");

    return {
      success: true,
      emailId: response.data.id,
    };
  } catch (error) {
    console.error("======================================");
    console.error("GMAIL API EMAIL ERROR");
    console.error(error.response?.data || error.message);
    console.error("======================================");

    throw error;
  }
};
