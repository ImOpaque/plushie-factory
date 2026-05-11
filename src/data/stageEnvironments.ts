/**
 * Cosmetic stage backgrounds (factory, seasonal, etc.). Only `factory_v1` is implemented.
 */
export const DEFAULT_STAGE_ID = "factory_v1" as const;

export type StageEnvironmentId = typeof DEFAULT_STAGE_ID;
