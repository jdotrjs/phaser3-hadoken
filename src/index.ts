import * as Keyboard from 'ph/Adapters/Keyboard'
import * as Gamepad from 'ph/Adapters/Gamepad'
import * as Common from 'ph/Common/index'
import * as Base from 'ph/Hadoken'

export default {
    ...Base,
    Adapters: {
        Gamepad,
        Keyboard,
    },
    Common,
}