import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { loginSchema, insertTermSchema, updateTermSchema } from "@shared/schema";
import { z } from "zod";
import express from "express";
import path from "path";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static data files for GitHub Pages compatibility
  app.use('/data', express.static(path.resolve(process.cwd(), 'data')));

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: { id: user.id, username: user.username } });
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Terms routes
  app.get("/api/terms", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let terms;
      if (search) {
        terms = await storage.searchTerms(search as string);
      } else if (category && category !== "all") {
        terms = await storage.getTermsByCategory(category as string);
      } else {
        terms = await storage.getTerms();
      }
      
      res.json(terms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch terms" });
    }
  });

  app.get("/api/terms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const term = await storage.getTerm(id);
      
      if (!term) {
        return res.status(404).json({ message: "Term not found" });
      }
      
      res.json(term);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch term" });
    }
  });

  app.post("/api/terms", requireAuth, async (req, res) => {
    try {
      const termData = insertTermSchema.parse(req.body);
      const term = await storage.createTerm(termData);
      res.status(201).json(term);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create term" });
    }
  });

  app.put("/api/terms/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const termData = updateTermSchema.parse({ ...req.body, id });
      
      const updatedTerm = await storage.updateTerm(termData);
      if (!updatedTerm) {
        return res.status(404).json({ message: "Term not found" });
      }
      
      res.json(updatedTerm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update term" });
    }
  });

  app.delete("/api/terms/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTerm(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Term not found" });
      }
      
      res.json({ message: "Term deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete term" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
