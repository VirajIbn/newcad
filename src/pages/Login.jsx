import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Package, Mail, Lock, AlertCircle, CheckCircle, Loader2, ArrowRight, Plus, ChevronLeft, ChevronRight, Clock, Users, Shield, BarChart3, Leaf, KeyRound, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('password');
  const [otpData, setOtpData] = useState({ phone: '', otp: '', step: 'request', sending: false });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Carousel slides data
  const slides = [
    {
      title: "Decision Making",
      description: "Get comprehensive reports and analytics to optimize your asset portfolio",
      cta: "View Analytics"
    },
    {
      title: "Asset Management",
      description: "Manage assets efficiently, and increase your productivity & profitability",
      cta: "Explore AssetHub"
    },
    {
      title: "Smart Analytics",
      description: "Data-driven insights for better decision making and portfolio optimization",
      cta: "View Analytics"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    const usernameError = validateUsername(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (usernameError) newErrors.email = usernameError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleInputBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    if (field === 'email') {
      const error = validateUsername(formData.email);
      setErrors(prev => ({ ...prev, email: error }));
    } else if (field === 'password') {
      const error = validatePassword(formData.password);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    
    try {

      
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        // Don't show toast here as AuthContext already shows the error
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      // Don't show toast here as AuthContext already shows the error
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    toast.info('OTP login is coming soon! Please use password login for now.');
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    toast.info('OTP login is coming soon! Please use password login for now.');
  };

  const renderInput = (field, label, type, icon, placeholder) => {
    const hasError = errors[field] && touched[field];
    const isValid = !errors[field] && touched[field] && formData[field];
    const isPassword = field === 'password';
    
    return (
      <div className="space-y-1">
        <Label htmlFor={field} className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
          <Input
            id={field}
            name={field}
            type={type}
            autoComplete={field === 'email' ? 'username' : 'current-password'}
            required
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            onBlur={() => handleInputBlur(field)}
            className={`
              pl-10 ${isPassword ? 'pr-10' : 'pr-4'} py-2 border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm
              ${hasError 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                : isValid 
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-300'
              }
            `}
            placeholder={placeholder}
          />
          
          {/* Error/Success Icon */}
          <div className={`absolute inset-y-0 ${isPassword ? 'right-10' : 'right-3'} flex items-center` }>
            {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
            {!hasError && isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
          
          {/* Password Toggle for password field */}
          {isPassword && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 h-auto px-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        {/* Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-red-600 flex items-center font-medium"
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors[field]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="w-full h-16 md:h-[90px] bg-white shadow-sm border-b-3 border-gray-200 flex items-center justify-between px-4 md:px-6 relative z-20">
                          <div className="flex items-center">
          <img src="src/images/cad_logo.png" alt="CADashboard logo" className="h-[167px] w-[133px] md:h-[267px] md:w-[200px] lg:h-[333px] lg:w-[267px] xl:h-[400px] xl:w-[300px] 2xl:h-[467px] 2xl:w-[333px] object-contain drop-shadow-lg" />
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="bg-gray-100 hover:bg-gray-200 text-black font-medium px-4 py-2 rounded-lg">
            Home
          </Button>
          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">
            Create an account
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Side - Promotional Content */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-blue-50/80 via-blue-50/40 to-white relative overflow-hidden">
          {/* Background decorative elements - Soft overlapping circular shapes */}
          <div className="absolute w-[250px] h-[250px] -left-[80px] top-[40px] bg-blue-100/20 rounded-full blur-[12px]"></div>
          <div className="absolute w-[180px] h-[180px] left-[280px] top-[180px] bg-blue-100/15 rounded-full blur-[10px]"></div>
          <div className="absolute w-[220px] h-[220px] right-[80px] top-[80px] bg-blue-100/18 rounded-full blur-[11px]"></div>
          <div className="absolute w-[140px] h-[140px] left-[480px] top-[380px] bg-blue-100/12 rounded-full blur-[8px]"></div>
          <div className="absolute w-[120px] h-[120px] right-[40px] top-[580px] bg-blue-100/15 rounded-full blur-[9px]"></div>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 pt-6 md:pt-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:w-1/2 space-y-6">
              {/* Welcome Section */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Welcome to
                </h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 leading-tight">
                  CADashboard
                </h2>
              </div>

              {/* Main Headline with proper spacing */}
              <div className="space-y-1 mt-6">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Operate from
                </h3>
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                 Anywhere Anytime 
                </h4>
              </div>
              
              {/* Supporting text with proper spacing and typography */}
              <p className="text-lg md:text-xl text-gray-700 font-normal max-w-md leading-relaxed">
                Work Life Balance.. CADASHBOARD helps to achieve work life balance due to flexibility it provides
              </p>
            </div>

            {/* Illustration - Positioned to the right with proper sizing */}
            <div className="lg:w-1/2 flex justify-end mt-8 lg:mt-0">
              <img 
                src="src/images/lady-working.png.png" 
                alt="Lady working" 
                className="w-auto h-[350px] md:h-[450px] lg:h-[550px] object-contain"
              />
            </div>

            {/* Carousel Indicators - positioned at bottom left as navigation dots */}
            <div className="absolute bottom-16 left-12 flex space-x-3">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>

            {/* Security Badges - positioned at bottom left */}
            <div className="absolute bottom-8 left-12 flex space-x-4">
              <img src="src/images/godaddy.gif" alt="GoDaddy" className="h-12 w-auto" />
              <img src="src/images/AWS_Logo.png" alt="AWS" className="h-12 w-auto" />
            </div>
          </div>
        </div>

                 {/* Right Side - Login Form */}
         <div className="w-full lg:w-1/2 bg-white flex items-start justify-center pt-8 relative">
           {/* Background decorative elements */}
           <div className="absolute w-[134px] h-[134px] -left-[26px] top-[66px] bg-blue-200/50 rounded-full blur-[4.15px] shadow-lg"></div>
           <div className="absolute w-[173px] h-[173px] -left-[44px] top-[780px] bg-blue-200/50 rounded-full blur-[4.15px] shadow-lg"></div>
           <div className="absolute w-[119px] h-[119px] right-[55px] top-[101px] bg-blue-200/50 rounded-full blur-[4.15px] shadow-lg transform rotate-[23deg]"></div>

           {/* Login Card */}
           <div className="w-full max-w-[489px] bg-white rounded-[40px] shadow-lg p-4 md:p-8 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-[30px] font-bold text-black mb-2">Login to your account</h2>
              <p className="text-lg text-[#797979] font-light">Welcome back! Please enter your details.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#F3F4F6] rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-light transition-all ${
                  activeTab === 'password' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-black hover:text-gray-700'
                }`}
              >
                Login with password
              </button>
              <button
                onClick={() => {
                  setActiveTab('otp');
                  toast.info('OTP login is coming soon! Please use password login for now.');
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-light transition-all ${
                  activeTab === 'otp' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-black hover:text-gray-700'
                }`}
              >
                Login with OTP
              </button>
            </div>

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleInputBlur('email')}
                    placeholder="admin@example.com"
                    className="pl-10 pr-4 py-3 border-2 border-[#F3F4F6] rounded-lg bg-[#FCFDFF] focus:border-[#F3F4F6] focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleInputBlur('password')}
                    placeholder="••••••••"
                    className="pl-10 pr-10 py-3 border-2 border-[#F3F4F6] rounded-lg bg-[#FCFDFF] focus:border-[#F3F4F6] focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
                    className="border-black"
                  />
                  <Label htmlFor="remember-me" className="text-sm font-light text-black">
                    Remember me
                  </Label>
                </div>

                {/* Captcha Area */}
                <div className="border-2 border-[#F3F4F6] rounded-lg p-4 bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-[30px] h-[28px] border border-black rounded"></div>
                    <span className="text-sm font-light text-black">I am not a Robot</span>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-[#1E40AF] hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </Button>

                {/* Forgot Password */}
                <div className="text-center">
                  <a href="#" className="text-[#1E40AF] hover:text-blue-700 font-medium text-lg">Forgot Password?</a>
                </div>
              </form>
            )}

            {/* OTP Tab */}
            {activeTab === 'otp' && (
              <div className="space-y-6 text-center py-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">OTP Login</h3>
                    <p className="text-gray-600 text-sm">Coming Soon!</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      We're working on bringing you a seamless OTP login experience. 
                      For now, please use the password login option.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('password')}
                    className="w-full bg-[#1E40AF] hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Use Password Login
                  </Button>
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-2 md:py-4 px-4 mt-auto">
        <p className="text-black text-sm md:text-lg">
          This website is best viewed using Google Chrome Browser version 115 & above.<br/>
          2025 © CADashboard.
        </p>
      </div>
    </div>
  );
};

export default Login; 