await sendMail({
  email: user.email,
  subject: "Reset Your Password",
  html: `
    <p>You received this email because you (or someone else) requested a password reset.</p>
    <p><a href="${resetLink}">Click here to reset your password</a></p>
    <p>This link will expire in 15 minutes.</p>
    <br>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `,
});
