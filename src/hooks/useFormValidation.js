import { useState, useCallback } from 'react'
import { validateForm, validatePartial, getFieldError } from '@/lib/validations'

export const useFormValidation = (schema, initialData = {}) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [isValidating, setIsValidating] = useState(false)

  // Update form data
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }, [errors])

  // Update multiple fields at once
  const updateFields = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
    
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates)
    setErrors(prev => {
      const newErrors = { ...prev }
      updatedFields.forEach(field => {
        if (newErrors[field]) {
          newErrors[field] = null
        }
      })
      return newErrors
    })
  }, [])

  // Validate single field
  const validateField = useCallback((field, value) => {
    try {
      const fieldSchema = schema.shape[field]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors(prev => ({ ...prev, [field]: null }))
        return true
      }
      return true
    } catch (error) {
      const fieldError = getFieldError([error], field)
      setErrors(prev => ({ ...prev, [field]: fieldError }))
      return false
    }
  }, [schema])

  // Validate entire form
  const validateFormData = useCallback(async (data = formData) => {
    setIsValidating(true)
    
    try {
      const result = validateForm(schema, data)
      
      if (result.success) {
        setErrors({})
        setIsValidating(false)
        return { success: true, data: result.data }
      } else {
        // Convert Zod errors to field-specific errors
        const fieldErrors = {}
        result.errors?.forEach(error => {
          const field = error.path[0]
          if (field) {
            fieldErrors[field] = error.message
          }
        })
        
        setErrors(fieldErrors)
        setIsValidating(false)
        return { success: false, errors: fieldErrors }
      }
    } catch (error) {
      setIsValidating(false)
      return { success: false, errors: { general: 'Validation failed' } }
    }
  }, [schema, formData])

  // Validate partial data
  const validatePartialData = useCallback(async (data) => {
    setIsValidating(true)
    
    try {
      const result = validatePartial(schema, data)
      
      if (result.success) {
        setIsValidating(false)
        return { success: true, data: result.data }
      } else {
        const fieldErrors = {}
        result.errors?.forEach(error => {
          const field = error.path[0]
          if (field) {
            fieldErrors[field] = error.message
          }
        })
        
        setIsValidating(false)
        return { success: false, errors: fieldErrors }
      }
    } catch (error) {
      setIsValidating(false)
      return { success: false, errors: { general: 'Validation failed' } }
    }
  }, [schema])

  // Reset form
  const resetForm = useCallback((newData = initialData) => {
    setFormData(newData)
    setErrors({})
    setIsValidating(false)
  }, [initialData])

  // Get error for specific field
  const getFieldError = useCallback((field) => {
    return errors[field] || null
  }, [errors])

  // Check if form has any errors
  const hasErrors = useCallback(() => {
    return Object.values(errors).some(error => error !== null)
  }, [errors])

  // Check if specific field has error
  const hasFieldError = useCallback((field) => {
    return !!errors[field]
  }, [errors])

  // Get all errors as array
  const getAllErrors = useCallback(() => {
    return Object.values(errors).filter(error => error !== null)
  }, [errors])

  return {
    // State
    formData,
    errors,
    isValidating,
    
    // Actions
    updateField,
    updateFields,
    validateField,
    validateFormData,
    validatePartialData,
    resetForm,
    
    // Utilities
    getFieldError,
    hasErrors,
    hasFieldError,
    getAllErrors
  }
}
