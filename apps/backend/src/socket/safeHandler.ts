export function safeHandler<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return ((...args: any[]) =>
    fn(...args).catch((err: unknown) => {
      console.error("[Socket] Handler error:", err)
    })) as T
}
