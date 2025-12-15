import { useState } from 'react'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { registerSchema } from '@/lib/validations'
import { toast } from 'react-toastify'
import { useZodForm } from '@/hooks/useZodForm'
import { Eye, EyeOff, Loader2, User, Mail, Lock, Shield } from 'lucide-react'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useZodForm(registerSchema, {
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  })

  const onSubmit = async (data) => {
    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Your account has been created successfully!')
      
      reset()
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'bg-gray-200', text: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    const strengths = [
      { strength: 1, color: 'bg-red-500', text: 'Very Weak' },
      { strength: 2, color: 'bg-orange-500', text: 'Weak' },
      { strength: 3, color: 'bg-yellow-500', text: 'Fair' },
      { strength: 4, color: 'bg-blue-500', text: 'Good' },
      { strength: 5, color: 'bg-green-500', text: 'Strong' }
    ]
    
    return strengths[Math.min(score - 1, 4)] || strengths[0]
  }

  const passwordStrength = getPasswordStrength(watch('password'))

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name Field */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                {...register('firstName')}
                className={errors.firstName ? 'border-red-500 pl-10' : 'pl-10'}
                disabled={isSubmitting}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                {...register('lastName')}
                className={errors.lastName ? 'border-red-500 pl-10' : 'pl-10'}
                disabled={isSubmitting}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-red-500 pl-10' : 'pl-10'}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...register('password')}
                className={errors.password ? 'border-red-500 pl-10 pr-10' : 'pl-10 pr-10'}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {watch('password') && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  Password strength: <span className="font-medium">{passwordStrength.text}</span>
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500 pl-10 pr-10' : 'pl-10 pr-10'}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={watch('acceptTerms')}
              onCheckedChange={(checked) => setValue('acceptTerms', checked)}
              disabled={isSubmitting}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="acceptTerms" className="text-sm font-normal">
                I accept the terms and conditions
              </Label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Password Requirements */}
          <Alert className="bg-gray-50 border-gray-200">
            <AlertDescription className="text-gray-700 text-sm">
              <strong>Password Requirements:</strong><br />
              • At least 8 characters<br />
              • One uppercase letter<br />
              • One lowercase letter<br />
              • One number
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  )
}
