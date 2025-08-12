import React, { useState } from 'react';
import { ArrowLeft, Shield, User, Mail, Lock, Calendar, Phone, MapPin, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface CreateHealthAccountPageProps {
  onBack: () => void;
  onAccountCreated: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  allowDataSharing: boolean;
}

const CreateHealthAccountPage: React.FC<CreateHealthAccountPageProps> = ({ onBack, onAccountCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    allowDataSharing: false
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms of service';
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    // Simulate account creation
    setTimeout(() => {
      setIsSubmitting(false);
      onAccountCreated();
    }, 2000);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your first name"
            />
          </div>
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your last name"
            />
          </div>
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
        </div>
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formData.password && (
          <div className="space-y-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded ${
                    i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Password strength: <span className="font-medium">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
            </p>
          </div>
        )}
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600">Help us provide better healthcare recommendations</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={3}
              placeholder="Enter your address"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contact & Medical History</h2>
        <p className="text-gray-600">This information helps us provide better care</p>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Full name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
            <input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Medical History (Optional)</label>
          <textarea
            value={formData.medicalHistory}
            onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={3}
            placeholder="Previous medical conditions, surgeries, etc."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Allergies (Optional)</label>
          <textarea
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={2}
            placeholder="Food allergies, drug allergies, etc."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Current Medications (Optional)</label>
          <textarea
            value={formData.currentMedications}
            onChange={(e) => handleInputChange('currentMedications', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={2}
            placeholder="List any medications you're currently taking"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Privacy & Terms</h2>
        <p className="text-gray-600">Please review and accept our terms</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <label htmlFor="terms" className="text-sm font-medium text-gray-900 cursor-pointer">
                I agree to the Terms of Service
              </label>
              <p className="text-xs text-gray-600 mt-1">
                By checking this box, you agree to our terms of service and user agreement.
              </p>
            </div>
          </div>
          {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy"
              checked={formData.agreeToPrivacy}
              onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <label htmlFor="privacy" className="text-sm font-medium text-gray-900 cursor-pointer">
                I agree to the Privacy Policy
              </label>
              <p className="text-xs text-gray-600 mt-1">
                We will protect your personal information according to our privacy policy.
              </p>
            </div>
          </div>
          {errors.agreeToPrivacy && <p className="text-sm text-red-600">{errors.agreeToPrivacy}</p>}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="dataSharing"
              checked={formData.allowDataSharing}
              onChange={(e) => handleInputChange('allowDataSharing', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <label htmlFor="dataSharing" className="text-sm font-medium text-gray-900 cursor-pointer">
                Allow anonymous data sharing for research (Optional)
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Help improve healthcare by sharing anonymized data for medical research.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Your Privacy is Protected</h4>
              <p className="text-sm text-blue-700 mt-1">
                All your health data is encrypted and stored securely. We never share your personal information without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Gonobee Health</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Create Health Account</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
          </div>
          
          <div className="flex space-x-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Form Steps */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Benefits</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Save diagnosis history</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Track health trends</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Personalized recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Connect with healthcare providers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHealthAccountPage;