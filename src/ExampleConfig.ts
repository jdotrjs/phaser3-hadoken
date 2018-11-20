import * as Filters from 'ph/Common/Filters'

const c = Phaser.Input.Keyboard.KeyCodes

// This maps a keyboard key code to a named input
export const KeymapArrows = {
  [c.DOWN]:  'down',
  [c.UP]:    'up',
  [c.RIGHT]: 'right',
  [c.LEFT]:  'left',
}

// For the Dvorak layout this maps the homerow keys to various attakcs
export const KeymapDvorak = {
  [c.A]: 'punch:light',
  [c.O]: 'punch:hard',
  [c.E]: 'kick:light',
  [c.U]: 'kick:hard',
  [c.I]: 'guard',
}

// For the Qwerty layout this maps the homerow keys to various attakcs
export const KeymapQwerty = {
  [c.A]: 'punch:light',
  [c.S]: 'punch:hard',
  [c.D]: 'kick:light',
  [c.F]: 'kick:hard',
  [c.G]: 'guard',
}

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

// what directions could be used to construct a move sequence
export const DIRECTIONS = Object.keys(DPAD).map(
  k => (<{[key:string]:string}>DPAD)[k]
)

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
export const HADOKEN = [...QFC, ACTION.punch_light]

// quarter backward circle
export const QBC = [DPAD.down, DPAD.down_backward, DPAD.backward]
export const HURICANE_KICK = [...QBC, ACTION.kick_light]

// summon suffering
export const SS = [
  DPAD.down_forward,
  DPAD.up_backward,
  DPAD.forward,
  DPAD.down,
  DPAD.down_forward,
  DPAD.down_backward,
  ACTION.punch_light,
  ACTION.guard,
]
