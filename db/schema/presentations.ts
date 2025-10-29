import { pgTable, text, timestamp, integer, jsonb, index, varchar, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const presentations = pgTable("presentations", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    theme: text("theme").notNull().default("modern"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    userIdIdx: index("presentations_user_id_idx").on(table.userId),
    createdAtIdx: index("presentations_created_at_idx").on(table.createdAt),
}));

export const slides = pgTable("slides", {
    id: text("id").primaryKey(),
    presentationId: text("presentation_id")
        .notNull()
        .references(() => presentations.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    type: text("type").notNull().default("content"),
    title: text("title").notNull(),
    content: jsonb("content").notNull(),
    templateId: text("template_id").references(() => slideTemplates.id),
    layoutType: varchar("layout_type", { length: 100 }),
    backgroundColor: varchar("background_color", { length: 20 }).default("#ffffff"),
    backgroundImage: text("background_image"),
    transitionEffect: varchar("transition_effect", { length: 50 }).default("none"),
    transitionDuration: integer("transition_duration").default(300),
    speakerNotes: text("speaker_notes"),
    isHidden: boolean("is_hidden").default(false),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    presentationIdIdx: index("slides_presentation_id_idx").on(table.presentationId),
    presentationOrderIdx: index("slides_presentation_order_idx").on(table.presentationId, table.order),
    templateIdIdx: index("slides_template_id_idx").on(table.templateId),
}));

// Slide Templates
export const slideTemplates = pgTable("slide_templates", {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    description: text("description"),
    layoutConfig: jsonb("layout_config").notNull(),
    thumbnail: text("thumbnail"),
    isDefault: boolean("is_default").default(false),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    categoryIdx: index("slide_templates_category_idx").on(table.category),
    isActiveIdx: index("slide_templates_is_active_idx").on(table.isActive),
}));

// Slide Elements
export const slideElements = pgTable("slide_elements", {
    id: text("id").primaryKey(),
    slideId: text("slide_id")
        .notNull()
        .references(() => slides.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(), // text, image, shape, chart, etc.
    content: jsonb("content").notNull(),
    position: jsonb("position").notNull(), // { x, y, width, height }
    styling: jsonb("styling"), // { fontSize, color, fontFamily, etc. }
    zIndex: integer("z_index").default(0),
    isLocked: boolean("is_locked").default(false),
    isVisible: boolean("is_visible").default(true),
    animation: jsonb("animation"), // animation settings
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    slideIdIdx: index("slide_elements_slide_id_idx").on(table.slideId),
    typeIdx: index("slide_elements_type_idx").on(table.type),
    zIndexIdx: index("slide_elements_z_index_idx").on(table.zIndex),
}));

// Presentation Settings
export const presentationSettings = pgTable("presentation_settings", {
    id: text("id").primaryKey(),
    presentationId: text("presentation_id")
        .notNull()
        .references(() => presentations.id, { onDelete: "cascade" }),
    aspectRatio: varchar("aspect_ratio", { length: 20 }).default("16:9"),
    theme: varchar("theme", { length: 50 }).notNull().default("modern"),
    transitionStyle: varchar("transition_style", { length: 50 }).default("fade"),
    autoPlay: boolean("auto_play").default(false),
    autoPlayDelay: integer("auto_play_delay").default(5000), // milliseconds
    loopPresentation: boolean("loop_presentation").default(false),
    showSlideNumbers: boolean("show_slide_numbers").default(false),
    showProgressBar: boolean("show_progress_bar").default(true),
    allowFullscreen: boolean("allow_fullscreen").default(true),
    defaultFont: varchar("default_font", { length: 100 }).default("Inter"),
    primaryColor: varchar("primary_color", { length: 20 }).default("#3b82f6"),
    secondaryColor: varchar("secondary_color", { length: 20 }).default("#64748b"),
    backgroundColor: varchar("background_color", { length: 20 }).default("#ffffff"),
    textColor: varchar("text_color", { length: 20 }).default("#1f2937"),
    accentColor: varchar("accent_color", { length: 20 }).default("#f59e0b"),
    customCSS: text("custom_css"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    presentationIdIdx: index("presentation_settings_presentation_id_idx").on(table.presentationId).unique(),
}));

// Export types for TypeScript usage
export type Presentation = typeof presentations.$inferSelect;
export type NewPresentation = typeof presentations.$inferInsert;
export type Slide = typeof slides.$inferSelect;
export type NewSlide = typeof slides.$inferInsert;
export type SlideTemplate = typeof slideTemplates.$inferSelect;
export type NewSlideTemplate = typeof slideTemplates.$inferInsert;
export type SlideElement = typeof slideElements.$inferSelect;
export type NewSlideElement = typeof slideElements.$inferInsert;
export type PresentationSettings = typeof presentationSettings.$inferSelect;
export type NewPresentationSettings = typeof presentationSettings.$inferInsert;

// Content types for slide content JSON
export interface SlideContent {
    text?: string;
    bulletPoints?: string[];
    image?: string;
    layout?: string;
    speakerNotes?: string;
    elements?: SlideElementData[];
}

export interface SlideElementData {
    id: string;
    type: ElementType;
    content: ElementContent;
    position: ElementPosition;
    styling?: ElementStyling;
    animation?: ElementAnimation;
}

export type ElementType =
    | 'text'
    | 'heading'
    | 'subheading'
    | 'bullet'
    | 'image'
    | 'shape'
    | 'chart'
    | 'table'
    | 'icon'
    | 'video'
    | 'code'
    | 'quote';

export interface ElementContent {
    text?: string;
    imageUrl?: string;
    altText?: string;
    chartType?: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
    chartData?: ChartData;
    tableData?: TableData;
    icon?: string;
    videoUrl?: string;
    code?: string;
    language?: string;
    bulletPoints?: string[];
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string[];
        borderColor?: string[];
    }[];
}

export interface TableData {
    headers: string[];
    rows: string[][];
}

export interface ElementPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ElementStyling {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    opacity?: number;
    rotation?: number;
}

export interface ElementAnimation {
    type?: 'fadeIn' | 'slideIn' | 'zoomIn' | 'bounce' | 'rotate';
    duration?: number;
    delay?: number;
    direction?: 'left' | 'right' | 'up' | 'down';
}

export interface TemplateLayoutConfig {
    name: string;
    category: TemplateCategory;
    description: string;
    elements: TemplateElement[];
    defaultStyles: TemplateStyles;
    placeholders: TemplatePlaceholder[];
}

export type TemplateCategory =
    | 'basic'
    | 'content'
    | 'media'
    | 'data'
    | 'timeline'
    | 'comparison'
    | 'process'
    | 'structure'
    | 'gallery'
    | 'specialized';

export interface TemplateElement {
    id: string;
    type: ElementType;
    defaultPosition: ElementPosition;
    defaultStyling: ElementStyling;
    placeholder?: string;
    isRequired: boolean;
}

export interface TemplateStyles {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: number;
}

export interface TemplatePlaceholder {
    id: string;
    type: string;
    label: string;
    defaultValue?: string;
    position: ElementPosition;
}

export interface PresentationTheme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
}