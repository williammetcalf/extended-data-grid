export function serializeValue(value: any) {
  return value.toString().replace(/"/g, '\\"');
}

export function serializeRow<T extends object>(row: T, _idx: number) {
  return Object.keys(row)
    .map((key) => serializeValue(row[key]))
    .map((value) => (value.includes(",") ? `"${value}"` : value))
    .join(",");
}
