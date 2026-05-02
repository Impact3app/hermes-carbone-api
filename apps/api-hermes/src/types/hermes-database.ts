export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type HermesDatabase = {
  hermes: {
    Tables: {
      estimate_requests: {
        Row: {
          id: string;
          article_name: string;
          created_at: string;
          external_ref: string | null;
          mode: "rapide" | "auditable";
          raw_payload: Json;
          scope_type: "scope_3" | "cycle_complet";
          source_context: Json;
          status: "received" | "processing" | "completed" | "failed";
          unit_label: string;
          updated_at: string;
        };
        Insert: {
          article_name: string;
          external_ref?: string | null;
          mode: "rapide" | "auditable";
          raw_payload: Json;
          scope_type: "scope_3" | "cycle_complet";
          source_context?: Json;
          status?: "received" | "processing" | "completed" | "failed";
          unit_label?: string;
        };
        Update: Partial<{
          article_name: string;
          external_ref: string | null;
          mode: "rapide" | "auditable";
          raw_payload: Json;
          scope_type: "scope_3" | "cycle_complet";
          source_context: Json;
          status: "received" | "processing" | "completed" | "failed";
          unit_label: string;
          updated_at: string;
        }>;
      };
      estimate_inputs: {
        Row: {
          id: string;
          created_at: string;
          input_type: "material" | "transport" | "energy" | "usage" | "end_of_life";
          label: string;
          payload: Json;
          request_id: string;
          status: "provided" | "normalized" | "missing" | "to_confirm";
          unit: string | null;
          value_num: number | null;
          value_text: string | null;
        };
        Insert: {
          input_type: "material" | "transport" | "energy" | "usage" | "end_of_life";
          label: string;
          payload?: Json;
          request_id: string;
          status?: "provided" | "normalized" | "missing" | "to_confirm";
          unit?: string | null;
          value_num?: number | null;
          value_text?: string | null;
        };
        Update: Partial<{
          input_type: "material" | "transport" | "energy" | "usage" | "end_of_life";
          label: string;
          payload: Json;
          request_id: string;
          status: "provided" | "normalized" | "missing" | "to_confirm";
          unit: string | null;
          value_num: number | null;
          value_text: string | null;
        }>;
      };
      estimate_normalizations: {
        Row: {
          id: string;
          created_at: string;
          input_id: string | null;
          normalization_rule: string;
          normalized_value: string;
          request_id: string;
          source_value: string;
        };
        Insert: {
          input_id?: string | null;
          normalization_rule: string;
          normalized_value: string;
          request_id: string;
          source_value: string;
        };
        Update: Partial<{
          input_id: string | null;
          normalization_rule: string;
          normalized_value: string;
          request_id: string;
          source_value: string;
        }>;
      };
      estimate_runs: {
        Row: {
          attempt_no: number;
          created_at: string;
          duration_ms: number | null;
          error_message: string | null;
          id: string;
          is_fallback: boolean;
          request_id: string;
          request_payload: Json;
          response_payload: Json | null;
          status: "success" | "error";
          tool_name: string;
          tool_priority: number;
        };
        Insert: {
          attempt_no: number;
          duration_ms?: number | null;
          error_message?: string | null;
          is_fallback?: boolean;
          request_id: string;
          request_payload: Json;
          response_payload?: Json | null;
          status: "success" | "error";
          tool_name: string;
          tool_priority: number;
        };
        Update: Partial<{
          attempt_no: number;
          duration_ms: number | null;
          error_message: string | null;
          is_fallback: boolean;
          request_id: string;
          request_payload: Json;
          response_payload: Json | null;
          status: "success" | "error";
          tool_name: string;
          tool_priority: number;
        }>;
      };
      estimate_results: {
        Row: {
          confidence_level: "faible" | "moyen" | "eleve";
          created_at: string;
          emission_per_unit_kgco2e: number;
          id: string;
          notes: string | null;
          quality_score_global: "A" | "B" | "C" | "D" | "E";
          request_id: string;
          total_emission_tco2e: number | null;
        };
        Insert: {
          confidence_level: "faible" | "moyen" | "eleve";
          emission_per_unit_kgco2e: number;
          notes?: string | null;
          quality_score_global: "A" | "B" | "C" | "D" | "E";
          request_id: string;
          total_emission_tco2e?: number | null;
        };
        Update: Partial<{
          confidence_level: "faible" | "moyen" | "eleve";
          emission_per_unit_kgco2e: number;
          notes: string | null;
          quality_score_global: "A" | "B" | "C" | "D" | "E";
          request_id: string;
          total_emission_tco2e: number | null;
        }>;
      };
      estimate_factors: {
        Row: {
          created_at: string;
          factor_code: string | null;
          factor_name: string;
          factor_source: string;
          factor_unit: string;
          factor_value: number;
          id: string;
          payload: Json;
          poste: "material" | "transport" | "energy" | "usage" | "end_of_life";
          quality_score: "A" | "B" | "C" | "D" | "E";
          request_id: string;
          run_id: string | null;
        };
        Insert: {
          factor_code?: string | null;
          factor_name: string;
          factor_source: string;
          factor_unit: string;
          factor_value: number;
          payload?: Json;
          poste: "material" | "transport" | "energy" | "usage" | "end_of_life";
          quality_score: "A" | "B" | "C" | "D" | "E";
          request_id: string;
          run_id?: string | null;
        };
        Update: Partial<{
          factor_code: string | null;
          factor_name: string;
          factor_source: string;
          factor_unit: string;
          factor_value: number;
          payload: Json;
          poste: "material" | "transport" | "energy" | "usage" | "end_of_life";
          quality_score: "A" | "B" | "C" | "D" | "E";
          request_id: string;
          run_id: string | null;
        }>;
      };
      estimate_breakdown: {
        Row: {
          activity_data: number | null;
          activity_unit: string | null;
          created_at: string;
          emission_kgco2e: number;
          factor_unit: string | null;
          factor_value: number | null;
          formula_text: string;
          id: string;
          payload: Json;
          poste: "material" | "transport" | "energy" | "usage" | "end_of_life";
          quality_score: "A" | "B" | "C" | "D" | "E";
          request_id: string;
        };
        Insert: {
          activity_data?: number | null;
          activity_unit?: string | null;
          emission_kgco2e: number;
          factor_unit?: string | null;
          factor_value?: number | null;
          formula_text: string;
          payload?: Json;
          poste: "material" | "transport" | "energy" | "usage" | "end_of_life";
          quality_score: "A" | "B" | "C" | "D" | "E";
          request_id: string;
        };
        Update: Partial<{
          activity_data: number | null;
          activity_unit: string | null;
          emission_kgco2e: number;
          factor_unit: string | null;
          factor_value: number | null;
          formula_text: string;
          payload: Json;
          poste: "material" | "transport" | "energy" | "usage" | "end_of_life";
          quality_score: "A" | "B" | "C" | "D" | "E";
          request_id: string;
        }>;
      };
      estimate_assumptions: {
        Row: {
          assumption_text: string;
          created_at: string;
          id: string;
          impact_level: "low" | "medium" | "high";
          request_id: string;
          to_confirm: boolean;
        };
        Insert: {
          assumption_text: string;
          impact_level: "low" | "medium" | "high";
          request_id: string;
          to_confirm?: boolean;
        };
        Update: Partial<{
          assumption_text: string;
          impact_level: "low" | "medium" | "high";
          request_id: string;
          to_confirm: boolean;
        }>;
      };
      estimate_versions: {
        Row: {
          created_at: string;
          id: string;
          rendered_payload: Json;
          request_id: string;
          version_no: number;
        };
        Insert: {
          rendered_payload: Json;
          request_id: string;
          version_no: number;
        };
        Update: Partial<{
          rendered_payload: Json;
          request_id: string;
          version_no: number;
        }>;
      };
      estimate_feedback: {
        Row: {
          author_label: string | null;
          created_at: string;
          feedback_text: string;
          feedback_type: "correction" | "validation" | "comment";
          id: string;
          request_id: string;
        };
        Insert: {
          author_label?: string | null;
          feedback_text: string;
          feedback_type: "correction" | "validation" | "comment";
          request_id: string;
        };
        Update: Partial<{
          author_label: string | null;
          feedback_text: string;
          feedback_type: "correction" | "validation" | "comment";
          request_id: string;
        }>;
      };
      factor_aliases: {
        Row: {
          created_at: string;
          factor_family: "material" | "transport" | "energy";
          id: string;
          is_active: boolean;
          normalized_label: string;
          raw_label: string;
        };
        Insert: {
          factor_family: "material" | "transport" | "energy";
          is_active?: boolean;
          normalized_label: string;
          raw_label: string;
        };
        Update: Partial<{
          factor_family: "material" | "transport" | "energy";
          is_active: boolean;
          normalized_label: string;
          raw_label: string;
        }>;
      };
      factor_catalog_cache: {
        Row: {
          created_at: string;
          factor_code: string | null;
          factor_family: string;
          factor_name: string;
          factor_source: string;
          factor_unit: string;
          factor_value: number;
          id: string;
          is_active: boolean;
          source_payload: Json;
        };
        Insert: {
          factor_code?: string | null;
          factor_family: string;
          factor_name: string;
          factor_source: string;
          factor_unit: string;
          factor_value: number;
          is_active?: boolean;
          source_payload?: Json;
        };
        Update: Partial<{
          factor_code: string | null;
          factor_family: string;
          factor_name: string;
          factor_source: string;
          factor_unit: string;
          factor_value: number;
          is_active: boolean;
          source_payload: Json;
        }>;
      };
    };
    Views: {
      estimate_audit_export: {
        Row: {
          article_name: string | null;
          confidence_level: "faible" | "moyen" | "eleve" | null;
          created_at: string | null;
          emission_per_unit_kgco2e: number | null;
          mode: "rapide" | "auditable" | null;
          quality_score_global: "A" | "B" | "C" | "D" | "E" | null;
          request_id: string | null;
          scope_type: "scope_3" | "cycle_complet" | null;
          status: "received" | "processing" | "completed" | "failed" | null;
          total_emission_tco2e: number | null;
          unit_label: string | null;
        };
      };
    };
  };
};
