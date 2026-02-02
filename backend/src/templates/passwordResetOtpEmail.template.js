export const passwordResetOtpEmail = (otp) => ({
  subject: "Password Reset Verification Code",
  html: `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f4f6f8; padding:24px;">
      <div style="max-width:520px; margin:auto; background:#ffffff; padding:24px; border-radius:8px;">
        
        <h2 style="color:#2c3e50; margin-top:0;">
          Password Reset Request
        </h2>

        <p style="color:#555; font-size:14px;">
          You requested to reset the password for your account.
        </p>

        <p style="color:#555; font-size:14px;">
          Use the verification code below to proceed:
        </p>

        <div style="
          margin:24px 0;
          padding:16px;
          text-align:center;
          background:#eef4ff;
          border-radius:6px;
        ">
          <span style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:4px;
            color:#1a56db;
          ">
            ${otp}
          </span>
        </div>

        <p style="color:#777; font-size:13px;">
          This code will expire in <strong>10 minutes</strong>.
        </p>

        <p style="color:#777; font-size:13px;">
          If you did not request this, please ignore this email.
        </p>

        <p style="margin-top:32px; color:#444; font-size:13px;">
          — IIIT Sonepat Portal Team
        </p>
      </div>
    </div>
  `,
});
