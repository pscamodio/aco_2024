export type Vec2 = {
  x: number;
  y: number;
};

export function isSame(a: Vec2, b: Vec2): boolean {
  return a.x === b.x && a.y === b.y;
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function distance(a: Vec2, b: Vec2): number {
  return Math.abs(Math.sqrt((b.x - a.x) * (b.y - a.y)));
}
