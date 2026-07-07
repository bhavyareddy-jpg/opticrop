import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  farms,
  fields,
  soilAnalysis,
  yieldPredictions,
  resourceRecommendations,
  calendarEvents,
  alerts,
  weatherData,
  chatHistory,
  reports,
  User,
  Farm,
  Field,
  SoilAnalysis,
  YieldPrediction,
  ResourceRecommendation,
  CalendarEvent,
  Alert,
  WeatherData,
  ChatHistory,
  Report,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ FARM OPERATIONS ============

export async function createFarm(
  userId: number,
  farmData: Omit<typeof farms.$inferInsert, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(farms).values({
    userId,
    ...farmData,
  });

  return result;
}

export async function getFarmsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(farms).where(eq(farms.userId, userId));
}

export async function getFarmById(farmId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(farms).where(eq(farms.id, farmId)).limit(1);
  return result[0];
}

export async function updateFarm(farmId: number, data: Partial<typeof farms.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(farms).set(data).where(eq(farms.id, farmId));
}

export async function deleteFarm(farmId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(farms).where(eq(farms.id, farmId));
}

// ============ FIELD OPERATIONS ============

export async function createField(fieldData: typeof fields.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(fields).values(fieldData);
}

export async function getFieldsByFarmId(farmId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(fields).where(eq(fields.farmId, farmId));
}

export async function getFieldById(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(fields).where(eq(fields.id, fieldId)).limit(1);
  return result[0];
}

export async function updateField(fieldId: number, data: Partial<typeof fields.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(fields).set(data).where(eq(fields.id, fieldId));
}

export async function deleteField(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(fields).where(eq(fields.id, fieldId));
}

// ============ SOIL ANALYSIS OPERATIONS ============

export async function createSoilAnalysis(data: typeof soilAnalysis.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(soilAnalysis).values(data);
}

export async function getSoilAnalysisByFieldId(fieldId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(soilAnalysis)
    .where(eq(soilAnalysis.fieldId, fieldId))
    .orderBy(desc(soilAnalysis.recordDate))
    .limit(limit);
}

export async function getLatestSoilAnalysis(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(soilAnalysis)
    .where(eq(soilAnalysis.fieldId, fieldId))
    .orderBy(desc(soilAnalysis.recordDate))
    .limit(1);

  return result[0];
}

// ============ YIELD PREDICTION OPERATIONS ============

export async function createYieldPrediction(data: typeof yieldPredictions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(yieldPredictions).values(data);
}

export async function getYieldPredictionsByFieldId(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(yieldPredictions)
    .where(eq(yieldPredictions.fieldId, fieldId))
    .orderBy(desc(yieldPredictions.predictionDate));
}

export async function getLatestYieldPrediction(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(yieldPredictions)
    .where(eq(yieldPredictions.fieldId, fieldId))
    .orderBy(desc(yieldPredictions.predictionDate))
    .limit(1);

  return result[0];
}

// ============ RESOURCE RECOMMENDATION OPERATIONS ============

export async function createResourceRecommendation(
  data: typeof resourceRecommendations.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(resourceRecommendations).values(data);
}

export async function getResourceRecommendationsByFieldId(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(resourceRecommendations)
    .where(eq(resourceRecommendations.fieldId, fieldId))
    .orderBy(desc(resourceRecommendations.recommendationDate));
}

export async function getLatestResourceRecommendation(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(resourceRecommendations)
    .where(eq(resourceRecommendations.fieldId, fieldId))
    .orderBy(desc(resourceRecommendations.recommendationDate))
    .limit(1);

  return result[0];
}

// ============ CALENDAR EVENT OPERATIONS ============

export async function createCalendarEvent(data: typeof calendarEvents.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(calendarEvents).values(data);
}

export async function getCalendarEventsByFieldId(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(calendarEvents)
    .where(eq(calendarEvents.fieldId, fieldId))
    .orderBy(calendarEvents.eventDate);
}

export async function getUpcomingCalendarEvents(fieldId: number, daysAhead: number = 30) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return db
    .select()
    .from(calendarEvents)
    .where(
      and(
        eq(calendarEvents.fieldId, fieldId),
        gte(calendarEvents.eventDate, new Date()),
        lte(calendarEvents.eventDate, futureDate)
      )
    )
    .orderBy(calendarEvents.eventDate);
}

export async function updateCalendarEvent(
  eventId: number,
  data: Partial<typeof calendarEvents.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(calendarEvents).set(data).where(eq(calendarEvents.id, eventId));
}

export async function deleteCalendarEvent(eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(calendarEvents).where(eq(calendarEvents.id, eventId));
}

// ============ ALERT OPERATIONS ============

export async function createAlert(data: typeof alerts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(alerts).values(data);
}

export async function getAlertsByFieldId(fieldId: number, dismissed: boolean = false) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(alerts)
    .where(and(eq(alerts.fieldId, fieldId), eq(alerts.dismissed, dismissed)))
    .orderBy(desc(alerts.createdAt));
}

export async function dismissAlert(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(alerts)
    .set({ dismissed: true, dismissedAt: new Date() })
    .where(eq(alerts.id, alertId));
}

// ============ WEATHER DATA OPERATIONS ============

export async function createWeatherData(data: typeof weatherData.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(weatherData).values(data);
}

export async function getWeatherDataByFieldId(fieldId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(weatherData)
    .where(eq(weatherData.fieldId, fieldId))
    .orderBy(desc(weatherData.recordDate))
    .limit(limit);
}

export async function getLatestWeatherData(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(weatherData)
    .where(eq(weatherData.fieldId, fieldId))
    .orderBy(desc(weatherData.recordDate))
    .limit(1);

  return result[0];
}

// ============ CHAT HISTORY OPERATIONS ============

export async function createChatMessage(data: typeof chatHistory.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(chatHistory).values(data);
}

export async function getChatHistoryByUserId(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(chatHistory)
    .where(eq(chatHistory.userId, userId))
    .orderBy(desc(chatHistory.createdAt))
    .limit(limit);
}

export async function getChatHistoryByFieldId(fieldId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(chatHistory)
    .where(eq(chatHistory.fieldId, fieldId))
    .orderBy(desc(chatHistory.createdAt))
    .limit(limit);
}

// ============ REPORT OPERATIONS ============

export async function createReport(data: typeof reports.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(reports).values(data);
}

export async function getReportsByFarmId(farmId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(reports)
    .where(eq(reports.farmId, farmId))
    .orderBy(desc(reports.generatedAt));
}

export async function getReportsByFieldId(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(reports)
    .where(eq(reports.fieldId, fieldId))
    .orderBy(desc(reports.generatedAt));
}
