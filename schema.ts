import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  avatar: true,
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  color: true,
});

// Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: jsonb("content").notNull().$type<Record<string, string>>(), // Multilingual content
  categoryId: integer("category_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  title: true,
  content: true,
  categoryId: true,
});

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'send', 'create', 'edit'
  templateId: integer("template_id"),
  templateTitle: text("template_title").notNull(),
  recipient: text("recipient"),
  userId: integer("user_id"),
  language: text("language").notNull(), // Language code or 'multiple'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  templateId: true,
  templateTitle: true,
  recipient: true,
  userId: true,
  language: true,
});

// Stats table
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  totalResponses: integer("total_responses").notNull(),
  responseTrend: integer("response_trend").notNull(),
  avgResponseTime: text("avg_response_time").notNull(),
  responseTimeTrend: integer("response_time_trend").notNull(),
  satisfaction: integer("satisfaction").notNull(),
  satisfactionTrend: integer("satisfaction_trend").notNull(),
  languagesUsed: integer("languages_used").notNull(),
  languagesList: text("languages_list").array().notNull(),
});

export const insertStatsSchema = createInsertSchema(stats).pick({
  totalResponses: true,
  responseTrend: true,
  avgResponseTime: true,
  responseTimeTrend: true,
  satisfaction: true,
  satisfactionTrend: true,
  languagesUsed: true,
  languagesList: true,
});

// Language stats table
export const languageStats = pgTable("language_stats", {
  id: serial("id").primaryKey(),
  language: text("language").notNull(),
  code: text("code").notNull(),
  percentage: integer("percentage").notNull(),
  color: text("color").notNull(),
});

export const insertLanguageStatSchema = createInsertSchema(languageStats).pick({
  language: true,
  code: true,
  percentage: true,
  color: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Stat = typeof stats.$inferSelect;
export type InsertStat = z.infer<typeof insertStatsSchema>;

export type LanguageStat = typeof languageStats.$inferSelect;
export type InsertLanguageStat = z.infer<typeof insertLanguageStatSchema>;
