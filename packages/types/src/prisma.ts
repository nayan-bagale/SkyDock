import type { ExplorerItems, Plan } from "@skydock/db";

export type ExplorerItemsPrismaT = ExplorerItems;

export type PlansT = Pick<
  Plan,
  | "id"
  | "name"
  | "price"
  | "storageLimit"
  | "description"
  | "interval"
  | "popular"
  | "features"
>[];
