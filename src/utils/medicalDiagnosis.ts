// ICD-11 compliant diagnostic logic
export interface Symptom {
  type: 'visual' | 'reported';
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: string;
  location?: string;
}

export interface VisualFeatures {
  hasGenitalia: boolean;
  lesionType?: 'vesicles' | 'ulcers' | 'warts' | 'discharge' | 'rash' | 'none';
  color?: 'red' | 'yellow' | 'green' | 'white' | 'clear' | 'brown' | 'skin-colored';
  pattern?: 'clustered' | 'scattered' | 'single' | 'cauliflower' | 'linear';
  inflammation?: 'none' | 'mild' | 'moderate' | 'severe';
  texture?: 'smooth' | 'rough' | 'bumpy' | 'fluid-filled';
}

export interface DiagnosisResult {
  primaryDiagnosis: {
    icd11Code: string;
    name: string;
    confidence: number;
  };
  differentialDiagnoses: Array<{
    icd11Code: string;
    name: string;
    probability: number;
  }>;
  reasoning: string;
  recommendedActions: string[];
  urgency: 'low' | 'moderate' | 'high' | 'urgent';
}

// ICD-11 code definitions
const ICD11_CODES = {
  // STIs
  CHLAMYDIA: '1A95.0',
  GONORRHEA: '1A91.0',
  SYPHILIS: '1A62',
  HERPES: '1E90',
  HPV_WARTS: '1E91.1',
  // Non-STIs
  CANDIDA: '1F23.0',
  NORMAL: 'QA02' // No abnormality detected
};

export class MedicalDiagnosisEngine {
  private symptoms: Symptom[] = [];
  private visualFeatures: VisualFeatures = { hasGenitalia: false };

  addSymptom(symptom: Symptom) {
    this.symptoms.push(symptom);
  }

  setVisualFeatures(features: VisualFeatures) {
    this.visualFeatures = features;
  }

  // Extract symptom objects from text keywords
  extractSymptomsFromText(text: string): Symptom[] {
    const symptoms: Symptom[] = [];
    const lowerText = text.toLowerCase();

    // Pain-related
    if (lowerText.includes('pain') || lowerText.includes('hurt') || lowerText.includes('sore') || lowerText.includes('ache')) {
      const severity = lowerText.includes('severe') || lowerText.includes('intense') || lowerText.includes('excruciating') ? 'severe' :
                      lowerText.includes('mild') || lowerText.includes('slight') ? 'mild' : 'moderate';
      symptoms.push({ type: 'reported', category: 'pain', severity });
    }

    // Itching-related
    if (lowerText.includes('itch') || lowerText.includes('itchy') || lowerText.includes('itching')) {
      symptoms.push({ type: 'reported', category: 'itching', severity: 'moderate' });
    }

    // Discharge-related
    if (lowerText.includes('discharge') || lowerText.includes('fluid') || lowerText.includes('leak') || lowerText.includes('drip')) {
      const severity = lowerText.includes('heavy') || lowerText.includes('lots') || lowerText.includes('much') ? 'severe' : 'moderate';
      symptoms.push({ type: 'reported', category: 'discharge', severity });
    }

    // Rash/redness-related
    if (lowerText.includes('red') || lowerText.includes('redness') || lowerText.includes('inflamed') || lowerText.includes('inflammation')) {
      symptoms.push({ type: 'reported', category: 'redness', severity: 'moderate' });
    }

    // Bumps/growths-related
    if (lowerText.includes('bump') || lowerText.includes('lump') || lowerText.includes('growth') || lowerText.includes('wart')) {
      symptoms.push({ type: 'reported', category: 'lesion', severity: 'moderate' });
    }

    // Vesicles/blisters-related
    if (lowerText.includes('blister') || lowerText.includes('vesicle') || lowerText.includes('fluid-filled') || lowerText.includes('bubble')) {
      symptoms.push({ type: 'reported', category: 'vesicles', severity: 'moderate' });
    }

    // Ulcer-related
    if (lowerText.includes('ulcer') || lowerText.includes('sore') || lowerText.includes('open wound') || lowerText.includes('crater')) {
      symptoms.push({ type: 'reported', category: 'ulcer', severity: 'severe' });
    }

    // Urination symptoms
    if (lowerText.includes('urination') || lowerText.includes('urinating') || lowerText.includes('pee') || lowerText.includes('burning')) {
      symptoms.push({ type: 'reported', category: 'dysuria', severity: 'moderate' });
    }

    return symptoms;
  }

