import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
  general?: string
}

interface PasswordStrength {
  score: number
  label: string
  color: string
}

export function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) {
      return { score: 0, label: '', color: 'bg-gray-200' }
    }
    
    let score = 0
    
    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1
    
    if (score <= 2) {
      return { score, label: 'Weak', color: 'bg-red-500' }
    } else if (score <= 4) {
      return { score, label: 'Good', color: 'bg-yellow-500' }
    } else {
      return { score, label: 'Strong', color: 'bg-green-500' }
    }
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must confirm that you are a human being'
    }

    return newErrors
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    // Real-time validation for confirm password
    if (field === 'confirmPassword' && typeof value === 'string') {
      if (value && formData.password && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      } else if (errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }))
      }
    }
    
    // Also check confirm password when main password changes
    if (field === 'password' && typeof value === 'string') {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      } else if (errors.confirmPassword && value === formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }))
      }
    }
  }

  const handleBlur = (field: keyof FormData) => {
    // Validate single field on blur
    const newErrors: FormErrors = {}
    
    if (field === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    } else if (field === 'password') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    } else if (field === 'confirmPassword') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    // Update errors for this field
    setErrors(prev => ({ ...prev, ...newErrors }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show unavailable message instead of creating account
    setErrors({ 
      general: 'New account creation is unavailable at this time. Please try again later or use the test login on the login page.' 
    })
    setIsLoading(false)
  }

  const isFormValid = () => {
    const validationErrors = validateForm()
    return Object.keys(validationErrors).length === 0
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-slate-800 mb-3 tracking-tight">
            WordWise AI
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Create your account
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all duration-200 ${
                      errors.password ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}

                {/* Password Requirements */}
                <div className="mt-2 text-xs text-slate-600">
                  <p>Password should be at least 6 characters long</p>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-slate-800 border-slate-300 rounded focus:ring-slate-800/20"
                  />
                  <span className="text-sm text-slate-600">
                    I agree that I am a human being.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors duration-200"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>


      </div>
    </div>
  )
} 