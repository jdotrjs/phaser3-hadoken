import { SemanticInput } from "ph/Hadoken"
import { MappingFn } from "./index"

export function NewSimpleMapper(map: { [key: string]: SemanticInput }): MappingFn {
  return function(keycode: number): SemanticInput | null {
    return map[keycode] || null
  }
}