// © Copyright 2023 HP Development Company, L.P.
/* eslint-disable no-restricted-globals */

import type {
  BakerError,
  BakerProgress,
  BakerSuccess,
  Typeless,
} from "@core/baker/types";
import { BakerOutTypes } from "@core/baker/types";
import { handleBakerMessage } from "@core/baker/utils";

const ctx: Worker = self as any;

/**
 * Post a success message
 */
const postSuccess = (msg: Typeless<BakerSuccess>) => {
  const successMessage: BakerSuccess = {
    type: BakerOutTypes.BAKER_SUCCESS,
    ...msg,
  };

  ctx.postMessage(successMessage);
};

/**
 * Post an error message
 */
const postError = (msg: Typeless<BakerError>) => {
  const errorMessage: BakerError = {
    type: BakerOutTypes.BAKER_ERROR,
    ...msg,
  };

  ctx.postMessage(errorMessage);
};

/**
 * Post a progress message
 */
const postProgress = (msg: Typeless<BakerProgress>) => {
  const progressMessage: BakerProgress = {
    type: BakerOutTypes.BAKER_PROGRESS,
    ...msg,
  };

  ctx.postMessage(progressMessage);
};

/**
 * Run the recipe
 */
ctx.onmessage = handleBakerMessage(postSuccess, postError, postProgress);

export {};