  // Image analysis simulation (in actual implementation, use machine learning models)
  analyzeImage(imageData?: string): VisualFeatures {
    // Simulation: randomly generate genitalia detection and lesion features
    const hasGenitalia = Math.random() > 0.3; // 70% chance of detecting genitalia
    
    if (!hasGenitalia) {
      return { hasGenitalia: false };
    }

    // Simulate visual features if symptoms are present
    const hasSymptoms = this.symptoms.length > 0;
    
    if (!hasSymptoms) {
      return { 
        hasGenitalia: true,
        lesionType: 'none',
        inflammation: 'none'
      };
    }

    // Estimate visual features based on symptoms
    const symptomTypes = this.symptoms.map(s => s.category);
    
    let lesionType: VisualFeatures['lesionType'] = 'none';
    let color: VisualFeatures['color'] = 'skin-colored';
    let pattern: VisualFeatures['pattern'] = 'single';
    let inflammation: VisualFeatures['inflammation'] = 'none';
    let texture: VisualFeatures['texture'] = 'smooth';

    if (symptomTypes.includes('vesicles')) {
      lesionType = 'vesicles';
      color = 'clear';
      pattern = 'clustered';
      texture = 'fluid-filled';
      inflammation = 'moderate';
    } else if (symptomTypes.includes('lesion')) {
      lesionType = 'warts';
      color = 'skin-colored';
      pattern = 'cauliflower';
      texture = 'rough';
      inflammation = 'mild';
    } else if (symptomTypes.includes('ulcer')) {
      lesionType = 'ulcers';
      color = 'red';
      pattern = 'single';
      texture = 'smooth';
      inflammation = 'severe';
    } else if (symptomTypes.includes('discharge')) {
      lesionType = 'discharge';
      color = 'yellow';
      inflammation = 'moderate';
    } else if (symptomTypes.includes('redness')) {
      lesionType = 'rash';
      color = 'red';
      pattern = 'scattered';
      inflammation = 'moderate';
    }

    return {
      hasGenitalia: true,
      lesionType,
      color,
      pattern,
      inflammation,
      texture
    };
  }

  // Main diagnostic engine logic
  diagnose(): DiagnosisResult {
    // Integrate symptoms and visual features for diagnosis
    const reportedSymptoms = this.symptoms.filter(s => s.type === 'reported');
    const visualSymptoms = this.symptoms.filter(s => s.type === 'visual');

    // If no symptoms
    if (reportedSymptoms.length === 0 && (!this.visualFeatures.hasGenitalia || this.visualFeatures.lesionType === 'none')) {
      return {
        primaryDiagnosis: {
          icd11Code: ICD11_CODES.NORMAL,
          name: 'No abnormality detected',
          confidence: 95
        },
        differentialDiagnoses: [],
        reasoning: 'No reported symptoms or visual abnormalities were detected.',
        recommendedActions: [
          'Continue regular health checkups',
          'Perform self-checks if symptoms appear',
          'Practice safe sexual behaviors'
        ],
        urgency: 'low'
      };
    }

    // Diagnostic logic based on symptom patterns
    const symptomCategories = reportedSymptoms.map(s => s.category);
    const hasVisualLesions = this.visualFeatures.lesionType && this.visualFeatures.lesionType !== 'none';

    // Herpes diagnostic logic
    if (symptomCategories.includes('vesicles') || 
        (this.visualFeatures.lesionType === 'vesicles' && this.visualFeatures.texture === 'fluid-filled')) {
      return this.diagnoseHerpes();
    }

    // Syphilis diagnostic logic
    if (symptomCategories.includes('ulcer') || 
        (this.visualFeatures.lesionType === 'ulcers' && this.visualFeatures.inflammation === 'severe')) {
      return this.diagnoseSyphilis();
    }

    // HPV/Genital warts diagnostic logic
    if (symptomCategories.includes('lesion') || 
        (this.visualFeatures.lesionType === 'warts' && this.visualFeatures.pattern === 'cauliflower')) {
      return this.diagnoseHPV();
    }

    // Chlamydia/Gonorrhea diagnostic logic
    if (symptomCategories.includes('discharge') || symptomCategories.includes('dysuria') ||
        this.visualFeatures.lesionType === 'discharge') {
      return this.diagnoseUrethritis();
    }

    // Candida diagnostic logic
    if (symptomCategories.includes('itching') && 
        (symptomCategories.includes('discharge') || this.visualFeatures.color === 'white')) {
      return this.diagnoseCandida();
    }

    // General inflammation
    if (symptomCategories.includes('redness') || symptomCategories.includes('pain')) {
      return this.diagnoseInflammation();
    }

    // Default diagnosis
    return this.diagnoseGeneral();
  }

