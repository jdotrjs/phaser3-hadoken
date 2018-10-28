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

/***/ "./src/Common/Coalesse.ts":
/*!********************************!*\
  !*** ./src/Common/Coalesse.ts ***!
  \********************************/
/*! exports provided: DPAD_COMBINATIONS, Coalesse, NewFacingFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DPAD_COMBINATIONS\", function() { return DPAD_COMBINATIONS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Coalesse\", function() { return Coalesse; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NewFacingFilter\", function() { return NewFacingFilter; });\n/* harmony import */ var ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ph/InputSnapshot */ \"./src/InputSnapshot.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n\r\nvar DPAD_COMBINATIONS = {\r\n    'down+left': ['down', 'left'],\r\n    'down+right': ['down', 'right'],\r\n    'up+left': ['up', 'left'],\r\n    'up+right': ['up', 'right'],\r\n};\r\nfunction Coalesse(input, timestamp) {\r\n    var hasAll = function (set) { return set.every(function (k) { return !!output[k]; }); };\r\n    var output = __assign({}, input.state);\r\n    Object.keys(DPAD_COMBINATIONS).forEach(function (k) {\r\n        if (hasAll(DPAD_COMBINATIONS[k])) {\r\n            var timeStamp_1 = 0;\r\n            DPAD_COMBINATIONS[k].forEach(function (e) {\r\n                if (output[e].pressed > timeStamp_1) {\r\n                    timeStamp_1 = output[e].pressed;\r\n                }\r\n                delete output[e];\r\n            });\r\n            output[k] = { pressed: timeStamp_1 };\r\n        }\r\n    });\r\n    return { timestamp: input.timestamp, state: output };\r\n}\r\nfunction NewFacingFilter(getFacing) {\r\n    return function (input) {\r\n        var facing = getFacing();\r\n        var output = __assign({}, input, { state: __assign({}, input.state) });\r\n        if (facing === 'right') {\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'right', 'forward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+right', 'down+forward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+right', 'up+forward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'left', 'backward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+left', 'down+backward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+left', 'up+backward');\r\n        }\r\n        else {\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'left', 'forward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+left', 'down+forward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+left', 'up+forward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'right', 'backward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'down+right', 'down+backward');\r\n            output = Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_0__[\"ReplaceKey\"])(output, 'up+right', 'up+backward');\r\n        }\r\n        return output;\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack://Hadoken/./src/Common/Coalesse.ts?");

/***/ }),

/***/ "./src/Common/Matcher.ts":
/*!*******************************!*\
  !*** ./src/Common/Matcher.ts ***!
  \*******************************/
