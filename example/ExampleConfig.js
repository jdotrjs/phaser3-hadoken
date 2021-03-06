import Phaser from 'phaser'
import Hadoken from 'hadoken'

const common = Hadoken.Common.default
const Filters = common.Filters
const {
  mkButtonInput,
  mkStandardLeftStickInput,
  mkBasicStickDpadMapper,
} = common.Gamepad
const Match = common.Matchers
const SimpleMatcher = common.SimpleMatcher
const StandardButtons = common.StandardButtons.default
const KeyboardCommon = common.Keyboard

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
export const DPAD_COMBINATIONS = {
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
export const DIRECTIONS = Object.keys(DPAD).map(k => DPAD[k])

// configures inputs for a gamepad
export const GamepadButtons = [
  mkButtonInput(StandardButtons.LeftDpad.Up, 'up'),
  mkButtonInput(StandardButtons.LeftDpad.Down, 'down'),
  mkButtonInput(StandardButtons.LeftDpad.Left, 'left'),
  mkButtonInput(StandardButtons.LeftDpad.Right, 'right'),
  mkButtonInput(StandardButtons.RightCluster.Down, 'punch:light'),
  mkButtonInput(StandardButtons.RightCluster.Right, 'punch:hard'),
  mkButtonInput(StandardButtons.RightCluster.Left, 'kick:light'),
  mkButtonInput(StandardButtons.RightCluster.Up, 'kick:hard'),
  mkButtonInput(StandardButtons.Right.Trigger, 'kick:light'),
  mkButtonInput(StandardButtons.Left.Shoulder, 'guard'),
]

const GamepadJoystick = mkStandardLeftStickInput(
  'left-stick',
  mkBasicStickDpadMapper(),
  ABSOLUTE_DIRECTIONS,
)

export const mkInvertedLeftJoystick = (x, y) => {
  const def = mkStandardLeftStickInput(
    'left-stick',
    mkBasicStickDpadMapper(),
    ABSOLUTE_DIRECTIONS,
  )

  if (x) {
    def.horizontalAxis.right = def.horizontalAxis.right * -1
  }

  if (y) {
    def.verticalAxis.up = def.verticalAxis.up * -1
  }

  return def
}

export const GamepadInputs = [
  ...GamepadButtons,
  GamepadJoystick,
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

// This is shared between both keyboard and gamepad hadokens
const mkCommonHadokenConfig = (getFacing) => ({
  bufferLimitType: 'time',
  bufferLimit: 5000,

  // the following functions will be applied to inputs before trying to match
  filters: Filters.NewChain(
    // convert two directional inputs into a diagonal, if applicable
    Filters.CoalesseInputs(DPAD_COMBINATIONS),
    // change formats from right/left to forward/backward based on the
    // player's facing
    Filters.MapToFacing(getFacing),
    // only accept the most recent direction
    Filters.OnlyMostRecent(DIRECTIONS),
    // and the most recent attack
    Filters.OnlyMostRecent(ATTACKS),
  ),

  // defines a set of moves to register (and how that match should happen)
  matchers: [
    { name: 'hadoken', match: SimpleMatcher.New(HADOKEN), },
    { name: 'huricane_kick', match: SimpleMatcher.New(HURICANE_KICK), },
    {
      name: 'summon_suffering',
      match: SimpleMatcher.New(SS, { stepDelay: 800, totalDelay: 6000 }),
    }
  ],
})

// the two controller variations

export const mkGamepadHadokenConfig = (getFacing, pad) => ({
  ...mkCommonHadokenConfig(getFacing),
  gamepad: pad,
  buttonMap: GamepadInputs,
})

const dvorakMapper = KeyboardCommon.NewSimpleMapper(DVORAK_LAYOUT)
const qwertykMapper = KeyboardCommon.NewSimpleMapper(QWERTY_LAYOUT)

export const mkKeyboardHadokenConfig = (getFacing, getLayout) => ({
  ...mkCommonHadokenConfig(getFacing),
  keymapFn: code => getLayout() === 'dvorak'
    ? dvorakMapper(code)
    : qwertykMapper(code),
})