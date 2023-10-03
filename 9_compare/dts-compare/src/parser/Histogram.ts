export class Histogram extends Map<string, number> {
  inc(key: string) {
    const oldVal = this.get(key);
    if (typeof oldVal == 'number') {
      this.set(key, oldVal + 1);
    } else {
      this.set(key, 1);
    }
  }

  toJSON() {
    return [...this.entries()];
  }
}