/*! exports provided: NoopMatch, simpleMoveList, NewMatcher */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NoopMatch\", function() { return NoopMatch; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"simpleMoveList\", function() { return simpleMoveList; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NewMatcher\", function() { return NewMatcher; });\n// Looks for _one_ pressed button of a given class\r\nfunction oneClass(n) {\r\n    return function (input) {\r\n        return Object.keys(input).filter(function (i) { return i.indexOf(n) === 0; }).length === 1;\r\n    };\r\n}\r\n// Verifies that none of the represented classes are present\r\nfunction noClass(n) {\r\n    return function (input) {\r\n        return Object.keys(input).filter(function (i) { return i.indexOf(n) === 0; }).length === 0;\r\n    };\r\n}\r\nfunction multiKey() {\r\n    var matchers = [];\r\n    for (var _i = 0; _i < arguments.length; _i++) {\r\n        matchers[_i] = arguments[_i];\r\n    }\r\n    return function (input) {\r\n        return matchers.reduce(function (acc, cur) {\r\n            if (typeof cur === 'string') {\r\n                return acc && !!input[cur];\r\n            }\r\n            return acc && cur(input);\r\n        }, true);\r\n    };\r\n}\r\nvar QFC = ['down', 'down+forward', 'forward'];\r\nvar QBC = ['down', 'down+backward', 'backward'];\r\nvar SS = [\r\n    'down+forward',\r\n    'up+back',\r\n    'forward',\r\n    'down',\r\n    'down+forward',\r\n    'down+back',\r\n    multiKey(oneClass('punch'), noClass('kick'), 'guard'),\r\n];\r\nfunction NoopMatch() { }\r\nvar simpleMoveList = [\r\n    {\r\n        name: 'summon_suffering',\r\n        inputToleranceMS: 16 * 50,\r\n        sequence: SS,\r\n    },\r\n    {\r\n        name: 'hadoken',\r\n        sequence: QFC.concat([oneClass('punch')]),\r\n    },\r\n    {\r\n        name: 'huricane_kick',\r\n        sequence: QBC.concat([oneClass('kick')]),\r\n    },\r\n];\r\nfunction matchInput(state, matcher, reqFrame) {\r\n    if (typeof matcher === 'string') {\r\n        return !!state[matcher] &&\r\n            Object.keys(state).length === 1 &&\r\n            (!reqFrame || state[matcher].frameAdded);\r\n    }\r\n    return matcher(state);\r\n}\r\nfunction NewMatcher(moves, defaultToleranceMS) {\r\n    if (defaultToleranceMS === void 0) { defaultToleranceMS = 2; }\r\n    var moveList = moves.reduce(function (acc, cur) {\r\n        var sequence = cur.sequence.slice();\r\n        sequence.reverse();\r\n        return acc.concat([\r\n            { name: cur.name, sequence: sequence },\r\n        ]);\r\n    }, []);\r\n    return function (input) {\r\n        console.log(input);\r\n        var lastInput = input.slice(-1)[0];\r\n        var matchedMove = moveList.reduce(function (matched, tgtMove) {\r\n            if (matched !== '') {\r\n                return matched;\r\n            }\r\n            var tolerance = tgtMove.inputToleranceMS || defaultToleranceMS;\r\n            var sequence = tgtMove.sequence;\r\n            var lastMatch = 0;\r\n            // Check to see if we're at the end of this move; if not then it's not worth checking anything else\r\n            if (!matchInput(lastInput.state, sequence[0], true)) {\r\n                return '';\r\n            }\r\n            else {\r\n                lastMatch = lastInput.timestamp;\r\n                if (input.length === 1) {\r\n                    return tgtMove.name;\r\n                }\r\n            }\r\n            var i = 1;\r\n            var j = input.length - 2;\r\n            for (; i < sequence.length; i++) {\r\n                for (; j >= 0; j--) {\r\n                    if (matchInput(input[j].state, sequence[i], false)) {\r\n                        var newMatchTS = input[j].timestamp;\r\n                        if (lastMatch - newMatchTS <= tolerance) {\r\n                            lastMatch = newMatchTS;\r\n                        }\r\n                    }\r\n                }\r\n            }\r\n            if (i === sequence.length) {\r\n                return tgtMove.name;\r\n            }\r\n            return '';\r\n        }, '');\r\n        if (matchedMove !== '') {\r\n            var str_1 = [];\r\n            input.forEach(function (i) {\r\n                str_1.push(Object.keys(i.state).join(', '));\r\n            });\r\n            console.log(str_1.join(' / '));\r\n            console.log(Date.now() + \" - matched \" + matchedMove);\r\n        }\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack://Hadoken/./src/Common/Matcher.ts?");

/***/ }),

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

/***/ "./src/Keyboard/Mapper.ts":
/*!********************************!*\
  !*** ./src/Keyboard/Mapper.ts ***!
  \********************************/
/*! exports provided: NewSimpleMapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NewSimpleMapper\", function() { return NewSimpleMapper; });\nfunction NewSimpleMapper(map) {\r\n    return function (keycode) {\r\n        return map[keycode] || null;\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack://Hadoken/./src/Keyboard/Mapper.ts?");

/***/ }),

