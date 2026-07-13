import { AsyncLocalStorage } from "async_hooks";

type AsyncLocalStorageType = {
  correlationId: string;
};

export const asyncLocalstorage = new AsyncLocalStorage<AsyncLocalStorageType>();

export const getCorrelationId = () => {
  const asyncStore = asyncLocalstorage.getStore();
  return (
    asyncStore?.correlationId || "unknown-error-while-creating-correlation-id"
  );
};
