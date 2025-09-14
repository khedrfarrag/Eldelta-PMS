import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Verify JWT token
 *     description: Verify if the provided JWT token is valid and return user data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '64a1b2c3d4e5f6789012345'
 *                     name:
 *                       type: string
 *                       example: 'أحمد محمد'
 *                     email:
 *                       type: string
 *                       example: 'ahmed@example.com'
 *                     role:
 *                       type: string
 *                       enum: [admin, super_admin]
 *                       example: 'admin'
 *                     status:
 *                       type: string
 *                       enum: [active, pending, inactive]
 *                       example: 'active'
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        status: payload.status
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