/***/ "./src/Keyboard/index.ts":
/*!*******************************!*\
  !*** ./src/Keyboard/index.ts ***!
  \*******************************/
/*! exports provided: HadokenKeyboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HadokenKeyboard\", function() { return HadokenKeyboard; });\n/* harmony import */ var ph_Hadoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ph/Hadoken */ \"./src/Hadoken.ts\");\n/* harmony import */ var ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ph/InputSnapshot */ \"./src/InputSnapshot.ts\");\n/* harmony import */ var ph_Common_Matcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ph/Common/Matcher */ \"./src/Common/Matcher.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n\r\n\r\n\r\nvar HadokenKeyboard = /** @class */ (function () {\r\n    function HadokenKeyboard(scn, cfg) {\r\n        this.state = Object(ph_Hadoken__WEBPACK_IMPORTED_MODULE_0__[\"NewHadoken\"])(scn, cfg);\r\n        scn.input.keyboard.on('keydown', this.keydown, this);\r\n        scn.input.keyboard.on('keyup', this.keyup, this);\r\n        scn.events.on('preupdate', this.preupdate, this);\r\n    }\r\n    HadokenKeyboard.prototype.preupdate = function () {\r\n        var coalesse = this.state.config.coalesseFn || function (e) { return e; };\r\n        for (var i = this.state.processedHistory.length; i < this.state.rawHistory.length; i++) {\r\n            var state = this.state.rawHistory[i];\r\n            var coalessed = coalesse(state, state.timestamp);\r\n            var filters = this.state.config.filters;\r\n            var filtered = filters ? filters(coalessed) : coalessed;\r\n            this.state.processedHistory.push(filtered);\r\n            var matcher = this.state.config.matchFn || ph_Common_Matcher__WEBPACK_IMPORTED_MODULE_2__[\"NoopMatch\"];\r\n            matcher(this.state.processedHistory);\r\n        }\r\n    };\r\n    HadokenKeyboard.prototype.keydown = function (e) {\r\n        var _a;\r\n        var sem = this.state.config.keymapFn(e.keyCode);\r\n        if (!sem) {\r\n            return;\r\n        }\r\n        var now = Date.now();\r\n        var lastState = this.state.rawHistory.slice(-1)[0];\r\n        var newSnapshot = {\r\n            timestamp: now,\r\n            state: __assign((_a = {}, _a[sem] = { pressed: e.timeStamp, frameAdded: true }, _a), lastState.state)\r\n        };\r\n        if (!Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_1__[\"HasSameKeys\"])(newSnapshot, lastState)) {\r\n            Object.keys(newSnapshot.state).filter(function (k) { return k !== sem; }).forEach(function (k) {\r\n                newSnapshot.state[k].frameAdded = false;\r\n            });\r\n            this.state.rawHistory.push(newSnapshot);\r\n        }\r\n    };\r\n    HadokenKeyboard.prototype.keyup = function (e) {\r\n        var sem = this.state.config.keymapFn(e.keyCode);\r\n        if (!sem) {\r\n            return;\r\n        }\r\n        var lastSnapshot = this.state.rawHistory.slice(-1)[0];\r\n        var state = __assign({}, lastSnapshot.state);\r\n        delete state[sem];\r\n        if (!Object(ph_InputSnapshot__WEBPACK_IMPORTED_MODULE_1__[\"HasSameKeys\"])(lastSnapshot, state)) {\r\n            var newState = {\r\n                timestamp: Date.now(),\r\n                state: state,\r\n            };\r\n            this.state.rawHistory.push(newState);\r\n        }\r\n    };\r\n    HadokenKeyboard.prototype.lastState = function () {\r\n        if (this.state.processedHistory.length === 0) {\r\n            return null;\r\n        }\r\n        return this.state.processedHistory.slice(-1)[0];\r\n    };\r\n    return HadokenKeyboard;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://Hadoken/./src/Keyboard/index.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var ph_Keyboard_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ph/Keyboard/index */ \"./src/Keyboard/index.ts\");\n/* harmony import */ var ph_Keyboard_Mapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ph/Keyboard/Mapper */ \"./src/Keyboard/Mapper.ts\");\n/* harmony import */ var ph_Common_Coalesse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ph/Common/Coalesse */ \"./src/Common/Coalesse.ts\");\n/* harmony import */ var ph_Common_Matcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ph/Common/Matcher */ \"./src/Common/Matcher.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    }\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar _a, _b, _c;\r\n// TODO: index should resolve automatically...\r\n\r\n\r\n\r\n\r\nvar c = Phaser.Input.Keyboard.KeyCodes;\r\nvar keymapArrows = (_a = {},\r\n    _a[c.DOWN] = 'down',\r\n    _a[c.UP] = 'up',\r\n    _a[c.RIGHT] = 'right',\r\n    _a[c.LEFT] = 'left',\r\n    _a);\r\nvar keymapDvorak = (_b = {},\r\n    _b[c.A] = 'punch:light',\r\n    _b[c.O] = 'punch:hard',\r\n    _b[c.E] = 'kick:light',\r\n    _b[c.U] = 'kick:hard',\r\n    _b[c.I] = 'guard',\r\n    _b);\r\nvar keymapQwerty = (_c = {},\r\n    _c[c.A] = 'punch:light',\r\n    _c[c.S] = 'punch:hard',\r\n    _c[c.D] = 'kick:light',\r\n    _c[c.F] = 'kick:hard',\r\n    _c[c.G] = 'guard',\r\n    _c);\r\nvar Scene1 = /** @class */ (function (_super) {\r\n    __extends(Scene1, _super);\r\n    function Scene1() {\r\n        var _this = _super.call(this, 'scene1') || this;\r\n        _this.facing = 'right';\r\n        console.log(_this);\r\n        return _this;\r\n    }\r\n    Scene1.prototype.create = function () {\r\n        var _this = this;\r\n        this.hadoken = new ph_Keyboard_index__WEBPACK_IMPORTED_MODULE_0__[\"HadokenKeyboard\"](this, {\r\n            bufferLimitType: 'time',\r\n            bufferLimit: 500,\r\n            keymapFn: ph_Keyboard_Mapper__WEBPACK_IMPORTED_MODULE_1__[\"NewSimpleMapper\"](__assign({}, keymapArrows, keymapDvorak)),\r\n            coalesseFn: ph_Common_Coalesse__WEBPACK_IMPORTED_MODULE_2__[\"Coalesse\"],\r\n            filters: ph_Common_Coalesse__WEBPACK_IMPORTED_MODULE_2__[\"NewFacingFilter\"](function () { return _this.facing; }),\r\n            matchFn: ph_Common_Matcher__WEBPACK_IMPORTED_MODULE_3__[\"NewMatcher\"](ph_Common_Matcher__WEBPACK_IMPORTED_MODULE_3__[\"simpleMoveList\"]),\r\n        });\r\n    };\r\n    Scene1.prototype.update = function () {\r\n        var ls = this.hadoken.lastState();\r\n        if (ls && ls !== this.ls) {\r\n            this.ls = ls;\r\n        }\r\n    };\r\n    return Scene1;\r\n}(Phaser.Scene));\r\nvar phaserConfig = {\r\n    type: Phaser.AUTO,\r\n    parent: 'phaser-display',\r\n    backgroundColor: '0x9a9a9a',\r\n    width: 800,\r\n    height: 600,\r\n    scene: [Scene1],\r\n    input: {\r\n        gamepad: true,\r\n    }\r\n};\r\nnew Phaser.Game(phaserConfig);\r\n\n\n//# sourceURL=webpack://Hadoken/./src/index.ts?");

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