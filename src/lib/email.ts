import nodemailer from 'nodemailer'
import { env } from '@/config/env'

// Email templates
const otpEmailTemplate = (otp: string, name: string) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد الحساب - شركة إلدلتا</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-box { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; font-size: 24px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>شركة إلدلتا</h1>
            <p>خدمات الاستيراد والتصدير</p>
        </div>
        
        <div class="content">
            <h2>مرحباً ${name}</h2>
            <p>شكراً لك على التسجيل في نظام إدارة شركة إلدلتا.</p>
            <p>لإكمال عملية التسجيل، يرجى استخدام رمز التحقق التالي:</p>
            
            <div class="otp-box">
                ${otp}
            </div>
            
            <div class="warning">
                <strong>تنبيه:</strong>
                <ul>
                    <li>هذا الرمز صالح لمدة دقيقة واحدة فقط</li>
                    <li>لا تشارك هذا الرمز مع أي شخص</li>
                    <li>إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد</li>
                </ul>
            </div>
            
            <p>بعد إدخال الرمز، سيتم مراجعة طلبك من قبل الإدارة.</p>
        </div>
        
        <div class="footer">
            <p>© 2024 شركة إلدلتا. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
`

const passwordResetTemplate = (token: string, name: string) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة ضبط كلمة المرور - شركة إلدلتا</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>شركة إلدلتا</h1>
            <p>خدمات الاستيراد والتصدير</p>
        </div>
        
        <div class="content">
            <h2>مرحباً ${name}</h2>
            <p>لقد تلقينا طلباً لإعادة ضبط كلمة المرور الخاصة بحسابك.</p>
            
            <p>إذا كنت قد طلبت هذا، يرجى النقر على الزر التالي:</p>
            
            <a href="${env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}" class="button">
                إعادة ضبط كلمة المرور
            </a>
            
            <div class="warning">
                <strong>تنبيه:</strong>
                <ul>
                    <li>هذا الرابط صالح لمدة ساعة واحدة فقط</li>
                    <li>لا تشارك هذا الرابط مع أي شخص</li>
                    <li>إذا لم تطلب إعادة ضبط كلمة المرور، يرجى تجاهل هذا البريد</li>
                </ul>
            </div>
            
            <p>أو يمكنك نسخ الرابط التالي في المتصفح:</p>
            <p style="word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 4px;">
                ${env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 شركة إلدلتا. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
`

// Create transporter
const createTransporter = () => {
  if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASS) {
    throw new Error('Email configuration is incomplete')
  }

  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT || '587'),
    secure: env.EMAIL_PORT === '465',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  })
}

// Send OTP email
export async function sendOtpEmail(email: string, otp: string, name: string): Promise<boolean> {
  try {
    if (!env.EMAIL_HOST) {
      console.warn('Email service not configured, skipping OTP email')
      return false
    }

    const transporter = createTransporter()
    const html = otpEmailTemplate(otp, name)
    
    await transporter.sendMail({
      from: `"شركة إلدلتا" <${env.EMAIL_USER}>`,
      to: email,
      subject: 'رمز التحقق - شركة إلدلتا',
      html,
    })
    
    return true
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    return false
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string, name: string): Promise<boolean> {
  try {
    if (!env.EMAIL_HOST) {
      console.warn('Email service not configured, skipping password reset email')
      return false
    }

    const transporter = createTransporter()
    const html = passwordResetTemplate(token, name)
    
    await transporter.sendMail({
      from: `"شركة إلدلتا" <${env.EMAIL_USER}>`,
      to: email,
      subject: 'إعادة ضبط كلمة المرور - شركة إلدلتا',
      html,
    })
    
    return true
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return false
  }
}

// Test email configuration
export async function testEmailConnection(): Promise<boolean> {
  try {
    if (!env.EMAIL_HOST) return false
    
    const transporter = createTransporter()
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email connection test failed:', error)
    return false
  }
}
