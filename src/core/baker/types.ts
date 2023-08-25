// © Copyright 2023 HP Development Company, L.P.
import type { Item } from "@core/types";

/**
 * What is passed to the baker
 */
export interface BakerIn {
  obfCode: string;
  items: Item[];
  steps?: number;
}

/**
 * What the baker returns
 */
export enum BakerOutTypes {
  BAKER_SUCCESS,
  BAKER_PROGRESS,
  BAKER_ERROR,
}

export interface BaseBakerOut {
  type: BakerOutTypes;
}

export interface BakerSuccess extends BaseBakerOut {
  type: BakerOutTypes.BAKER_SUCCESS;
  code: string;
  mappings: number[][];
  steps: number;
}

export interface BakerError extends BaseBakerOut {
  type: BakerOutTypes.BAKER_ERROR;

  /* Error that caused the failure */
  error: any;
}

export interface BakerProgress extends BaseBakerOut {
  type: BakerOutTypes.BAKER_PROGRESS;

  /* Progress percentage */
  progress: number;
}

export type BakerOut = BakerSuccess | BakerError | BakerProgress;

/**
 * A baker out message without the type
 */
export type Typeless<T extends BakerOut> = Omit<T, "type">;
