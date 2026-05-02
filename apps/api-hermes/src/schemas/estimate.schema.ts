import { z } from "zod";

const materialSchema = z.object({
  label: z.string().min(1),
  mass_kg: z.number().positive()
});

const transportSchema = z.object({
  mode: z.string().min(1),
  distance_km: z.number().positive(),
  mass_kg: z.number().positive()
});

const energySchema = z.object({
  label: z.string().min(1).default("electricite"),
  kwh: z.number().positive()
});

export const estimateRequestSchema = z.object({
  article_name: z.string().min(1),
  unit_label: z.string().min(1).default("1 unite"),
  mode: z.enum(["rapide", "auditable"]),
  scope_type: z.enum(["scope_3", "cycle_complet"]),
  materials: z.array(materialSchema).default([]),
  transport: z.array(transportSchema).default([]),
  energy: z.array(energySchema).default([]),
  source_context: z.record(z.any()).default({})
});

export type EstimateRequest = z.infer<typeof estimateRequestSchema>;
