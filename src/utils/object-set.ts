export class ObjectSet<T extends Record<string, unknown>> {
  data = new Map<string, T>();

  constructor(
    initialData: Array<T> = [],
    public computeKey: (value: T) => string = JSON.stringify
  ) {
    for (const value of initialData) {
      this.add(value);
    }
  }

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
