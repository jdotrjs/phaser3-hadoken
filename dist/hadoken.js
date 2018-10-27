(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hadoken"] = factory();
	else
		root["Hadoken"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Hadoken.ts":
/*!************************!*\
  !*** ./src/Hadoken.ts ***!
  \************************/
/*! exports provided: filterChain, NewHadoken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"filterChain\", function() { return filterChain; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NewHadoken\", function() { return NewHadoken; });\n/* harmony import */ var _InputSnapshot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InputSnapshot */ \"./src/InputSnapshot.ts\");\n\r\nfunction filterChain() {\r\n    var filters = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        filters[_i] = arguments[_i];\r\n    }\r\n    return function (input) { return filters.reduce(function (acc, nextFn) { return nextFn(acc); }, input); };\r\n}\r\nfunction NewHadoken(scn, cfg) {\r\n    return {\r\n        scene: scn,\r\n        config: cfg,\r\n        rawHistory: [Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"NewInputSnapshot\"])()],\r\n        processedHistory: [],\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack://Hadoken/./src/Hadoken.ts?");

/***/ }),

/***/ "./src/InputSnapshot.ts":
/*!******************************!*\
  !*** ./src/InputSnapshot.ts ***!
  \******************************/
/*! exports provided: sameKeys, HasKey, ReplaceKey, HasSameKeys, NewInputSnapshot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sameKeys\", function() { return sameKeys; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HasKey\", function() { return HasKey; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ReplaceKey\", function() { return ReplaceKey; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HasSameKeys\", function() { return HasSameKeys; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NewInputSnapshot\", function() { return NewInputSnapshot; });\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nfunction sameKeys(s1, s2) {\r\n    var nkeys = Object.keys(s1);\r\n    var okeys = Object.keys(s2);\r\n    return !(nkeys.length !== okeys.length ||\r\n        nkeys.some(function (k) { return okeys.indexOf(k) === -1; }));\r\n}\r\nfunction HasKey(s, key) {\r\n    return !!s.state[key];\r\n}\r\nfunction ReplaceKey(s, oldKey, newKey) {\r\n    var output = { timestamp: s.timestamp, state: __assign({}, s.state) };\r\n    if (!s.state[oldKey]) {\r\n        return output;\r\n    }\r\n    output.state[newKey] = s.state[oldKey];\r\n    delete output.state[oldKey];\r\n    return output;\r\n}\r\nfunction HasSameKeys(ss, other) {\r\n    var state = ss.state;\r\n    var otherState = other.state ? other.state : other;\r\n    var nkeys = Object.keys(state);\r\n    var okeys = Object.keys(otherState);\r\n    return !(nkeys.length !== okeys.length ||\r\n        nkeys.some(function (k) { return okeys.indexOf(k) === -1; }));\r\n}\r\nfunction NewInputSnapshot() {\r\n    return {\r\n        timestamp: Date.now(),\r\n        state: {},\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack://Hadoken/./src/InputSnapshot.ts?");

/***/ }),

/***/ "./src/Keyboard/Simple.ts":
/*!********************************!*\
  !*** ./src/Keyboard/Simple.ts ***!
  \********************************/
