import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ FARM OPERATIONS ============
  farms: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getFarmsByUserId(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          location: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          totalArea: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createFarm(ctx.user.id, input as any);
        return { success: true };
      }),

    get: protectedProcedure
      .input(z.object({ farmId: z.number() }))
      .query(async ({ input }) => {
        return db.getFarmById(input.farmId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          farmId: z.number(),
          name: z.string().optional(),
          location: z.string().optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          totalArea: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { farmId, ...data } = input;
        await db.updateFarm(farmId, data as any);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ farmId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteFarm(input.farmId);
        return { success: true };
      }),
  }),

  // ============ FIELD OPERATIONS ============
  fields: router({
    listByFarm: protectedProcedure
      .input(z.object({ farmId: z.number() }))
      .query(async ({ input }) => {
        return db.getFieldsByFarmId(input.farmId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          farmId: z.number(),
          name: z.string().min(1),
          cropType: z.string().min(1),
          area: z.number().positive().transform(v => v.toString()),
          plantingDate: z.date().optional(),
          expectedHarvestDate: z.date().optional(),
          growthStage: z
            .enum([
              "preparation",
              "germination",
              "vegetative",
              "flowering",
              "fruiting",
              "maturation",
              "harvest_ready",
            ])
            .optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { area, ...rest } = input;
        await db.createField({ ...rest, area: area as any } as any);
        return { success: true };
      }),

    get: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getFieldById(input.fieldId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          fieldId: z.number(),
          name: z.string().optional(),
          cropType: z.string().optional(),
          area: z.number().optional().transform(v => v?.toString()),
          plantingDate: z.date().optional(),
          expectedHarvestDate: z.date().optional(),
          growthStage: z
            .enum([
              "preparation",
              "germination",
              "vegetative",
              "flowering",
              "fruiting",
              "maturation",
              "harvest_ready",
            ])
            .optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          status: z.enum(["active", "fallow", "harvested"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { fieldId, ...data } = input;
        const updateData = Object.entries(data).reduce((acc: any, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        }, {});
        await db.updateField(fieldId, updateData as any);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteField(input.fieldId);
        return { success: true };
      }),
  }),

  // ============ SOIL ANALYSIS OPERATIONS ============
  soilAnalysis: router({
    create: protectedProcedure
      .input(
        z.object({
          fieldId: z.number(),
          recordDate: z.date(),
          pH: z.number().optional(),
          nitrogen: z.number().optional(),
          phosphorus: z.number().optional(),
          potassium: z.number().optional(),
          moisture: z.number().optional(),
          organicMatter: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createSoilAnalysis(input as any);
        return { success: true };
      }),

    listByField: protectedProcedure
      .input(z.object({ fieldId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getSoilAnalysisByFieldId(input.fieldId, input.limit);
      }),

    getLatest: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getLatestSoilAnalysis(input.fieldId);
      }),
  }),

  // ============ YIELD PREDICTION OPERATIONS ============
  yieldPrediction: router({
    create: protectedProcedure
      .input(
        z.object({
          fieldId: z.number(),
          predictionDate: z.date(),
          estimatedYield: z.number().optional(),
          actualYield: z.number().optional(),
          confidence: z.number().optional(),
          factors: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createYieldPrediction(input as any);
        return { success: true };
      }),

    listByField: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getYieldPredictionsByFieldId(input.fieldId);
      }),

    getLatest: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getLatestYieldPrediction(input.fieldId);
      }),
  }),

  // ============ RESOURCE RECOMMENDATION OPERATIONS ============
  resourceRecommendation: router({
    create: protectedProcedure
      .input(
        z.object({
          fieldId: z.number(),
          recommendationDate: z.date(),
          fertilizerType: z.string().optional(),
          fertilizerQuantity: z.number().optional(),
          waterRequirement: z.number().optional(),
          pesticides: z.array(z.any()).optional(),
          rationale: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createResourceRecommendation(input as any);
        return { success: true };
      }),

    listByField: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getResourceRecommendationsByFieldId(input.fieldId);
      }),

    getLatest: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getLatestResourceRecommendation(input.fieldId);
      }),
  }),

  // ============ CALENDAR EVENT OPERATIONS ============
  calendarEvents: router({
    create: protectedProcedure
      .input(
        z.object({
          fieldId: z.number(),
          eventType: z.enum([
            "planting",
            "irrigation",
            "fertilization",
            "pesticide_application",
            "harvest",
            "other",
          ]),
          eventDate: z.date(),
          title: z.string().min(1),
          description: z.string().optional(),
          completed: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createCalendarEvent(input);
        return { success: true };
      }),

    listByField: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getCalendarEventsByFieldId(input.fieldId);
      }),

    getUpcoming: protectedProcedure
      .input(z.object({ fieldId: z.number(), daysAhead: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getUpcomingCalendarEvents(input.fieldId, input.daysAhead);
      }),

    update: protectedProcedure
      .input(
        z.object({
          eventId: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          eventDate: z.date().optional(),
          completed: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { eventId, ...data } = input;
        await db.updateCalendarEvent(eventId, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ eventId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCalendarEvent(input.eventId);
        return { success: true };
      }),
  }),

  // ============ ALERT OPERATIONS ============
  alerts: router({
    create: protectedProcedure
      .input(
        z.object({
          fieldId: z.number(),
          alertType: z.enum([
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
          ]),
          priority: z.enum(["low", "medium", "high", "critical"]).optional(),
          message: z.string().min(1),
          actionable: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createAlert(input);
        return { success: true };
      }),

    listByField: protectedProcedure
      .input(z.object({ fieldId: z.number(), dismissed: z.boolean().optional() }))
      .query(async ({ input }) => {
        return db.getAlertsByFieldId(input.fieldId, input.dismissed ?? false);
      }),

    dismiss: protectedProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ input }) => {
        await db.dismissAlert(input.alertId);
        return { success: true };
      }),
  }),

  // ============ WEATHER DATA OPERATIONS ============
  weatherData: router({
    create: protectedProcedure
      .input(
        z.object({
          fieldId: z.number(),
          recordDate: z.date(),
          temperature: z.number().optional(),
          minTemperature: z.number().optional(),
          maxTemperature: z.number().optional(),
          humidity: z.number().optional(),
          rainfall: z.number().optional(),
          windSpeed: z.number().optional(),
          condition: z.string().optional(),
          isForecast: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createWeatherData(input as any);
        return { success: true };
      }),

    listByField: protectedProcedure
      .input(z.object({ fieldId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getWeatherDataByFieldId(input.fieldId, input.limit);
      }),

    getLatest: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getLatestWeatherData(input.fieldId);
      }),
  }),

  // ============ CHAT HISTORY OPERATIONS ============
  chat: router({
    sendMessage: protectedProcedure
      .input(
        z.object({
          fieldId: z.number().optional(),
          message: z.string().min(1),
          context: z.record(z.string(), z.any()).optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.createChatMessage({
          userId: ctx.user.id,
          fieldId: input.fieldId,
          role: "user" as const,
          message: input.message,
          context: input.context,
        });

        return { success: true };
      }),

    saveAssistantMessage: protectedProcedure
      .input(
        z.object({
          fieldId: z.number().optional(),
          message: z.string().min(1),
          context: z.record(z.string(), z.any()).optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createChatMessage({
          userId: ctx.user.id,
          fieldId: input.fieldId,
          role: "assistant" as const,
          message: input.message,
          context: input.context,
        });

        return { success: true };
      }),

    getHistory: protectedProcedure
      .input(z.object({ fieldId: z.number().optional(), limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        if (input.fieldId) {
          return db.getChatHistoryByFieldId(input.fieldId, input.limit ?? 50);
        }
        return db.getChatHistoryByUserId(ctx.user.id, input.limit ?? 50);
      }),
  }),

  // ============ REPORT OPERATIONS ============
  reports: router({
    create: protectedProcedure
      .input(
        z.object({
          farmId: z.number(),
          fieldId: z.number().optional(),
          reportType: z.enum([
            "field_summary",
            "farm_summary",
            "soil_analysis",
            "yield_analysis",
            "resource_usage",
          ]),
          reportData: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ input }) => {
        await db.createReport({
          ...input,
          generatedAt: new Date(),
        } as any);
        return { success: true };
      }),

    listByFarm: protectedProcedure
      .input(z.object({ farmId: z.number() }))
      .query(async ({ input }) => {
        return db.getReportsByFarmId(input.farmId);
      }),

    listByField: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return db.getReportsByFieldId(input.fieldId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
