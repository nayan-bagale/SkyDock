export type OptionalExceptForId<T, K extends keyof T> = Partial<T> & Pick<T, K>;