/*! exports provided: Mapper, DPAD_COMBINATIONS, Coalesse, NewFacingFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Mapper\", function() { return Mapper; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DPAD_COMBINATIONS\", function() { return DPAD_COMBINATIONS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Coalesse\", function() { return Coalesse; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NewFacingFilter\", function() { return NewFacingFilter; });\n/* harmony import */ var _InputSnapshot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../InputSnapshot */ \"./src/InputSnapshot.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n\r\nvar c = Phaser.Input.Keyboard.KeyCodes;\r\nfunction Mapper(keycode) {\r\n    var _a;\r\n    var mapping = (_a = {},\r\n        _a[c.DOWN] = 'down',\r\n        _a[c.UP] = 'up',\r\n        _a[c.RIGHT] = 'right',\r\n        _a[c.LEFT] = 'left',\r\n        _a[c.A] = 'punch:light',\r\n        _a[c.O] = 'punch:hard',\r\n        _a[c.E] = 'kick:light',\r\n        _a[c.U] = 'kick:hard',\r\n        _a);\r\n    return mapping[keycode] || null;\r\n}\r\nvar DPAD_COMBINATIONS = {\r\n    'down+left': ['down', 'left'],\r\n    'down+right': ['down', 'right'],\r\n    'up+left': ['up', 'left'],\r\n    'up+right': ['up', 'right'],\r\n};\r\nfunction Coalesse(input, timestamp) {\r\n    var output = __assign({}, input.state);\r\n    var hasKey = function (i) {\r\n        return !!output[i];\r\n    };\r\n    var hasAll = function (set) { return set.every(hasKey); };\r\n    Object.keys(DPAD_COMBINATIONS).forEach(function (k) {\r\n        if (hasAll(DPAD_COMBINATIONS[k])) {\r\n            DPAD_COMBINATIONS[k].forEach(function (e) { return delete output[e]; });\r\n            output[k] = { pressed: timestamp, meta: null };\r\n        }\r\n    });\r\n    return { timestamp: input.timestamp, state: output };\r\n}\r\nfunction NewFacingFilter(getFacing) {\r\n    return function (input) {\r\n        var facing = getFacing();\r\n        var output = __assign({}, input, { state: __assign({}, input.state) });\r\n        if (facing === 'right') {\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'right', 'forward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+right', 'down+forward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+right', 'up+forward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'left', 'backward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+left', 'down+backward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+left', 'up+backward');\r\n        }\r\n        else {\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'left', 'forward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+left', 'down+forward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+left', 'up+forward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'right', 'backward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+right', 'down+backward');\r\n            output = Object(_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+right', 'up+backward');\r\n        }\r\n        return output;\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack://Hadoken/./src/Keyboard/Simple.ts?");

/***/ }),

/***/ "./src/Keyboard/index.ts":
/*!*******************************!*\
  !*** ./src/Keyboard/index.ts ***!
  \*******************************/
