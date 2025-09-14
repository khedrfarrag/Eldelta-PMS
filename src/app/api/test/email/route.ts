import { NextRequest } from 'next/server'
import { error, success } from '@/lib/http'
import { testEmailConnection, sendOtpEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    // Test email connection
    const connectionTest = await testEmailConnection()
    
    if (!connectionTest) {
      return error('Email service not configured', 400, {
        details: 'Please check EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables',
        note: 'Add these to your .env.local file to enable email service'
      })
    }

    return success({ 
      message: 'Email service is properly configured',
      connection: 'success',
      note: 'You can now send OTP and password reset emails'
    })
  } catch (e) {
    return error('Email service test failed', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    if (!email || !name) {
      return error('Email and name are required', 400)
    }

    // Test sending OTP email
    const emailSent = await sendOtpEmail(email, '123456', name)
    
    if (emailSent) {
      return success({ 
        message: 'Test OTP email sent successfully',
        email,
        name,
        note: 'Check your email for the test OTP: 123456'
      })
    } else {
      return error('Failed to send test email', 500, {
        note: 'Check email configuration or try again'
      })
    }
  } catch (e) {
    return error('Email test failed', 500)
  }
}