  private diagnoseHerpes(): DiagnosisResult {
    return {
      primaryDiagnosis: {
        icd11Code: ICD11_CODES.HERPES,
        name: 'Suspected Genital Herpes Infection',
        confidence: 85
      },
      differentialDiagnoses: [
        { icd11Code: ICD11_CODES.SYPHILIS, name: 'Syphilis', probability: 15 },
        { icd11Code: '1F20', name: 'Contact Dermatitis', probability: 10 }
      ],
      reasoning: 'The combination of vesicular lesions and pain strongly suggests genital herpes infection.',
      recommendedActions: [
        'Seek immediate consultation with a urologist or STI specialist',
        'PCR testing is needed for definitive diagnosis',
        'Avoid sexual contact to prevent partner transmission',
        'Early antiviral treatment is most effective'
      ],
      urgency: 'high'
    };
  }

  private diagnoseSyphilis(): DiagnosisResult {
    return {
      primaryDiagnosis: {
        icd11Code: ICD11_CODES.SYPHILIS,
        name: 'Suspected Syphilis',
        confidence: 80
      },
      differentialDiagnoses: [
        { icd11Code: ICD11_CODES.HERPES, name: 'Genital Herpes', probability: 20 },
        { icd11Code: '1F20', name: 'Traumatic Ulcer', probability: 15 }
      ],
      reasoning: 'The presence of painless ulcers suggests primary syphilis lesions (chancre).',
      recommendedActions: [
        'Seek urgent medical attention immediately',
        'Serological testing (RPR, TPLA) is required',
        'Partner testing is also necessary',
        'Early treatment can achieve complete cure'
      ],
      urgency: 'urgent'
    };
  }

  private diagnoseHPV(): DiagnosisResult {
    return {
      primaryDiagnosis: {
        icd11Code: ICD11_CODES.HPV_WARTS,
        name: 'Suspected Genital Warts (HPV Infection)',
        confidence: 90
      },
      differentialDiagnoses: [
        { icd11Code: '2F20', name: 'Seborrheic Keratosis', probability: 10 },
        { icd11Code: '1F21', name: 'Folliculitis', probability: 5 }
      ],
      reasoning: 'Cauliflower-like warty lesions strongly suggest HPV-induced genital warts.',
      recommendedActions: [
        'Consult with a urologist or dermatologist',
        'Tissue diagnosis for definitive confirmation is recommended',
        'Consider partner screening',
        'Treatment options include surgical removal, cryotherapy, and topical medications'
      ],
      urgency: 'moderate'
    };
  }

