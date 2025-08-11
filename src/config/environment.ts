// Configuration automatique selon l'environnement
export const ENV_CONFIG = {
  // Environnement actuel
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // URLs de l'API selon l'environnement
  API_URLS: {
    development: process.env.REACT_APP_DEV_API_URL || 'http://localhost:3001/api',
    production: process.env.REACT_APP_PROD_API_URL || 'https://api.brightpath.com/api',
    test: process.env.REACT_APP_TEST_API_URL || 'http://localhost:3001/api'
  },
  
  // URL de base de l'application
  BASE_URLS: {
    development: process.env.REACT_APP_DEV_BASE_URL || 'http://localhost:3000',
    production: process.env.REACT_APP_PROD_BASE_URL || 'https://brightpath.com',
    test: process.env.REACT_APP_TEST_BASE_URL || 'http://localhost:3000'
  },
  
  // Configuration des features
  FEATURES: {
    analytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    errorMonitoring: process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true',
    debugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
    mockMode: process.env.REACT_APP_ENABLE_MOCK_MODE === 'true'
  },
  
  // Configuration de performance
  PERFORMANCE: {
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '5242880'),
    apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000')
  }
};

// Fonctions utilitaires
export const getApiUrl = (): string => {
  const env = ENV_CONFIG.NODE_ENV as keyof typeof ENV_CONFIG.API_URLS;
  return ENV_CONFIG.API_URLS[env] || ENV_CONFIG.API_URLS.development;
};

export const getBaseUrl = (): string => {
  const env = ENV_CONFIG.NODE_ENV as keyof typeof ENV_CONFIG.BASE_URLS;
  return ENV_CONFIG.BASE_URLS[env] || ENV_CONFIG.BASE_URLS.development;
};

export const isDevelopment = (): boolean => {
  return ENV_CONFIG.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return ENV_CONFIG.NODE_ENV === 'production';
};

export const isTest = (): boolean => {
  return ENV_CONFIG.NODE_ENV === 'test';
};

export const shouldUseMock = (): boolean => {
  return isDevelopment() && ENV_CONFIG.FEATURES.mockMode;
};

// Log de la configuration au démarrage
if (isDevelopment()) {
  console.log('🔧 Configuration Environnement:', {
    NODE_ENV: ENV_CONFIG.NODE_ENV,
    API_URL: getApiUrl(),
    BASE_URL: getBaseUrl(),
    FEATURES: ENV_CONFIG.FEATURES
  });
} 