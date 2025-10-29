import { TemplateLayoutConfig } from '@/db/schema/presentations';
import { ALL_TEMPLATES, TEMPLATES_BY_CATEGORY } from './templates';

export class TemplateRegistry {
  private templates: Map<string, TemplateLayoutConfig> = new Map();
  private categoryMap: Map<string, TemplateLayoutConfig[]> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Register all templates
    ALL_TEMPLATES.forEach(template => {
      this.templates.set(template.name.toLowerCase().replace(/\s+/g, '-'), template);
    });

    // Initialize category map
    Object.entries(TEMPLATES_BY_CATEGORY).forEach(([category, templates]) => {
      this.categoryMap.set(category, templates);
    });
  }

  getTemplate(name: string): TemplateLayoutConfig | undefined {
    return this.templates.get(name.toLowerCase().replace(/\s+/g, '-'));
  }

  getTemplatesByCategory(category: string): TemplateLayoutConfig[] {
    return this.categoryMap.get(category) || [];
  }

  getAllTemplates(): TemplateLayoutConfig[] {
    return Array.from(this.templates.values());
  }

  searchTemplates(query: string): TemplateLayoutConfig[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  registerTemplate(template: TemplateLayoutConfig): void {
    const key = template.name.toLowerCase().replace(/\s+/g, '-');
    this.templates.set(key, template);

    // Add to category
    const categoryTemplates = this.categoryMap.get(template.category) || [];
    categoryTemplates.push(template);
    this.categoryMap.set(template.category, categoryTemplates);
  }

  getTemplateCategories(): string[] {
    return Array.from(this.categoryMap.keys());
  }
}

// Singleton instance
export const templateRegistry = new TemplateRegistry();