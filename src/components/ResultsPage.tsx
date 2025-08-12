import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, MapPin, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import { DiagnosisResult } from '../utils/medicalDiagnosis';

interface ResultsPageProps {
  result: DiagnosisResult;
  onStartOver: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, onStartOver }) => {
  const [capturedImages, setCapturedImages] = useState<number[]>([1, 2, 3, 4, 5]);
  
  const isNormal = result.primaryDiagnosis.icd11Code === 'QA02';
  const isUrgent = result.urgency === 'urgent';
  const isHigh = result.urgency === 'high';

  // Image deletion simulation
  useEffect(() => {
    if (capturedImages.length > 0) {
      const timer = setTimeout(() => {
        setCapturedImages(images => images.slice(1));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [capturedImages]);
  
  const getUrgencyIcon = () => {
    if (isNormal) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (isUrgent) return <AlertCircle className="w-8 h-8 text-red-600" />;
    if (isHigh) return <AlertTriangle className="w-8 h-8 text-orange-600" />;
    return <Clock className="w-8 h-8 text-blue-600" />;
  };

  const getUrgencyColor = () => {
    if (isNormal) return 'bg-green-100';
    if (isUrgent) return 'bg-red-100';
    if (isHigh) return 'bg-orange-100';
    return 'bg-blue-100';
  };

  const getUrgencyBorder = () => {
    if (isNormal) return 'border-green-500';
    if (isUrgent) return 'border-red-500';
    if (isHigh) return 'border-orange-500';
    return 'border-blue-500';
  };

  const confidenceColor = result.primaryDiagnosis.confidence > 80 ? 'text-green-600' : 
                          result.primaryDiagnosis.confidence > 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Image Deletion */}
        <div className="flex items-center justify-between py-6">
          <div className="text-center flex-1 space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getUrgencyColor()}`}>
              {getUrgencyIcon()}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Diagnosis Complete</h1>
            <p className="text-gray-600">Analysis time: 2.3 seconds</p>
          </div>
          
          {/* Image deletion indicator */}
          {capturedImages.length > 0 && (
            <div className="flex flex-col items-end space-y-3">
              <div className="text-sm text-gray-600 font-medium">
                Deleting used images...
              </div>
              <div className="flex space-x-2">
                {capturedImages.map((imageNum, index) => (
                  <div 
                    key={imageNum} 
                    className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 animate-pulse"
                  >
                    {imageNum}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {capturedImages.length} image{capturedImages.length !== 1 ? 's' : ''} remaining
              </div>
            </div>
          )}
          
          {/* Placeholder when all images are deleted */}
          {capturedImages.length === 0 && (
            <div className="flex flex-col items-end space-y-3">
              <div className="text-sm text-green-600 font-medium">
                ✓ All images deleted
              </div>
              <div className="text-xs text-gray-500">
                Privacy protected
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Diagnosis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Primary Diagnosis</h2>
                <div className="flex items-center space-x-4">
                  <div className={`text-sm font-medium ${confidenceColor}`}>
                    Confidence {result.primaryDiagnosis.confidence}%
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ICD-11: {result.primaryDiagnosis.icd11Code}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border-l-4 ${
                isNormal ? 'bg-green-50 border-green-500' : 
                isUrgent ? 'bg-red-50 border-red-500' :
                isHigh ? 'bg-orange-50 border-orange-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {result.primaryDiagnosis.name}
                </h3>
                <p className="text-gray-700">{result.reasoning}</p>
              </div>

              {/* Urgency indicator */}
              {!isNormal && (
                <div className={`p-3 rounded-lg border ${getUrgencyBorder()} ${getUrgencyColor()}`}>
                  <div className="flex items-center space-x-2">
                    {getUrgencyIcon()}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {isUrgent ? 'Urgent Medical Attention Recommended' : 
                         isHigh ? 'Early Medical Consultation Recommended' : 
                         'Medical Consultation Recommended'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isUrgent ? 'Please seek medical care immediately' : 
                         isHigh ? 'We recommend seeing a doctor within 1-2 days' : 
                         'Please consult with a healthcare provider at your convenience'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Differential Diagnoses */}
            {result.differentialDiagnoses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Differential Diagnoses</h2>
                <div className="space-y-3">
                  {result.differentialDiagnoses.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-700">{condition.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{condition.probability}%</span>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          {condition.icd11Code}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Testing by a specialist is recommended to rule out these conditions
                </p>
              </div>
            )}

            {/* Recommended Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Recommended Actions</h2>
              <div className="space-y-3">
                {result.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Find Care */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Find Healthcare</span>
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 group">
                  <div className="font-medium text-blue-900 group-hover:text-blue-800">City Urology Clinic</div>
                  <div className="text-sm text-blue-600">0.8 miles</div>
                </button>
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 group">
                  <div className="font-medium text-blue-900 group-hover:text-blue-800">General Hospital</div>
                  <div className="text-sm text-blue-600">1.2 miles</div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition duration-200 group">
                  <div className="font-medium text-green-900 group-hover:text-green-800">Telemedicine</div>
                  <div className="text-sm text-green-600">Available now</div>
                </button>
              </div>
            </div>

            {/* Support Resources */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Support Resources</h3>
              <div className="space-y-3 text-sm">
                <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition duration-200">
                  <span className="text-gray-700">STI Information Hub</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition duration-200">
                  <span className="text-gray-700">Anonymous Support Chat</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition duration-200">
                  <span className="text-gray-700">Treatment Options Guide</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Privacy Protection</h4>
              <p className="text-sm text-blue-700">
                This diagnosis was processed locally on your device. Personal data was never transmitted or stored externally.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={onStartOver}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Start New Diagnosis</span>
          </button>
          
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 px-6 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200">
            Create Health Account
          </button>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> This diagnosis is for informational purposes only and does not replace professional medical diagnosis.
            For proper medical evaluation and treatment, please consult with a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;