import React, { useState } from 'react';
import StartDiagnosisPage from './components/StartDiagnosisPage';
import DiagnosisPage from './components/DiagnosisPage';
import ResultsPage from './components/ResultsPage';

type Page = 'start' | 'diagnosis' | 'results';

interface DiagnosisResult {
  diagnosis: string;
  reason: string;
  otherConditions: string[];
  suggestedActions: string[];
  confidence: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('start');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const handleStartDiagnosis = () => {
    setCurrentPage('diagnosis');
  };

  const handleDiagnosisComplete = (result: DiagnosisResult) => {
    setDiagnosisResult(result);
    setCurrentPage('results');
  };

  const handleStartOver = () => {
    setCurrentPage('start');
    setDiagnosisResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'start' && (
        <StartDiagnosisPage onStartDiagnosis={handleStartDiagnosis} />
      )}
      {currentPage === 'diagnosis' && (
        <DiagnosisPage 
          onDiagnosisComplete={handleDiagnosisComplete}
          onBack={() => setCurrentPage('start')}
        />
      )}
      {currentPage === 'results' && diagnosisResult && (
        <ResultsPage 
          result={diagnosisResult}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}

export default App;