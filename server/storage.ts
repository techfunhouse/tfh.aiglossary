import { users, categories, terms, type User, type InsertUser, type Category, type InsertCategory, type Term, type InsertTerm, type UpdateTerm } from "@shared/schema";
import fs from "fs";
import path from "path";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Term operations
  getTerms(): Promise<Term[]>;
  getTermsByCategory(category: string): Promise<Term[]>;
  getTerm(id: number): Promise<Term | undefined>;
  searchTerms(query: string): Promise<Term[]>;
  createTerm(term: InsertTerm): Promise<Term>;
  updateTerm(term: UpdateTerm): Promise<Term | undefined>;
  deleteTerm(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private terms: Map<number, Term>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentTermId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.terms = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentTermId = 1;
    
    this.initializeData();
  }

  private async initializeData() {
    // Create default admin user
    await this.createUser({ username: "admin", password: "admin123" });
    
    // Load categories from JSON file
    await this.loadCategories();
    
    // Load terms from JSON file
    await this.loadTerms();
  }

  private async loadCategories() {
    try {
      const categoriesPath = path.resolve(process.cwd(), "data", "categories.json");
      if (fs.existsSync(categoriesPath)) {
        const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
        for (const categoryData of categoriesData) {
          await this.createCategory(categoryData);
        }
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  private async loadTerms() {
    try {
      const termsPath = path.resolve(process.cwd(), "data", "terms.json");
      if (fs.existsSync(termsPath)) {
        const termsData = JSON.parse(fs.readFileSync(termsPath, "utf-8"));
        for (const termData of termsData) {
          await this.createTerm(termData);
        }
      }
    } catch (error) {
      console.error("Error loading terms:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name === name,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Term operations
  async getTerms(): Promise<Term[]> {
    return Array.from(this.terms.values());
  }

  async getTermsByCategory(category: string): Promise<Term[]> {
    return Array.from(this.terms.values()).filter(
      (term) => term.category === category,
    );
  }

  async getTerm(id: number): Promise<Term | undefined> {
    return this.terms.get(id);
  }

  async searchTerms(query: string): Promise<Term[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.terms.values()).filter((term) => {
      // Search in term name, definition, aliases, and tags
      const searchFields = [
        term.term,
        term.definition,
        ...(term.aliases || []),
        ...(term.tags || []),
      ].map(field => field.toLowerCase());

      return searchFields.some(field => field.includes(lowerQuery));
    });
  }

  async createTerm(insertTerm: InsertTerm): Promise<Term> {
    const id = this.currentTermId++;
    const term: Term = { ...insertTerm, id };
    this.terms.set(id, term);
    return term;
  }

  async updateTerm(updateTerm: UpdateTerm): Promise<Term | undefined> {
    const existingTerm = this.terms.get(updateTerm.id);
    if (!existingTerm) {
      return undefined;
    }

    const updatedTerm: Term = { ...existingTerm, ...updateTerm };
    this.terms.set(updateTerm.id, updatedTerm);
    return updatedTerm;
  }

  async deleteTerm(id: number): Promise<boolean> {
    return this.terms.delete(id);
  }
}

export const storage = new MemStorage();
