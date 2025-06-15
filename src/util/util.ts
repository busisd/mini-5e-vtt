export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function minOne(num: number) {
  return Math.max(num, 1);
}

export function peek<t>(arr: t[]): t {
  return arr[arr.length - 1];
}

export function isEmptyStr(str: string | null | undefined): boolean {
  return str == null || str.length === 0;
}
