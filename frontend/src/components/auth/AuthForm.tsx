import React, { useState, useEffect, useCallback, useRef } from 'react'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: AuthData) => Promise<void>
  error?: string
  initialEmail?: string
  initialPassword?: string
  onReady?: (fillAndSubmit: (email: string, password: string) => void) => void
}

interface AuthData {
  email: string
  password: string
  confirmPassword?: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

export function AuthForm({ 
  mode, 
  onSubmit, 
  error, 
  initialEmail = '', 
  initialPassword = '',
  onReady
}: AuthFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState(initialPassword)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Update state when initial values change
  useEffect(() => {
    setEmail(initialEmail)
    setPassword(initialPassword)
  }, [initialEmail, initialPassword])

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

    try {
      await onSubmit({
        email,
        password,
        confirmPassword: mode === 'signup' ? confirmPassword : undefined
      })
    } catch (err) {
      // Error handling is done by parent component via error prop
    } finally {
      setIsLoading(false)
    }
  }

  // Create fillAndSubmit function with useCallback
  const fillAndSubmit = useCallback((newEmail: string, newPassword: string) => {
    setEmail(newEmail)
    setPassword(newPassword)
    // Trigger form submission after state update
    setTimeout(() => {
      if (formRef.current) {
        // Create and dispatch a submit event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        formRef.current.dispatchEvent(submitEvent)
      }
    }, 100)
  }, [])

  // Pass fillAndSubmit function to parent when component mounts (only once)
  useEffect(() => {
    if (onReady) {
      onReady(fillAndSubmit)
    }
  }, [onReady, fillAndSubmit])

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    // Email validation
    const emailError = getEmailError(email)
    if (emailError) {
      newErrors.email = emailError
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (password.length > 128) {
      newErrors.password = 'Password is too long'
    }

    // Confirm password validation (signup only)
    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    return newErrors
  }

  const validateEmail = (email: string): boolean => {
    // Comprehensive email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const getEmailError = (email: string): string | null => {
    const trimmedEmail = email.trim()
    
    if (!trimmedEmail) {
      return 'Email is required'
    }
    
    if (trimmedEmail.length > 254) {
      return 'Email is too long'
    }
    
    if (trimmedEmail.startsWith('@') || trimmedEmail.endsWith('@')) {
      return 'Invalid email format'
    }
    
    if (trimmedEmail.includes('..')) {
      return 'Invalid email format'
    }
    
    if (!validateEmail(trimmedEmail)) {
      return 'Invalid email format'
    }
    
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    // Update field value
    if (field === 'email') setEmail(value)
    else if (field === 'password') setPassword(value)
    else if (field === 'confirmPassword') setConfirmPassword(value)

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: string) => {
    // Validate single field on blur
    const newErrors: FormErrors = {}
    
    if (field === 'email') {
      const emailError = getEmailError(email)
      if (emailError) {
        newErrors.email = emailError
      }
    } else if (field === 'password') {
      if (!password) {
        newErrors.password = 'Password is required'
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      } else if (password.length > 128) {
        newErrors.password = 'Password is too long'
      }
    } else if (field === 'confirmPassword' && mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    // Update errors for this field
    setErrors(prev => ({ ...prev, ...newErrors }))
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
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
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={isLoading}
            className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
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
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              disabled={isLoading}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-300' : 'border-slate-200'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password (signup only) */}
        {mode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.confirmPassword ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">
                {mode === 'login' ? 'Signing in...' : 'Creating Account...'}
              </span>
            </div>
          ) : (
            mode === 'login' ? 'Sign in' : 'Create Account'
          )}
        </button>
      </div>
    </form>
  )
} 