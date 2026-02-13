/**
 * Multi-Language Support System (i18n)
 * Supports 15+ languages with RTL support and regional customization
 */

export type SupportedLanguage = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'zh' | 'hi' 
  | 'ar' | 'ko' | 'ru' | 'nl' | 'pl' | 'tr'

export interface Translation {
  [key: string]: string | Translation
}

export interface LanguageConfig {
  code: SupportedLanguage
  name: string
  nativeName: string
  rtl: boolean
  dateFormat: string
  currencyCode: string
}

class MultiLanguageManager {
  private currentLanguage: SupportedLanguage = 'en'
  private translations: Map<SupportedLanguage, Translation>
  private listeners: Set<(lang: SupportedLanguage) => void>

  private languageConfigs: Record<SupportedLanguage, LanguageConfig> = {
    en: { code: 'en', name: 'English', nativeName: 'English', rtl: false, dateFormat: 'MM/DD/YYYY', currencyCode: 'USD' },
    es: { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, dateFormat: 'DD/MM/YYYY', currencyCode: 'EUR' },
    fr: { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, dateFormat: 'DD/MM/YYYY', currencyCode: 'EUR' },
    de: { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, dateFormat: 'DD.MM.YYYY', currencyCode: 'EUR' },
    it: { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, dateFormat: 'DD/MM/YYYY', currencyCode: 'EUR' },
    pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, dateFormat: 'DD/MM/YYYY', currencyCode: 'BRL' },
    ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, dateFormat: 'YYYY/MM/DD', currencyCode: 'JPY' },
    zh: { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, dateFormat: 'YYYY/MM/DD', currencyCode: 'CNY' },
    hi: { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', rtl: false, dateFormat: 'DD/MM/YYYY', currencyCode: 'INR' },
    ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, dateFormat: 'DD/MM/YYYY', currencyCode: 'AED' },
    ko: { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, dateFormat: 'YYYY.MM.DD', currencyCode: 'KRW' },
    ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, dateFormat: 'DD.MM.YYYY', currencyCode: 'RUB' },
    nl: { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false, dateFormat: 'DD-MM-YYYY', currencyCode: 'EUR' },
    pl: { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false, dateFormat: 'DD.MM.YYYY', currencyCode: 'PLN' },
    tr: { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, dateFormat: 'DD.MM.YYYY', currencyCode: 'TRY' },
  }

  private translationDatabase: Record<SupportedLanguage, Translation> = {
    en: this.getEnglishTranslations(),
    es: this.getSpanishTranslations(),
    fr: this.getFrenchTranslations(),
    de: this.getGermanTranslations(),
    it: this.getItalianTranslations(),
    pt: this.getPortugueseTranslations(),
    ja: this.getJapaneseTranslations(),
    zh: this.getChineseTranslations(),
    hi: this.getHindiTranslations(),
    ar: this.getArabicTranslations(),
    ko: this.getKoreanTranslations(),
    ru: this.getRussianTranslations(),
    nl: this.getDutchTranslations(),
    pl: this.getPolishTranslations(),
    tr: this.getTurkishTranslations(),
  }

  constructor() {
    this.translations = new Map()
    this.listeners = new Set()
    this.loadTranslations()
    this.detectBrowserLanguage()
  }

  private getEnglishTranslations(): Translation {
    return {
      app: {
        name: 'EcoSort',
        subtitle: 'AI-Powered Waste Classification for Sustainable Living',
      },
      nav: {
        home: 'Home',
        classify: 'Classify Waste',
        dashboard: 'Dashboard',
        aiHub: 'AI Hub',
        knowledge: 'Knowledge Base',
      },
      classify: {
        title: 'Waste Classification',
        uploadImage: 'Upload Image',
        takePhoto: 'Take Photo',
        classifying: 'Analyzing waste...',
        recyclable: 'Recyclable',
        organic: 'Organic',
        eWaste: 'E-Waste',
        plastic: 'Plastic',
        hazardous: 'Hazardous',
        general: 'General',
      },
      dashboard: {
        title: 'Your Impact Dashboard',
        stats: 'Statistics',
        recycled: 'Items Recycled',
        carbonSaved: 'Carbon Saved',
        eWasteTracked: 'E-Waste Tracked',
      },
      sustainability: {
        goals: 'Sustainability Goals',
        impact: 'Environmental Impact',
        community: 'Community Contribution',
      },
    }
  }

  private getSpanishTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'Clasificación de Residuos Impulsada por IA' },
      nav: { home: 'Inicio', classify: 'Clasificar', dashboard: 'Panel' },
      classify: { title: 'Clasificación de Residuos', recyclable: 'Reciclable' },
    }
  }

  private getFrenchTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'Classification des Déchets par IA' },
      nav: { home: 'Accueil', classify: 'Classer', dashboard: 'Tableau de Bord' },
      classify: { title: 'Classification des Déchets', recyclable: 'Recyclable' },
    }
  }

  private getGermanTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'KI-gestützte Abfallklassifizierung' },
      nav: { home: 'Startseite', classify: 'Klassifizieren', dashboard: 'Dashboard' },
      classify: { title: 'Abfallklassifizierung', recyclable: 'Recycelbar' },
    }
  }

  private getItalianTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'Classificazione dei Rifiuti con IA' },
      nav: { home: 'Home', classify: 'Classifica', dashboard: 'Pannello' },
      classify: { title: 'Classificazione dei Rifiuti', recyclable: 'Riciclabile' },
    }
  }

  private getPortugueseTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'Classificação de Resíduos com IA' },
      nav: { home: 'Início', classify: 'Classificar', dashboard: 'Painel' },
      classify: { title: 'Classificação de Resíduos', recyclable: 'Reciclável' },
    }
  }

  private getJapaneseTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'AI駆動のごみ分類システム' },
      nav: { home: 'ホーム', classify: '分類', dashboard: 'ダッシュボード' },
      classify: { title: 'ごみ分類', recyclable: 'リサイクル可能' },
    }
  }

  private getChineseTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: '人工智能垃圾分类系统' },
      nav: { home: '首页', classify: '分类', dashboard: '仪表板' },
      classify: { title: '垃圾分类', recyclable: '可回收' },
    }
  }

  private getHindiTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'एआई-संचालित अपशिष्ट वर्गीकरण' },
      nav: { home: 'होम', classify: 'वर्गीकृत करें', dashboard: 'डैशबोर्ड' },
      classify: { title: 'अपशिष्ट वर्गीकरण', recyclable: 'पुनर्चक्रण योग्य' },
    }
  }

  private getArabicTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'تصنيف النفايات الموجه بالذكاء الاصطناعي' },
      nav: { home: 'الصفحة الرئيسية', classify: 'تصنيف', dashboard: 'لوحة التحكم' },
      classify: { title: 'تصنيف النفايات', recyclable: 'قابل لإعادة التدوير' },
    }
  }

  private getKoreanTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'AI 기반 폐기물 분류 시스템' },
      nav: { home: '홈', classify: '분류', dashboard: '대시보드' },
      classify: { title: '폐기물 분류', recyclable: '재활용 가능' },
    }
  }

  private getRussianTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'Классификация отходов на основе ИИ' },
      nav: { home: 'Главная', classify: 'Классифицировать', dashboard: 'Панель' },
      classify: { title: 'Классификация отходов', recyclable: 'Перерабатываемый' },
    }
  }

  private getDutchTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'AI-aangedreven afvalclassificatie' },
      nav: { home: 'Startpagina', classify: 'Classificeer', dashboard: 'Dashboard' },
      classify: { title: 'Afvalclassificatie', recyclable: 'Recyclebaar' },
    }
  }

  private getPolishTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'Klasyfikacja odpadów zasilana sztuczną inteligencją' },
      nav: { home: 'Strona główna', classify: 'Klasyfikuj', dashboard: 'Panel' },
      classify: { title: 'Klasyfikacja odpadów', recyclable: 'Nadaje się do recyklingu' },
    }
  }

  private getTurkishTranslations(): Translation {
    return {
      app: { name: 'EcoSort', subtitle: 'Yapay Zeka Tarafından Desteklenen Atık Sınıflandırması' },
      nav: { home: 'Anasayfa', classify: 'Sınıflandır', dashboard: 'Gösterge Paneli' },
      classify: { title: 'Atık Sınıflandırması', recyclable: 'Geri Dönüştürülebilir' },
    }
  }

  private loadTranslations(): void {
    Object.entries(this.translationDatabase).forEach(([lang, trans]) => {
      this.translations.set(lang as SupportedLanguage, trans)
    })
  }

  private detectBrowserLanguage(): void {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage
      if (this.languageConfigs[browserLang]) {
        this.setLanguage(browserLang)
      }
    }
  }

  setLanguage(lang: SupportedLanguage): void {
    if (this.languageConfigs[lang]) {
      this.currentLanguage = lang
      localStorage.setItem('ecosort_language', lang)
      this.notifyListeners()
    }
  }

  getLanguage(): SupportedLanguage {
    return this.currentLanguage
  }

  getLanguageConfig(): LanguageConfig {
    return this.languageConfigs[this.currentLanguage]
  }

  getAvailableLanguages(): LanguageConfig[] {
    return Object.values(this.languageConfigs)
  }

  translate(key: string, defaultValue: string = key): string {
    const keys = key.split('.')
    let value: any = this.translations.get(this.currentLanguage)

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === 'string' ? value : defaultValue
  }

  subscribe(listener: (lang: SupportedLanguage) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage))
  }
}

export const i18nManager = new MultiLanguageManager()
