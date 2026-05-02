import type { Json } from "../types/hermes-database.js";

type FullProductPayload = {
  article_name: string;
  materials: Array<{ label: string; mass_kg: number }>;
  transport: Array<{ mode: string; distance_km: number; mass_kg: number }>;
  energy: Array<{ label: string; kwh: number }>;
};

type MpcResponse = {
  tool: "estimate_full_product_emission";
  payload: FullProductPayload;
  response: {
    total_kgco2e: number;
    breakdown: Json[];
    factors: Json[];
  };
};

export async function estimateFullProductEmission(payload: FullProductPayload) {
  const baseUrl = process.env.MCP_CARBONE_BASE_URL;
  const apiKey = process.env.MCP_CARBONE_API_KEY;

  if (!baseUrl) {
    throw new Error("MCP_CARBONE_BASE_URL is missing");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/estimate_full_product_emission`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`MCP request failed with status ${response.status}`);
  }

  const data = (await response.json()) as MpcResponse["response"];

  return {
    tool: "estimate_full_product_emission",
    payload,
    response: data
  };
}
