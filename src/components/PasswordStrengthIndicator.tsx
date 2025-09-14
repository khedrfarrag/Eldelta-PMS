'use client'
import { useState, useEffect } from 'react'

interface PasswordStrengthIndicatorProps {
  password: string
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
  met: boolean
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([])

  useEffect(() => {
    const passwordRequirements: PasswordRequirement[] = [
      {
        label: '8 أحرف على الأقل',
        test: (pwd) => pwd.length >= 8,
        met: false
      },
      {
        label: 'حرف كبير واحد على الأقل',
        test: (pwd) => /[A-Z]/.test(pwd),
        met: false
      },
      {
        label: 'حرف صغير واحد على الأقل',
        test: (pwd) => /[a-z]/.test(pwd),
        met: false
      },
      {
        label: 'رقم واحد على الأقل',
        test: (pwd) => /\d/.test(pwd),
        met: false
      },
      {
        label: 'رمز خاص واحد على الأقل (@$!%*?&)',
        test: (pwd) => /[@$!%*?&]/.test(pwd),
        met: false
      }
    ]

    const updatedRequirements = passwordRequirements.map(req => ({
      ...req,
      met: req.test(password)
    }))

    setRequirements(updatedRequirements)
  }, [password])

  const getStrengthLevel = () => {
    const metCount = requirements.filter(req => req.met).length
    if (metCount === 0) return { level: 0, label: 'ضعيفة جداً', color: 'bg-red-500' }
    if (metCount === 1) return { level: 1, label: 'ضعيفة', color: 'bg-red-400' }
    if (metCount === 2) return { level: 2, label: 'متوسطة', color: 'bg-yellow-500' }
    if (metCount === 3) return { level: 3, label: 'جيدة', color: 'bg-blue-500' }
    if (metCount === 4) return { level: 4, label: 'قوية', color: 'bg-green-500' }
    if (metCount === 5) return { level: 5, label: 'قوية جداً', color: 'bg-green-600' }
    return { level: 0, label: 'ضعيفة جداً', color: 'bg-red-500' }
  }

  const strength = getStrengthLevel()

  if (!password) return null

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">قوة كلمة المرور:</span>
          <span className={`text-sm font-medium ${
            strength.level <= 2 ? 'text-red-600' : 
            strength.level <= 3 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {strength.label}
          </span>
        </div>
        
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded transition-all duration-300 ${
                level <= strength.level ? strength.color : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">متطلبات كلمة المرور:</p>
        <div className="space-y-1">
          {requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                requirement.met ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {requirement.met && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${
                requirement.met ? 'text-green-600' : 'text-gray-500'
              }`}>
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Status */}
      {requirements.every(req => req.met) && (
        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-green-700">
            كلمة المرور قوية وآمنة!
          </span>
        </div>
      )}
    </div>
  )
}
