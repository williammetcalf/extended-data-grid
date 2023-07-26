export function serializeValue(value: any) {
  return value.toString().replace(/"/g, '\\"');
}

export type SerializeRowOptions = {
  valueDelimeter?: string;
};

export function serializeRow<T extends object>(
  row: T,
  _idx: number,
  opts: SerializeRowOptions = {}
) {
  const { valueDelimeter = "," } = opts;
  return Object.keys(row)
    .map((key) => serializeValue(row[key]))
    .map((value) => (value.includes(valueDelimeter) ? `"${value}"` : value))
    .join(",");
}
