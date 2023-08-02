export type UpdaterRepo<T> = (t: T) => T
export type UpdateRepo<T> = (updater: UpdaterRepo<T>) => void
