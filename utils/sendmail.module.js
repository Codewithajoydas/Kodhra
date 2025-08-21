const nodemailer = require("nodemailer");
const fs = require("fs");
async function sendMail(to, subject, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAil,
      pass: process.env.APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"Code Snippet Manager" <${process.env.EMAIL}>`,
    to,
    subject,
    html: `
       <body style="margin:0; padding:0; background:#8efc44; text-align:center;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background:#50ec30b9; text-align:center; border-radius:8px;">
          <tr>
            <td style="padding:40px;">
              <div style="text-align:center;">
                <div style="background:black; color:white; font-size:20px; font-weight:bold; width:80px; height:80px; line-height:80px; border-radius:50%; margin:0 auto;">
                  CSM
                </div>

                <h2 style="margin-top:20px; font-family:sans-serif; color:#000;">OTP Verification</h2>
                <h1 style="font-size:32px; font-weight:bold; margin:10px 0; font-family:monospace;">${otp}</h1>
                <p style="font-family:sans-serif; font-size:14px; color:#000; line-height:1.5; max-width:400px; margin:0 auto;">
                  Use the OTP above to verify your account on <b>CMD(Code Snippet Manager)</b>. 
                  This OTP is valid for the next <b>10 minutes</b>. Please do not share it with anyone.
                </p>

                <p style="margin-top:20px; font-size:12px; color:#444; font-family:sans-serif;">
                  If you did not request this code, please ignore this email.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

        `,
  });
  return info;
}
module.exports = sendMail;
