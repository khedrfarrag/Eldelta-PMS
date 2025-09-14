// LibreTranslate Service for dynamic translation
export interface TranslationResult {
  ar: string;
  en: string;
  status: 'auto' | 'manual' | 'pending';
}

export interface ServiceTranslation {
  name: TranslationResult;
  description: TranslationResult;
  features: TranslationResult[];
}

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

// Detect if text is in Arabic
export const isArabic = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};

// LibreTranslate service class
class LibreTranslateService {
  private baseUrl: string;
  private cache: Map<string, string>;

  constructor() {
    this.baseUrl = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
    this.cache = new Map();
  }

  // Translate text using LibreTranslate
  async translateText(text: string, targetLang: 'ar' | 'en'): Promise<string> {
    if (!text || text.trim().length === 0) return text;
    
    const sourceLang = isArabic(text) ? 'ar' : 'en';
    if (sourceLang === targetLang) return text;

    // Check cache first
    const cacheKey = `${text}-${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('LibreTranslate error:', error);
      // Return original text as fallback
      return text;
    }
  }

  // Translate multiple texts in parallel
  async translateMultiple(texts: string[], targetLang: 'ar' | 'en'): Promise<string[]> {
    const promises = texts.map(text => this.translateText(text, targetLang));
    return Promise.all(promises);
  }
}

// Create singleton instance
const translator = new LibreTranslateService();

// Export translation functions
export const translateText = (text: string, targetLang: 'ar' | 'en') => 
  translator.translateText(text, targetLang);

export const translateMultiple = (texts: string[], targetLang: 'ar' | 'en') => 
  translator.translateMultiple(texts, targetLang);

// Translate service object for display
export const translateService = (service: any, targetLang: 'ar' | 'en') => {
  // Helper function to extract text from translation object or string
  const extractText = (value: any): string => {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object' && value !== null) {
      // Check if it's a translation object with ar/en keys
      if (value.hasOwnProperty('ar') || value.hasOwnProperty('en')) {
        return value[targetLang] || value.ar || value.en || '';
      }
      // If it's not a translation object, try to get any string value
      const values = Object.values(value).filter(v => typeof v === 'string');
      return values[0] || '';
    }
    return '';
  };

  // Helper function to extract features array
  const extractFeatures = (features: any[]): string[] => {
    if (!Array.isArray(features)) return [];
    return features.map(feature => extractText(feature));
  };

  return {
    ...service,
    name: extractText(service.name),
    description: extractText(service.description),
    features: extractFeatures(service.features)
  };
};

// Create service with translations using LibreTranslate
export const createServiceWithTranslations = async (serviceData: {
  name: string;
  description: string;
  features: string[];
  status?: 'active' | 'inactive';
  order?: number;
}) => {
  const sourceLang = isArabic(serviceData.name) ? 'ar' : 'en';
  const targetLang = sourceLang === 'ar' ? 'en' : 'ar';
  
  try {
    // Translate all texts in parallel
    const [translatedName, translatedDescription, ...translatedFeatures] = await Promise.all([
      translateText(serviceData.name, targetLang),
      translateText(serviceData.description, targetLang),
      ...serviceData.features.map(feature => translateText(feature, targetLang))
    ]);
    
    const translatedService = {
      name: {
        [sourceLang]: serviceData.name,
        [targetLang]: translatedName
      },
      description: {
        [sourceLang]: serviceData.description,
        [targetLang]: translatedDescription
      },
      features: serviceData.features.map((feature, index) => ({
        [sourceLang]: feature,
        [targetLang]: translatedFeatures[index]
      })),
      status: serviceData.status || 'active',
      order: serviceData.order || 0,
      translationStatus: 'auto', // LibreTranslate translated
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return translatedService;
  } catch (error) {
    console.error('Translation failed, creating service without translation:', error);
    
    // Fallback: create service with original text only
    return {
      name: serviceData.name,
      description: serviceData.description,
      features: serviceData.features,
      status: serviceData.status || 'active',
      order: serviceData.order || 0,
      translationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
};

// Update translation manually
export const updateTranslation = (service: any, field: 'name' | 'description' | 'features', lang: 'ar' | 'en', newText: string) => {
  const updated = { ...service };
  
  if (field === 'features') {
    updated.features = updated.features.map((feature: any, index: number) => {
      if (typeof feature === 'object') {
        return { ...feature, [lang]: newText };
      }
      return { [lang]: newText };
    });
  } else {
    updated[field] = {
      ...updated[field],
      [lang]: newText
    };
  }
  
  updated.translationStatus = 'manual';
  updated.updatedAt = new Date();
  
  return updated;
};