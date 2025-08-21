const sendMail = require("../utils/sendmail.module.js");
const nodemailer = require("nodemailer");

jest.mock("nodemailer");

describe("sendMail module", () => {
  it("should send email with correct details", async () => {
    const sendMailMock = jest.fn().mockResolvedValue("Email Sent!");
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const result = await sendMail(
      "test@example.com",
      "Hello",
      "This is a test"
    );

    expect(result).toBe("Email Sent!");
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL,
      to: "test@example.com",
      subject: "Hello",
        text: "This is a test",
    });
  });
});
