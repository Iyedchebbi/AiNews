export const CATEGORY_KEYS = ['ai', 'ml', 'robotics', 'nlp', 'cv'];

type CategoryTranslations = {
  [key: string]: {
    en: string;
    fr: string;
  };
};

export const CATEGORIES: CategoryTranslations = {
  ai: {
    en: 'Artificial Intelligence',
    fr: 'Intelligence Artificielle'
  },
  ml: {
    en: 'Machine Learning',
    fr: 'Apprentissage Automatique'
  },
  robotics: {
    en: 'Robotics',
    fr: 'Robotique'
  },
  nlp: {
    en: 'NLP',
    fr: 'TAL' // Traitement Automatique des Langues
  },
  cv: {
    en: 'Computer Vision',
    fr: 'Vision par Ordinateur'
  }
};