// © Copyright 2023 HP Development Company, L.P.
/**
 * A wrapper that is mocked by jest
 */
export const getBakerWorker = () => {
  return new Worker(new URL("@core/baker/baker.worker.ts", import.meta.url));
};
