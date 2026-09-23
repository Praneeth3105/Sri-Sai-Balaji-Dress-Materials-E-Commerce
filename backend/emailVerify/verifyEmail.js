import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Your frontend verification page
  const verificationLink = `http://localhost:5173/verify/${token}`;

  const mailConfigurations = {
    from: `"Sri Sai Balaji Dress Materials" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "✨ Verify Your Email — Sri Sai Balaji Dress Materials",

    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Email Verification</title>

        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f8f4ee;
            font-family: Arial, Helvetica, sans-serif;
            color: #3d3028;
          }

          table {
            border-spacing: 0;
            width: 100%;
          }

          .wrapper {
            width: 100%;
            background-color: #f8f4ee;
            padding: 40px 15px;
          }

          .container {
            width: 100%;
            max-width: 620px;
            margin: 0 auto;
            background-color: #fffdf9;
            border: 1px solid #e5d9ca;
            border-radius: 18px;
            overflow: hidden;
          }

          .header {
            background-color: #4a382c;
            padding: 35px 30px;
            text-align: center;
          }

          .brand {
            margin: 0;
            color: #f7ead8;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 30px;
            font-weight: normal;
            letter-spacing: 1px;
          }

          .brand-line {
            width: 55px;
            height: 2px;
            background-color: #b99a6b;
            margin: 14px auto;
          }

          .tagline {
            margin: 0;
            color: #dfcfba;
            font-size: 13px;
            letter-spacing: 1.5px;
          }

          .content {
            padding: 45px 40px;
            text-align: center;
          }

          .welcome {
            margin: 0 0 10px;
            color: #a78352;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .title {
            margin: 0 0 18px;
            color: #35271f;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 32px;
            font-weight: normal;
          }

          .description {
            margin: 0 auto 28px;
            max-width: 470px;
            color: #7b6d64;
            font-size: 15px;
            line-height: 1.8;
          }

          .email-box {
            margin: 0 auto 30px;
            padding: 15px 20px;
            max-width: 420px;
            background-color: #f4efe7;
            border: 1px solid #e5d9ca;
            border-radius: 10px;
            color: #4a382c;
            font-size: 14px;
          }

          .button-wrapper {
            margin: 30px 0;
          }

          .button {
            display: inline-block;
            padding: 15px 32px;
            background-color: #4a382c;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 0.5px;
          }

          .button:hover {
            background-color: #35271f;
          }

          .security-box {
            margin-top: 35px;
            padding: 18px 20px;
            background-color: #faf7f2;
            border-left: 3px solid #b99a6b;
            text-align: left;
          }

          .security-title {
            margin: 0 0 7px;
            color: #4a382c;
            font-size: 13px;
            font-weight: bold;
          }

          .security-text {
            margin: 0;
            color: #7b6d64;
            font-size: 12px;
            line-height: 1.7;
          }

          .link-section {
            margin-top: 28px;
            padding-top: 25px;
            border-top: 1px solid #eadfd3;
            text-align: left;
          }

          .link-label {
            margin: 0 0 8px;
            color: #7b6d64;
            font-size: 12px;
          }

          .link {
            color: #a78352;
            font-size: 12px;
            line-height: 1.6;
            word-break: break-all;
          }

          .footer {
            padding: 25px 30px;
            background-color: #f4efe7;
            border-top: 1px solid #e5d9ca;
            text-align: center;
          }

          .footer-brand {
            margin: 0 0 8px;
            color: #4a382c;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 18px;
          }

          .footer-text {
            margin: 0;
            color: #8a7c72;
            font-size: 11px;
            line-height: 1.6;
          }

          @media only screen and (max-width: 600px) {
            .wrapper {
              padding: 20px 10px;
            }

            .header {
              padding: 30px 20px;
            }

            .brand {
              font-size: 25px;
            }

            .content {
              padding: 35px 22px;
            }

            .title {
              font-size: 27px;
            }

            .description {
              font-size: 14px;
            }

            .button {
              display: block;
              padding: 15px 20px;
            }
          }
        </style>
      </head>

      <body>

        <table role="presentation" class="wrapper">
          <tr>
            <td align="center">

              <table
                role="presentation"
                class="container"
              >

                <!-- HEADER -->
                <tr>
                  <td class="header">

                    <h1 class="brand">
                      Sri Sai Balaji
                    </h1>

                    <div class="brand-line"></div>

                    <p class="tagline">
                      DRESS MATERIALS
                    </p>

                  </td>
                </tr>

                <!-- CONTENT -->
                <tr>
                  <td class="content">

                    <p class="welcome">
                      Welcome to our store
                    </p>

                    <h2 class="title">
                      Verify Your Email
                    </h2>

                    <p class="description">
                      Thank you for creating an account with
                      <strong>Sri Sai Balaji Dress Materials</strong>.
                      Please verify your email address to complete
                      your registration and start exploring our
                      collection.
                    </p>

                    <div class="email-box">
                      ${email}
                    </div>

                    <!-- BUTTON -->
                    <div class="button-wrapper">

                      <a
                        href="${verificationLink}"
                        class="button"
                        target="_blank"
                      >
                        Verify My Email
                      </a>

                    </div>

                    <!-- SECURITY MESSAGE -->
                    <div class="security-box">

                      <p class="security-title">
                        🔐 A quick security note
                      </p>

                      <p class="security-text">
                        If you did not create an account with us,
                        you can safely ignore this email.
                        Please do not share your verification link
                        with anyone.
                      </p>

                    </div>

                    <!-- FALLBACK LINK -->
                    <div class="link-section">

                      <p class="link-label">
                        If the button above doesn't work, copy and
                        paste this link into your browser:
                      </p>

                      <a
                        href="${verificationLink}"
                        class="link"
                      >
                        ${verificationLink}
                      </a>

                    </div>

                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td class="footer">

                    <p class="footer-brand">
                      Sri Sai Balaji Dress Materials
                    </p>

                    <p class="footer-text">
                      Style that feels like you.
                    </p>

                    <br />

                    <p class="footer-text">
                      This is an automated email.
                      Please do not reply directly to this message.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.error("Email sending failed:", error);
      return;
    }

    console.log("Email Sent Successfully");
    console.log(info.response);
  });
};
