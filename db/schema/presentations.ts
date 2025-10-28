import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
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
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    presentationIdIdx: index("slides_presentation_id_idx").on(table.presentationId),
    presentationOrderIdx: index("slides_presentation_order_idx").on(table.presentationId, table.order),
}));

// Export types for TypeScript usage
export type Presentation = typeof presentations.$inferSelect;
export type NewPresentation = typeof presentations.$inferInsert;
export type Slide = typeof slides.$inferSelect;
export type NewSlide = typeof slides.$inferInsert;

// Content types for slide content JSON
export interface SlideContent {
    text?: string;
    bulletPoints?: string[];
    image?: string;
    layout?: string;
    speakerNotes?: string;
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