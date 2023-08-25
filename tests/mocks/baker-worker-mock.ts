// © Copyright 2023 HP Development Company, L.P.
import type {
  BakerError,
  BakerProgress,
  BakerSuccess,
  Typeless,
} from "@core/baker";
import { BakerOutTypes } from "@core/baker";
import { handleBakerMessage } from "@core/baker/utils";

class MockBakerWorker {
  onmessage: (e: any) => void;

  constructor() {
    this.onmessage = () => {
      /* empty */
    };
  }

  postMessage(msg: any) {
    const postSuccess = (msg: Typeless<BakerSuccess>) => {
      const successMessage: BakerSuccess = {
        type: BakerOutTypes.BAKER_SUCCESS,
        ...msg,
      };

      this.onmessage({ data: successMessage });
    };

    const postError = (msg: Typeless<BakerError>) => {
      const errorMessage: BakerError = {
        type: BakerOutTypes.BAKER_ERROR,
        ...msg,
      };

      this.onmessage({ data: errorMessage });
    };

    const postProgress = (msg: Typeless<BakerProgress>) => {
      const progressMessage: BakerProgress = {
        type: BakerOutTypes.BAKER_PROGRESS,
        ...msg,
      };

      this.onmessage({ data: progressMessage });
    };

    handleBakerMessage(
      postSuccess,
      postError,
      postProgress
    )({ data: msg } as any);
  }
}

export const getBakerWorker = () => {
  return new MockBakerWorker();
};
