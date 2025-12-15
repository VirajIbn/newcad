import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { loginSchema } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext' // Changed to use AuthContext
import { toast } from 'react-toastify'
import { useZodForm } from '@/hooks/useZodForm'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading: authLoading } = useAuth() // Use AuthContext instead
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useZodForm(loginSchema, {
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data) => {
    try {
      // Call login with username and password (AuthContext expects username, not email)
      const result = await login(data.email, data.password)
      
      if (result.success) {
        toast.success('Welcome back!')
        reset()
        
        // Add redirect logic here

        navigate('/') // Redirect to main dashboard
      } else {
        toast.error(result.error || 'Invalid credentials')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const isLoading = authLoading || isSubmitting

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={watch('rememberMe')}
              onCheckedChange={(checked) => setValue('rememberMe', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          {/* Login Instructions */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Login Instructions:</strong><br />
              Enter your registered email and password to access the system.<br />
              Contact your administrator if you need access credentials.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  )
}
