import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  templates, Template, InsertTemplate,
  activities, Activity, InsertActivity,
  stats, Stat, InsertStat,
  languageStats, LanguageStat, InsertLanguageStat
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryIdByName(name: string): Promise<number>;
  createCategory(category: Partial<InsertCategory>): Promise<Category>;
  
  // Template operations
  getTemplates(): Promise<any[]>; // Returning with extended fields
  getTemplateById(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Activity operations
  getRecentActivities(limit?: number): Promise<Activity[]>;
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: Partial<InsertActivity>): Promise<Activity>;
  
  // Stats operations
  getStats(): Promise<Stat | undefined>;
  updateStats(stats: Partial<InsertStat>): Promise<Stat | undefined>;
  
  // Language stats operations
  getLanguageStats(): Promise<LanguageStat[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private templates: Map<number, Template>;
  private activities: Map<number, Activity>;
  private stats: Stat | undefined;
  private languageStats: Map<number, LanguageStat>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private templateIdCounter: number;
  private activityIdCounter: number;
  private languageStatIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.templates = new Map();
    this.activities = new Map();
    this.languageStats = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.templateIdCounter = 1;
    this.activityIdCounter = 1;
    this.languageStatIdCounter = 1;
    
    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Add default user
    this.createUser({
      username: "alex.morgan",
      password: "password123",
      name: "Alex Morgan",
      avatar: undefined
    });
    
    // Add default categories
    this.createCategory({ name: "Pricing", color: "#107C10" });
    this.createCategory({ name: "Revisions", color: "#D83B01" });
    this.createCategory({ name: "Timeline", color: "#2B88D8" });
    
    // Add default templates
    this.createTemplate({
      title: "Pricing Inquiry",
      content: {
        en: "Thank you for your interest in our design services. Our standard rates are $X/hour. For your specific project, I'd estimate Y hours based on the scope discussed. I'm happy to provide a detailed quote if you'd like.",
        es: "Gracias por su interés en nuestros servicios de diseño. Nuestras tarifas estándar son $X/hora. Para su proyecto específico, estimo Y horas según el alcance discutido. Me complace proporcionarle un presupuesto detallado si lo desea.",
        fr: "Merci pour votre intérêt pour nos services de conception. Nos tarifs standards sont de $X/heure. Pour votre projet spécifique, j'estime Y heures selon la portée discutée. Je serai heureux de vous fournir un devis détaillé si vous le souhaitez."
      },
      categoryId: 1
    });
    
    this.createTemplate({
      title: "Revision Policy",
      content: {
        en: "Our design package includes 2 rounds of revisions. Additional revisions are billed at our standard hourly rate. Please ensure your feedback is comprehensive to maximize the included revision rounds.",
        es: "Nuestro paquete de diseño incluye 2 rondas de revisiones. Las revisiones adicionales se facturan según nuestra tarifa estándar por hora. Asegúrese de que sus comentarios sean exhaustivos para maximizar las rondas de revisión incluidas.",
        fr: "Notre forfait de conception comprend 2 cycles de révisions. Les révisions supplémentaires sont facturées à notre tarif horaire standard. Veuillez vous assurer que vos commentaires sont complets pour maximiser les cycles de révision inclus."
      },
      categoryId: 2
    });
    
    this.createTemplate({
      title: "Project Timeline",
      content: {
        en: "Based on your requirements, our typical timeline for this type of project is X weeks. This includes the initial concept phase (Y days), revisions (Z days), and finalization. Does this timeline work for your needs?",
        es: "Según sus requisitos, nuestro cronograma típico para este tipo de proyecto es de X semanas. Esto incluye la fase de concepto inicial (Y días), revisiones (Z días) y finalización. ¿Este cronograma funciona para sus necesidades?",
        fr: "Sur la base de vos exigences, notre calendrier typique pour ce type de projet est de X semaines. Cela comprend la phase de concept initial (Y jours), les révisions (Z jours) et la finalisation. Ce calendrier convient-il à vos besoins?"
      },
      categoryId: 3
    });
    
    // Add initial activities
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    this.createActivity({
      type: "send",
      templateId: 1,
      templateTitle: "Pricing inquiry",
      recipient: "John Smith",
      userId: 1,
      language: "en",
      timestamp: now.toISOString()
    });
    
    this.createActivity({
      type: "create",
      templateId: 3,
      templateTitle: "Timeline clarification",
      userId: 1,
      language: "es",
      timestamp: yesterday.toISOString()
    });
    
    this.createActivity({
      type: "edit",
      templateId: 2,
      templateTitle: "Revision policy",
      userId: 1,
      language: "multiple",
      timestamp: yesterday.toISOString()
    });
    
    this.createActivity({
      type: "send",
      templateId: 3,
      templateTitle: "Project scope",
      recipient: "Marie Dubois",
      userId: 1,
      language: "fr",
      timestamp: twoDaysAgo.toISOString()
    });
    
    // Add stats
    this.stats = {
      id: 1,
      totalResponses: 256,
      responseTrend: 12,
      avgResponseTime: "2.4 min",
      responseTimeTrend: 30,
      satisfaction: 92,
      satisfactionTrend: 5,
      languagesUsed: 3,
      languagesList: ["English", "Spanish", "French"]
    };
    
    // Add language stats
    this.createLanguageStat({
      language: "English",
      code: "en",
      percentage: 65,
      color: "hsl(var(--chart-1))"
    });
    
    this.createLanguageStat({
      language: "Spanish",
      code: "es",
      percentage: 25,
      color: "hsl(var(--chart-2))"
    });
    
    this.createLanguageStat({
      language: "French",
      code: "fr",
      percentage: 10,
      color: "hsl(var(--chart-3))"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryIdByName(name: string): Promise<number> {
    const category = Array.from(this.categories.values()).find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
    
    if (!category) {
      throw new Error(`Category ${name} not found`);
    }
    
    return category.id;
  }
  
  async createCategory(categoryData: Partial<InsertCategory>): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = {
      id,
      name: categoryData.name || `Category ${id}`,
      color: categoryData.color || "#000000"
    };
    this.categories.set(id, category);
    return category;
  }
  
  // Template operations
  async getTemplates(): Promise<any[]> {
    const templates = Array.from(this.templates.values());
    const result = [];
    
    for (const template of templates) {
      const category = await this.getCategoryById(template.categoryId);
      
      result.push({
        id: template.id,
        title: template.title,
        content: template.content,
        category: category?.name || "Unknown",
        categoryColor: category?.color || "#000000",
        languages: Object.keys(template.content),
        createdAt: template.createdAt
      });
    }
    
    return result;
  }
  
  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }
  
  async createTemplate(templateData: InsertTemplate): Promise<Template> {
    const id = this.templateIdCounter++;
    const now = new Date().toISOString();
    
    const template: Template = {
      ...templateData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.templates.set(id, template);
    return template;
  }
  
  async updateTemplate(id: number, templateData: Partial<InsertTemplate>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    
    if (!template) {
      return undefined;
    }
    
    const updatedTemplate: Template = {
      ...template,
      ...templateData,
      updatedAt: new Date().toISOString()
    };
    
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }
  
  // Activity operations
  async getRecentActivities(limit: number = 5): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
  
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createActivity(activityData: Partial<InsertActivity>): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date().toISOString();
    
    const activity: Activity = {
      id,
      type: activityData.type || "send",
      templateId: activityData.templateId,
      templateTitle: activityData.templateTitle || "Unknown Template",
      recipient: activityData.recipient,
      userId: activityData.userId || 1,
      language: activityData.language || "en",
      timestamp: activityData.timestamp || now
    };
    
    this.activities.set(id, activity);
    return activity;
  }
  
  // Stats operations
  async getStats(): Promise<Stat | undefined> {
    return this.stats;
  }
  
  async updateStats(statsData: Partial<InsertStat>): Promise<Stat | undefined> {
    if (!this.stats) {
      return undefined;
    }
    
    this.stats = {
      ...this.stats,
      ...statsData
    };
    
    return this.stats;
  }
  
  // Language stats operations
  async getLanguageStats(): Promise<LanguageStat[]> {
    return Array.from(this.languageStats.values());
  }
  
  private async createLanguageStat(statData: InsertLanguageStat): Promise<LanguageStat> {
    const id = this.languageStatIdCounter++;
    
    const stat: LanguageStat = {
      id,
      language: statData.language,
      code: statData.code,
      percentage: statData.percentage,
      color: statData.color
    };
    
    this.languageStats.set(id, stat);
    return stat;
  }
}

export const storage = new MemStorage();
