import React from 'react';
import { Camera, Shield, Clock, Lock, Mic, Brain } from 'lucide-react';

interface StartDiagnosisPageProps {
  onStartDiagnosis: () => void;
}

const StartDiagnosisPage: React.FC<StartDiagnosisPageProps> = ({ onStartDiagnosis }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Gonobee</h1>
          </div>
          <p className="text-xl text-gray-600">Private STI Self-Check Support</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Start Confidential Diagnosis</h2>
            <p className="text-base text-gray-600 max-w-lg mx-auto">
              Instant private guidance through advanced AI analysis. Your privacy is completely protected.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 py-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Visual Analysis</h3>
              <p className="text-sm text-gray-500">AI-powered camera-based diagnosis</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                <Mic className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Voice Interaction</h3>
              <p className="text-sm text-gray-500">Real-time voice consultation system</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Medical AI</h3>
              <p className="text-sm text-gray-500">ICD-11 compliant diagnostic logic</p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">3-Second Results</h3>
              <p className="text-xs text-gray-500">Comprehensive analysis in seconds</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">100% Private</h3>
              <p className="text-xs text-gray-500">All data processed locally, no external sharing</p>
            </div>
          </div>

          {/* Conditions Covered */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Conditions Covered</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Chlamydia Infection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Genital Herpes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Genital Warts (HPV)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Syphilis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Gonorrhea</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Candida Balanitis</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-900">Privacy Protection</h4>
                <p className="text-sm text-blue-700">
                  All analysis is performed locally on your device. Images, audio, and personal data are never transmitted or stored on external servers.
                </p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartDiagnosis}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl py-4 px-6 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 transform hover:-translate-y-0.5"
          >
            Start Diagnosis
          </button>

          <p className="text-xs text-gray-500 text-center">
            This tool is for educational purposes only and does not replace professional medical advice
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartDiagnosisPage;