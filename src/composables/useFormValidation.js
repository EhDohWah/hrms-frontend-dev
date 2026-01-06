// src/composables/useFormValidation.js
import { useVuelidate } from '@vuelidate/core'
import { 
  required, 
  email, 
  minLength,
  maxLength,
  sameAs,
  helpers 
} from '@vuelidate/validators'
import { apiService } from '@/services/api.service'

export function useFormValidation() {
  // Custom validators
  const passwordStrength = helpers.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
  )

  const uniqueEmail = (currentEmail = null) => {
    return helpers.withAsync(async (value) => {
      if (!value) return true
      // Don't check if it's the same as current email (for edit mode)
      if (currentEmail && value === currentEmail) return true
      
      try {
        const response = await apiService.get(`/admin/users/check-email?email=${value}`)
        return !response.exists
      } catch (error) {
        console.error('Email validation error:', error)
        return true // On error, don't block submission
      }
    })
  }

  // Common rule sets
  const userRules = {
    name: {
      required: helpers.withMessage('Name is required', required),
      minLength: helpers.withMessage('Name must be at least 2 characters', minLength(2)),
      maxLength: helpers.withMessage('Name cannot exceed 255 characters', maxLength(255))
    },
    email: {
      required: helpers.withMessage('Email is required', required),
      email: helpers.withMessage('Please enter a valid email address', email)
    },
    password: {
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage('Password must be at least 8 characters', minLength(8)),
      passwordStrength: helpers.withMessage(
        'Password must contain uppercase, lowercase, number, and special character',
        passwordStrength
      )
    },
    role: {
      required: helpers.withMessage('Please select a role', required)
    }
  }

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
      hasMinLength: password.length >= 8
    }

    const passedChecks = Object.values(checks).filter(Boolean).length
    const percentage = (passedChecks / 5) * 100

    let strength = 'weak'
    let color = 'danger'

    if (percentage >= 80) {
      strength = 'strong'
      color = 'success'
    } else if (percentage >= 60) {
      strength = 'good'
      color = 'info'
    } else if (percentage >= 40) {
      strength = 'fair'
      color = 'warning'
    }

    return {
      ...checks,
      percentage,
      strength,
      color
    }
  }

  return {
    useVuelidate,
    validators: {
      required,
      email,
      minLength,
      maxLength,
      sameAs,
      passwordStrength,
      uniqueEmail
    },
    userRules,
    checkPasswordStrength,
    helpers
  }
}

