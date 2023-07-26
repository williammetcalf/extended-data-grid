import { parse } from "papaparse";

export default function defaultDeserializeRows(serializedRows: string) {
  return parse(serializedRows, { header: true }).data;
}
