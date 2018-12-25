import { SemanticInput } from 'ph/Hadoken'
import { MappingFn } from 'ph/Adapters/Keyboard'

/**
 * Constructs a simple translation function between a keyboard input keycode
 * to some input that has meaning in your game.
 *
 * If an input is not present in `map` then it won't be tracked
 */
export function NewSimpleMapper(
  map: { [key: number]: SemanticInput },
): MappingFn {
  return function(keycode: number): SemanticInput | null {
    return map[keycode] || null
  }
}
