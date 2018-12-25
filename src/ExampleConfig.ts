import * as Filters from 'ph/Common/Filters'
import * as Match from 'ph/Common/Matchers'
import { ButtonMap } from 'ph/Adapters/Gamepad'
import {
  mkButtonInput,
  mkStandardLeftStickInput,
  mkBasicStickDpadMapper,
} from 'ph/Common/Gamepad'
import StandardButton from 'ph/Common/StandardButtons'

const c = Phaser.Input.Keyboard.KeyCodes

// This maps a keyboard key code to a named input
export const KeymapArrows = {
  [c.DOWN]:  'down',
  [c.UP]:    'up',
  [c.RIGHT]: 'right',
  [c.LEFT]:  'left',
}

// For the Dvorak layout this maps the homerow keys to various attakcs
const KeymapDvorak = {
  [c.A]: 'punch:light',
  [c.O]: 'punch:hard',
  [c.E]: 'kick:light',
  [c.U]: 'kick:hard',
  [c.I]: 'guard',
}

// For the Qwerty layout this maps the homerow keys to various attakcs
const KeymapQwerty = {
  [c.A]: 'punch:light',
  [c.S]: 'punch:hard',
  [c.D]: 'kick:light',
  [c.F]: 'kick:hard',
  [c.G]: 'guard',
}

export const QWERTY_LAYOUT = { ...KeymapArrows, ...KeymapQwerty }
export const DVORAK_LAYOUT = { ...KeymapArrows, ...KeymapDvorak }

// This specifies how a set of combined inputs get constructed
export const DPAD_COMBINATIONS: Filters.CoalesseMapping = {
  'down+left':  ['down', 'left' ],
  'down+right': ['down', 'right'],
  'up+left':    ['up',   'left' ],
  'up+right':   ['up',   'right'],
}

// gives a constant name to dpad directions
export const DPAD = {
  up:           'up',
  up_forward:   'up+forward',
  forward:      'forward',
  down_forward: 'down+forward',
  down:          'down',
  down_backward: 'down+backward',
  backward:      'backward',
  up_backward:   'up+backward',
}

// Absolute directions that an input can produce: [up, up+right, ...]
export const ABSOLUTE_DIRECTIONS = [
  'up', 'down', 'left', 'right',
  ...Object.keys(DPAD_COMBINATIONS),
]

// what directions could be used to construct a move sequence:
// [up, up+forward, ...]
export const DIRECTIONS = Object.keys(DPAD).map(
  k => (<{[key:string]:string}>DPAD)[k]
)

// configures inputs for a gamepad
export const GamepadInputs: ButtonMap = [
  mkButtonInput(StandardButton.LeftDpad.Up, 'up'),
  mkButtonInput(StandardButton.LeftDpad.Down, 'down'),
  mkButtonInput(StandardButton.LeftDpad.Left, 'left'),
  mkButtonInput(StandardButton.LeftDpad.Right, 'right'),
  mkButtonInput(StandardButton.RightCluster.Down, 'punch:light'),
  mkButtonInput(StandardButton.RightCluster.Right, 'punch:hard'),
  mkButtonInput(StandardButton.RightCluster.Left, 'kick:light'),
  mkButtonInput(StandardButton.RightCluster.Up, 'kick:hard'),
  mkButtonInput(StandardButton.Right.Trigger, 'kick:light'),
  mkButtonInput(StandardButton.Left.Shoulder, 'guard'),
  mkStandardLeftStickInput(
    'left-stick',
    mkBasicStickDpadMapper(),
    ABSOLUTE_DIRECTIONS,
  ),
]

// All the non-movement actions a player could take as part of a move sequence
export const ACTION = {
  punch_light: 'punch:light',
  punch_hard:  'punch:hard',
  kick_light:  'kick:light',
  kick_hard:   'kick:hard',
  guard:       'guard',
}

// various classes of actions

export const PUNCHES = [ACTION.punch_light, ACTION.punch_hard]
export const KICKS = [ACTION.kick_light, ACTION.kick_hard]
export const ATTACKS = [...PUNCHES, ...KICKS]

// quarter forward circle
export const QFC = [DPAD.down, DPAD.down_forward, DPAD.forward]
export const HADOKEN = [...QFC, Match.OneWithPrefix('punch:')]

// quarter backward circle
export const QBC = [DPAD.down, DPAD.down_backward, DPAD.backward]
export const HURICANE_KICK = [...QBC, Match.OneWithPrefix('kick:')]

// summon suffering
export const SS = [
  DPAD.down_forward,
  DPAD.up_backward,
  DPAD.forward,
  DPAD.down,
  DPAD.down_forward,
  DPAD.down_backward,
  Match.All(ACTION.punch_light, ACTION.guard),
]
