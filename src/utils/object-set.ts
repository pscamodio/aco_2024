export class ObjectSet<T extends Record<string, unknown>> {
  data = new Map<string, T>();

  constructor(public computeKey: (value: T) => string = JSON.stringify) {}

  add(value: T): void {
    if (this.has(value)) return;
    this.data.set(this.computeKey(value), value);
  }

  has(value: T): boolean {
    return this.data.has(this.computeKey(value));
  }

  get size(): number {
    return this.data.size;
  }
}
