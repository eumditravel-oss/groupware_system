const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static portal files
app.use(express.static(__dirname));

// Styled HTML Email Templates
const getWelcomeTemplate = (name, email, empNo, dept, role) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Malgun Gothic', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f6f8; }
    .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .email-header { background: linear-gradient(135deg, #f16800 0%, #ea580c 100%); padding: 35px 20px; text-align: center; color: #ffffff; }
    .email-header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px; }
    .email-body { padding: 40px 30px; }
    .welcome-text { font-size: 18px; font-weight: bold; color: #f16800; margin-bottom: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 25px 0; background-color: #fafafa; border-radius: 8px; overflow: hidden; }
    .info-table th, .info-table td { padding: 12px 16px; text-align: left; font-size: 14px; border-bottom: 1px solid #eeeeee; }
    .info-table th { background-color: #f1f5f9; color: #475569; font-weight: 600; width: 30%; }
    .info-table td { color: #1e293b; }
    .button-container { text-align: center; margin: 30px 0 10px 0; }
    .cta-button { display: inline-block; padding: 12px 30px; background-color: #f16800; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 10px rgba(241,104,0,0.25); transition: background-color 0.2s; }
    .cta-button:hover { background-color: #d35400; }
    .email-footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>CONCOST GROUPWARE</h1>
    </div>
    <div class="email-body">
      <div class="welcome-text">환영합니다, ${name}님!</div>
      <p style="font-size: 15px; color: #334155; margin: 0 0 15px 0;">
        ㈜컨코스트 사내 포탈 시스템에 성공적으로 등록되셨습니다.<br>
        부여받으신 고유 사원번호와 부서 계정 정보는 다음과 같습니다.
      </p>
      
      <table class="info-table">
        <tr>
          <th>사원명</th>
          <td>${name}</td>
        </tr>
        <tr>
          <th>사원번호</th>
          <td style="font-weight: bold; color: #f16800;">${empNo}</td>
        </tr>
        <tr>
          <th>이메일 계정</th>
          <td>${email}</td>
        </tr>
        <tr>
          <th>소속 부서</th>
          <td>${dept}</td>
        </tr>
        <tr>
          <th>직급 / 직책</th>
          <td>${role}</td>
        </tr>
      </table>

      <p style="font-size: 14px; color: #64748b;">
        보안 유지를 위해 계정 비밀번호는 본인만 관리해야 하며, 로그인 후 포탈에서 업무 및 상태관리를 바로 이용하실 수 있습니다.
      </p>

      <div class="button-container">
        <a href="http://localhost:8080" class="cta-button" target="_blank">포탈 바로가기</a>
      </div>
    </div>
    <div class="email-footer">
      © 2026 ㈜컨코스트 개발 TF팀. All Rights Reserved.<br>
      본 메일은 발신 전용 메일입니다.
    </div>
  </div>
</body>
</html>
`;

const getResetTemplate = (name, email, tempPassword) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Malgun Gothic', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f6f8; }
    .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .email-header { background: linear-gradient(135deg, #f16800 0%, #ea580c 100%); padding: 35px 20px; text-align: center; color: #ffffff; }
    .email-header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px; }
    .email-body { padding: 40px 30px; }
    .alert-text { font-size: 18px; font-weight: bold; color: #ef4444; margin-bottom: 20px; }
    .password-box { background-color: #fff7ed; border: 1px dashed #fdba74; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; }
    .password-label { font-size: 13px; color: #7c2d12; margin-bottom: 5px; text-transform: uppercase; font-weight: bold; }
    .password-value { font-size: 22px; font-weight: bold; color: #ea580c; letter-spacing: 1px; font-family: monospace; }
    .button-container { text-align: center; margin: 30px 0 10px 0; }
    .cta-button { display: inline-block; padding: 12px 30px; background-color: #f16800; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 10px rgba(241,104,0,0.25); }
    .email-footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>CONCOST GROUPWARE</h1>
    </div>
    <div class="email-body">
      <div class="alert-text">비밀번호 찾기 임시 비밀번호 안내</div>
      <p style="font-size: 15px; color: #334155; margin: 0 0 15px 0;">
        안녕하세요, ${name}님.<br>
        요청하신 비밀번호 재설정을 위해 임시 비밀번호를 발급해 드립니다.<br>
        아래 비밀번호로 로그인하신 후 즉시 비밀번호를 변경해 주시기 바랍니다.
      </p>
      
      <div class="password-box">
        <div class="password-label">발급된 임시 비밀번호</div>
        <div class="password-value">${tempPassword}</div>
      </div>

      <p style="font-size: 14px; color: #64748b; background-color: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #f16800;">
        <strong>주의:</strong> 임시 비밀번호는 로그인 즉시 포탈 우측 하단의 [내 프로필]을 눌러 안전한 비밀번호로 재설정해 주시기 바랍니다. 본인이 직접 비밀번호 초기화를 요청하지 않은 경우 경영지원본부에 즉시 신고하십시오.
      </p>

      <div class="button-container">
        <a href="http://localhost:8080" class="cta-button" target="_blank">포탈 로그인하러 가기</a>
      </div>
    </div>
    <div class="email-footer">
      © 2026 ㈜컨코스트 개발 TF팀. All Rights Reserved.<br>
      본 메일은 발신 전용 메일입니다.
    </div>
  </div>
</body>
</html>
`;

// Secure Email API Endpoint
app.post('/api/send-email', async (req, res) => {
  const { type, email, data } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Recipient email is required.' });
  }

  let subject = '';
  let html = '';

  if (type === 'welcome') {
    subject = `[CONCOST] ${data.name}님의 사내 포탈 회원가입을 환영합니다.`;
    html = getWelcomeTemplate(data.name, email, data.empNo, data.dept, data.role);
  } else if (type === 'resetPassword') {
    subject = `[CONCOST] 임시 비밀번호 발급 안내 메일입니다.`;
    html = getResetTemplate(data.name, email, data.tempPassword);
  } else {
    return res.status(400).json({ success: false, message: 'Invalid email template type.' });
  }

  // Check if credentials are set
  const hasSMTP = process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSMTP) {
    console.warn('\n⚠️  [WARN] SMTP credentials are not configured in .env file.');
    console.log('==================== MOCK EMAIL LOG ====================');
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log('-------------------- Content Body --------------------');
    console.log(html.replace(/<[^>]*>/g, '').trim().substring(0, 300) + '...');
    console.log('========================================================\n');

    return res.status(200).json({ 
      success: true, 
      message: 'SMTP credentials missing. Email logged to server console in mock mode.',
      mocked: true,
      emailBody: html
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully: ${info.messageId}`);
    return res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email.', error: error.message });
  }
});

// Fallback: Redirect all other requests to index.html (useful for SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 CONCOST Portal Server is running at http://localhost:${PORT}`);
  console.log(`📁 Static root: ${__dirname}\n`);
});