  private diagnoseUrethritis(): DiagnosisResult {
    const hasDischarge = this.symptoms.some(s => s.category === 'discharge');
    const hasDysuria = this.symptoms.some(s => s.category === 'dysuria');
    
    if (hasDischarge && hasDysuria) {
      return {
        primaryDiagnosis: {
          icd11Code: ICD11_CODES.GONORRHEA,
          name: 'Suspected Gonococcal Urethritis',
          confidence: 75
        },
        differentialDiagnoses: [
          { icd11Code: ICD11_CODES.CHLAMYDIA, name: 'Chlamydial Urethritis', probability: 60 },
          { icd11Code: '1A96', name: 'Non-specific Urethritis', probability: 30 }
        ],
        reasoning: 'Purulent discharge with dysuria suggests bacterial urethritis. Differentiation between gonorrhea and chlamydia is needed.',
        recommendedActions: [
          'Consult with a urologist',
          'Urine testing and discharge culture for pathogen identification is necessary',
          'Simultaneous partner treatment is important',
          'Appropriate antibiotic therapy is required'
        ],
        urgency: 'high'
      };
    } else {
      return {
        primaryDiagnosis: {
          icd11Code: ICD11_CODES.CHLAMYDIA,
          name: 'Suspected Chlamydia Infection',
          confidence: 70
        },
        differentialDiagnoses: [
          { icd11Code: ICD11_CODES.GONORRHEA, name: 'Gonorrhea', probability: 40 },
          { icd11Code: '1A96', name: 'Non-specific Urethritis', probability: 25 }
        ],
        reasoning: 'Mild symptoms suggest chlamydia infection.',
        recommendedActions: [
          'Consult with a urologist or STI specialist',
          'PCR testing for definitive diagnosis is recommended',
          'Partner testing and treatment is also necessary',
          'Appropriate antibiotic treatment can achieve complete cure'
        ],
        urgency: 'moderate'
      };
    }
  }

  private diagnoseCandida(): DiagnosisResult {
    return {
      primaryDiagnosis: {
        icd11Code: ICD11_CODES.CANDIDA,
        name: 'Suspected Candida Balanitis',
        confidence: 80
      },
      differentialDiagnoses: [
        { icd11Code: '1F20', name: 'Contact Dermatitis', probability: 20 },
        { icd11Code: '1F21', name: 'Seborrheic Dermatitis', probability: 15 }
      ],
      reasoning: 'Itching with white discharge suggests candida infection.',
      recommendedActions: [
        'Consult with a urologist or dermatologist',
        'Fungal testing for definitive diagnosis is recommended',
        'Antifungal medication treatment is effective',
        'Maintain cleanliness and dryness'
      ],
      urgency: 'moderate'
    };
  }

  private diagnoseInflammation(): DiagnosisResult {
    return {
      primaryDiagnosis: {
        icd11Code: '1F20',
        name: 'Suspected Non-specific Inflammation',
        confidence: 60
      },
      differentialDiagnoses: [
        { icd11Code: ICD11_CODES.CHLAMYDIA, name: 'Chlamydia Infection', probability: 30 },
        { icd11Code: ICD11_CODES.CANDIDA, name: 'Candida Infection', probability: 25 },
        { icd11Code: '1F21', name: 'Contact Dermatitis', probability: 20 }
      ],
      reasoning: 'Inflammatory symptoms are present but lack specific findings, requiring detailed examination.',
      recommendedActions: [
        'Consult with a urologist for detailed examination',
        'Exclusion of infectious diseases is important',
        'Seek early consultation if symptoms worsen',
        'Maintain good hygiene'
      ],
      urgency: 'moderate'
    };
  }

  private diagnoseGeneral(): DiagnosisResult {
    return {
      primaryDiagnosis: {
        icd11Code: '1A96',
        name: 'Suspected STI (Requires Further Investigation)',
        confidence: 50
      },
      differentialDiagnoses: [
        { icd11Code: ICD11_CODES.CHLAMYDIA, name: 'Chlamydia Infection', probability: 40 },
        { icd11Code: ICD11_CODES.GONORRHEA, name: 'Gonorrhea', probability: 30 },
        { icd11Code: ICD11_CODES.CANDIDA, name: 'Candida Infection', probability: 25 }
      ],
      reasoning: 'Symptoms suggest possible STI, but definitive diagnosis requires detailed examination.',
      recommendedActions: [
        'Consult with a urologist or STI specialist',
        'Comprehensive STI testing panel is recommended',
        'Consider partner screening',
        'Seek early consultation before symptoms worsen'
      ],
      urgency: 'moderate'
    };
  }

  reset() {
    this.symptoms = [];
    this.visualFeatures = { hasGenitalia: false };
  }
}