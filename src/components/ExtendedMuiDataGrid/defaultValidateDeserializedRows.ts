export default function defaultValidateDeserializedRows<T>(
  deserializedRows: any
): deserializedRows is T[] {
  return true;
}
