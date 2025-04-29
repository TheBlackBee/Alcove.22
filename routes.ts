import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTemplateSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/stats", async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/templates", async (req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  app.post("/api/templates", async (req, res) => {
    try {
      // Validate request body
      const templateData = {
        title: req.body.title,
        content: req.body.content,
        categoryId: await storage.getCategoryIdByName(req.body.category)
      };

      const validatedData = insertTemplateSchema.parse(templateData);
      
      // Create template
      const template = await storage.createTemplate(validatedData);
      
      // Record activity
      const activityData = {
        type: "create",
        templateId: template.id,
        templateTitle: template.title,
        language: Object.keys(template.content).length > 1 ? "multiple" : Object.keys(template.content)[0],
        userId: 1, // Default user ID for demo
      };
      
      await storage.createActivity(activityData);
      
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "An error occurred while creating the template" });
      }
    }
  });

  app.get("/api/activities", async (req, res) => {
    const activities = await storage.getRecentActivities();
    res.json(activities);
  });

  app.get("/api/activities/history", async (req, res) => {
    const activities = await storage.getAllActivities();
    res.json(activities);
  });

  app.get("/api/languages/stats", async (req, res) => {
    const languageStats = await storage.getLanguageStats();
    res.json(languageStats);
  });

  // Add a category
  app.post("/api/categories", async (req, res) => {
    try {
      const category = await storage.createCategory({
        name: req.body.name,
        color: req.body.color
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "An error occurred while creating the category" });
    }
  });

  // Record an activity
  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "An error occurred while recording the activity" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