/*! exports provided: HadokenKeyboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HadokenKeyboard\", function() { return HadokenKeyboard; });\n/* harmony import */ var ph_Hadoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ph/Hadoken */ \"./src/Hadoken.ts\");\n/* harmony import */ var ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ph/InputSnapshot */ \"./src/InputSnapshot.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n\r\n\r\nvar HadokenKeyboard = /** @class */ (function () {\r\n    function HadokenKeyboard(scn, cfg) {\r\n        this.state = Object(ph_Hadoken__WEBPACK_IMPORTED_MODULE_0__[\"NewHadoken\"])(scn, cfg);\r\n        scn.input.keyboard.on('keydown', this.keydown, this);\r\n        scn.input.keyboard.on('keyup', this.keyup, this);\r\n        scn.events.on('preupdate', this.preupdate, this);\r\n    }\r\n    HadokenKeyboard.prototype.preupdate = function () {\r\n        var coalesse = this.state.config.coalesseFn || function (e) { return e; };\r\n        for (var i = this.state.processedHistory.length; i < this.state.rawHistory.length; i++) {\r\n            var state = this.state.rawHistory[i];\r\n            var coalessed = coalesse(state, state.timestamp);\r\n            var filters = this.state.config.filters;\r\n            var filtered = filters ? filters(coalessed) : coalessed;\r\n            this.state.processedHistory.push(filtered);\r\n        }\r\n    };\r\n    HadokenKeyboard.prototype.keydown = function (e) {\r\n        var _a;\r\n        var sem = this.state.config.keymapFn(e.keyCode);\r\n        if (!sem) {\r\n            return;\r\n        }\r\n        var now = Date.now();\r\n        var lastState = this.state.rawHistory.slice(-1)[0];\r\n        var newSnapshot = {\r\n            timestamp: now,\r\n            state: __assign((_a = {}, _a[sem] = { pressed: now, meta: e.keyCode }, _a), lastState.state)\r\n        };\r\n        if (!Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_1__[\"HasSameKeys\"])(newSnapshot, lastState)) {\r\n            this.state.rawHistory.push(newSnapshot);\r\n        }\r\n    };\r\n    HadokenKeyboard.prototype.keyup = function (e) {\r\n        var sem = this.state.config.keymapFn(e.keyCode);\r\n        if (!sem) {\r\n            return;\r\n        }\r\n        var lastSnapshot = this.state.rawHistory.slice(-1)[0];\r\n        var state = __assign({}, lastSnapshot.state);\r\n        delete state[sem];\r\n        if (!Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_1__[\"HasSameKeys\"])(lastSnapshot, state)) {\r\n            var newState = {\r\n                timestamp: Date.now(),\r\n                state: state,\r\n            };\r\n            this.state.rawHistory.push(newState);\r\n        }\r\n    };\r\n    HadokenKeyboard.prototype.lastState = function () {\r\n        if (this.state.processedHistory.length === 0) {\r\n            return null;\r\n        }\r\n        return this.state.processedHistory.slice(-1)[0];\r\n    };\r\n    return HadokenKeyboard;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://Hadoken/./src/Keyboard/index.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var ph_Keyboard_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ph/Keyboard/index */ \"./src/Keyboard/index.ts\");\n/* harmony import */ var ph_Keyboard_Simple__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ph/Keyboard/Simple */ \"./src/Keyboard/Simple.ts\");\n/* harmony import */ var _Hadoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Hadoken */ \"./src/Hadoken.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    }\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\n// TODO: index should resolve automatically...\r\n\r\n\r\n\r\nvar Scene1 = /** @class */ (function (_super) {\r\n    __extends(Scene1, _super);\r\n    function Scene1() {\r\n        var _this = _super.call(this, 'scene1') || this;\r\n        _this.facing = 'right';\r\n        console.log(_this);\r\n        return _this;\r\n    }\r\n    Scene1.prototype.create = function () {\r\n        var _this = this;\r\n        this.hadoken = new ph_Keyboard_index__WEBPACK_IMPORTED_MODULE_0__[\"HadokenKeyboard\"](this, {\r\n            bufferLimitType: 'time',\r\n            bufferLimit: 500,\r\n            keymapFn: ph_Keyboard_Simple__WEBPACK_IMPORTED_MODULE_1__[\"Mapper\"],\r\n            coalesseFn: ph_Keyboard_Simple__WEBPACK_IMPORTED_MODULE_1__[\"Coalesse\"],\r\n            filters: Object(_Hadoken__WEBPACK_IMPORTED_MODULE_2__[\"filterChain\"])(ph_Keyboard_Simple__WEBPACK_IMPORTED_MODULE_1__[\"NewFacingFilter\"](function () { return _this.facing; }))\r\n        });\r\n    };\r\n    Scene1.prototype.update = function () {\r\n        var ls = this.hadoken.lastState();\r\n        if (ls && ls !== this.ls) {\r\n            this.ls = ls;\r\n            console.log(Object.keys(ls.state));\r\n        }\r\n    };\r\n    return Scene1;\r\n}(Phaser.Scene));\r\nvar phaserConfig = {\r\n    type: Phaser.AUTO,\r\n    parent: 'phaser-display',\r\n    backgroundColor: '0x9a9a9a',\r\n    width: 800,\r\n    height: 600,\r\n    scene: [Scene1],\r\n    input: {\r\n        gamepad: true,\r\n    }\r\n};\r\nnew Phaser.Game(phaserConfig);\r\n\n\n//# sourceURL=webpack://Hadoken/./src/index.ts?");

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/index.ts */\"./src/index.ts\");\n\n\n//# sourceURL=webpack://Hadoken/multi_./src/index.ts?");

/***/ })

/******/ });
});