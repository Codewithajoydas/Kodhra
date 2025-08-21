const getOtp = require("../utils/generateOtp.module.js");

describe("getOtp function", () => {
  it("should return a string", () => {
    const otp = getOtp(6);
    expect(typeof otp).toBe("string");
  });

  it("should return OTP of correct length", () => {
    const otp = getOtp(8);
    expect(otp.length).toBe(8);
  });

  it("should only contain allowed characters (a-z, 0-9)", () => {
    const otp = getOtp(10);
    const allowedChars = /^[a-z0-9]+$/;
    expect(allowedChars.test(otp)).toBe(true);
  });

  it("should generate different OTPs on multiple calls (likely)", () => {
    const otp1 = getOtp(6);
    const otp2 = getOtp(6);
    expect(otp1).not.toBe(otp2); 
  });
});
