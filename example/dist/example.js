(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("hadoken"));
	else if(typeof define === 'function' && define.amd)
		define(["hadoken"], factory);
	else if(typeof exports === 'object')
		exports["HadokenExample"] = factory(require("hadoken"));
	else
		root["HadokenExample"] = factory(root["Hadoken"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_hadoken__) {
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

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! exports provided: selectKeymap, selectInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"selectKeymap\", function() { return selectKeymap; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"selectInput\", function() { return selectInput; });\n/* harmony import */ var hadoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hadoken */ \"hadoken\");\n/* harmony import */ var hadoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hadoken__WEBPACK_IMPORTED_MODULE_0__);\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n// import {\n//   Events,\n//   Hadoken as HadokenBase,\n//   MatchData,\n//   HadokenPipelineConfig,\n// } from 'ph/Hadoken'\n// import * as Keyboard from 'ph/Adapters/Keyboard'\n// import * as Gamepad from 'ph/Adapters/Gamepad'\n// import * as Filters from \"ph/Common/Filters\"\n// import { isStandardMapping } from 'ph/Common/Gamepad';\n// import * as KeyboardCommon from 'ph/Common/Keyboard'\n// import * as SimpleMatcher from 'ph/Common/SimpleMatcher'\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\n\n\nconsole.log(hadoken__WEBPACK_IMPORTED_MODULE_0___default.a);\nvar Events = hadoken__WEBPACK_IMPORTED_MODULE_0___default.a.Events;\nvar _a = hadoken__WEBPACK_IMPORTED_MODULE_0___default.a.Adapters, Gamepad = _a.Gamepad, Keyboard = _a.Keyboard;\nvar common = hadoken__WEBPACK_IMPORTED_MODULE_0___default.a.Common;\nvar Filters = common.Filters;\nvar KeyboardCommon = common.Keyboard;\nvar SimpleMatcher = common.SimpleMatcher;\nvar isStandardMapping = common.Gamepad;\nvar DemoScene = /** @class */ (function (_super) {\n    __extends(DemoScene, _super);\n    function DemoScene() {\n        var _this = _super.call(this, 'demoscene') || this;\n        _this.facing = 'right';\n        _this.keymap = 'qwerty';\n        _this.displayCount = 12;\n        _this.hadoken = null;\n        _this.kbh = null;\n        _this.gph = null;\n        return _this;\n    }\n    DemoScene.prototype.preload = function () {\n        var _this = this;\n        ['1', '2', '3', '4', '6', '7', '8', '9', 'punch', 'punch_hard', 'kick', 'kick_hard', 'guard'].forEach(function (n) {\n            _this.load.image(\"input_\" + n, \"./assets/\" + n + \".png\");\n        });\n    };\n    DemoScene.prototype.create = function () {\n        this._constructUI();\n        this._connectKB();\n        this.g = this.add.graphics();\n        this.g.lineStyle(3, 0xff0000);\n        this.at = this.add.text(20, 70, '');\n    };\n    DemoScene.prototype._connectPad = function () {\n        var _this = this;\n        if (this.kbh !== null) {\n            this.kbh.pause();\n        }\n        if (this.gph !== null) {\n            this.hadoken = this.gph;\n            this.hadoken.resume();\n            return;\n        }\n        var ch = this.cameras.main.height;\n        var txt = this.add.text(0, ch / 2, 'Waiting for Gamepad', { fontFamily: \"Impact, ArialBlack\", fontSize: 50, color: '#3300cc', align: 'center' });\n        txt.setX(this.cameras.main.width / 2 - txt.width / 2);\n        txt.setY(ch / 2 - txt.height / 2);\n        var tween = this.add.tween({\n            targets: txt,\n            alpha: .4,\n            duration: 500,\n            easy: 'Power2',\n            repeat: -1,\n            yoyo: -1,\n        });\n        var attach = function (pad) {\n            tween.stop();\n            txt.destroy();\n            console.log(pad);\n            if (!isStandardMapping(pad)) {\n                alert('Gamepad + browser combination error, see dev console for details');\n                console.error('The browser doesn\\'t understand how to remap the attached');\n                console.error('controller into the standard gamepad mapping. Because this demo');\n                console.error('did not implement a remapping interface we bail instead of');\n                console.error('getting into a weird state where keys are nonsense.');\n                selectInput('keyboard');\n                return;\n            }\n            _this.gph = new Gamepad.Hadoken(_this, {\n                bufferLimitType: 'time',\n                bufferLimit: 5000,\n                gamepad: pad,\n                buttonMap: !(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()),\n                filters: Filters.NewChain(\n                // convert two directional inputs into a diagonal, if applicable\n                Filters.CoalesseInputs(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), \n                // change formats from right/left to forward/backward based on the\n                // player's facing\n                Filters.MapToFacing(function () { return _this.facing; }), \n                // only accept the most recent direction\n                Filters.OnlyMostRecent(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), \n                // and the most recent attack\n                Filters.OnlyMostRecent(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))),\n                // defines a set of moves to register\n                matchers: [\n                    { name: 'hadoken', match: SimpleMatcher.New(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), },\n                    { name: 'huricane_kick', match: SimpleMatcher.New(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), },\n                    {\n                        name: 'summon_suffering',\n                        match: SimpleMatcher.New(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { stepDelay: 800, totalDelay: 6000 }),\n                    }\n                ],\n            });\n            // hadoken will emit a match event when a move's input sequence is matched\n            _this.gph.emitter.on(Events.Match, _this._onMoveMatched, _this);\n            _this.hadoken = _this.gph;\n        };\n        if (this.input.gamepad.total > 0) {\n            attach(this.input.gamepad.pad1);\n        }\n        else {\n            this.input.gamepad.once('connected', attach);\n        }\n    };\n    DemoScene.prototype._connectKB = function () {\n        var _this = this;\n        if (this.gph !== null) {\n            this.gph.pause();\n        }\n        if (this.kbh !== null) {\n            this.hadoken = this.kbh;\n            this.hadoken.resume();\n            return;\n        }\n        var dvorakMapper = KeyboardCommon.NewSimpleMapper(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n        var qwertykMapper = KeyboardCommon.NewSimpleMapper(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n        this.kbh = new Keyboard.Hadoken(this, {\n            bufferLimitType: 'time',\n            bufferLimit: 5000,\n            keymapFn: function (code) { return _this.keymap === 'dvorak'\n                ? dvorakMapper(code)\n                : qwertykMapper(code); },\n            filters: Filters.NewChain(\n            // convert two directional inputs into a diagonal, if applicable\n            Filters.CoalesseInputs(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), \n            // change formats from right/left to forward/backward based on the\n            // player's facing\n            Filters.MapToFacing(function () { return _this.facing; }), \n            // only accept the most recent direction\n            Filters.OnlyMostRecent(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), \n            // and the most recent attack\n            Filters.OnlyMostRecent(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))),\n            // defines a set of moves to register\n            matchers: [\n                { name: 'hadoken', match: SimpleMatcher.New(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), },\n                { name: 'huricane_kick', match: SimpleMatcher.New(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())), },\n                {\n                    name: 'summon_suffering',\n                    match: SimpleMatcher.New(!(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { stepDelay: 800, totalDelay: 6000 }),\n                }\n            ],\n        });\n        // hadoken will emit a match event when a move's input sequence is matched\n        this.kbh.emitter.on(Events.Match, this._onMoveMatched, this);\n        this.hadoken = this.kbh;\n    };\n    DemoScene.prototype._constructUI = function () {\n        var ch = this.cameras.main.height;\n        var cw = this.cameras.main.width;\n        var boxesCount = this.displayCount;\n        var boxBorder = 12;\n        var bb2 = boxBorder / 2;\n        var offsetX = 40;\n        var offsetY = 3 / 5 * ch;\n        var boxWidth = (cw - boxesCount * boxBorder - 2 * offsetX) / boxesCount;\n        var boxHeight = boxWidth;\n        this.lastMatched = null;\n        this.boxG = [];\n        for (var i = 0; i < boxesCount; i++) {\n            this.boxG.push([]);\n            for (var j = 0; j < 3; j++) {\n                var bx = offsetX + i * ((i === 0 ? bb2 : boxBorder) + boxWidth);\n                var by = offsetY + j * (boxHeight + bb2);\n                var img = this.add.image(bx, by, 'input_6');\n                img.setOrigin(0);\n                img.setDisplaySize(boxWidth, boxHeight);\n                this.boxG[i].push(img);\n            }\n        }\n        this.controls = [];\n        var txtCfg = { fontFamily: \"Impact, ArialBlack\", fontSize: 35, color: '#3300cc', align: 'center' };\n        var col1 = cw / 3;\n        var col2 = cw / 2;\n        var col3 = 2 / 3 * cw;\n        this.controls.push(this.add.text(col1, 0, ' : A', txtCfg));\n        var row1 = this.controls[0].height / 2;\n        this.controls[0].setY(row1);\n        var row2 = row1 + this.controls[0].height + 4;\n        this.controls.push(this.add.text(col1, row2, ' : S', txtCfg));\n        this.controls.push(this.add.text(col2, row1, ' : D', txtCfg));\n        this.controls.push(this.add.text(col2, row2, ' : F', txtCfg));\n        this.controls.push(this.add.text(col3, row1 + (row2 - row1) / 2, ' : G', txtCfg));\n        var offset = this.controls[0].width;\n        var sz = this.controls[0].height;\n        this.add.image(col1 - offset, row1, 'input_punch').setDisplaySize(sz, sz).setOrigin(0);\n        this.add.image(col2 - offset, row1, 'input_punch_hard').setDisplaySize(sz, sz).setOrigin(0);\n        this.add.image(col1 - offset, row2, 'input_kick').setDisplaySize(sz, sz).setOrigin(0);\n        this.add.image(col2 - offset, row2, 'input_kick_hard').setDisplaySize(sz, sz).setOrigin(0);\n        this.add.image(col3 - offset, row1 + (row2 - row1) / 2, 'input_guard').setDisplaySize(sz, sz).setOrigin(0);\n    };\n    DemoScene.prototype._onMoveMatched = function (data) {\n        if (this.lastMatched) {\n            this.lastMatched.setVisible(false);\n        }\n        var ch = this.cameras.main.height;\n        var txt = this.add.text(0, ch / 3, data.name, { fontFamily: \"Impact, ArialBlack\", fontSize: 64, color: '#3300cc', align: 'center' });\n        this.lastMatched = txt;\n        txt.setShadow(2, 2, \"#333333\", 2, true, true);\n        txt.setOrigin(0);\n        txt.setX(this.cameras.main.width / 2 - (txt.width / 2));\n        this.add.tween({\n            targets: txt,\n            alpha: 0,\n            delay: 500,\n            duration: 1200,\n            ease: 'Power2',\n        });\n        if (this.hadoken !== null) {\n            var hData_1 = this.hadoken.hadokenData;\n            var m = data.meta;\n            m.indicies.forEach(function (idx) {\n                var state = hData_1.processedHistory[idx].state;\n                console.log(\"  \" + idx + \" => [\" + Object.keys(state).join(', ') + \"]\");\n            });\n        }\n    };\n    DemoScene.prototype._drawInputHistory = function () {\n        var nameMapping = {\n            'down+backward': '1',\n            'down': '2',\n            'down+forward': '3',\n            'backward': '4',\n            'forward': '6',\n            'up+backward': '7',\n            'up': '8',\n            'up+forward': '9',\n            'punch:light': 'punch',\n            'punch:hard': 'punch_hard',\n            'kick:light': 'kick',\n            'kick:hard': 'kick_hard',\n            'guard': 'guard',\n        };\n        this.at.setText('');\n        if (this.g) {\n            this.g.clear();\n        }\n        if (this.g && this.hadoken instanceof Gamepad.Hadoken) {\n            this.g.lineStyle(2, 0xff0000, 1);\n            this.g.strokeCircle(40, 40, 25);\n            var stickData = this.hadoken.analogData.stick;\n            var _a = stickData['left-stick'] || { angle: 0, value: 0 }, angle = _a.angle, value = _a.value;\n            var angleRad = angle / 57.295827;\n            var x2 = (value * 25) * Math.cos(angleRad) + 40;\n            var y2 = (value * 25) * Math.sin(angleRad) + 40;\n            this.g.lineStyle(2, 0xff0000, 1);\n            this.g.strokeLineShape(new Phaser.Geom.Line(40, 40, x2, y2));\n            this.at.setText(angle + \"\\n\" + value);\n        }\n        var history = this.hadoken !== null\n            ? this.hadoken.hadokenData.processedHistory.filter(function (h) { return Object.keys(h.state).length; }).slice(-1 * this.displayCount)\n            : [];\n        var i = 0;\n        var _loop_1 = function () {\n            var state = history[i].state;\n            var inputs = Object.keys(state);\n            var col = this_1.boxG[i];\n            if (inputs.length > 3) {\n                console.error(\"inputs > 3: [\" + inputs.join(', ') + \"]\");\n            }\n            var directions = !(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).filter(function (i) { return inputs.indexOf(i) !== -1; });\n            var attacks = !(function webpackMissingModule() { var e = new Error(\"Cannot find module './ExampleConfig'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).filter(function (i) { return inputs.indexOf(i) !== -1; });\n            var guard = inputs.indexOf('guard') == -1 ? [] : ['guard'];\n            var j = 0;\n            if (directions.length) {\n                col[j].setTexture(\"input_\" + nameMapping[directions[0]]);\n                col[j].setVisible(true);\n                j++;\n            }\n            if (attacks.length) {\n                col[j].setTexture(\"input_\" + nameMapping[attacks[0]]);\n                col[j].setVisible(true);\n                j++;\n            }\n            if (guard.length) {\n                col[j].setTexture(\"input_\" + nameMapping[guard[0]]);\n                col[j].setVisible(true);\n                j++;\n            }\n            for (; j < 3; j++) {\n                col[j].setVisible(false);\n            }\n        };\n        var this_1 = this;\n        for (; i < history.length; i++) {\n            _loop_1();\n        }\n        for (; i < this.displayCount; i++) {\n            for (var j = 0; j < 3; j++) {\n                this.boxG[i][j].setVisible(false);\n            }\n        }\n    };\n    DemoScene.prototype.switchInputTo = function (typ) {\n        if (typ === 'keyboard') {\n            this._connectKB();\n        }\n        if (typ === 'gamepad') {\n            this._connectPad();\n        }\n    };\n    DemoScene.prototype.update = function () {\n        this._drawInputHistory();\n        if (this.hadoken && this.hadoken.hadokenData.matchedMove !== null) {\n            console.log(\"matched: \" + this.hadoken.hadokenData.matchedMove);\n        }\n    };\n    return DemoScene;\n}(Phaser.Scene));\nvar phaserConfig = {\n    type: Phaser.AUTO,\n    parent: 'phaser-display',\n    backgroundColor: '0x9a9a9a',\n    width: 800,\n    height: 400,\n    scene: [DemoScene],\n    input: {\n        gamepad: true,\n    }\n};\nvar game = new Phaser.Game(phaserConfig);\n// hook for demo page to swap keymaps\nfunction selectKeymap(newmap) {\n    var scn = game.scene.getScene('demoscene');\n    scn.keymap = newmap;\n    var nowQwerty = newmap === 'qwerty';\n    var letters = nowQwerty\n        ? ['A', 'S', 'D', 'F', 'G']\n        : ['A', 'O', 'E', 'U', 'I'];\n    letters.forEach(function (l, i) { scn.controls[i].setText(\" : \" + l); });\n    var qwEle = document.getElementById('keymap-qwerty');\n    qwEle.className = 'selectable' + (nowQwerty ? ' selected' : '');\n    var dvEle = document.getElementById('keymap-dvorak');\n    dvEle.className = 'selectable' + (nowQwerty ? '' : ' selected');\n}\nfunction selectInput(typ) {\n    var scn = game.scene.getScene('demoscene');\n    scn.switchInputTo(typ);\n    var nowKB = typ === 'keyboard';\n    var kbEle = document.getElementById('input-keyboard');\n    kbEle.className = 'selectable' + (nowKB ? ' selected' : '');\n    var gpEle = document.getElementById('input-gamepad');\n    gpEle.className = 'selectable' + (nowKB ? '' : ' selected');\n    var keymapEle = document.getElementById('keymap-select-section');\n    if (nowKB) {\n        keymapEle.style.display = 'block';\n        selectKeymap(scn.keymap);\n    }\n    else {\n        var letters = ['A', 'B', 'X', 'Y', 'LS'];\n        letters.forEach(function (l, i) { scn.controls[i].setText(\" : \" + l); });\n        keymapEle.style.display = 'none';\n    }\n}\n\n\n//# sourceURL=webpack://HadokenExample/./index.ts?");

/***/ }),

/***/ 0:
/*!************************!*\
  !*** multi ./index.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! /Users/falun/Projects/phaser/phaser3-hadoken/example/index.ts */\"./index.ts\");\n\n\n//# sourceURL=webpack://HadokenExample/multi_./index.ts?");

/***/ }),

/***/ "hadoken":
/*!**************************************************************************************************************!*\
  !*** external {"umd":"hadoken","commonjs2":"hadoken","commonjs":"hadoken","amd":"hadoken","root":"Hadoken"} ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_hadoken__;\n\n//# sourceURL=webpack://HadokenExample/external_%7B%22umd%22:%22hadoken%22,%22commonjs2%22:%22hadoken%22,%22commonjs%22:%22hadoken%22,%22amd%22:%22hadoken%22,%22root%22:%22Hadoken%22%7D?");

/***/ })

/******/ });
});