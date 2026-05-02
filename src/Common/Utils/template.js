export const otpTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 500px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; padding: 20px; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .otp-box { background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; border: 1px dashed #4f46e5; }
        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5; margin: 0; }
        .warning { font-size: 13px; color: #ef4444; text-align: center; margin-top: 20px; }
        .footer { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="color: #4f46e5; margin: 0;">Verify Your Account</h2>
        </div>
        <div class="body">
            <p>Hi ${data.firstName},</p>
            <p>Use the following code to complete your verification process. This code is valid for a limited time.</p>
            
            <div class="otp-box">
                <p style="margin-bottom: 10px; color: #6b7280;">Your OTP Code</p>
                <h1 class="otp-code">${data.otp}</h1>
            </div>

            <p class="warning">
                <strong>Note:</strong> This code will expire in <b>${data.expiration} minutes</b>. 
                If you didn't request this, please ignore this email.
            </p>
        </div>
        <div class="footer">
            <p>This is an automated message from Sarahah App. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;