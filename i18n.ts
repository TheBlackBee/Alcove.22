import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Resources for each language
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      responses: 'Responses',
      history: 'History',
      settings: 'Settings',
      general: 'General',
      languages: 'Languages',
      
      // Categories
      categories: 'Categories',
      pricing: 'Pricing',
      revisions: 'Revisions',
      timeline: 'Timeline',
      addCategory: 'Add Category',
      
      // Dashboard
      overview: 'Overview of your automated responses and performance',
      totalResponses: 'Total Responses',
      responseTime: 'Response Time',
      clientSatisfaction: 'Client Satisfaction',
      languagesUsed: 'Languages Used',
      fromLastMonth: 'from last month',
      fasterThanTarget: 'faster than target',
      
      // Activity
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
      responseSent: 'response sent to',
      templateCreated: 'template created',
      templateEdited: 'template edited',
      today: 'Today',
      yesterday: 'Yesterday',
      inLanguage: 'In',
      multipleLanguages: 'Multiple languages',
      
      // Language Distribution
      languageDistribution: 'Language Distribution',
      
      // Templates
      responseTemplates: 'Response Templates',
      addTemplate: 'Add Template',
      pricingInquiry: 'Pricing Inquiry',
      revisionPolicy: 'Revision Policy',
      projectTimeline: 'Project Timeline',
      editTemplate: 'Edit',
      useTemplate: 'Use',
      
      // Form
      searchResponses: 'Search responses...',
      newResponse: 'New Response',
      
      // Common actions
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel'
    }
  },
  es: {
    translation: {
      // Navigation
      dashboard: 'Panel de Control',
      responses: 'Respuestas',
      history: 'Historial',
      settings: 'Configuración',
      general: 'General',
      languages: 'Idiomas',
      
      // Categories
      categories: 'Categorías',
      pricing: 'Precios',
      revisions: 'Revisiones',
      timeline: 'Cronograma',
      addCategory: 'Añadir Categoría',
      
      // Dashboard
      overview: 'Resumen de sus respuestas automatizadas y rendimiento',
      totalResponses: 'Respuestas Totales',
      responseTime: 'Tiempo de Respuesta',
      clientSatisfaction: 'Satisfacción del Cliente',
      languagesUsed: 'Idiomas Utilizados',
      fromLastMonth: 'desde el mes pasado',
      fasterThanTarget: 'más rápido que el objetivo',
      
      // Activity
      recentActivity: 'Actividad Reciente',
      viewAll: 'Ver Todo',
      responseSent: 'respuesta enviada a',
      templateCreated: 'plantilla creada',
      templateEdited: 'plantilla editada',
      today: 'Hoy',
      yesterday: 'Ayer',
      inLanguage: 'En',
      multipleLanguages: 'Múltiples idiomas',
      
      // Language Distribution
      languageDistribution: 'Distribución de Idiomas',
      
      // Templates
      responseTemplates: 'Plantillas de Respuesta',
      addTemplate: 'Añadir Plantilla',
      pricingInquiry: 'Consulta de Precios',
      revisionPolicy: 'Política de Revisiones',
      projectTimeline: 'Cronograma del Proyecto',
      editTemplate: 'Editar',
      useTemplate: 'Usar',
      
      // Form
      searchResponses: 'Buscar respuestas...',
      newResponse: 'Nueva Respuesta',
      
      // Common actions
      create: 'Crear',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar'
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de Bord',
      responses: 'Réponses',
      history: 'Historique',
      settings: 'Paramètres',
      general: 'Général',
      languages: 'Langues',
      
      // Categories
      categories: 'Catégories',
      pricing: 'Tarification',
      revisions: 'Révisions',
      timeline: 'Calendrier',
      addCategory: 'Ajouter une Catégorie',
      
      // Dashboard
      overview: 'Aperçu de vos réponses automatisées et performances',
      totalResponses: 'Réponses Totales',
      responseTime: 'Temps de Réponse',
      clientSatisfaction: 'Satisfaction Client',
      languagesUsed: 'Langues Utilisées',
      fromLastMonth: 'par rapport au mois dernier',
      fasterThanTarget: 'plus rapide que l\'objectif',
      
      // Activity
      recentActivity: 'Activité Récente',
      viewAll: 'Voir Tout',
      responseSent: 'réponse envoyée à',
      templateCreated: 'modèle créé',
      templateEdited: 'modèle modifié',
      today: 'Aujourd\'hui',
      yesterday: 'Hier',
      inLanguage: 'En',
      multipleLanguages: 'Plusieurs langues',
      
      // Language Distribution
      languageDistribution: 'Distribution des Langues',
      
      // Templates
      responseTemplates: 'Modèles de Réponse',
      addTemplate: 'Ajouter un Modèle',
      pricingInquiry: 'Demande de Prix',
      revisionPolicy: 'Politique de Révision',
      projectTimeline: 'Calendrier du Projet',
      editTemplate: 'Modifier',
      useTemplate: 'Utiliser',
      
      // Form
      searchResponses: 'Rechercher des réponses...',
      newResponse: 'Nouvelle Réponse',
      
      // Common actions
      create: 'Créer',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
