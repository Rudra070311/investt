export const Capabilities = {
    LEARN: "learn",
    SIMULATE: "simulate",
    CREATE_CONTENT: "create_content",
    MODERATE: "moderate",
    VIEW_AI_LOGS: "view_ai_logs",
} as const;

export type Capability = typeof Capabilities[keyof typeof Capabilities];