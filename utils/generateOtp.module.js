/**
 * @param {String} len;
 * @returns {String}
 */

function getOtp(len) {
  const alpha = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const arry = [...alpha, ...num];
  let otp = "";
  for (let i = 1; i <= len; i++) {
    otp += arry[Math.floor(Math.random() * arry.length)];
  }
  return otp;
}

module.exports = getOtp;