const resetPasswordTemplate = (resetLink) => {
    return `
      <html>
        <body>
          <h2>Reset Your Password</h2>
          <p>Click on the following link to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not request to reset your password, please ignore this email.</p>
        </body>
      </html>
    `;
  };
  