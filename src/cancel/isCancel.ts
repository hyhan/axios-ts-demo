import Cancel from "./Cancel"

export default function isCancel(value: any): boolean {
  return value instanceof Cancel
}
