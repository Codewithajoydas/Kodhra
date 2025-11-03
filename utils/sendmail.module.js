const nodemailer = require("nodemailer");
const fs = require("fs");
async function sendMail(to, subject, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"Code Snippet Manager" <${process.env.EMAIL}>`,
    to,
    subject,
    html: `
    <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <meta charset="UTF-8" />
  <meta content="width=device-width, initial-scale=1" name="viewport" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta content="telephone=no" name="format-detection" />
  <title>Explore the Secure OTP Viewer Template</title>
  <!--[if (mso 16)]>
      <style type="text/css">
        a {
          text-decoration: none;
        }
      </style>
    <![endif]-->
  <!--[if gte mso 9]>
      <style>
        sup {
          font-size: 100% !important;
        }
      </style><!
    [endif]-->
  <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    .es-button {
      mso-style-priority: 100 !important;
      text-decoration: none !important;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
      mso-hide: all;
    }

    @media only screen and (max-width: 600px) {

      p,
      ul li,
      ol li,
      a {
        line-height: 150% !important;
      }

      h1,
      h2,
      h3,
      h1 a,
      h2 a,
      h3 a {
        line-height: 120% !important;
      }

      h1 {
        font-size: 40px !important;
        text-align: left;
        margin-bottom: 0px;
      }

      h2 {
        font-size: 28px !important;
        text-align: left;
        margin-bottom: 0px;
      }

      h3 {
        font-size: 20px !important;
        text-align: left;
        margin-bottom: 0px;
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 40px !important;
        text-align: left;
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 28px !important;
        text-align: left;
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px !important;
        text-align: left;
      }

      .es-menu td a {
        font-size: 14px !important;
      }

      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li,
      .es-header-body a {
        font-size: 14px !important;
      }

      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li,
      .es-content-body a {
        font-size: 14px !important;
      }

      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li,
      .es-footer-body a {
        font-size: 14px !important;
      }

      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li,
      .es-infoblock a {
        font-size: 12px !important;
      }

      *[class="gmail-fix"] {
        display: none !important;
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3 {
        text-align: center !important;
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3 {
        text-align: right !important;
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3 {
        text-align: left !important;
      }

      .es-m-txt-r img,
      .es-m-txt-c img,
      .es-m-txt-l img {
        display: inline !important;
      }

      .es-button-border {
        display: inline-block !important;
      }

      a.es-button,
      button.es-button {
        font-size: 18px !important;
        display: inline-block !important;
      }

      .es-adaptive table,
      .es-left,
      .es-right {
        width: 100% !important;
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100% !important;
        max-width: 600px !important;
      }

      .es-adapt-td {
        display: block !important;
        width: 100% !important;
      }

      .adapt-img {
        width: 100% !important;
        height: auto !important;
      }

      .es-m-p0 {
        padding: 0 !important;
      }

      .es-m-p0r {
        padding-right: 0 !important;
      }

      .es-m-p0l {
        padding-left: 0 !important;
      }

      .es-m-p0t {
        padding-top: 0 !important;
      }

      .es-m-p0b {
        padding-bottom: 0 !important;
      }

      .es-m-p20b {
        padding-bottom: 20px !important;
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none !important;
      }

      tr.es-desk-hidden,
      td.es-desk-hidden,
      table.es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important;
      }

      tr.es-desk-hidden {
        display: table-row !important;
      }

      table.es-desk-hidden {
        display: table !important;
      }

      td.es-desk-menu-hidden {
        display: table-cell !important;
      }

      .es-menu td {
        width: 1% !important;
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto !important;
      }

      table.es-social {
        display: inline-block !important;
      }

      table.es-social td {
        display: inline-block !important;
      }

      .es-desk-hidden {
        display: table-row !important;
        width: auto !important;
        overflow: visible !important;
        max-height: inherit !important;
      }

      .es-m-p5 {
        padding: 5px !important;
      }

      .es-m-p5t {
        padding-top: 5px !important;
      }

      .es-m-p5b {
        padding-bottom: 5px !important;
      }

      .es-m-p5r {
        padding-right: 5px !important;
      }

      .es-m-p5l {
        padding-left: 5px !important;
      }

      .es-m-p10 {
        padding: 10px !important;
      }

      .es-m-p10t {
        padding-top: 10px !important;
      }

      .es-m-p10b {
        padding-bottom: 10px !important;
      }

      .es-m-p10r {
        padding-right: 10px !important;
      }

      .es-m-p10l {
        padding-left: 10px !important;
      }

      .es-m-p15 {
        padding: 15px !important;
      }

      .es-m-p15t {
        padding-top: 15px !important;
      }

      .es-m-p15b {
        padding-bottom: 15px !important;
      }

      .es-m-p15r {
        padding-right: 15px !important;
      }

      .es-m-p15l {
        padding-left: 15px !important;
      }

      .es-m-p20 {
        padding: 20px !important;
      }

      .es-m-p20t {
        padding-top: 20px !important;
      }

      .es-m-p20r {
        padding-right: 20px !important;
      }

      .es-m-p20l {
        padding-left: 20px !important;
      }

      .es-m-p25 {
        padding: 25px !important;
      }

      .es-m-p25t {
        padding-top: 25px !important;
      }

      .es-m-p25b {
        padding-bottom: 25px !important;
      }

      .es-m-p25r {
        padding-right: 25px !important;
      }

      .es-m-p25l {
        padding-left: 25px !important;
      }

      .es-m-p30 {
        padding: 30px !important;
      }

      .es-m-p30t {
        padding-top: 30px !important;
      }

      .es-m-p30b {
        padding-bottom: 30px !important;
      }

      .es-m-p30r {
        padding-right: 30px !important;
      }

      .es-m-p30l {
        padding-left: 30px !important;
      }

      .es-m-p35 {
        padding: 35px !important;
      }

      .es-m-p35t {
        padding-top: 35px !important;
      }

      .es-m-p35b {
        padding-bottom: 35px !important;
      }

      .es-m-p35r {
        padding-right: 35px !important;
      }

      .es-m-p35l {
        padding-left: 35px !important;
      }

      .es-m-p40 {
        padding: 40px !important;
      }

      .es-m-p40t {
        padding-top: 40px !important;
      }

      .es-m-p40b {
        padding-bottom: 40px !important;
      }

      .es-m-p40r {
        padding-right: 40px !important;
      }

      .es-m-p40l {
        padding-left: 40px !important;
      }

      p,
      ul li,
      ol li {
        margin-bottom: 11px !important;
      }

      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li {
        margin-bottom: 11px !important;
      }

      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li {
        margin-bottom: 11px !important;
      }

      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li {
        margin-bottom: 9px !important;
      }
    }

    @media screen and (max-width: 384px) {
      .mail-message-content {
        width: 414px !important;
      }
    }
  </style>
</head>

<body style="
      width: 100%;
      font-family: Lexend, Arial, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      padding: 0;
      margin: 0;
    ">
  <span style="
        display: none !important;
        font-size: 0px;
        line-height: 0;
        color: #ffffff;
        visibility: hidden;
        opacity: 0;
        height: 0;
        width: 0;
        mso-hide: all;
      ">Discover seamless integration and enhanced security with our OTP Viewer
    Template.</span>
  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color: #e6f9fe">
    <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#f6f6f6"></v:fill>
        </v:background>
      <![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          border-collapse: collapse;
          border-spacing: 0px;
          padding: 0;
          margin: 0;
          width: 100%;
          height: 100%;
          background-repeat: repeat;
          background-position: center top;
          background-color: #e6f9fe;
        ">
      <tr>
        <td valign="top" style="padding: 0; margin: 0">
          <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                table-layout: fixed !important;
                width: 100%;
                background-color: transparent;
                background-repeat: repeat;
                background-position: center top;
              ">
            <tr>
              <td align="center" bgcolor="transparent" style="padding: 0; margin: 0">
                <table align="center" cellpadding="0" cellspacing="0" bgcolor="#ffffff" class="es-header-body"
                  role="none" style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: transparent;
                      width: 600px;
                    ">
                  <tr>
                    <td align="left" data-custom-paddings="true" style="
                          margin: 0;
                          padding-bottom: 15px;
                          padding-top: 20px;
                          padding-left: 30px;
                          padding-right: 30px;
                        ">
                      <table cellspacing="0" width="100%" cellpadding="0" role="none" style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          ">
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table> 
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                table-layout: fixed !important;
                width: 100%;
              ">
            <tr>
              <td align="center" bgcolor="transparent" style="padding: 0; margin: 0">
                <table cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" class="es-content-body"
                  role="none" style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #ffffff;
                      width: 600px;
                    ">
                  <tr>
                    <td align="left" data-custom-paddings="true" style="
                          margin: 0;
                          padding-top: 15px;
                          padding-bottom: 15px;
                          padding-left: 30px;
                          padding-right: 30px;
                        ">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none" style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          ">
                        <tr>
                          <td align="left" style="padding: 0; margin: 0; width: 540px">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                ">
                              <tr>
                                <td align="center" style="
                                      padding: 0;
                                      margin: 0;
                                      font-size: 0px;
                                    ">
                                  <a target="_blank" href="https://example.com/otp-viewer-template" style="
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        text-decoration: underline;
                                        color: #0d4259;
                                        font-size: 14px;
                                      ">
                                    <img
                                      src="https://cdn.prod.website-files.com/619e15d781b21202de206fb5/67371216d6ba9c7a8e9622e4_writing-otp-verification-test-cases.jpg"
                                      alt="" width="540" class="adapt-img p_image" style="
                                          display: block;
                                          border: 0;
                                          outline: none;
                                          text-decoration: none;
                                          -ms-interpolation-mode: bicubic;
                                        " /></a>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-bottom: 5px;
                                      padding-top: 15px;
                                    ">
                                  <h2 class="p_title" style="
                                        margin: 0;
                                        font-weight: bolder;
                                        line-height: 33.6px;
                                        border: .1px solid rgba(128, 128, 128, 0.158);
                                        padding: 10px;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        font-size: 28px;
                                        font-style: normal;
                                        font-weight: normal;
                                        color: #0d4259;
                                        margin-bottom: 0px;
                                      ">
                                    ${otp}
                                  </h2>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" class="p_description" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-top: 10px;
                                      padding-bottom: 20px;
                                    ">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 10px;
                                        color: #0d4259;
                                        font-size: 14px;
                                      ">
                                    Your One-Time Password (OTP) is generated
                                    securely and displayed with clarity for
                                    your convenience. This verification step
                                    ensures your account remains protected and
                                    accessible only to you. Our system is
                                    designed to provide a seamless and secure
                                    experience, with a layout that adapts to
                                    any device and reflects the
                                    trustworthiness of our service.
                                  </p>
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 10px;
                                        color: #0d4259;
                                        font-size: 14px;
                                      ">
                                    Please use the OTP within the next few
                                    minutes, as it will expire shortly for
                                    your security. Do not share this code with
                                    anyone. If you did not request this
                                    verification, you can safely ignore this
                                    email.
                                  </p>
                                </td>
                              </tr>

                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                border-collapse: collapse;
                border-spacing: 0px;
                table-layout: fixed !important;
                width: 100%;
                background-color: transparent;
                background-repeat: repeat;
                background-position: center top;
              ">
            <tr>
              <td align="center" style="padding: 0; margin: 0">
                <table align="center" cellpadding="0" cellspacing="0" bgcolor="#151515" class="es-footer-body" style="
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      border-collapse: collapse;
                      border-spacing: 0px;
                      background-color: #151515;
                      width: 600px;
                    " role="none">
                  <tr>
                    <td align="left" class="es-m-p25r es-m-p25l" data-custom-paddings="true" style="
                          margin: 0;
                          padding-bottom: 10px;
                          padding-left: 30px;
                          padding-right: 30px;
                          padding-top: 40px;
                        ">
                    </td>
                  </tr>
              
                  <tr>
                    <td align="left" data-custom-paddings="true" style="
                          padding: 0;
                          margin: 0;
                          padding-top: 10px;
                          padding-left: 30px;
                          padding-right: 30px;
                        ">
                      <table cellpadding="0" cellspacing="0" width="100%" align="right" class="es-right" role="none"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: right;
                          ">
                        <tr>
                          <td align="center" valign="top" style="padding: 0; margin: 0; width: 540px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                ">
                              <tr>
                                <td align="center" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-bottom: 20px;
                                    ">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 0px;
                                        color: #737373;
                                        font-size: 14px;
                                      ">
                                    You are receiving this email because you
                                    subscribed to our newsletters or
                                    registered with Example Company.
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" data-custom-paddings="true" style="
                          padding: 0;
                          margin: 0;
                          padding-left: 30px;
                          padding-right: 30px;
                        ">
                      <!--[if mso]><table style="width:540px" cellpadding="0" cellspacing="0"><tr><td style="width:265px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: left;
                          ">
                        <tr>
                          <td align="left" style="padding: 0; margin: 0; width: 265px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                ">
                              <tr>
                                <td align="center" class="es-m-p0l" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-bottom: 5px;
                                      padding-left: 40px;
                                    ">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 0px;
                                        color: #0d4259;
                                        font-size: 14px;
                                      ">
                                    <a href="https://esputnik.com/viewInBrowser" target="_blank" style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: none;
                                          color: #0d4259;
                                          font-size: 14px;
                                        ">View in Browser</a>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-p0l" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-bottom: 5px;
                                      padding-left: 40px;
                                    ">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 0px;
                                        color: #0d4259;
                                        font-size: 14px;
                                      ">
                                    <a href="https://stripo.email/terms-of-use/" target="_blank" style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: none;
                                          color: #0d4259;
                                          font-size: 14px;
                                        ">Terms of Use</a>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table align="right" cellpadding="0" cellspacing="0" class="es-right" role="none" style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: right;
                          ">
                        <tr>
                          <td align="left" style="padding: 0; margin: 0; width: 265px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                ">
                              <tr>
                                <td align="center" class="es-m-p0r" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-bottom: 5px;
                                      padding-right: 40px;
                                    ">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 0px;
                                        color: #0d4259;
                                        font-size: 14px;
                                      ">
                                    <a target="_blank" href="https://stripo.email/privacy-policy/" style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: none;
                                          color: #0d4259;
                                          font-size: 14px;
                                        ">Privacy Policy</a>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-p0r" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-right: 40px;
                                    ">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 0px;
                                        color: #0d4259;
                                        font-size: 14px;
                                      ">
                                    <a target="_blank" href="https://esputnik.com/unsubscribe" style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: none;
                                          color: #0d4259;
                                          font-size: 14px;
                                        ">Unsubscribe</a>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td align="left" data-custom-paddings="true" style="
                          padding: 0;
                          margin: 0;
                          padding-left: 30px;
                          padding-right: 30px;
                          padding-bottom: 35px;
                        ">
                      <table cellpadding="0" cellspacing="0" width="100%" align="right" class="es-right" role="none"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                            float: right;
                          ">
                        <tr>
                          <td align="center" valign="top" style="padding: 0; margin: 0; width: 540px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  border-collapse: collapse;
                                  border-spacing: 0px;
                                ">
                              <tr>
                                <td align="center" style="
                                      padding: 0;
                                      margin: 0;
                                      padding-top: 20px;
                                    ">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 16.8px;
                                        margin-bottom: 0px;
                                        color: #737373;
                                        font-size: 14px;
                                      ">
                                    782001, Nagaon, Assam, India
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding: 0; margin: 0">
                                  <p style="
                                        margin: 0;
                                        -webkit-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        mso-line-height-rule: exactly;
                                        font-family: Lexend, Arial, sans-serif;
                                        line-height: 21px;
                                        margin-bottom: 0px;
                                        color: #737373;
                                        font-size: 14px;
                                      ">
                                    <a href="mailto:support@stripo.email" target="_blank" style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: none;
                                          color: #737373;
                                          font-size: 14px;
                                        ">codewithajoydas@gmail.com</a>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>
    `,
  });
  return info;
}
module.exports = sendMail;
