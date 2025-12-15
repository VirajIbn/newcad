import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

/**
 * Custom hook that combines React Hook Form with Zod validation
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 * @param {Object} options - Additional options for useForm
 * @returns {Object} React Hook Form methods and state
 */
export const useZodForm = (schema, options = {}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange', // Validate on change for better UX
    ...options
  })

  return {
    ...form,
    // Helper method to set multiple fields at once
    setFields: (fields) => {
      Object.entries(fields).forEach(([key, value]) => {
        form.setValue(key, value)
      })
    },
    
    // Helper method to get field value with fallback
    getFieldValue: (field, fallback = '') => {
      return form.watch(field) || fallback
    },
    
    // Helper method to check if form is dirty
    isDirty: () => {
      return form.formState.isDirty
    },
    
    // Helper method to get all form errors as array
    getAllErrors: () => {
      const errors = form.formState.errors
      return Object.values(errors).map(error => error.message).filter(Boolean)
    },
    
    // Helper method to check if specific field has error
    hasFieldError: (field) => {
      return !!form.formState.errors[field]
    },
    
    // Helper method to get field error message
    getFieldError: (field) => {
      return form.formState.errors[field]?.message || null
    },
    
    // Helper method to clear specific field error
    clearFieldError: (field) => {
      form.clearErrors(field)
    },
    
    // Helper method to reset form to specific values
    resetForm: (values = {}) => {
      form.reset(values)
    }
  }
}
