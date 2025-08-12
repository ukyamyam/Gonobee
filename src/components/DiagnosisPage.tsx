import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, ArrowLeft, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { MedicalDiagnosisEngine, DiagnosisResult } from '../utils/medicalDiagnosis';
import { ElevenLabsService, SpeechRecognitionService } from '../utils/elevenLabsService';

interface DiagnosisPageProps {
  onDiagnosisComplete: (result: DiagnosisResult) => void;
  onBack: () => void;
}

const DiagnosisPage: React.FC<DiagnosisPageProps> = ({ onDiagnosisComplete, onBack }) => {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [capturedImages, setCapturedImages] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [genitaliaDetected, setGenitaliaDetected] = useState<boolean | null>(null);
  const [showGenitaliaWarning, setShowGenitaliaWarning] = useState(false);
  const [noInputTimer, setNoInputTimer] = useState<NodeJS.Timeout | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const diagnosisEngineRef = useRef(new MedicalDiagnosisEngine());
  const elevenLabsRef = useRef<ElevenLabsService | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);
  const conversationStateRef = useRef<'initial' | 'listening' | 'responding'>('initial');

  // Initialize ElevenLabs and SpeechRecognition
  useEffect(() => {
    // Initialize ElevenLabs (API key from environment variables)
    const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (elevenLabsApiKey) {
      elevenLabsRef.current = new ElevenLabsService(elevenLabsApiKey);
    }

    // Initialize SpeechRecognition
    speechRecognitionRef.current = new SpeechRecognitionService();

    return () => {
      elevenLabsRef.current?.disconnect();
      speechRecognitionRef.current?.stopListening();
    };
  }, []);

  // Image deletion simulation
  useEffect(() => {
    if (capturedImages.length > 0 && isRecording) {
      const timer = setTimeout(() => {
        setCapturedImages(images => images.slice(1));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [capturedImages, isRecording]);

  // Camera initialization
  useEffect(() => {
    if (cameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [cameraEnabled]);

  // No input timer
  useEffect(() => {
    if (isRecording && !transcript && !aiResponse) {
      const timer = setTimeout(() => {
        handleAIPrompt("Please describe your symptoms in detail. What symptoms have you been experiencing and when did they start?");
      }, 10000);
      setNoInputTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isRecording, transcript, aiResponse]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: micEnabled 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      
      // Start image analysis
      if (isRecording) {
        analyzeVideoStream();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Video analysis (genitalia detection simulation)
  const analyzeVideoStream = () => {
    const analyzeFrame = () => {
      if (!isRecording || !videoRef.current) return;

      // In actual implementation, use machine learning models
      // This is a simulation
      const detectionResult = Math.random() > 0.4; // 60% chance of detecting genitalia
      
      if (genitaliaDetected === null) {
        setGenitaliaDetected(detectionResult);
        
        if (!detectionResult) {
          setShowGenitaliaWarning(true);
          handleAIPrompt("The affected area doesn't appear to be visible in the camera. For diagnosis, please show the area of concern to the camera. If you cannot show it, please describe your symptoms in detail.");
        } else {
          // If genitalia detected, analyze visual features
          const visualFeatures = diagnosisEngineRef.current.analyzeImage();
          diagnosisEngineRef.current.setVisualFeatures(visualFeatures);
        }
      }

      // Continue analysis
      if (isRecording) {
        setTimeout(analyzeFrame, 2000);
      }
    };

    analyzeFrame();
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    conversationStateRef.current = 'initial';
    
    // Initialize ElevenLabs connection
    if (elevenLabsRef.current) {
      await elevenLabsRef.current.initializeConnection();
    }
    
    // Start speech recognition
    if (speechRecognitionRef.current && micEnabled) {
      speechRecognitionRef.current.startListening((transcript, isFinal) => {
        if (isFinal) {
          handleUserInput(transcript);
          setInterimTranscript('');
        } else {
          setInterimTranscript(transcript);
        }
      });
    }

    // Start video analysis
    if (cameraEnabled) {
      analyzeVideoStream();
    }

    // Initial AI greeting
    setTimeout(() => {
      handleAIPrompt("Hello. Please tell me about your symptoms in detail. When did these symptoms start and what are you experiencing?");
    }, 1000);
  };

  const handleUserInput = (userText: string) => {
    if (!userText.trim()) return;

    // Clear no input timer
    if (noInputTimer) {
      clearTimeout(noInputTimer);
      setNoInputTimer(null);
    }

    setTranscript(prev => prev + (prev ? ' ' : '') + userText);
    
    // Extract symptoms and add to diagnosis engine
    const symptoms = diagnosisEngineRef.current.extractSymptomsFromText(userText);
    symptoms.forEach(symptom => {
      diagnosisEngineRef.current.addSymptom(symptom);
    });

    // Generate AI response
    generateAIResponse(userText);
  };

  const generateAIResponse = (userInput: string) => {
    conversationStateRef.current = 'responding';
    
    // Generate appropriate questions based on symptoms
    const lowerInput = userInput.toLowerCase();
    let response = '';

    if (lowerInput.includes('pain') || lowerInput.includes('hurt') || lowerInput.includes('sore')) {
      response = "I understand you're experiencing pain. When did this pain start? Does it get worse during urination?";
    } else if (lowerInput.includes('itch') || lowerInput.includes('itchy') || lowerInput.includes('itching')) {
      response = "I see you have itching symptoms. Are there any other symptoms like discharge or redness?";
    } else if (lowerInput.includes('discharge') || lowerInput.includes('fluid') || lowerInput.includes('leak')) {
      response = "You mentioned discharge. Can you describe the color, amount, and any odor?";
    } else if (lowerInput.includes('red') || lowerInput.includes('redness') || lowerInput.includes('inflamed')) {
      response = "I notice you mentioned redness. When did this redness appear? Is it spreading?";
    } else if (lowerInput.includes('bump') || lowerInput.includes('lump') || lowerInput.includes('growth') || lowerInput.includes('wart')) {
      response = "You mentioned bumps or growths. When did these appear? Have they changed in size or number?";
    } else if (lowerInput.includes('blister') || lowerInput.includes('vesicle') || lowerInput.includes('fluid-filled')) {
      response = "You mentioned blisters. When did these appear? Are they painful?";
    } else if (lowerInput.includes('ulcer') || lowerInput.includes('sore') || lowerInput.includes('open wound')) {
      response = "You mentioned sores or ulcers. Are these painful? When did they first appear?";
    } else if (lowerInput.includes('urination') || lowerInput.includes('urinating') || lowerInput.includes('pee')) {
      response = "You mentioned urination symptoms. Is there pain, burning, or difficulty when urinating?";
    } else {
      response = "Please tell me more about your symptoms. Are there any other concerns you'd like to discuss?";
    }

    handleAIPrompt(response);
  };

  const handleAIPrompt = (message: string) => {
    setAiResponse(message);
    
    // Output voice with ElevenLabs
    if (elevenLabsRef.current && elevenLabsRef.current.isReady()) {
      elevenLabsRef.current.speakText(message);
    }
    
    conversationStateRef.current = 'listening';
  };

  const handleViewResults = () => {
    setIsProcessing(true);
    
    // Stop speech recognition
    speechRecognitionRef.current?.stopListening();
    
    // Disconnect ElevenLabs
    elevenLabsRef.current?.disconnect();
    
    // Execute diagnosis
    setTimeout(() => {
      const result = diagnosisEngineRef.current.diagnose();
      onDiagnosisComplete(result);
    }, 2000);
  };

  const highlightSymptoms = (text: string) => {
    const symptoms = ['pain', 'hurt', 'sore', 'itch', 'itchy', 'itching', 'discharge', 'fluid', 'red', 'redness', 
                     'bump', 'lump', 'growth', 'wart', 'blister', 'vesicle', 'ulcer', 'burning', 'severe', 'inflammation'];
    let highlightedText = text;
    
    symptoms.forEach(symptom => {
      const regex = new RegExp(`(${symptom})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<strong class="text-red-600 font-bold">$1</strong>`);
    });
    
    return highlightedText;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          {/* Image deletion indicator */}
          {capturedImages.length > 0 && isRecording && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Deleting used images...</span>
              <div className="flex space-x-1">
                {capturedImages.map((_, index) => (
                  <div key={index} className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Genitalia detection warning */}
        {showGenitaliaWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900">Area Visibility Check</h4>
              <p className="text-sm text-yellow-800 mt-1">
                For more accurate diagnosis, please show the area of concern to the camera.
                If this is difficult, you can still get a diagnosis by describing your symptoms in detail.
              </p>
              <button
                onClick={() => setShowGenitaliaWarning(false)}
                className="text-sm text-yellow-700 underline mt-2"
              >
                I understand
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Visual Diagnosis</h2>
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`p-2 rounded-lg transition duration-200 ${
                    cameraEnabled 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                      : 'bg-red-100 hover:bg-red-200 text-red-600'
                  }`}
                >
                  {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                {cameraEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center space-y-2">
                      <CameraOff className="w-8 h-8 mx-auto" />
                      <p className="text-sm">Camera disabled - Voice/text input only</p>
                    </div>
                  </div>
                )}
                
                {/* Recording indicator */}
                {isRecording && cameraEnabled && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Recording</span>
                  </div>
                )}

                {/* Genitalia detection status */}
                {isRecording && genitaliaDetected !== null && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
                    genitaliaDetected 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {genitaliaDetected ? 'Area Detected' : 'Area Not Detected'}
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-4 px-6 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
              >
                Start Diagnosis
              </button>
            ) : (
              <button
                onClick={handleViewResults}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-xl py-4 px-6 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200"
              >
                {isProcessing ? 'Analyzing...' : 'View Diagnosis Results'}
              </button>
            )}
          </div>

          {/* Transcript Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Voice Input</h2>
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-2 rounded-lg transition duration-200 ${
                    micEnabled 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                      : 'bg-red-100 hover:bg-red-200 text-red-600'
                  }`}
                >
                  {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto mb-4">
                {/* User transcript */}
                {(transcript || interimTranscript) && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-blue-600">You:</div>
                    <div className="bg-blue-50 rounded-lg p-3 text-gray-900">
                      <span dangerouslySetInnerHTML={{ __html: highlightSymptoms(transcript) }} />
                      {interimTranscript && (
                        <span className="text-gray-500 italic">
                          {highlightSymptoms(interimTranscript)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* AI response */}
                {aiResponse && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-green-600">AI Doctor:</div>
                    <div className="bg-green-50 rounded-lg p-3 text-gray-900">
                      {aiResponse}
                    </div>
                  </div>
                )}

                {/* No input state */}
                {isRecording && !transcript && !aiResponse && !interimTranscript && (
                  <div className="text-center py-8 text-gray-500">
                    <Mic className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                    <p>Listening for symptoms...</p>
                    <p className="text-sm mt-1">Please describe your symptoms in detail</p>
                  </div>
                )}
              </div>

              {/* Text input alternative */}
              {isRecording && (
                <div className="border-t pt-4">
                  <textarea
                    placeholder="Or type your symptoms here..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    rows={3}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const target = e.target as HTMLTextAreaElement;
                        if (target.value.trim()) {
                          handleUserInput(target.value);
                          target.value = '';
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Press Enter to send (Shift+Enter for new line)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPage;