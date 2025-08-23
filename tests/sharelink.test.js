const shareLink = require("../utils/shareLink.module.js");

test("Generate a Porper Share Link", () => {
  const result = shareLink("j1212", "12122", "codewithajoydas.com");
  expect(result).toBe("codewithajoydas.com/folder/j1212/12122");
});
