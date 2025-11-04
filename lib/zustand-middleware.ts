import type { PersistOptions, StateStorage, StorageValue } from "zustand/middleware";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const middleware = require("zustand/middleware") as typeof import("zustand/middleware");

export const persist = middleware.persist;
export const createJSONStorage = middleware.createJSONStorage;

export type { PersistOptions, StateStorage, StorageValue };
