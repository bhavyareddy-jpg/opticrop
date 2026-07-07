import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  datetime,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Farms table - represents a user's farm/agricultural operation
 */
export const farms = mysqlTable("farms", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  totalArea: decimal("totalArea", { precision: 10, scale: 2 }), // in hectares
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Farm = typeof farms.$inferSelect;
export type InsertFarm = typeof farms.$inferInsert;

/**
 * Fields table - individual fields within a farm
 */
export const fields = mysqlTable("fields", {
  id: int("id").autoincrement().primaryKey(),
  farmId: int("farmId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  cropType: varchar("cropType", { length: 100 }).notNull(), // e.g., "wheat", "corn", "rice"
  area: decimal("area", { precision: 10, scale: 2 }).notNull(), // in hectares
  plantingDate: datetime("plantingDate"),
  expectedHarvestDate: datetime("expectedHarvestDate"),
  growthStage: mysqlEnum("growthStage", [
    "preparation",
    "germination",
    "vegetative",
    "flowering",
    "fruiting",
    "maturation",
    "harvest_ready",
  ]).default("preparation"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  status: mysqlEnum("status", ["active", "fallow", "harvested"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Field = typeof fields.$inferSelect;
export type InsertField = typeof fields.$inferInsert;

/**
 * Soil analysis records - track soil health metrics over time
 */
export const soilAnalysis = mysqlTable("soil_analysis", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("fieldId").notNull(),
  recordDate: datetime("recordDate").notNull(),
  pH: decimal("pH", { precision: 3, scale: 2 }),
  nitrogen: decimal("nitrogen", { precision: 8, scale: 2 }), // mg/kg
  phosphorus: decimal("phosphorus", { precision: 8, scale: 2 }), // mg/kg
  potassium: decimal("potassium", { precision: 8, scale: 2 }), // mg/kg
  moisture: decimal("moisture", { precision: 5, scale: 2 }), // percentage
  organicMatter: decimal("organicMatter", { precision: 5, scale: 2 }), // percentage
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SoilAnalysis = typeof soilAnalysis.$inferSelect;
export type InsertSoilAnalysis = typeof soilAnalysis.$inferInsert;

/**
 * Yield predictions - estimated and actual yields per field
 */
export const yieldPredictions = mysqlTable("yield_predictions", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("fieldId").notNull(),
  predictionDate: datetime("predictionDate").notNull(),
  estimatedYield: decimal("estimatedYield", { precision: 10, scale: 2 }), // in kg/hectare
  actualYield: decimal("actualYield", { precision: 10, scale: 2 }), // in kg/hectare
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0-1 confidence level
  factors: json("factors"), // JSON object with contributing factors
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type YieldPrediction = typeof yieldPredictions.$inferSelect;
export type InsertYieldPrediction = typeof yieldPredictions.$inferInsert;

/**
 * Resource recommendations - fertilizer, water, pesticide suggestions
 */
export const resourceRecommendations = mysqlTable("resource_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("fieldId").notNull(),
  recommendationDate: datetime("recommendationDate").notNull(),
  fertilizerType: varchar("fertilizerType", { length: 100 }),
  fertilizerQuantity: decimal("fertilizerQuantity", { precision: 10, scale: 2 }), // kg/hectare
  waterRequirement: decimal("waterRequirement", { precision: 10, scale: 2 }), // mm
  pesticides: json("pesticides"), // JSON array of pesticide recommendations
  rationale: text("rationale"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ResourceRecommendation = typeof resourceRecommendations.$inferSelect;
export type InsertResourceRecommendation = typeof resourceRecommendations.$inferInsert;

/**
 * Calendar events - planting, irrigation, fertilization, harvest events
 */
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("fieldId").notNull(),
  eventType: mysqlEnum("eventType", [
    "planting",
    "irrigation",
    "fertilization",
    "pesticide_application",
    "harvest",
    "other",
  ]).notNull(),
  eventDate: datetime("eventDate").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

/**
 * Alerts - actionable alerts and recommendations
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("fieldId").notNull(),
  alertType: mysqlEnum("alertType", [
    "low_soil_moisture",
    "high_soil_moisture",
    "low_nitrogen",
    "low_phosphorus",
    "low_potassium",
    "disease_risk",
    "pest_risk",
    "upcoming_harvest",
    "weather_alert",
    "recommendation",
  ]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  message: text("message").notNull(),
  actionable: boolean("actionable").default(true),
  dismissed: boolean("dismissed").default(false),
  dismissedAt: timestamp("dismissedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * Weather data cache - store weather data per field location
 */
export const weatherData = mysqlTable("weather_data", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("fieldId").notNull(),
  recordDate: datetime("recordDate").notNull(),
  temperature: decimal("temperature", { precision: 5, scale: 2 }), // Celsius
  minTemperature: decimal("minTemperature", { precision: 5, scale: 2 }),
  maxTemperature: decimal("maxTemperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }), // percentage
  rainfall: decimal("rainfall", { precision: 8, scale: 2 }), // mm
  windSpeed: decimal("windSpeed", { precision: 5, scale: 2 }), // km/h
  condition: varchar("condition", { length: 100 }), // e.g., "sunny", "rainy", "cloudy"
  isForecast: boolean("isForecast").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = typeof weatherData.$inferInsert;

/**
 * Chat history - store AI chat conversations
 */
export const chatHistory = mysqlTable("chat_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fieldId: int("fieldId"), // optional - context field
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  message: text("message").notNull(),
  context: json("context"), // JSON object with field data context
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;

/**
 * Reports - generated farm and field reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  farmId: int("farmId").notNull(),
  fieldId: int("fieldId"), // null for farm-wide reports
  reportType: mysqlEnum("reportType", [
    "field_summary",
    "farm_summary",
    "soil_analysis",
    "yield_analysis",
    "resource_usage",
  ]).notNull(),
  reportData: json("reportData").notNull(), // JSON with report content
  generatedAt: timestamp("generatedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
