module.exports =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@jscpd/core/dist/detector.js":
/*!***************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/detector.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabin_karp_1 = __webpack_require__(/*! ./rabin-karp */ "./node_modules/@jscpd/core/dist/rabin-karp.js");
const validators_1 = __webpack_require__(/*! ./validators */ "./node_modules/@jscpd/core/dist/validators/index.js");
const mode_1 = __webpack_require__(/*! ./mode */ "./node_modules/@jscpd/core/dist/mode.js");
// TODO replace to own event emitter
const EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
class Detector extends EventEmitter {
    constructor(tokenizer, store, cloneValidators = [], options) {
        super();
        this.tokenizer = tokenizer;
        this.store = store;
        this.cloneValidators = cloneValidators;
        this.options = options;
        this.initCloneValidators();
        this.algorithm = new rabin_karp_1.RabinKarp(this.options, this, this.cloneValidators);
        this.options.minTokens = this.options.minTokens || 50;
        this.options.maxLines = this.options.maxLines || 500;
        this.options.minLines = this.options.minLines || 5;
        this.options.mode = this.options.mode || mode_1.mild;
    }
    detect(id, text, format) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenMaps = this.tokenizer.generateMaps(id, text, format, this.options);
            // TODO change stores implementation
            this.store.namespace(format);
            const detect = (tokenMap, clones) => __awaiter(this, void 0, void 0, function* () {
                if (tokenMap) {
                    this.emit('START_DETECTION', { source: tokenMap });
                    return this.algorithm
                        .run(tokenMap, this.store)
                        .then((clns) => {
                        clones.push(...clns);
                        const nextTokenMap = tokenMaps.pop();
                        if (nextTokenMap) {
                            return detect(nextTokenMap, clones);
                        }
                        else {
                            return clones;
                        }
                    });
                }
            });
            return detect(tokenMaps.pop(), []);
        });
    }
    initCloneValidators() {
        if (this.options.minLines || this.options.maxLines) {
            this.cloneValidators.push(new validators_1.LinesLengthCloneValidator());
        }
    }
}
exports.Detector = Detector;
//# sourceMappingURL=detector.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/index.js":
/*!************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./detector */ "./node_modules/@jscpd/core/dist/detector.js"));
__export(__webpack_require__(/*! ./mode */ "./node_modules/@jscpd/core/dist/mode.js"));
__export(__webpack_require__(/*! ./options */ "./node_modules/@jscpd/core/dist/options.js"));
__export(__webpack_require__(/*! ./statistic */ "./node_modules/@jscpd/core/dist/statistic.js"));
__export(__webpack_require__(/*! ./store/memory */ "./node_modules/@jscpd/core/dist/store/memory.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/mode.js":
/*!***********************************************!*\
  !*** ./node_modules/@jscpd/core/dist/mode.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function strict(token) {
    return token.type !== 'ignore';
}
exports.strict = strict;
function mild(token) {
    return strict(token) && token.type !== 'empty' && token.type !== 'new_line';
}
exports.mild = mild;
function weak(token) {
    return mild(token)
        && token.format !== 'comment'
        && token.type !== 'comment'
        && token.type !== 'block-comment';
}
exports.weak = weak;
const MODES = {
    mild,
    strict,
    weak,
};
function getModeByName(name) {
    if (name in MODES) {
        return MODES[name];
    }
    throw new Error(`Mode ${name} does not supported yet.`);
}
exports.getModeByName = getModeByName;
function getModeHandler(mode) {
    return typeof mode === 'string' ? getModeByName(mode) : mode;
}
exports.getModeHandler = getModeHandler;
//# sourceMappingURL=mode.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/options.js":
/*!**************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/options.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mode_1 = __webpack_require__(/*! ./mode */ "./node_modules/@jscpd/core/dist/mode.js");
function getDefaultOptions() {
    return {
        executionId: new Date().toISOString(),
        path: [process.cwd()],
        mode: mode_1.getModeHandler('mild'),
        minLines: 5,
        maxLines: 1000,
        maxSize: '100kb',
        minTokens: 50,
        output: './report',
        reporters: ['console'],
        ignore: [],
        threshold: undefined,
        formatsExts: {},
        debug: false,
        silent: false,
        blame: false,
        cache: true,
        absolute: false,
        noSymlinks: false,
        skipLocal: false,
        ignoreCase: false,
        gitignore: false,
        reportersOptions: {},
    };
}
exports.getDefaultOptions = getDefaultOptions;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOption(name, options) {
    const defaultOptions = getDefaultOptions();
    return options ? options[name] || defaultOptions[name] : defaultOptions[name];
}
exports.getOption = getOption;
//# sourceMappingURL=options.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/rabin-karp.js":
/*!*****************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/rabin-karp.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = __webpack_require__(/*! ./validators */ "./node_modules/@jscpd/core/dist/validators/index.js");
class RabinKarp {
    constructor(options, eventEmitter, cloneValidators) {
        this.options = options;
        this.eventEmitter = eventEmitter;
        this.cloneValidators = cloneValidators;
    }
    run(tokenMap, store) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve => {
                let mapFrameInStore;
                let clone = null;
                const clones = [];
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                const loop = () => {
                    const iteration = tokenMap.next();
                    store
                        .get(iteration.value.id)
                        .then((mapFrameFromStore) => {
                        mapFrameInStore = mapFrameFromStore;
                        if (!clone) {
                            clone = RabinKarp.createClone(tokenMap.getFormat(), iteration.value, mapFrameInStore);
                        }
                    }, () => {
                        if (clone && this.validate(clone)) {
                            clones.push(clone);
                        }
                        clone = null;
                        if (iteration.value.id) {
                            return store.set(iteration.value.id, iteration.value);
                        }
                    })
                        .finally(() => {
                        if (!iteration.done) {
                            if (clone) {
                                clone = RabinKarp.enlargeClone(clone, iteration.value, mapFrameInStore);
                            }
                            loop();
                        }
                        else {
                            resolve(clones);
                        }
                    });
                };
                loop();
            }));
        });
    }
    validate(clone) {
        const validation = validators_1.runCloneValidators(clone, this.options, this.cloneValidators);
        if (validation.status) {
            this.eventEmitter.emit('CLONE_FOUND', { clone });
        }
        else {
            this.eventEmitter.emit('CLONE_SKIPPED', { clone, validation });
        }
        return validation.status;
    }
    static createClone(format, mapFrameA, mapFrameB) {
        return {
            format,
            foundDate: new Date().getTime(),
            duplicationA: {
                sourceId: mapFrameA.sourceId,
                start: mapFrameA.start.loc.start,
                end: mapFrameA.end.loc.end,
                range: [mapFrameA.start.range[0], mapFrameA.end.range[1]],
            },
            duplicationB: {
                sourceId: mapFrameB.sourceId,
                start: mapFrameB.start.loc.start,
                end: mapFrameB.end.loc.end,
                range: [mapFrameB.start.range[0], mapFrameB.end.range[1]],
            },
        };
    }
    static enlargeClone(clone, mapFrameA, mapFrameB) {
        clone.duplicationA.range[1] = mapFrameA.end.range[1];
        clone.duplicationA.end = mapFrameA.end.loc.end;
        clone.duplicationB.range[1] = mapFrameB.end.range[1];
        clone.duplicationB.end = mapFrameB.end.loc.end;
        return clone;
    }
}
exports.RabinKarp = RabinKarp;
//# sourceMappingURL=rabin-karp.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/statistic.js":
/*!****************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/statistic.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Statistic {
    constructor(options) {
        this.options = options;
        this.statistic = {
            detectionDate: new Date().toISOString(),
            formats: {},
            total: Statistic.getDefaultStatistic(),
        };
    }
    static getDefaultStatistic() {
        return {
            lines: 0,
            tokens: 0,
            sources: 0,
            clones: 0,
            duplicatedLines: 0,
            duplicatedTokens: 0,
            percentage: 0,
            percentageTokens: 0,
            newDuplicatedLines: 0,
            newClones: 0,
        };
    }
    subscribe() {
        return {
            CLONE_FOUND: this.cloneFound.bind(this),
            START_DETECTION: this.matchSource.bind(this),
        };
    }
    getStatistic() {
        return this.statistic;
    }
    cloneFound(payload) {
        const { clone } = payload;
        const id = clone.duplicationA.sourceId;
        const id2 = clone.duplicationB.sourceId;
        const linesCount = clone.duplicationA.end.line - clone.duplicationA.start.line;
        const duplicatedTokens = clone.duplicationA.end.position - clone.duplicationA.start.position;
        this.statistic.total.clones++;
        this.statistic.total.duplicatedLines += linesCount;
        this.statistic.total.duplicatedTokens += duplicatedTokens;
        this.statistic.formats[clone.format].total.clones++;
        this.statistic.formats[clone.format].total.duplicatedLines += linesCount;
        this.statistic.formats[clone.format].total.duplicatedTokens += duplicatedTokens;
        this.statistic.formats[clone.format].sources[id].clones++;
        this.statistic.formats[clone.format].sources[id].duplicatedLines += linesCount;
        this.statistic.formats[clone.format].sources[id].duplicatedTokens += duplicatedTokens;
        this.statistic.formats[clone.format].sources[id2].clones++;
        this.statistic.formats[clone.format].sources[id2].duplicatedLines += linesCount;
        this.statistic.formats[clone.format].sources[id2].duplicatedTokens += duplicatedTokens;
        this.updatePercentage(clone.format);
    }
    matchSource(payload) {
        const { source } = payload;
        const format = source.getFormat();
        if (!(format in this.statistic.formats)) {
            this.statistic.formats[format] = {
                sources: {},
                total: Statistic.getDefaultStatistic(),
            };
        }
        this.statistic.total.sources++;
        this.statistic.total.lines += source.getLinesCount();
        this.statistic.total.tokens += source.getTokensCount();
        this.statistic.formats[format].total.sources++;
        this.statistic.formats[format].total.lines += source.getLinesCount();
        this.statistic.formats[format].total.tokens += source.getTokensCount();
        this.statistic.formats[format].sources[source.getId()] =
            this.statistic.formats[format].sources[source.getId()] || Statistic.getDefaultStatistic();
        this.statistic.formats[format].sources[source.getId()].sources = 1;
        this.statistic.formats[format].sources[source.getId()].lines += source.getLinesCount();
        this.statistic.formats[format].sources[source.getId()].tokens += source.getTokensCount();
        this.updatePercentage(format);
    }
    updatePercentage(format) {
        this.statistic.total.percentage = Statistic.calculatePercentage(this.statistic.total.lines, this.statistic.total.duplicatedLines);
        this.statistic.total.percentageTokens = Statistic.calculatePercentage(this.statistic.total.tokens, this.statistic.total.duplicatedTokens);
        this.statistic.formats[format].total.percentage = Statistic.calculatePercentage(this.statistic.formats[format].total.lines, this.statistic.formats[format].total.duplicatedLines);
        this.statistic.formats[format].total.percentageTokens = Statistic.calculatePercentage(this.statistic.formats[format].total.tokens, this.statistic.formats[format].total.duplicatedTokens);
        Object.entries(this.statistic.formats[format].sources).forEach(([id, stat]) => {
            this.statistic.formats[format].sources[id].percentage = Statistic.calculatePercentage(stat.lines, stat.duplicatedLines);
            this.statistic.formats[format].sources[id].percentageTokens = Statistic.calculatePercentage(stat.tokens, stat.duplicatedTokens);
        });
    }
    static calculatePercentage(total, cloned) {
        return total ? Math.round((10000 * cloned) / total) / 100 : 0.0;
    }
}
exports.Statistic = Statistic;
//# sourceMappingURL=statistic.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/store/memory.js":
/*!*******************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/store/memory.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class MemoryStore {
    constructor() {
        this.values = {};
    }
    namespace(namespace) {
        this._namespace = namespace;
        this.values[namespace] = this.values[namespace] || {};
    }
    get(key) {
        return new Promise((resolve, reject) => {
            if (key in this.values[this._namespace]) {
                resolve(this.values[this._namespace][key]);
            }
            else {
                reject(new Error('not found'));
            }
        });
    }
    set(key, value) {
        this.values[this._namespace][key] = value;
        return Promise.resolve(value);
    }
    close() {
        this.values = {};
    }
}
exports.MemoryStore = MemoryStore;
//# sourceMappingURL=memory.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/validators/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/validators/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./lines-length-clone.validator */ "./node_modules/@jscpd/core/dist/validators/lines-length-clone.validator.js"));
__export(__webpack_require__(/*! ./validator */ "./node_modules/@jscpd/core/dist/validators/validator.js"));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/validators/lines-length-clone.validator.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/validators/lines-length-clone.validator.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class LinesLengthCloneValidator {
    validate(clone, options) {
        const lines = clone.duplicationA.end.line - clone.duplicationA.start.line;
        const status = lines >= options.minLines;
        return {
            status,
            message: status ? ['ok'] : [`Lines of code less then limit (${lines} < ${options.minLines})`],
        };
    }
}
exports.LinesLengthCloneValidator = LinesLengthCloneValidator;
//# sourceMappingURL=lines-length-clone.validator.js.map

/***/ }),

/***/ "./node_modules/@jscpd/core/dist/validators/validator.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscpd/core/dist/validators/validator.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function runCloneValidators(clone, options, validators) {
    return validators.reduce((acc, validator) => {
        const res = validator.validate(clone, options);
        return Object.assign(Object.assign({}, acc), { status: res.status && acc.status, message: res.message ? [...acc.message, ...res.message] : acc.message });
    }, { status: true, message: [], clone });
}
exports.runCloneValidators = runCloneValidators;
//# sourceMappingURL=validator.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/formats.js":
/*!*******************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/formats.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __webpack_require__(/*! path */ "path");
exports.FORMATS = {
    abap: {
        exts: [],
    },
    actionscript: {
        exts: ['as'],
    },
    ada: {
        exts: ['ada'],
    },
    apacheconf: {
        exts: [],
    },
    apl: {
        exts: ['apl'],
    },
    applescript: {
        exts: [],
    },
    arduino: {
        exts: [],
    },
    arff: {
        exts: [],
    },
    asciidoc: {
        exts: [],
    },
    asm6502: {
        exts: [],
    },
    aspnet: {
        exts: ['asp', 'aspx'],
    },
    autohotkey: {
        exts: [],
    },
    autoit: {
        exts: [],
    },
    bash: {
        exts: ['sh', 'ksh', 'bash'],
    },
    basic: {
        exts: ['bas'],
    },
    batch: {
        exts: [],
    },
    bison: {
        exts: [],
    },
    brainfuck: {
        exts: ['b', 'bf'],
    },
    bro: {
        exts: [],
    },
    c: {
        exts: ['c', 'z80'],
    },
    'c-header': {
        exts: ['h'],
        parent: 'c',
    },
    clike: {
        exts: [],
    },
    clojure: {
        exts: ['cljs', 'clj', 'cljc', 'cljx', 'edn'],
    },
    coffeescript: {
        exts: ['coffee'],
    },
    comments: {
        exts: []
    },
    cpp: {
        exts: ['cpp', 'c++', 'cc', 'cxx'],
    },
    'cpp-header': {
        exts: ['hpp', 'h++', 'hh', 'hxx'],
        parent: 'cpp',
    },
    crystal: {
        exts: ['cr'],
    },
    csharp: {
        exts: ['cs'],
    },
    csp: {
        exts: [],
    },
    'css-extras': {
        exts: [],
    },
    css: {
        exts: ['css', 'gss'],
    },
    d: {
        exts: ['d'],
    },
    dart: {
        exts: ['dart'],
    },
    diff: {
        exts: ['diff', 'patch'],
    },
    django: {
        exts: [],
    },
    docker: {
        exts: [],
    },
    eiffel: {
        exts: ['e'],
    },
    elixir: {
        exts: [],
    },
    elm: {
        exts: ['elm'],
    },
    erb: {
        exts: [],
    },
    erlang: {
        exts: ['erl', 'erlang'],
    },
    flow: {
        exts: [],
    },
    fortran: {
        exts: ['f', 'for', 'f77', 'f90'],
    },
    fsharp: {
        exts: ['fs'],
    },
    gedcom: {
        exts: [],
    },
    gherkin: {
        exts: ['feature'],
    },
    git: {
        exts: [],
    },
    glsl: {
        exts: [],
    },
    go: {
        exts: ['go'],
    },
    graphql: {
        exts: ['graphql'],
    },
    groovy: {
        exts: ['groovy', 'gradle'],
    },
    haml: {
        exts: ['haml'],
    },
    handlebars: {
        exts: ['hb', 'hbs', 'handlebars'],
    },
    haskell: {
        exts: ['hs', 'lhs '],
    },
    haxe: {
        exts: ['hx', 'hxml'],
    },
    hpkp: {
        exts: [],
    },
    hsts: {
        exts: [],
    },
    http: {
        exts: [],
    },
    ichigojam: {
        exts: [],
    },
    icon: {
        exts: [],
    },
    inform7: {
        exts: [],
    },
    ini: {
        exts: ['ini'],
    },
    io: {
        exts: [],
    },
    j: {
        exts: [],
    },
    java: {
        exts: ['java'],
    },
    javascript: {
        exts: ['js', 'es', 'es6'],
    },
    jolie: {
        exts: [],
    },
    json: {
        exts: ['json', 'map', 'jsonld'],
    },
    jsx: {
        exts: ['jsx'],
    },
    julia: {
        exts: ['jl'],
    },
    keymap: {
        exts: [],
    },
    kotlin: {
        exts: ['kt', 'kts'],
    },
    latex: {
        exts: ['tex'],
    },
    less: {
        exts: ['less'],
    },
    liquid: {
        exts: [],
    },
    lisp: {
        exts: ['cl', 'lisp', 'el'],
    },
    livescript: {
        exts: ['ls'],
    },
    lolcode: {
        exts: [],
    },
    lua: {
        exts: ['lua'],
    },
    makefile: {
        exts: [],
    },
    markdown: {
        exts: ['md', 'markdown', 'mkd', 'txt'],
    },
    markup: {
        exts: ['html', 'htm', 'xml', 'xsl', 'xslt', 'svg', 'vue', 'ejs', 'jsp'],
    },
    matlab: {
        exts: [],
    },
    mel: {
        exts: [],
    },
    mizar: {
        exts: [],
    },
    monkey: {
        exts: [],
    },
    n4js: {
        exts: [],
    },
    nasm: {
        exts: [],
    },
    nginx: {
        exts: [],
    },
    nim: {
        exts: [],
    },
    nix: {
        exts: [],
    },
    nsis: {
        exts: ['nsh', 'nsi'],
    },
    objectivec: {
        exts: ['m', 'mm'],
    },
    ocaml: {
        exts: ['ocaml', 'ml', 'mli', 'mll', 'mly'],
    },
    opencl: {
        exts: [],
    },
    oz: {
        exts: ['oz'],
    },
    parigp: {
        exts: [],
    },
    pascal: {
        exts: ['pas', 'p'],
    },
    perl: {
        exts: ['pl', 'pm'],
    },
    php: {
        exts: ['php', 'phtml'],
    },
    plsql: {
        exts: ['plsql'],
    },
    powershell: {
        exts: ['ps1', 'psd1', 'psm1'],
    },
    processing: {
        exts: [],
    },
    prolog: {
        exts: ['pro'],
    },
    properties: {
        exts: ['properties'],
    },
    protobuf: {
        exts: ['proto'],
    },
    pug: {
        exts: ['pug', 'jade'],
    },
    puppet: {
        exts: ['pp', 'puppet'],
    },
    pure: {
        exts: [],
    },
    python: {
        exts: ['py', 'pyx', 'pxd', 'pxi'],
    },
    q: {
        exts: ['q'],
    },
    qore: {
        exts: [],
    },
    r: {
        exts: ['r', 'R'],
    },
    reason: {
        exts: [],
    },
    renpy: {
        exts: [],
    },
    rest: {
        exts: [],
    },
    rip: {
        exts: [],
    },
    roboconf: {
        exts: [],
    },
    ruby: {
        exts: ['rb'],
    },
    rust: {
        exts: ['rs'],
    },
    sas: {
        exts: ['sas'],
    },
    sass: {
        exts: ['sass'],
    },
    scala: {
        exts: ['scala'],
    },
    scheme: {
        exts: ['scm', 'ss'],
    },
    scss: {
        exts: ['scss'],
    },
    smalltalk: {
        exts: ['st'],
    },
    smarty: {
        exts: ['smarty', 'tpl'],
    },
    soy: {
        exts: ['soy'],
    },
    sql: {
        exts: ['sql', 'cql'],
    },
    stylus: {
        exts: ['styl', 'stylus'],
    },
    swift: {
        exts: ['swift'],
    },
    tap: {
        exts: ['tap'],
    },
    tcl: {
        exts: ['tcl'],
    },
    textile: {
        exts: ['textile'],
    },
    tsx: {
        exts: ['tsx'],
    },
    tt2: {
        exts: ['tt2'],
    },
    twig: {
        exts: ['twig'],
    },
    typescript: {
        exts: ['ts'],
    },
    vbnet: {
        exts: ['vb'],
    },
    velocity: {
        exts: ['vtl'],
    },
    verilog: {
        exts: ['v'],
    },
    vhdl: {
        exts: ['vhd', 'vhdl'],
    },
    vim: {
        exts: [],
    },
    'visual-basic': {
        exts: ['vb'],
    },
    wasm: {
        exts: [],
    },
    url: {
        exts: [],
    },
    wiki: {
        exts: [],
    },
    xeora: {
        exts: [],
    },
    xojo: {
        exts: [],
    },
    xquery: {
        exts: ['xy', 'xquery'],
    },
    yaml: {
        exts: ['yaml', 'yml'],
    },
};
function getSupportedFormats() {
    return Object.keys(exports.FORMATS).filter((name) => name !== 'important' && name !== 'url');
}
exports.getSupportedFormats = getSupportedFormats;
function getFormatByFile(path, formatsExts) {
    const ext = path_1.extname(path).slice(1);
    if (formatsExts && Object.keys(formatsExts).length) {
        return Object.keys(formatsExts).find((format) => formatsExts[format].includes(ext));
    }
    return Object.keys(exports.FORMATS).find((language) => exports.FORMATS[language].exts.includes(ext));
}
exports.getFormatByFile = getFormatByFile;
//# sourceMappingURL=formats.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/grammar-loader.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/grammar-loader.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const reprism = __webpack_require__(/*! reprism */ "./node_modules/reprism/es/index.js");
const abap = __webpack_require__(/*! reprism/languages/abap */ "./node_modules/reprism/languages/abap.js");
const actionscript = __webpack_require__(/*! reprism/languages/actionscript */ "./node_modules/reprism/languages/actionscript.js");
const ada = __webpack_require__(/*! reprism/languages/ada */ "./node_modules/reprism/languages/ada.js");
const apacheconf = __webpack_require__(/*! reprism/languages/apacheconf */ "./node_modules/reprism/languages/apacheconf.js");
const apl = __webpack_require__(/*! reprism/languages/apl */ "./node_modules/reprism/languages/apl.js");
const applescript = __webpack_require__(/*! reprism/languages/applescript */ "./node_modules/reprism/languages/applescript.js");
const arff = __webpack_require__(/*! reprism/languages/arff */ "./node_modules/reprism/languages/arff.js");
const asciidoc = __webpack_require__(/*! reprism/languages/asciidoc */ "./node_modules/reprism/languages/asciidoc.js");
const asm6502 = __webpack_require__(/*! reprism/languages/asm6502 */ "./node_modules/reprism/languages/asm6502.js");
const aspnet = __webpack_require__(/*! reprism/languages/aspnet */ "./node_modules/reprism/languages/aspnet.js");
const autohotkey = __webpack_require__(/*! reprism/languages/autohotkey */ "./node_modules/reprism/languages/autohotkey.js");
const autoit = __webpack_require__(/*! reprism/languages/autoit */ "./node_modules/reprism/languages/autoit.js");
const bash = __webpack_require__(/*! reprism/languages/bash */ "./node_modules/reprism/languages/bash.js");
const basic = __webpack_require__(/*! reprism/languages/basic */ "./node_modules/reprism/languages/basic.js");
const batch = __webpack_require__(/*! reprism/languages/batch */ "./node_modules/reprism/languages/batch.js");
const brainfuck = __webpack_require__(/*! reprism/languages/brainfuck */ "./node_modules/reprism/languages/brainfuck.js");
const bro = __webpack_require__(/*! reprism/languages/bro */ "./node_modules/reprism/languages/bro.js");
const c = __webpack_require__(/*! reprism/languages/c */ "./node_modules/reprism/languages/c.js");
const clike = __webpack_require__(/*! reprism/languages/clike */ "./node_modules/reprism/languages/clike.js");
const clojure = __webpack_require__(/*! reprism/languages/clojure */ "./node_modules/reprism/languages/clojure.js");
const coffeescript = __webpack_require__(/*! reprism/languages/coffeescript */ "./node_modules/reprism/languages/coffeescript.js");
const cpp = __webpack_require__(/*! reprism/languages/cpp */ "./node_modules/reprism/languages/cpp.js");
const csharp = __webpack_require__(/*! reprism/languages/csharp */ "./node_modules/reprism/languages/csharp.js");
const csp = __webpack_require__(/*! reprism/languages/csp */ "./node_modules/reprism/languages/csp.js");
const cssExtras = __webpack_require__(/*! reprism/languages/css-extras */ "./node_modules/reprism/languages/css-extras.js");
const css = __webpack_require__(/*! reprism/languages/css */ "./node_modules/reprism/languages/css.js");
const d = __webpack_require__(/*! reprism/languages/d */ "./node_modules/reprism/languages/d.js");
const dart = __webpack_require__(/*! reprism/languages/dart */ "./node_modules/reprism/languages/dart.js");
const diff = __webpack_require__(/*! reprism/languages/diff */ "./node_modules/reprism/languages/diff.js");
const django = __webpack_require__(/*! reprism/languages/django */ "./node_modules/reprism/languages/django.js");
const docker = __webpack_require__(/*! reprism/languages/docker */ "./node_modules/reprism/languages/docker.js");
const eiffel = __webpack_require__(/*! reprism/languages/eiffel */ "./node_modules/reprism/languages/eiffel.js");
const elixir = __webpack_require__(/*! reprism/languages/elixir */ "./node_modules/reprism/languages/elixir.js");
const erlang = __webpack_require__(/*! reprism/languages/erlang */ "./node_modules/reprism/languages/erlang.js");
const flow = __webpack_require__(/*! reprism/languages/flow */ "./node_modules/reprism/languages/flow.js");
const fortran = __webpack_require__(/*! reprism/languages/fortran */ "./node_modules/reprism/languages/fortran.js");
const fsharp = __webpack_require__(/*! reprism/languages/fsharp */ "./node_modules/reprism/languages/fsharp.js");
const gedcom = __webpack_require__(/*! reprism/languages/gedcom */ "./node_modules/reprism/languages/gedcom.js");
const gherkin = __webpack_require__(/*! reprism/languages/gherkin */ "./node_modules/reprism/languages/gherkin.js");
const git = __webpack_require__(/*! reprism/languages/git */ "./node_modules/reprism/languages/git.js");
const glsl = __webpack_require__(/*! reprism/languages/glsl */ "./node_modules/reprism/languages/glsl.js");
const go = __webpack_require__(/*! reprism/languages/go */ "./node_modules/reprism/languages/go.js");
const graphql = __webpack_require__(/*! reprism/languages/graphql */ "./node_modules/reprism/languages/graphql.js");
const groovy = __webpack_require__(/*! reprism/languages/groovy */ "./node_modules/reprism/languages/groovy.js");
const haml = __webpack_require__(/*! reprism/languages/haml */ "./node_modules/reprism/languages/haml.js");
const handlebars = __webpack_require__(/*! reprism/languages/handlebars */ "./node_modules/reprism/languages/handlebars.js");
const haskell = __webpack_require__(/*! reprism/languages/haskell */ "./node_modules/reprism/languages/haskell.js");
const haxe = __webpack_require__(/*! reprism/languages/haxe */ "./node_modules/reprism/languages/haxe.js");
const hpkp = __webpack_require__(/*! reprism/languages/hpkp */ "./node_modules/reprism/languages/hpkp.js");
const hsts = __webpack_require__(/*! reprism/languages/hsts */ "./node_modules/reprism/languages/hsts.js");
const http = __webpack_require__(/*! reprism/languages/http */ "./node_modules/reprism/languages/http.js");
const ichigojam = __webpack_require__(/*! reprism/languages/ichigojam */ "./node_modules/reprism/languages/ichigojam.js");
const icon = __webpack_require__(/*! reprism/languages/icon */ "./node_modules/reprism/languages/icon.js");
const inform7 = __webpack_require__(/*! reprism/languages/inform7 */ "./node_modules/reprism/languages/inform7.js");
const ini = __webpack_require__(/*! reprism/languages/ini */ "./node_modules/reprism/languages/ini.js");
const io = __webpack_require__(/*! reprism/languages/io */ "./node_modules/reprism/languages/io.js");
const j = __webpack_require__(/*! reprism/languages/j */ "./node_modules/reprism/languages/j.js");
const java = __webpack_require__(/*! reprism/languages/java */ "./node_modules/reprism/languages/java.js");
const javascript = __webpack_require__(/*! reprism/languages/javascript */ "./node_modules/reprism/languages/javascript.js");
const jolie = __webpack_require__(/*! reprism/languages/jolie */ "./node_modules/reprism/languages/jolie.js");
const json = __webpack_require__(/*! reprism/languages/json */ "./node_modules/reprism/languages/json.js");
const jsx = __webpack_require__(/*! reprism/languages/jsx */ "./node_modules/reprism/languages/jsx.js");
const julia = __webpack_require__(/*! reprism/languages/julia */ "./node_modules/reprism/languages/julia.js");
const keyman = __webpack_require__(/*! reprism/languages/keyman */ "./node_modules/reprism/languages/keyman.js");
const kotlin = __webpack_require__(/*! reprism/languages/kotlin */ "./node_modules/reprism/languages/kotlin.js");
const latex = __webpack_require__(/*! reprism/languages/latex */ "./node_modules/reprism/languages/latex.js");
const less = __webpack_require__(/*! reprism/languages/less */ "./node_modules/reprism/languages/less.js");
const liquid = __webpack_require__(/*! reprism/languages/liquid */ "./node_modules/reprism/languages/liquid.js");
const lisp = __webpack_require__(/*! reprism/languages/lisp */ "./node_modules/reprism/languages/lisp.js");
const livescript = __webpack_require__(/*! reprism/languages/livescript */ "./node_modules/reprism/languages/livescript.js");
const lolcode = __webpack_require__(/*! reprism/languages/lolcode */ "./node_modules/reprism/languages/lolcode.js");
const lua = __webpack_require__(/*! reprism/languages/lua */ "./node_modules/reprism/languages/lua.js");
const makefile = __webpack_require__(/*! reprism/languages/makefile */ "./node_modules/reprism/languages/makefile.js");
const markdown = __webpack_require__(/*! reprism/languages/markdown */ "./node_modules/reprism/languages/markdown.js");
const markupTemplating = __webpack_require__(/*! reprism/languages/markup-templating */ "./node_modules/reprism/languages/markup-templating.js");
const markup = __webpack_require__(/*! reprism/languages/markup */ "./node_modules/reprism/languages/markup.js");
const matlab = __webpack_require__(/*! reprism/languages/matlab */ "./node_modules/reprism/languages/matlab.js");
const mel = __webpack_require__(/*! reprism/languages/mel */ "./node_modules/reprism/languages/mel.js");
const mizar = __webpack_require__(/*! reprism/languages/mizar */ "./node_modules/reprism/languages/mizar.js");
const monkey = __webpack_require__(/*! reprism/languages/monkey */ "./node_modules/reprism/languages/monkey.js");
const n4js = __webpack_require__(/*! reprism/languages/n4js */ "./node_modules/reprism/languages/n4js.js");
const nasm = __webpack_require__(/*! reprism/languages/nasm */ "./node_modules/reprism/languages/nasm.js");
const nginx = __webpack_require__(/*! reprism/languages/nginx */ "./node_modules/reprism/languages/nginx.js");
const nim = __webpack_require__(/*! reprism/languages/nim */ "./node_modules/reprism/languages/nim.js");
const nix = __webpack_require__(/*! reprism/languages/nix */ "./node_modules/reprism/languages/nix.js");
const nsis = __webpack_require__(/*! reprism/languages/nsis */ "./node_modules/reprism/languages/nsis.js");
const objectivec = __webpack_require__(/*! reprism/languages/objectivec */ "./node_modules/reprism/languages/objectivec.js");
const ocaml = __webpack_require__(/*! reprism/languages/ocaml */ "./node_modules/reprism/languages/ocaml.js");
const opencl = __webpack_require__(/*! reprism/languages/opencl */ "./node_modules/reprism/languages/opencl.js");
const oz = __webpack_require__(/*! reprism/languages/oz */ "./node_modules/reprism/languages/oz.js");
const parigp = __webpack_require__(/*! reprism/languages/parigp */ "./node_modules/reprism/languages/parigp.js");
const parser = __webpack_require__(/*! reprism/languages/parser */ "./node_modules/reprism/languages/parser.js");
const pascal = __webpack_require__(/*! reprism/languages/pascal */ "./node_modules/reprism/languages/pascal.js");
const perl = __webpack_require__(/*! reprism/languages/perl */ "./node_modules/reprism/languages/perl.js");
const phpExtras = __webpack_require__(/*! reprism/languages/php-extras */ "./node_modules/reprism/languages/php-extras.js");
const php = __webpack_require__(/*! reprism/languages/php */ "./node_modules/reprism/languages/php.js");
const powershell = __webpack_require__(/*! reprism/languages/powershell */ "./node_modules/reprism/languages/powershell.js");
const processing = __webpack_require__(/*! reprism/languages/processing */ "./node_modules/reprism/languages/processing.js");
const prolog = __webpack_require__(/*! reprism/languages/prolog */ "./node_modules/reprism/languages/prolog.js");
const properties = __webpack_require__(/*! reprism/languages/properties */ "./node_modules/reprism/languages/properties.js");
const protobuf = __webpack_require__(/*! reprism/languages/protobuf */ "./node_modules/reprism/languages/protobuf.js");
const pug = __webpack_require__(/*! reprism/languages/pug */ "./node_modules/reprism/languages/pug.js");
const puppet = __webpack_require__(/*! reprism/languages/puppet */ "./node_modules/reprism/languages/puppet.js");
const pure = __webpack_require__(/*! reprism/languages/pure */ "./node_modules/reprism/languages/pure.js");
const python = __webpack_require__(/*! reprism/languages/python */ "./node_modules/reprism/languages/python.js");
const q = __webpack_require__(/*! reprism/languages/q */ "./node_modules/reprism/languages/q.js");
const qore = __webpack_require__(/*! reprism/languages/qore */ "./node_modules/reprism/languages/qore.js");
const r = __webpack_require__(/*! reprism/languages/r */ "./node_modules/reprism/languages/r.js");
const reason = __webpack_require__(/*! reprism/languages/reason */ "./node_modules/reprism/languages/reason.js");
const renpy = __webpack_require__(/*! reprism/languages/renpy */ "./node_modules/reprism/languages/renpy.js");
const rest = __webpack_require__(/*! reprism/languages/rest */ "./node_modules/reprism/languages/rest.js");
const rip = __webpack_require__(/*! reprism/languages/rip */ "./node_modules/reprism/languages/rip.js");
const roboconf = __webpack_require__(/*! reprism/languages/roboconf */ "./node_modules/reprism/languages/roboconf.js");
const ruby = __webpack_require__(/*! reprism/languages/ruby */ "./node_modules/reprism/languages/ruby.js");
const rust = __webpack_require__(/*! reprism/languages/rust */ "./node_modules/reprism/languages/rust.js");
const sas = __webpack_require__(/*! reprism/languages/sas */ "./node_modules/reprism/languages/sas.js");
const sass = __webpack_require__(/*! reprism/languages/sass */ "./node_modules/reprism/languages/sass.js");
const scala = __webpack_require__(/*! reprism/languages/scala */ "./node_modules/reprism/languages/scala.js");
const scheme = __webpack_require__(/*! reprism/languages/scheme */ "./node_modules/reprism/languages/scheme.js");
const scss = __webpack_require__(/*! reprism/languages/scss */ "./node_modules/reprism/languages/scss.js");
const smalltalk = __webpack_require__(/*! reprism/languages/smalltalk */ "./node_modules/reprism/languages/smalltalk.js");
const smarty = __webpack_require__(/*! reprism/languages/smarty */ "./node_modules/reprism/languages/smarty.js");
const soy = __webpack_require__(/*! reprism/languages/soy */ "./node_modules/reprism/languages/soy.js");
const stylus = __webpack_require__(/*! reprism/languages/stylus */ "./node_modules/reprism/languages/stylus.js");
const swift = __webpack_require__(/*! reprism/languages/swift */ "./node_modules/reprism/languages/swift.js");
const tcl = __webpack_require__(/*! reprism/languages/tcl */ "./node_modules/reprism/languages/tcl.js");
const textile = __webpack_require__(/*! reprism/languages/textile */ "./node_modules/reprism/languages/textile.js");
const tsx = __webpack_require__(/*! reprism/languages/tsx */ "./node_modules/reprism/languages/tsx.js");
const twig = __webpack_require__(/*! reprism/languages/twig */ "./node_modules/reprism/languages/twig.js");
const typescript = __webpack_require__(/*! reprism/languages/typescript */ "./node_modules/reprism/languages/typescript.js");
const vbnet = __webpack_require__(/*! reprism/languages/vbnet */ "./node_modules/reprism/languages/vbnet.js");
const velocity = __webpack_require__(/*! reprism/languages/velocity */ "./node_modules/reprism/languages/velocity.js");
const verilog = __webpack_require__(/*! reprism/languages/verilog */ "./node_modules/reprism/languages/verilog.js");
const vhdl = __webpack_require__(/*! reprism/languages/vhdl */ "./node_modules/reprism/languages/vhdl.js");
const vim = __webpack_require__(/*! reprism/languages/vim */ "./node_modules/reprism/languages/vim.js");
const visualBasic = __webpack_require__(/*! reprism/languages/visual-basic */ "./node_modules/reprism/languages/visual-basic.js");
const wasm = __webpack_require__(/*! reprism/languages/wasm */ "./node_modules/reprism/languages/wasm.js");
const wiki = __webpack_require__(/*! reprism/languages/wiki */ "./node_modules/reprism/languages/wiki.js");
const xeora = __webpack_require__(/*! reprism/languages/xeora */ "./node_modules/reprism/languages/xeora.js");
const xojo = __webpack_require__(/*! reprism/languages/xojo */ "./node_modules/reprism/languages/xojo.js");
const yaml = __webpack_require__(/*! reprism/languages/yaml */ "./node_modules/reprism/languages/yaml.js");
const sql = __webpack_require__(/*! ./languages/sql */ "./node_modules/@jscpd/tokenizer/dist/languages/sql.js");
const plsql = __webpack_require__(/*! ./languages/plsql */ "./node_modules/@jscpd/tokenizer/dist/languages/plsql.js");
exports.languages = {
    abap, actionscript, ada, apacheconf, apl, applescript, arff,
    asciidoc, asm6502, aspnet, autohotkey, autoit, bash, basic, batch,
    brainfuck, bro, c, clike, clojure, coffeescript, cpp, csharp, csp, cssExtras,
    css, d, dart, diff, django, docker, eiffel, elixir, erlang, flow, fortran, fsharp,
    gedcom, gherkin, git, glsl, go, graphql, groovy, haml, handlebars, haskell, haxe,
    hpkp, hsts, http, ichigojam, icon, inform7, ini, io, j, java, javascript, jolie,
    json, jsx, julia, keyman, kotlin, latex, less, liquid, lisp, livescript,
    lolcode, lua, makefile, markdown, markupTemplating, markup, matlab, mel, mizar,
    monkey, n4js, nasm, nginx, nim, nix, nsis, objectivec, ocaml, opencl, oz, parigp,
    parser, pascal, perl, php, phpExtras, powershell, processing, prolog,
    properties, protobuf, pug, puppet, pure, python, q, qore, r, reason, renpy, rest,
    rip, roboconf, ruby, rust, sas, sass, scala, scheme, scss, smalltalk, smarty, soy,
    stylus, swift, tcl, textile, twig, typescript, vbnet, velocity, verilog, vhdl,
    vim, visualBasic, wasm, wiki, xeora, xojo, yaml, tsx, sql, plsql
};
exports.loadLanguages = () => {
    reprism.loadLanguages(Object.values(exports.languages).map(v => v.default));
};
//# sourceMappingURL=grammar-loader.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/hash.js":
/*!****************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/hash.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SparkMD5 = __webpack_require__(/*! spark-md5 */ "./node_modules/spark-md5/spark-md5.js");
function hash(value) {
    return SparkMD5.hash(value);
}
exports.hash = hash;
//# sourceMappingURL=hash.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const tokenize_1 = __webpack_require__(/*! ./tokenize */ "./node_modules/@jscpd/tokenizer/dist/tokenize.js");
__export(__webpack_require__(/*! ./tokenize */ "./node_modules/@jscpd/tokenizer/dist/tokenize.js"));
__export(__webpack_require__(/*! ./token-map */ "./node_modules/@jscpd/tokenizer/dist/token-map.js"));
__export(__webpack_require__(/*! ./formats */ "./node_modules/@jscpd/tokenizer/dist/formats.js"));
class Tokenizer {
    generateMaps(id, data, format, options) {
        return tokenize_1.createTokenMapBasedOnCode(id, data, format, options);
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/languages/plsql.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/languages/plsql.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const grammar = {
    language: 'plsql',
    init(Prism) {
        Prism.languages.plsql = Prism.languages.extend('sql', {
            comment: [/\/\*[\s\S]*?\*\//, /--.*/],
        });
        if (Prism.util.type(Prism.languages.plsql.keyword) !== 'Array') {
            Prism.languages.plsql.keyword = [Prism.languages.plsql.keyword];
        }
        Prism.languages.plsql.keyword.unshift(/\b(?:ACCESS|AGENT|AGGREGATE|ARRAY|ARROW|AT|ATTRIBUTE|AUDIT|AUTHID|BFILE_BASE|BLOB_BASE|BLOCK|BODY|BOTH|BOUND|BYTE|CALLING|CHAR_BASE|CHARSET(?:FORM|ID)|CLOB_BASE|COLAUTH|COLLECT|CLUSTERS?|COMPILED|COMPRESS|CONSTANT|CONSTRUCTOR|CONTEXT|CRASH|CUSTOMDATUM|DANGLING|DATE_BASE|DEFINE|DETERMINISTIC|DURATION|ELEMENT|EMPTY|EXCEPTIONS?|EXCLUSIVE|EXTERNAL|FINAL|FORALL|FORM|FOUND|GENERAL|HEAP|HIDDEN|IDENTIFIED|IMMEDIATE|INCLUDING|INCREMENT|INDICATOR|INDEXES|INDICES|INFINITE|INITIAL|ISOPEN|INSTANTIABLE|INTERFACE|INVALIDATE|JAVA|LARGE|LEADING|LENGTH|LIBRARY|LIKE[24C]|LIMITED|LONG|LOOP|MAP|MAXEXTENTS|MAXLEN|MEMBER|MINUS|MLSLABEL|MULTISET|NAME|NAN|NATIVE|NEW|NOAUDIT|NOCOMPRESS|NOCOPY|NOTFOUND|NOWAIT|NUMBER(?:_BASE)?|OBJECT|OCI(?:COLL|DATE|DATETIME|DURATION|INTERVAL|LOBLOCATOR|NUMBER|RAW|REF|REFCURSOR|ROWID|STRING|TYPE)|OFFLINE|ONLINE|ONLY|OPAQUE|OPERATOR|ORACLE|ORADATA|ORGANIZATION|ORL(?:ANY|VARY)|OTHERS|OVERLAPS|OVERRIDING|PACKAGE|PARALLEL_ENABLE|PARAMETERS?|PASCAL|PCTFREE|PIPE(?:LINED)?|PRAGMA|PRIOR|PRIVATE|RAISE|RANGE|RAW|RECORD|REF|REFERENCE|REM|REMAINDER|RESULT|RESOURCE|RETURNING|REVERSE|ROW(?:ID|NUM|TYPE)|SAMPLE|SB[124]|SEGMENT|SELF|SEPARATE|SEQUENCE|SHORT|SIZE(?:_T)?|SPARSE|SQL(?:CODE|DATA|NAME|STATE)|STANDARD|STATIC|STDDEV|STORED|STRING|STRUCT|STYLE|SUBMULTISET|SUBPARTITION|SUBSTITUTABLE|SUBTYPE|SUCCESSFUL|SYNONYM|SYSDATE|TABAUTH|TDO|THE|TIMEZONE_(?:ABBR|HOUR|MINUTE|REGION)|TRAILING|TRANSAC(?:TIONAL)?|TRUSTED|UB[124]|UID|UNDER|UNTRUSTED|VALIDATE|VALIST|VARCHAR2|VARIABLE|VARIANCE|VARRAY|VIEWS|VOID|WHENEVER|WRAPPED|ZONE)\b/i);
        if (Prism.util.type(Prism.languages.plsql.operator) !== 'Array') {
            Prism.languages.plsql.operator = [Prism.languages.plsql.operator];
        }
        Prism.languages.plsql.operator.unshift(/:=/);
    },
};
exports.default = grammar;
//# sourceMappingURL=plsql.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/languages/sql.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/languages/sql.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const grammar = {
    language: 'sql',
    init(Prism) {
        Prism.languages.sql = {
            'comment': {
                pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
                lookbehind: true,
            },
            'variable': [
                {
                    pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
                    greedy: true,
                },
                /@[\w.$]+/,
            ],
            'string': {
                pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
                greedy: true,
                lookbehind: true,
            },
            'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
            'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
            'boolean': /\b(?:TRUE|FALSE|NULL)\b/i,
            'number': /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
            'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
            'punctuation': /[;[\]()`,.]/,
        };
    },
};
exports.default = grammar;
//# sourceMappingURL=sql.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/token-map.js":
/*!*********************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/token-map.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = __webpack_require__(/*! ./hash */ "./node_modules/@jscpd/tokenizer/dist/hash.js");
const TOKEN_HASH_LENGTH = 20;
function createTokenHash(token, hashFunction = undefined) {
    return hashFunction ?
        hashFunction(token.type + token.value).substr(0, TOKEN_HASH_LENGTH) :
        hash_1.hash(token.type + token.value).substr(0, TOKEN_HASH_LENGTH);
}
function groupByFormat(tokens) {
    const result = {};
    // TODO change to reduce
    tokens.forEach((token) => {
        (result[token.format] = result[token.format] ? [...result[token.format], token] : [token]);
    });
    return result;
}
class TokensMap {
    constructor(id, data, tokens, format, options) {
        this.id = id;
        this.data = data;
        this.tokens = tokens;
        this.format = format;
        this.options = options;
        this.position = 0;
        this.hashMap = this.tokens.map((token) => {
            if (options.ignoreCase) {
                token.value = token.value.toLocaleLowerCase();
            }
            return createTokenHash(token, this.options.hashFunction);
        }).join('');
    }
    getTokensCount() {
        return this.tokens[this.tokens.length - 1].loc.end.position - this.tokens[0].loc.start.position;
    }
    getId() {
        return this.id;
    }
    getLinesCount() {
        return this.tokens[this.tokens.length - 1].loc.end.line - this.tokens[0].loc.start.line;
    }
    getFormat() {
        return this.format;
    }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        const hashFunction = this.options.hashFunction ? this.options.hashFunction : hash_1.hash;
        const mapFrame = hashFunction(this.hashMap.substring(this.position * TOKEN_HASH_LENGTH, this.position * TOKEN_HASH_LENGTH + this.options.minTokens * TOKEN_HASH_LENGTH)).substring(0, TOKEN_HASH_LENGTH);
        if (this.position < this.tokens.length - this.options.minTokens) {
            this.position++;
            return {
                done: false,
                value: {
                    id: mapFrame,
                    sourceId: this.getId(),
                    start: this.tokens[this.position - 1],
                    end: this.tokens[this.position + this.options.minTokens - 1],
                },
            };
        }
        else {
            return {
                done: true,
                value: false,
            };
        }
    }
}
exports.TokensMap = TokensMap;
function generateMapsForFormats(id, data, tokens, options) {
    return Object
        .values(groupByFormat(tokens))
        .map((formatTokens) => new TokensMap(id, data, formatTokens, formatTokens[0].format, options));
}
exports.generateMapsForFormats = generateMapsForFormats;
function createTokensMaps(id, data, tokens, options) {
    return generateMapsForFormats(id, data, tokens, options);
}
exports.createTokensMaps = createTokensMaps;
//# sourceMappingURL=token-map.js.map

/***/ }),

/***/ "./node_modules/@jscpd/tokenizer/dist/tokenize.js":
/*!********************************************************!*\
  !*** ./node_modules/@jscpd/tokenizer/dist/tokenize.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const reprism = __webpack_require__(/*! reprism */ "./node_modules/reprism/es/index.js");
const formats_1 = __webpack_require__(/*! ./formats */ "./node_modules/@jscpd/tokenizer/dist/formats.js");
const token_map_1 = __webpack_require__(/*! ./token-map */ "./node_modules/@jscpd/tokenizer/dist/token-map.js");
const grammar_loader_1 = __webpack_require__(/*! ./grammar-loader */ "./node_modules/@jscpd/tokenizer/dist/grammar-loader.js");
const ignore = {
    ignore: [
        {
            pattern: /(jscpd:ignore-start)[\s\S]*?(?=jscpd:ignore-end)/,
            lookbehind: true,
            greedy: true,
        },
        {
            pattern: /jscpd:ignore-start/,
            greedy: false,
        },
        {
            pattern: /jscpd:ignore-end/,
            greedy: false,
        },
    ],
};
const punctuation = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    new_line: /\n/,
    empty: /\s+/,
};
const initializeFormats = () => {
    grammar_loader_1.loadLanguages();
    Object
        .keys(reprism.default.languages)
        .forEach((lang) => {
        if (lang !== 'extend' && lang !== 'insertBefore' && lang !== 'DFS') {
            reprism.default.languages[lang] = Object.assign(Object.assign(Object.assign({}, ignore), reprism.default.languages[lang]), punctuation);
        }
    });
};
initializeFormats();
function getLanguagePrismName(lang) {
    if (lang in formats_1.FORMATS && formats_1.FORMATS[lang].parent) {
        return formats_1.FORMATS[lang].parent;
    }
    return lang;
}
function tokenize(code, language) {
    let length = 0;
    let line = 1;
    let column = 1;
    function sanitizeLangName(name) {
        return name && name.replace ? name.replace('language-', '') : 'unknown';
    }
    function createTokenFromString(token, lang) {
        return [
            {
                format: lang,
                type: 'default',
                value: token,
                length: token.length,
            },
        ];
    }
    function calculateLocation(token, position) {
        const result = token;
        const lines = result.value.split('\n');
        const newLines = lines.length - 1;
        const start = {
            line,
            column,
            position
        };
        column = newLines !== 0 ? lines[lines.length - 1].length + 1 : column + lines[lines.length - 1].length;
        const end = {
            line: line + newLines,
            column,
            position
        };
        result.loc = { start, end };
        result.range = [length, length + result.length];
        length += result.length;
        line += newLines;
        return result;
    }
    function createTokenFromFlatToken(token, lang) {
        return [
            {
                format: lang,
                type: token.type,
                value: token.content,
                length: token.length,
            },
        ];
    }
    function createTokens(token, lang) {
        if (token.content && typeof token.content === 'string') {
            return createTokenFromFlatToken(token, lang);
        }
        if (token.content && Array.isArray(token.content)) {
            let res = [];
            token.content.forEach((t) => (res = res.concat(createTokens(t, token.alias ? sanitizeLangName(token.alias) : lang))));
            return res;
        }
        return createTokenFromString(token, lang);
    }
    let tokens = [];
    const grammar = reprism.default.languages[getLanguagePrismName(language)];
    reprism.default.tokenize(code, grammar)
        .forEach((t) => (tokens = tokens.concat(createTokens(t, language))));
    return tokens
        .filter((t) => t.format in formats_1.FORMATS)
        .map((token, index) => calculateLocation(token, index));
}
exports.tokenize = tokenize;
function createTokenMapBasedOnCode(id, data, format, options = {}) {
    const { mode, ignoreCase } = options;
    const tokens = tokenize(data, format)
        .filter((token) => mode(token, options));
    if (ignoreCase) {
        return token_map_1.createTokensMaps(id, data, tokens.map((token) => {
            token.value = token.value.toLocaleLowerCase();
            return token;
        }), options);
    }
    return token_map_1.createTokensMaps(id, data, tokens, options);
}
exports.createTokenMapBasedOnCode = createTokenMapBasedOnCode;
//# sourceMappingURL=tokenize.js.map

/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/adapters/fs.js":
/*!*************************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/adapters/fs.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ "fs");
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
function createFileSystemAdapter(fsMethods) {
    if (fsMethods === undefined) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/constants.js":
/*!***********************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/constants.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
const MAJOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
const MINOR_VERSION = parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
const SUPPORTED_MAJOR_VERSION = 10;
const SUPPORTED_MINOR_VERSION = 10;
const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
/**
 * IS `true` for Node.js 10.10 and greater.
 */
exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;


/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(/*! ./providers/async */ "./node_modules/@nodelib/fs.scandir/out/providers/async.js");
const sync = __webpack_require__(/*! ./providers/sync */ "./node_modules/@nodelib/fs.scandir/out/providers/sync.js");
const settings_1 = __webpack_require__(/*! ./settings */ "./node_modules/@nodelib/fs.scandir/out/settings.js");
exports.Settings = settings_1.default;
function scandir(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.scandir = scandir;
function scandirSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.scandirSync = scandirSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/providers/async.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/providers/async.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(/*! @nodelib/fs.stat */ "./node_modules/@nodelib/fs.stat/out/index.js");
const rpl = __webpack_require__(/*! run-parallel */ "./node_modules/run-parallel/index.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./node_modules/@nodelib/fs.scandir/out/constants.js");
const utils = __webpack_require__(/*! ../utils */ "./node_modules/@nodelib/fs.scandir/out/utils/index.js");
function read(directory, settings, callback) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings, callback);
    }
    return readdir(directory, settings, callback);
}
exports.read = read;
function readdirWithFileTypes(directory, settings, callback) {
    settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
            return callFailureCallback(callback, readdirError);
        }
        const entries = dirents.map((dirent) => ({
            dirent,
            name: dirent.name,
            path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
        }));
        if (!settings.followSymbolicLinks) {
            return callSuccessCallback(callback, entries);
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
            if (rplError !== null) {
                return callFailureCallback(callback, rplError);
            }
            callSuccessCallback(callback, rplEntries);
        });
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function makeRplTaskEntry(entry, settings) {
    return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
            return done(null, entry);
        }
        settings.fs.stat(entry.path, (statError, stats) => {
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return done(statError);
                }
                return done(null, entry);
            }
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            return done(null, entry);
        });
    };
}
function readdir(directory, settings, callback) {
    settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
            return callFailureCallback(callback, readdirError);
        }
        const filepaths = names.map((name) => `${directory}${settings.pathSegmentSeparator}${name}`);
        const tasks = filepaths.map((filepath) => {
            return (done) => fsStat.stat(filepath, settings.fsStatSettings, done);
        });
        rpl(tasks, (rplError, results) => {
            if (rplError !== null) {
                return callFailureCallback(callback, rplError);
            }
            const entries = [];
            names.forEach((name, index) => {
                const stats = results[index];
                const entry = {
                    name,
                    path: filepaths[index],
                    dirent: utils.fs.createDirentFromStats(name, stats)
                };
                if (settings.stats) {
                    entry.stats = stats;
                }
                entries.push(entry);
            });
            callSuccessCallback(callback, entries);
        });
    });
}
exports.readdir = readdir;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/providers/sync.js":
/*!****************************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/providers/sync.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(/*! @nodelib/fs.stat */ "./node_modules/@nodelib/fs.stat/out/index.js");
const constants_1 = __webpack_require__(/*! ../constants */ "./node_modules/@nodelib/fs.scandir/out/constants.js");
const utils = __webpack_require__(/*! ../utils */ "./node_modules/@nodelib/fs.scandir/out/utils/index.js");
function read(directory, settings) {
    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
    }
    return readdir(directory, settings);
}
exports.read = read;
function readdirWithFileTypes(directory, settings) {
    const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
    return dirents.map((dirent) => {
        const entry = {
            dirent,
            name: dirent.name,
            path: `${directory}${settings.pathSegmentSeparator}${dirent.name}`
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
            try {
                const stats = settings.fs.statSync(entry.path);
                entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
            }
            catch (error) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    throw error;
                }
            }
        }
        return entry;
    });
}
exports.readdirWithFileTypes = readdirWithFileTypes;
function readdir(directory, settings) {
    const names = settings.fs.readdirSync(directory);
    return names.map((name) => {
        const entryPath = `${directory}${settings.pathSegmentSeparator}${name}`;
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
            name,
            path: entryPath,
            dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
            entry.stats = stats;
        }
        return entry;
    });
}
exports.readdir = readdir;


/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/settings.js":
/*!**********************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/settings.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(/*! path */ "path");
const fsStat = __webpack_require__(/*! @nodelib/fs.stat */ "./node_modules/@nodelib/fs.stat/out/index.js");
const fs = __webpack_require__(/*! ./adapters/fs */ "./node_modules/@nodelib/fs.scandir/out/adapters/fs.js");
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this.followSymbolicLinks,
            fs: this.fs,
            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/utils/fs.js":
/*!**********************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/utils/fs.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),

/***/ "./node_modules/@nodelib/fs.scandir/out/utils/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@nodelib/fs.scandir/out/utils/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! ./fs */ "./node_modules/@nodelib/fs.scandir/out/utils/fs.js");
exports.fs = fs;


/***/ }),

/***/ "./node_modules/@nodelib/fs.stat/out/adapters/fs.js":
/*!**********************************************************!*\
  !*** ./node_modules/@nodelib/fs.stat/out/adapters/fs.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ "fs");
exports.FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    stat: fs.stat,
    lstatSync: fs.lstatSync,
    statSync: fs.statSync
};
function createFileSystemAdapter(fsMethods) {
    if (fsMethods === undefined) {
        return exports.FILE_SYSTEM_ADAPTER;
    }
    return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
exports.createFileSystemAdapter = createFileSystemAdapter;


/***/ }),

/***/ "./node_modules/@nodelib/fs.stat/out/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@nodelib/fs.stat/out/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async = __webpack_require__(/*! ./providers/async */ "./node_modules/@nodelib/fs.stat/out/providers/async.js");
const sync = __webpack_require__(/*! ./providers/sync */ "./node_modules/@nodelib/fs.stat/out/providers/sync.js");
const settings_1 = __webpack_require__(/*! ./settings */ "./node_modules/@nodelib/fs.stat/out/settings.js");
exports.Settings = settings_1.default;
function stat(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return async.read(path, getSettings(), optionsOrSettingsOrCallback);
    }
    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
}
exports.stat = stat;
function statSync(path, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    return sync.read(path, settings);
}
exports.statSync = statSync;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),

/***/ "./node_modules/@nodelib/fs.stat/out/providers/async.js":
/*!**************************************************************!*\
  !*** ./node_modules/@nodelib/fs.stat/out/providers/async.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat) => {
        if (lstatError !== null) {
            return callFailureCallback(callback, lstatError);
        }
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
            return callSuccessCallback(callback, lstat);
        }
        settings.fs.stat(path, (statError, stat) => {
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) {
                    return callFailureCallback(callback, statError);
                }
                return callSuccessCallback(callback, lstat);
            }
            if (settings.markSymbolicLink) {
                stat.isSymbolicLink = () => true;
            }
            callSuccessCallback(callback, stat);
        });
    });
}
exports.read = read;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, result) {
    callback(null, result);
}


/***/ }),

/***/ "./node_modules/@nodelib/fs.stat/out/providers/sync.js":
/*!*************************************************************!*\
  !*** ./node_modules/@nodelib/fs.stat/out/providers/sync.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function read(path, settings) {
    const lstat = settings.fs.lstatSync(path);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat;
    }
    try {
        const stat = settings.fs.statSync(path);
        if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
        }
        return stat;
    }
    catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
            return lstat;
        }
        throw error;
    }
}
exports.read = read;


/***/ }),

/***/ "./node_modules/@nodelib/fs.stat/out/settings.js":
/*!*******************************************************!*\
  !*** ./node_modules/@nodelib/fs.stat/out/settings.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! ./adapters/fs */ "./node_modules/@nodelib/fs.stat/out/adapters/fs.js");
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(/*! ./providers/async */ "./node_modules/@nodelib/fs.walk/out/providers/async.js");
const stream_1 = __webpack_require__(/*! ./providers/stream */ "./node_modules/@nodelib/fs.walk/out/providers/stream.js");
const sync_1 = __webpack_require__(/*! ./providers/sync */ "./node_modules/@nodelib/fs.walk/out/providers/sync.js");
const settings_1 = __webpack_require__(/*! ./settings */ "./node_modules/@nodelib/fs.walk/out/settings.js");
exports.Settings = settings_1.default;
function walk(directory, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') {
        return new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
    }
    new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
}
exports.walk = walk;
function walkSync(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new sync_1.default(directory, settings);
    return provider.read();
}
exports.walkSync = walkSync;
function walkStream(directory, optionsOrSettings) {
    const settings = getSettings(optionsOrSettings);
    const provider = new stream_1.default(directory, settings);
    return provider.read();
}
exports.walkStream = walkStream;
function getSettings(settingsOrOptions = {}) {
    if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
    }
    return new settings_1.default(settingsOrOptions);
}


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/providers/async.js":
/*!**************************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/providers/async.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = __webpack_require__(/*! ../readers/async */ "./node_modules/@nodelib/fs.walk/out/readers/async.js");
class AsyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = new Set();
    }
    read(callback) {
        this._reader.onError((error) => {
            callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
            this._storage.add(entry);
        });
        this._reader.onEnd(() => {
            callSuccessCallback(callback, [...this._storage]);
        });
        this._reader.read();
    }
}
exports.default = AsyncProvider;
function callFailureCallback(callback, error) {
    callback(error);
}
function callSuccessCallback(callback, entries) {
    callback(null, entries);
}


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/providers/stream.js":
/*!***************************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/providers/stream.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(/*! stream */ "stream");
const async_1 = __webpack_require__(/*! ../readers/async */ "./node_modules/@nodelib/fs.walk/out/readers/async.js");
class StreamProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
            objectMode: true,
            read: () => { },
            destroy: this._reader.destroy.bind(this._reader)
        });
    }
    read() {
        this._reader.onError((error) => {
            this._stream.emit('error', error);
        });
        this._reader.onEntry((entry) => {
            this._stream.push(entry);
        });
        this._reader.onEnd(() => {
            this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
    }
}
exports.default = StreamProvider;


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/providers/sync.js":
/*!*************************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/providers/sync.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(/*! ../readers/sync */ "./node_modules/@nodelib/fs.walk/out/readers/sync.js");
class SyncProvider {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
    }
    read() {
        return this._reader.read();
    }
}
exports.default = SyncProvider;


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/readers/async.js":
/*!************************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/readers/async.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(/*! events */ "events");
const fsScandir = __webpack_require__(/*! @nodelib/fs.scandir */ "./node_modules/@nodelib/fs.scandir/out/index.js");
const fastq = __webpack_require__(/*! fastq */ "./node_modules/fastq/queue.js");
const common = __webpack_require__(/*! ./common */ "./node_modules/@nodelib/fs.walk/out/readers/common.js");
const reader_1 = __webpack_require__(/*! ./reader */ "./node_modules/@nodelib/fs.walk/out/readers/reader.js");
class AsyncReader extends reader_1.default {
    constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
            if (!this._isFatalError) {
                this._emitter.emit('end');
            }
        };
    }
    read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
            this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
    }
    destroy() {
        if (this._isDestroyed) {
            throw new Error('The reader is already destroyed');
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
    }
    onEntry(callback) {
        this._emitter.on('entry', callback);
    }
    onError(callback) {
        this._emitter.once('error', callback);
    }
    onEnd(callback) {
        this._emitter.once('end', callback);
    }
    _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
            if (error !== null) {
                this._handleError(error);
            }
        });
    }
    _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
            if (error !== null) {
                return done(error, undefined);
            }
            for (const entry of entries) {
                this._handleEntry(entry, item.base);
            }
            done(null, undefined);
        });
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit('error', error);
    }
    _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
            return;
        }
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _emitEntry(entry) {
        this._emitter.emit('entry', entry);
    }
}
exports.default = AsyncReader;


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/readers/common.js":
/*!*************************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/readers/common.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFatalError(settings, error) {
    if (settings.errorFilter === null) {
        return true;
    }
    return !settings.errorFilter(error);
}
exports.isFatalError = isFatalError;
function isAppliedFilter(filter, value) {
    return filter === null || filter(value);
}
exports.isAppliedFilter = isAppliedFilter;
function replacePathSegmentSeparator(filepath, separator) {
    return filepath.split(/[\\/]/).join(separator);
}
exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
function joinPathSegments(a, b, separator) {
    if (a === '') {
        return b;
    }
    return a + separator + b;
}
exports.joinPathSegments = joinPathSegments;


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/readers/reader.js":
/*!*************************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/readers/reader.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common = __webpack_require__(/*! ./common */ "./node_modules/@nodelib/fs.walk/out/readers/common.js");
class Reader {
    constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
}
exports.default = Reader;


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/readers/sync.js":
/*!***********************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/readers/sync.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsScandir = __webpack_require__(/*! @nodelib/fs.scandir */ "./node_modules/@nodelib/fs.scandir/out/index.js");
const common = __webpack_require__(/*! ./common */ "./node_modules/@nodelib/fs.walk/out/readers/common.js");
const reader_1 = __webpack_require__(/*! ./reader */ "./node_modules/@nodelib/fs.walk/out/readers/reader.js");
class SyncReader extends reader_1.default {
    constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = new Set();
        this._queue = new Set();
    }
    read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return [...this._storage];
    }
    _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
    }
    _handleQueue() {
        for (const item of this._queue.values()) {
            this._handleDirectory(item.directory, item.base);
        }
    }
    _handleDirectory(directory, base) {
        try {
            const entries = this._scandir(directory, this._settings.fsScandirSettings);
            for (const entry of entries) {
                this._handleEntry(entry, base);
            }
        }
        catch (error) {
            this._handleError(error);
        }
    }
    _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
            return;
        }
        throw error;
    }
    _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== undefined) {
            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
            this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
            this._pushToQueue(fullpath, entry.path);
        }
    }
    _pushToStorage(entry) {
        this._storage.add(entry);
    }
}
exports.default = SyncReader;


/***/ }),

/***/ "./node_modules/@nodelib/fs.walk/out/settings.js":
/*!*******************************************************!*\
  !*** ./node_modules/@nodelib/fs.walk/out/settings.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(/*! path */ "path");
const fsScandir = __webpack_require__(/*! @nodelib/fs.scandir */ "./node_modules/@nodelib/fs.scandir/out/index.js");
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, undefined);
        this.concurrency = this._getValue(this._options.concurrency, Infinity);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
        this.fsScandirSettings = new fsScandir.Settings({
            followSymbolicLinks: this._options.followSymbolicLinks,
            fs: this._options.fs,
            pathSegmentSeparator: this._options.pathSegmentSeparator,
            stats: this._options.stats,
            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
}
exports.default = Settings;


/***/ }),

/***/ "./node_modules/array-union/index.js":
/*!*******************************************!*\
  !*** ./node_modules/array-union/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (...arguments_) => {
	return [...new Set([].concat(...arguments_))];
};


/***/ }),

/***/ "./node_modules/braces/index.js":
/*!**************************************!*\
  !*** ./node_modules/braces/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(/*! ./lib/stringify */ "./node_modules/braces/lib/stringify.js");
const compile = __webpack_require__(/*! ./lib/compile */ "./node_modules/braces/lib/compile.js");
const expand = __webpack_require__(/*! ./lib/expand */ "./node_modules/braces/lib/expand.js");
const parse = __webpack_require__(/*! ./lib/parse */ "./node_modules/braces/lib/parse.js");

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => parse(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }
  return compile(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }

  let result = expand(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

 return options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);
};

/**
 * Expose "braces"
 */

module.exports = braces;


/***/ }),

/***/ "./node_modules/braces/lib/compile.js":
/*!********************************************!*\
  !*** ./node_modules/braces/lib/compile.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(/*! fill-range */ "./node_modules/fill-range/index.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/braces/lib/utils.js");

const compile = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? (prefix + node.value) : '(';
    }

    if (node.type === 'close') {
      return invalid ? (prefix + node.value) : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);
      let range = fill(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += walk(child, node);
      }
    }
    return output;
  };

  return walk(ast);
};

module.exports = compile;


/***/ }),

/***/ "./node_modules/braces/lib/constants.js":
/*!**********************************************!*\
  !*** ./node_modules/braces/lib/constants.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  MAX_LENGTH: 1024 * 64,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};


/***/ }),

/***/ "./node_modules/braces/lib/expand.js":
/*!*******************************************!*\
  !*** ./node_modules/braces/lib/expand.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fill = __webpack_require__(/*! fill-range */ "./node_modules/fill-range/index.js");
const stringify = __webpack_require__(/*! ./stringify */ "./node_modules/braces/lib/stringify.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/braces/lib/utils.js");

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;


/***/ }),

/***/ "./node_modules/braces/lib/parse.js":
/*!******************************************!*\
  !*** ./node_modules/braces/lib/parse.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringify = __webpack_require__(/*! ./stringify */ "./node_modules/braces/lib/stringify.js");

/**
 * Constants
 */

const {
  MAX_LENGTH,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = __webpack_require__(/*! ./constants */ "./node_modules/braces/lib/constants.js");

/**
 * parse
 */

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;
  let memo = {};

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;

      let closed = true;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

module.exports = parse;


/***/ }),

/***/ "./node_modules/braces/lib/stringify.js":
/*!**********************************************!*\
  !*** ./node_modules/braces/lib/stringify.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(/*! ./utils */ "./node_modules/braces/lib/utils.js");

module.exports = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};



/***/ }),

/***/ "./node_modules/braces/lib/utils.js":
/*!******************************************!*\
  !*** ./node_modules/braces/lib/utils.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  let node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};


/***/ }),

/***/ "./node_modules/bytes/index.js":
/*!*************************************!*\
  !*** ./node_modules/bytes/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

module.exports = bytes;
module.exports.format = format;
module.exports.parse = parse;

/**
 * Module variables.
 * @private
 */

var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;

var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;

var map = {
  b:  1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: Math.pow(1024, 4),
  pb: Math.pow(1024, 5),
};

var parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;

/**
 * Convert the given value in bytes into a string or parse to string to an integer in bytes.
 *
 * @param {string|number} value
 * @param {{
 *  case: [string],
 *  decimalPlaces: [number]
 *  fixedDecimals: [boolean]
 *  thousandsSeparator: [string]
 *  unitSeparator: [string]
 *  }} [options] bytes options.
 *
 * @returns {string|number|null}
 */

function bytes(value, options) {
  if (typeof value === 'string') {
    return parse(value);
  }

  if (typeof value === 'number') {
    return format(value, options);
  }

  return null;
}

/**
 * Format the given value in bytes into a string.
 *
 * If the value is negative, it is kept as such. If it is a float,
 * it is rounded.
 *
 * @param {number} value
 * @param {object} [options]
 * @param {number} [options.decimalPlaces=2]
 * @param {number} [options.fixedDecimals=false]
 * @param {string} [options.thousandsSeparator=]
 * @param {string} [options.unit=]
 * @param {string} [options.unitSeparator=]
 *
 * @returns {string|null}
 * @public
 */

function format(value, options) {
  if (!Number.isFinite(value)) {
    return null;
  }

  var mag = Math.abs(value);
  var thousandsSeparator = (options && options.thousandsSeparator) || '';
  var unitSeparator = (options && options.unitSeparator) || '';
  var decimalPlaces = (options && options.decimalPlaces !== undefined) ? options.decimalPlaces : 2;
  var fixedDecimals = Boolean(options && options.fixedDecimals);
  var unit = (options && options.unit) || '';

  if (!unit || !map[unit.toLowerCase()]) {
    if (mag >= map.pb) {
      unit = 'PB';
    } else if (mag >= map.tb) {
      unit = 'TB';
    } else if (mag >= map.gb) {
      unit = 'GB';
    } else if (mag >= map.mb) {
      unit = 'MB';
    } else if (mag >= map.kb) {
      unit = 'KB';
    } else {
      unit = 'B';
    }
  }

  var val = value / map[unit.toLowerCase()];
  var str = val.toFixed(decimalPlaces);

  if (!fixedDecimals) {
    str = str.replace(formatDecimalsRegExp, '$1');
  }

  if (thousandsSeparator) {
    str = str.replace(formatThousandsRegExp, thousandsSeparator);
  }

  return str + unitSeparator + unit;
}

/**
 * Parse the string value into an integer in bytes.
 *
 * If no unit is given, it is assumed the value is in bytes.
 *
 * @param {number|string} val
 *
 * @returns {number|null}
 * @public
 */

function parse(val) {
  if (typeof val === 'number' && !isNaN(val)) {
    return val;
  }

  if (typeof val !== 'string') {
    return null;
  }

  // Test if the string passed is valid
  var results = parseRegExp.exec(val);
  var floatValue;
  var unit = 'b';

  if (!results) {
    // Nothing could be extracted from the given string
    floatValue = parseInt(val, 10);
    unit = 'b'
  } else {
    // Retrieve the value and the unit
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }

  return Math.floor(map[unit] * floatValue);
}


/***/ }),

/***/ "./node_modules/dir-glob/index.js":
/*!****************************************!*\
  !*** ./node_modules/dir-glob/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const path = __webpack_require__(/*! path */ "path");
const pathType = __webpack_require__(/*! path-type */ "./node_modules/path-type/index.js");

const getExtensions = extensions => extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0];

const getPath = (filepath, cwd) => {
	const pth = filepath[0] === '!' ? filepath.slice(1) : filepath;
	return path.isAbsolute(pth) ? pth : path.join(cwd, pth);
};

const addExtensions = (file, extensions) => {
	if (path.extname(file)) {
		return `**/${file}`;
	}

	return `**/${file}.${getExtensions(extensions)}`;
};

const getGlob = (directory, options) => {
	if (options.files && !Array.isArray(options.files)) {
		throw new TypeError(`Expected \`files\` to be of type \`Array\` but received type \`${typeof options.files}\``);
	}

	if (options.extensions && !Array.isArray(options.extensions)) {
		throw new TypeError(`Expected \`extensions\` to be of type \`Array\` but received type \`${typeof options.extensions}\``);
	}

	if (options.files && options.extensions) {
		return options.files.map(x => path.posix.join(directory, addExtensions(x, options.extensions)));
	}

	if (options.files) {
		return options.files.map(x => path.posix.join(directory, `**/${x}`));
	}

	if (options.extensions) {
		return [path.posix.join(directory, `**/*.${getExtensions(options.extensions)}`)];
	}

	return [path.posix.join(directory, '**')];
};

module.exports = async (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = await Promise.all([].concat(input).map(async x => {
		const isDirectory = await pathType.isDirectory(getPath(x, options.cwd));
		return isDirectory ? getGlob(x, options) : x;
	}));

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};

module.exports.sync = (input, options) => {
	options = {
		cwd: process.cwd(),
		...options
	};

	if (typeof options.cwd !== 'string') {
		throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
	}

	const globs = [].concat(input).map(x => pathType.isDirectorySync(getPath(x, options.cwd)) ? getGlob(x, options) : x);

	return [].concat.apply([], globs); // eslint-disable-line prefer-spread
};


/***/ }),

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./node_modules/fast-glob/out/index.js":
/*!*********************************************!*\
  !*** ./node_modules/fast-glob/out/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const taskManager = __webpack_require__(/*! ./managers/tasks */ "./node_modules/fast-glob/out/managers/tasks.js");
const async_1 = __webpack_require__(/*! ./providers/async */ "./node_modules/fast-glob/out/providers/async.js");
const stream_1 = __webpack_require__(/*! ./providers/stream */ "./node_modules/fast-glob/out/providers/stream.js");
const sync_1 = __webpack_require__(/*! ./providers/sync */ "./node_modules/fast-glob/out/providers/sync.js");
const settings_1 = __webpack_require__(/*! ./settings */ "./node_modules/fast-glob/out/settings.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/fast-glob/out/utils/index.js");
async function FastGlob(source, options) {
    assertPatternsInput(source);
    const works = getWorks(source, async_1.default, options);
    const result = await Promise.all(works);
    return utils.array.flatten(result);
}
// https://github.com/typescript-eslint/typescript-eslint/issues/60
// eslint-disable-next-line no-redeclare
(function (FastGlob) {
    function sync(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
    }
    FastGlob.sync = sync;
    function stream(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        /**
         * The stream returned by the provider cannot work with an asynchronous iterator.
         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
         * This affects performance (+25%). I don't see best solution right now.
         */
        return utils.stream.merge(works);
    }
    FastGlob.stream = stream;
    function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
    }
    FastGlob.generateTasks = generateTasks;
    function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
    }
    FastGlob.isDynamicPattern = isDynamicPattern;
    function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
    }
    FastGlob.escapePath = escapePath;
})(FastGlob || (FastGlob = {}));
function getWorks(source, _Provider, options) {
    const patterns = [].concat(source);
    const settings = new settings_1.default(options);
    const tasks = taskManager.generate(patterns, settings);
    const provider = new _Provider(settings);
    return tasks.map(provider.read, provider);
}
function assertPatternsInput(input) {
    const source = [].concat(input);
    const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
    if (!isValidSource) {
        throw new TypeError('Patterns must be a string (non empty) or an array of strings');
    }
}
module.exports = FastGlob;


/***/ }),

/***/ "./node_modules/fast-glob/out/managers/tasks.js":
/*!******************************************************!*\
  !*** ./node_modules/fast-glob/out/managers/tasks.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
const utils = __webpack_require__(/*! ../utils */ "./node_modules/fast-glob/out/utils/index.js");
function generate(patterns, settings) {
    const positivePatterns = getPositivePatterns(patterns);
    const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore);
    const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
    const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
    return staticTasks.concat(dynamicTasks);
}
exports.generate = generate;
function convertPatternsToTasks(positive, negative, dynamic) {
    const positivePatternsGroup = groupPatternsByBaseDirectory(positive);
    // When we have a global group – there is no reason to divide the patterns into independent tasks.
    // In this case, the global task covers the rest.
    if ('.' in positivePatternsGroup) {
        const task = convertPatternGroupToTask('.', positive, negative, dynamic);
        return [task];
    }
    return convertPatternGroupsToTasks(positivePatternsGroup, negative, dynamic);
}
exports.convertPatternsToTasks = convertPatternsToTasks;
function getPositivePatterns(patterns) {
    return utils.pattern.getPositivePatterns(patterns);
}
exports.getPositivePatterns = getPositivePatterns;
function getNegativePatternsAsPositive(patterns, ignore) {
    const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
    const positive = negative.map(utils.pattern.convertToPositivePattern);
    return positive;
}
exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
function groupPatternsByBaseDirectory(patterns) {
    const group = {};
    return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
            collection[base].push(pattern);
        }
        else {
            collection[base] = [pattern];
        }
        return collection;
    }, group);
}
exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
function convertPatternGroupsToTasks(positive, negative, dynamic) {
    return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
    });
}
exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
function convertPatternGroupToTask(base, positive, negative, dynamic) {
    return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
    };
}
exports.convertPatternGroupToTask = convertPatternGroupToTask;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/async.js":
/*!*******************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/async.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(/*! ../readers/stream */ "./node_modules/fast-glob/out/readers/stream.js");
const provider_1 = __webpack_require__(/*! ./provider */ "./node_modules/fast-glob/out/providers/provider.js");
class ProviderAsync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = [];
        return new Promise((resolve, reject) => {
            const stream = this.api(root, task, options);
            stream.once('error', reject);
            stream.on('data', (entry) => entries.push(options.transform(entry)));
            stream.once('end', () => resolve(entries));
        });
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderAsync;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/filters/deep.js":
/*!**************************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/filters/deep.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(/*! ../../utils */ "./node_modules/fast-glob/out/utils/index.js");
const partial_1 = __webpack_require__(/*! ../matchers/partial */ "./node_modules/fast-glob/out/providers/matchers/partial.js");
class DeepFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
    }
    getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
    }
    _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
    }
    _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
    }
    _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
            return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
            return false;
        }
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
            return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
    }
    _isSkippedByDeep(basePath, entryPath) {
        /**
         * Avoid unnecessary depth calculations when it doesn't matter.
         */
        if (this._settings.deep === Infinity) {
            return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
    }
    _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split('/').length;
        if (basePath === '') {
            return entryPathDepth;
        }
        const basePathDepth = basePath.split('/').length;
        return entryPathDepth - basePathDepth;
    }
    _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
    }
    _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
    }
    _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils.pattern.matchAny(entryPath, patternsRe);
    }
}
exports.default = DeepFilter;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/filters/entry.js":
/*!***************************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/filters/entry.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(/*! ../../utils */ "./node_modules/fast-glob/out/utils/index.js");
class EntryFilter {
    constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = new Map();
    }
    getFilter(positive, negative) {
        const positiveRe = utils.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = utils.pattern.convertPatternsToRe(negative, this._micromatchOptions);
        return (entry) => this._filter(entry, positiveRe, negativeRe);
    }
    _filter(entry, positiveRe, negativeRe) {
        if (this._settings.unique && this._isDuplicateEntry(entry)) {
            return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
            return false;
        }
        if (this._isSkippedByAbsoluteNegativePatterns(entry.path, negativeRe)) {
            return false;
        }
        const filepath = this._settings.baseNameMatch ? entry.name : entry.path;
        const isMatched = this._isMatchToPatterns(filepath, positiveRe) && !this._isMatchToPatterns(entry.path, negativeRe);
        if (this._settings.unique && isMatched) {
            this._createIndexRecord(entry);
        }
        return isMatched;
    }
    _isDuplicateEntry(entry) {
        return this.index.has(entry.path);
    }
    _createIndexRecord(entry) {
        this.index.set(entry.path, undefined);
    }
    _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
    }
    _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
    }
    _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
        if (!this._settings.absolute) {
            return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, entryPath);
        return utils.pattern.matchAny(fullpath, patternsRe);
    }
    _isMatchToPatterns(entryPath, patternsRe) {
        const filepath = utils.path.removeLeadingDotSegment(entryPath);
        return utils.pattern.matchAny(filepath, patternsRe);
    }
}
exports.default = EntryFilter;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/filters/error.js":
/*!***************************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/filters/error.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(/*! ../../utils */ "./node_modules/fast-glob/out/utils/index.js");
class ErrorFilter {
    constructor(_settings) {
        this._settings = _settings;
    }
    getFilter() {
        return (error) => this._isNonFatalError(error);
    }
    _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
    }
}
exports.default = ErrorFilter;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/matchers/matcher.js":
/*!******************************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/matchers/matcher.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(/*! ../../utils */ "./node_modules/fast-glob/out/utils/index.js");
class Matcher {
    constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
    }
    _fillStorage() {
        /**
         * The original pattern may include `{,*,**,a/*}`, which will lead to problems with matching (unresolved level).
         * So, before expand patterns with brace expansion into separated patterns.
         */
        const patterns = utils.pattern.expandPatternsWithBraceExpansion(this._patterns);
        for (const pattern of patterns) {
            const segments = this._getPatternSegments(pattern);
            const sections = this._splitSegmentsIntoSections(segments);
            this._storage.push({
                complete: sections.length <= 1,
                pattern,
                segments,
                sections
            });
        }
    }
    _getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
            const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
            if (!dynamic) {
                return {
                    dynamic: false,
                    pattern: part
                };
            }
            return {
                dynamic: true,
                pattern: part,
                patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
            };
        });
    }
    _splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
    }
}
exports.default = Matcher;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/matchers/partial.js":
/*!******************************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/matchers/partial.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const matcher_1 = __webpack_require__(/*! ./matcher */ "./node_modules/fast-glob/out/providers/matchers/matcher.js");
class PartialMatcher extends matcher_1.default {
    match(filepath) {
        const parts = filepath.split('/');
        const levels = parts.length;
        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
        for (const pattern of patterns) {
            const section = pattern.sections[0];
            /**
             * In this case, the pattern has a globstar and we must read all directories unconditionally,
             * but only if the level has reached the end of the first group.
             *
             * fixtures/{a,b}/**
             *  ^ true/false  ^ always true
            */
            if (!pattern.complete && levels > section.length) {
                return true;
            }
            const match = parts.every((part, index) => {
                const segment = pattern.segments[index];
                if (segment.dynamic && segment.patternRe.test(part)) {
                    return true;
                }
                if (!segment.dynamic && segment.pattern === part) {
                    return true;
                }
                return false;
            });
            if (match) {
                return true;
            }
        }
        return false;
    }
}
exports.default = PartialMatcher;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/provider.js":
/*!**********************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/provider.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(/*! path */ "path");
const deep_1 = __webpack_require__(/*! ./filters/deep */ "./node_modules/fast-glob/out/providers/filters/deep.js");
const entry_1 = __webpack_require__(/*! ./filters/entry */ "./node_modules/fast-glob/out/providers/filters/entry.js");
const error_1 = __webpack_require__(/*! ./filters/error */ "./node_modules/fast-glob/out/providers/filters/error.js");
const entry_2 = __webpack_require__(/*! ./transformers/entry */ "./node_modules/fast-glob/out/providers/transformers/entry.js");
class Provider {
    constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
    }
    _getRootDirectory(task) {
        return path.resolve(this._settings.cwd, task.base);
    }
    _getReaderOptions(task) {
        const basePath = task.base === '.' ? '' : task.base;
        return {
            basePath,
            pathSegmentSeparator: '/',
            concurrency: this._settings.concurrency,
            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
            errorFilter: this.errorFilter.getFilter(),
            followSymbolicLinks: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            stats: this._settings.stats,
            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
            transform: this.entryTransformer.getTransformer()
        };
    }
    _getMicromatchOptions() {
        return {
            dot: this._settings.dot,
            matchBase: this._settings.baseNameMatch,
            nobrace: !this._settings.braceExpansion,
            nocase: !this._settings.caseSensitiveMatch,
            noext: !this._settings.extglob,
            noglobstar: !this._settings.globstar,
            posix: true,
            strictSlashes: false
        };
    }
}
exports.default = Provider;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/stream.js":
/*!********************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/stream.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(/*! stream */ "stream");
const stream_2 = __webpack_require__(/*! ../readers/stream */ "./node_modules/fast-glob/out/readers/stream.js");
const provider_1 = __webpack_require__(/*! ./provider */ "./node_modules/fast-glob/out/providers/provider.js");
class ProviderStream extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1.Readable({ objectMode: true, read: () => { } });
        source
            .once('error', (error) => destination.emit('error', error))
            .on('data', (entry) => destination.emit('data', options.transform(entry)))
            .once('end', () => destination.emit('end'));
        destination
            .once('close', () => source.destroy());
        return destination;
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderStream;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/sync.js":
/*!******************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/sync.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __webpack_require__(/*! ../readers/sync */ "./node_modules/fast-glob/out/readers/sync.js");
const provider_1 = __webpack_require__(/*! ./provider */ "./node_modules/fast-glob/out/providers/provider.js");
class ProviderSync extends provider_1.default {
    constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
    }
}
exports.default = ProviderSync;


/***/ }),

/***/ "./node_modules/fast-glob/out/providers/transformers/entry.js":
/*!********************************************************************!*\
  !*** ./node_modules/fast-glob/out/providers/transformers/entry.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils = __webpack_require__(/*! ../../utils */ "./node_modules/fast-glob/out/utils/index.js");
class EntryTransformer {
    constructor(_settings) {
        this._settings = _settings;
    }
    getTransformer() {
        return (entry) => this._transform(entry);
    }
    _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
            filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
            filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
            filepath += '/';
        }
        if (!this._settings.objectMode) {
            return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
    }
}
exports.default = EntryTransformer;


/***/ }),

/***/ "./node_modules/fast-glob/out/readers/reader.js":
/*!******************************************************!*\
  !*** ./node_modules/fast-glob/out/readers/reader.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(/*! path */ "path");
const fsStat = __webpack_require__(/*! @nodelib/fs.stat */ "./node_modules/@nodelib/fs.stat/out/index.js");
const utils = __webpack_require__(/*! ../utils */ "./node_modules/fast-glob/out/utils/index.js");
class Reader {
    constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
            followSymbolicLink: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
    }
    _getFullEntryPath(filepath) {
        return path.resolve(this._settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
        const entry = {
            name: pattern,
            path: pattern,
            dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
            entry.stats = stats;
        }
        return entry;
    }
    _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
    }
}
exports.default = Reader;


/***/ }),

/***/ "./node_modules/fast-glob/out/readers/stream.js":
/*!******************************************************!*\
  !*** ./node_modules/fast-glob/out/readers/stream.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __webpack_require__(/*! stream */ "stream");
const fsStat = __webpack_require__(/*! @nodelib/fs.stat */ "./node_modules/@nodelib/fs.stat/out/index.js");
const fsWalk = __webpack_require__(/*! @nodelib/fs.walk */ "./node_modules/@nodelib/fs.walk/out/index.js");
const reader_1 = __webpack_require__(/*! ./reader */ "./node_modules/fast-glob/out/readers/reader.js");
class ReaderStream extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
    }
    dynamic(root, options) {
        return this._walkStream(root, options);
    }
    static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new stream_1.PassThrough({ objectMode: true });
        stream._write = (index, _enc, done) => {
            return this._getEntry(filepaths[index], patterns[index], options)
                .then((entry) => {
                if (entry !== null && options.entryFilter(entry)) {
                    stream.push(entry);
                }
                if (index === filepaths.length - 1) {
                    stream.end();
                }
                done();
            })
                .catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
            stream.write(i);
        }
        return stream;
    }
    _getEntry(filepath, pattern, options) {
        return this._getStat(filepath)
            .then((stats) => this._makeEntry(stats, pattern))
            .catch((error) => {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        });
    }
    _getStat(filepath) {
        return new Promise((resolve, reject) => {
            this._stat(filepath, this._fsStatSettings, (error, stats) => {
                return error === null ? resolve(stats) : reject(error);
            });
        });
    }
}
exports.default = ReaderStream;


/***/ }),

/***/ "./node_modules/fast-glob/out/readers/sync.js":
/*!****************************************************!*\
  !*** ./node_modules/fast-glob/out/readers/sync.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fsStat = __webpack_require__(/*! @nodelib/fs.stat */ "./node_modules/@nodelib/fs.stat/out/index.js");
const fsWalk = __webpack_require__(/*! @nodelib/fs.walk */ "./node_modules/@nodelib/fs.walk/out/index.js");
const reader_1 = __webpack_require__(/*! ./reader */ "./node_modules/fast-glob/out/readers/reader.js");
class ReaderSync extends reader_1.default {
    constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
    }
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
            const filepath = this._getFullEntryPath(pattern);
            const entry = this._getEntry(filepath, pattern, options);
            if (entry === null || !options.entryFilter(entry)) {
                continue;
            }
            entries.push(entry);
        }
        return entries;
    }
    _getEntry(filepath, pattern, options) {
        try {
            const stats = this._getStat(filepath);
            return this._makeEntry(stats, pattern);
        }
        catch (error) {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        }
    }
    _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
    }
}
exports.default = ReaderSync;


/***/ }),

/***/ "./node_modules/fast-glob/out/settings.js":
/*!************************************************!*\
  !*** ./node_modules/fast-glob/out/settings.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
const fs = __webpack_require__(/*! fs */ "fs");
const os = __webpack_require__(/*! os */ "os");
const CPU_COUNT = os.cpus().length;
exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    lstatSync: fs.lstatSync,
    stat: fs.stat,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync
};
class Settings {
    constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
            this.onlyFiles = false;
        }
        if (this.stats) {
            this.objectMode = true;
        }
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
    _getFileSystemMethods(methods = {}) {
        return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
    }
}
exports.default = Settings;


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/array.js":
/*!***************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/array.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.splitWhen = exports.flatten = void 0;
function flatten(items) {
    return items.reduce((collection, item) => [].concat(collection, item), []);
}
exports.flatten = flatten;
function splitWhen(items, predicate) {
    const result = [[]];
    let groupIndex = 0;
    for (const item of items) {
        if (predicate(item)) {
            groupIndex++;
            result[groupIndex] = [];
        }
        else {
            result[groupIndex].push(item);
        }
    }
    return result;
}
exports.splitWhen = splitWhen;


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/errno.js":
/*!***************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/errno.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnoentCodeError = void 0;
function isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
exports.isEnoentCodeError = isEnoentCodeError;


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/fs.js":
/*!************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/fs.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirentFromStats = void 0;
class DirentFromStats {
    constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
    }
}
function createDirentFromStats(name, stats) {
    return new DirentFromStats(name, stats);
}
exports.createDirentFromStats = createDirentFromStats;


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
const array = __webpack_require__(/*! ./array */ "./node_modules/fast-glob/out/utils/array.js");
exports.array = array;
const errno = __webpack_require__(/*! ./errno */ "./node_modules/fast-glob/out/utils/errno.js");
exports.errno = errno;
const fs = __webpack_require__(/*! ./fs */ "./node_modules/fast-glob/out/utils/fs.js");
exports.fs = fs;
const path = __webpack_require__(/*! ./path */ "./node_modules/fast-glob/out/utils/path.js");
exports.path = path;
const pattern = __webpack_require__(/*! ./pattern */ "./node_modules/fast-glob/out/utils/pattern.js");
exports.pattern = pattern;
const stream = __webpack_require__(/*! ./stream */ "./node_modules/fast-glob/out/utils/stream.js");
exports.stream = stream;
const string = __webpack_require__(/*! ./string */ "./node_modules/fast-glob/out/utils/string.js");
exports.string = string;


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/path.js":
/*!**************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/path.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLeadingDotSegment = exports.escape = exports.makeAbsolute = exports.unixify = void 0;
const path = __webpack_require__(/*! path */ "path");
const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
/**
 * Designed to work only with simple paths: `dir\\file`.
 */
function unixify(filepath) {
    return filepath.replace(/\\/g, '/');
}
exports.unixify = unixify;
function makeAbsolute(cwd, filepath) {
    return path.resolve(cwd, filepath);
}
exports.makeAbsolute = makeAbsolute;
function escape(pattern) {
    return pattern.replace(UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
}
exports.escape = escape;
function removeLeadingDotSegment(entry) {
    // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (entry.charAt(0) === '.') {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === '/' || secondCharactery === '\\') {
            return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
    }
    return entry;
}
exports.removeLeadingDotSegment = removeLeadingDotSegment;


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/pattern.js":
/*!*****************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/pattern.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
const path = __webpack_require__(/*! path */ "path");
const globParent = __webpack_require__(/*! glob-parent */ "./node_modules/glob-parent/index.js");
const micromatch = __webpack_require__(/*! micromatch */ "./node_modules/micromatch/index.js");
const picomatch = __webpack_require__(/*! picomatch */ "./node_modules/picomatch/index.js");
const GLOBSTAR = '**';
const ESCAPE_SYMBOL = '\\';
const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[.*]/;
const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\(.*\|.*\)/;
const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\(.*\)/;
const BRACE_EXPANSIONS_SYMBOLS_RE = /{.*(?:,|\.\.).*}/;
function isStaticPattern(pattern, options = {}) {
    return !isDynamicPattern(pattern, options);
}
exports.isStaticPattern = isStaticPattern;
function isDynamicPattern(pattern, options = {}) {
    /**
     * A special case with an empty string is necessary for matching patterns that start with a forward slash.
     * An empty string cannot be a dynamic pattern.
     * For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
     */
    if (pattern === '') {
        return false;
    }
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */
    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
    }
    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.braceExpansion !== false && BRACE_EXPANSIONS_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    return false;
}
exports.isDynamicPattern = isDynamicPattern;
function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
exports.convertToPositivePattern = convertToPositivePattern;
function convertToNegativePattern(pattern) {
    return '!' + pattern;
}
exports.convertToNegativePattern = convertToNegativePattern;
function isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
exports.isNegativePattern = isNegativePattern;
function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
}
exports.isPositivePattern = isPositivePattern;
function getNegativePatterns(patterns) {
    return patterns.filter(isNegativePattern);
}
exports.getNegativePatterns = getNegativePatterns;
function getPositivePatterns(patterns) {
    return patterns.filter(isPositivePattern);
}
exports.getPositivePatterns = getPositivePatterns;
function getBaseDirectory(pattern) {
    return globParent(pattern, { flipBackslashes: false });
}
exports.getBaseDirectory = getBaseDirectory;
function hasGlobStar(pattern) {
    return pattern.includes(GLOBSTAR);
}
exports.hasGlobStar = hasGlobStar;
function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith('/' + GLOBSTAR);
}
exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
function isAffectDepthOfReadingPattern(pattern) {
    const basename = path.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}
exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
function expandPatternsWithBraceExpansion(patterns) {
    return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
    }, []);
}
exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
function expandBraceExpansion(pattern) {
    return micromatch.braces(pattern, {
        expand: true,
        nodupes: true
    });
}
exports.expandBraceExpansion = expandBraceExpansion;
function getPatternParts(pattern, options) {
    let { parts } = picomatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
    /**
     * The scan method returns an empty array in some cases.
     * See micromatch/picomatch#58 for more details.
     */
    if (parts.length === 0) {
        parts = [pattern];
    }
    /**
     * The scan method does not return an empty part for the pattern with a forward slash.
     * This is another part of micromatch/picomatch#58.
     */
    if (parts[0].startsWith('/')) {
        parts[0] = parts[0].slice(1);
        parts.unshift('');
    }
    return parts;
}
exports.getPatternParts = getPatternParts;
function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
}
exports.makeRe = makeRe;
function convertPatternsToRe(patterns, options) {
    return patterns.map((pattern) => makeRe(pattern, options));
}
exports.convertPatternsToRe = convertPatternsToRe;
function matchAny(entry, patternsRe) {
    return patternsRe.some((patternRe) => patternRe.test(entry));
}
exports.matchAny = matchAny;


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/stream.js":
/*!****************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/stream.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
const merge2 = __webpack_require__(/*! merge2 */ "./node_modules/merge2/index.js");
function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
        stream.once('error', (error) => mergedStream.emit('error', error));
    });
    mergedStream.once('close', () => propagateCloseEventToSources(streams));
    mergedStream.once('end', () => propagateCloseEventToSources(streams));
    return mergedStream;
}
exports.merge = merge;
function propagateCloseEventToSources(streams) {
    streams.forEach((stream) => stream.emit('close'));
}


/***/ }),

/***/ "./node_modules/fast-glob/out/utils/string.js":
/*!****************************************************!*\
  !*** ./node_modules/fast-glob/out/utils/string.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.isString = void 0;
function isString(input) {
    return typeof input === 'string';
}
exports.isString = isString;
function isEmpty(input) {
    return input === '';
}
exports.isEmpty = isEmpty;


/***/ }),

/***/ "./node_modules/fastq/queue.js":
/*!*************************************!*\
  !*** ./node_modules/fastq/queue.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var reusify = __webpack_require__(/*! reusify */ "./node_modules/reusify/reusify.js")

function fastqueue (context, worker, concurrency) {
  if (typeof context === 'function') {
    concurrency = worker
    worker = context
    context = null
  }

  var cache = reusify(Task)
  var queueHead = null
  var queueTail = null
  var _running = 0

  var self = {
    push: push,
    drain: noop,
    saturated: noop,
    pause: pause,
    paused: false,
    concurrency: concurrency,
    running: running,
    resume: resume,
    idle: idle,
    length: length,
    getQueue: getQueue,
    unshift: unshift,
    empty: noop,
    kill: kill,
    killAndDrain: killAndDrain
  }

  return self

  function running () {
    return _running
  }

  function pause () {
    self.paused = true
  }

  function length () {
    var current = queueHead
    var counter = 0

    while (current) {
      current = current.next
      counter++
    }

    return counter
  }

  function getQueue () {
    var current = queueHead
    var tasks = []

    while (current) {
      tasks.push(current.value)
      current = current.next
    }

    return tasks
  }

  function resume () {
    if (!self.paused) return
    self.paused = false
    for (var i = 0; i < self.concurrency; i++) {
      _running++
      release()
    }
  }

  function idle () {
    return _running === 0 && self.length() === 0
  }

  function push (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop

    if (_running === self.concurrency || self.paused) {
      if (queueTail) {
        queueTail.next = current
        queueTail = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function unshift (value, done) {
    var current = cache.get()

    current.context = context
    current.release = release
    current.value = value
    current.callback = done || noop

    if (_running === self.concurrency || self.paused) {
      if (queueHead) {
        current.next = queueHead
        queueHead = current
      } else {
        queueHead = current
        queueTail = current
        self.saturated()
      }
    } else {
      _running++
      worker.call(context, current.value, current.worked)
    }
  }

  function release (holder) {
    if (holder) {
      cache.release(holder)
    }
    var next = queueHead
    if (next) {
      if (!self.paused) {
        if (queueTail === queueHead) {
          queueTail = null
        }
        queueHead = next.next
        next.next = null
        worker.call(context, next.value, next.worked)
        if (queueTail === null) {
          self.empty()
        }
      } else {
        _running--
      }
    } else if (--_running === 0) {
      self.drain()
    }
  }

  function kill () {
    queueHead = null
    queueTail = null
    self.drain = noop
  }

  function killAndDrain () {
    queueHead = null
    queueTail = null
    self.drain()
    self.drain = noop
  }
}

function noop () {}

function Task () {
  this.value = null
  this.callback = noop
  this.next = null
  this.release = noop
  this.context = null

  var self = this

  this.worked = function worked (err, result) {
    var callback = self.callback
    self.value = null
    self.callback = noop
    callback.call(self.context, err, result)
    self.release(self)
  }
}

module.exports = fastqueue


/***/ }),

/***/ "./node_modules/fill-range/index.js":
/*!******************************************!*\
  !*** ./node_modules/fill-range/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */



const util = __webpack_require__(/*! util */ "util");
const toRegexRange = __webpack_require__(/*! to-regex-range */ "./node_modules/to-regex-range/index.js");

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }


  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill(start, end, 1, { transform: step });
  }

  if (isObject(step)) {
    return fill(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber(step)) {
    if (step != null && !isObject(step)) return invalidStep(step, opts);
    return fill(start, end, 1, step);
  }

  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

module.exports = fill;


/***/ }),

/***/ "./node_modules/glob-parent/index.js":
/*!*******************************************!*\
  !*** ./node_modules/glob-parent/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isGlob = __webpack_require__(/*! is-glob */ "./node_modules/is-glob/index.js");
var pathPosixDirname = __webpack_require__(/*! path */ "path").posix.dirname;
var isWin32 = __webpack_require__(/*! os */ "os").platform() === 'win32';

var slash = '/';
var backslash = /\\/g;
var enclosure = /[\{\[].*[\/]*.*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 */
module.exports = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (enclosure.test(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};


/***/ }),

/***/ "./node_modules/globby/gitignore.js":
/*!******************************************!*\
  !*** ./node_modules/globby/gitignore.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {promisify} = __webpack_require__(/*! util */ "util");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const fastGlob = __webpack_require__(/*! fast-glob */ "./node_modules/fast-glob/out/index.js");
const gitIgnore = __webpack_require__(/*! ignore */ "./node_modules/globby/node_modules/ignore/index.js");
const slash = __webpack_require__(/*! slash */ "./node_modules/slash/index.js");

const DEFAULT_IGNORE = [
	'**/node_modules/**',
	'**/flow-typed/**',
	'**/coverage/**',
	'**/.git'
];

const readFileP = promisify(fs.readFile);

const mapGitIgnorePatternTo = base => ignore => {
	if (ignore.startsWith('!')) {
		return '!' + path.posix.join(base, ignore.slice(1));
	}

	return path.posix.join(base, ignore);
};

const parseGitIgnore = (content, options) => {
	const base = slash(path.relative(options.cwd, path.dirname(options.fileName)));

	return content
		.split(/\r?\n/)
		.filter(Boolean)
		.filter(line => !line.startsWith('#'))
		.map(mapGitIgnorePatternTo(base));
};

const reduceIgnore = files => {
	return files.reduce((ignores, file) => {
		ignores.add(parseGitIgnore(file.content, {
			cwd: file.cwd,
			fileName: file.filePath
		}));
		return ignores;
	}, gitIgnore());
};

const ensureAbsolutePathForCwd = (cwd, p) => {
	cwd = slash(cwd);
	if (path.isAbsolute(p)) {
		if (p.startsWith(cwd)) {
			return p;
		}

		throw new Error(`Path ${p} is not in cwd ${cwd}`);
	}

	return path.join(cwd, p);
};

const getIsIgnoredPredecate = (ignores, cwd) => {
	return p => ignores.ignores(slash(path.relative(cwd, ensureAbsolutePathForCwd(cwd, p))));
};

const getFile = async (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = await readFileP(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const getFileSync = (file, cwd) => {
	const filePath = path.join(cwd, file);
	const content = fs.readFileSync(filePath, 'utf8');

	return {
		cwd,
		filePath,
		content
	};
};

const normalizeOptions = ({
	ignore = [],
	cwd = slash(process.cwd())
} = {}) => {
	return {ignore, cwd};
};

module.exports = async options => {
	options = normalizeOptions(options);

	const paths = await fastGlob('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = await Promise.all(paths.map(file => getFile(file, options.cwd)));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};

module.exports.sync = options => {
	options = normalizeOptions(options);

	const paths = fastGlob.sync('**/.gitignore', {
		ignore: DEFAULT_IGNORE.concat(options.ignore),
		cwd: options.cwd
	});

	const files = paths.map(file => getFileSync(file, options.cwd));
	const ignores = reduceIgnore(files);

	return getIsIgnoredPredecate(ignores, options.cwd);
};


/***/ }),

/***/ "./node_modules/globby/index.js":
/*!**************************************!*\
  !*** ./node_modules/globby/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const fs = __webpack_require__(/*! fs */ "fs");
const arrayUnion = __webpack_require__(/*! array-union */ "./node_modules/array-union/index.js");
const merge2 = __webpack_require__(/*! merge2 */ "./node_modules/merge2/index.js");
const fastGlob = __webpack_require__(/*! fast-glob */ "./node_modules/fast-glob/out/index.js");
const dirGlob = __webpack_require__(/*! dir-glob */ "./node_modules/dir-glob/index.js");
const gitignore = __webpack_require__(/*! ./gitignore */ "./node_modules/globby/gitignore.js");
const {FilterStream, UniqueStream} = __webpack_require__(/*! ./stream-utils */ "./node_modules/globby/stream-utils.js");

const DEFAULT_FILTER = () => false;

const isNegative = pattern => pattern[0] === '!';

const assertPatternsInput = patterns => {
	if (!patterns.every(pattern => typeof pattern === 'string')) {
		throw new TypeError('Patterns must be a string or an array of strings');
	}
};

const checkCwdOption = (options = {}) => {
	if (!options.cwd) {
		return;
	}

	let stat;
	try {
		stat = fs.statSync(options.cwd);
	} catch (_) {
		return;
	}

	if (!stat.isDirectory()) {
		throw new Error('The `cwd` option must be a path to a directory');
	}
};

const getPathString = p => p.stats instanceof fs.Stats ? p.path : p;

const generateGlobTasks = (patterns, taskOptions) => {
	patterns = arrayUnion([].concat(patterns));
	assertPatternsInput(patterns);
	checkCwdOption(taskOptions);

	const globTasks = [];

	taskOptions = {
		ignore: [],
		expandDirectories: true,
		...taskOptions
	};

	for (const [index, pattern] of patterns.entries()) {
		if (isNegative(pattern)) {
			continue;
		}

		const ignore = patterns
			.slice(index)
			.filter(isNegative)
			.map(pattern => pattern.slice(1));

		const options = {
			...taskOptions,
			ignore: taskOptions.ignore.concat(ignore)
		};

		globTasks.push({pattern, options});
	}

	return globTasks;
};

const globDirs = (task, fn) => {
	let options = {};
	if (task.options.cwd) {
		options.cwd = task.options.cwd;
	}

	if (Array.isArray(task.options.expandDirectories)) {
		options = {
			...options,
			files: task.options.expandDirectories
		};
	} else if (typeof task.options.expandDirectories === 'object') {
		options = {
			...options,
			...task.options.expandDirectories
		};
	}

	return fn(task.pattern, options);
};

const getPattern = (task, fn) => task.options.expandDirectories ? globDirs(task, fn) : [task.pattern];

const getFilterSync = options => {
	return options && options.gitignore ?
		gitignore.sync({cwd: options.cwd, ignore: options.ignore}) :
		DEFAULT_FILTER;
};

const globToTask = task => glob => {
	const {options} = task;
	if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
		options.ignore = dirGlob.sync(options.ignore);
	}

	return {
		pattern: glob,
		options
	};
};

module.exports = async (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const getFilter = async () => {
		return options && options.gitignore ?
			gitignore({cwd: options.cwd, ignore: options.ignore}) :
			DEFAULT_FILTER;
	};

	const getTasks = async () => {
		const tasks = await Promise.all(globTasks.map(async task => {
			const globs = await getPattern(task, dirGlob);
			return Promise.all(globs.map(globToTask(task)));
		}));

		return arrayUnion(...tasks);
	};

	const [filter, tasks] = await Promise.all([getFilter(), getTasks()]);
	const paths = await Promise.all(tasks.map(task => fastGlob(task.pattern, task.options)));

	return arrayUnion(...paths).filter(path_ => !filter(getPathString(path_)));
};

module.exports.sync = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = globTasks.reduce((tasks, task) => {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		return tasks.concat(newTask);
	}, []);

	const filter = getFilterSync(options);

	return tasks.reduce(
		(matches, task) => arrayUnion(matches, fastGlob.sync(task.pattern, task.options)),
		[]
	).filter(path_ => !filter(path_));
};

module.exports.stream = (patterns, options) => {
	const globTasks = generateGlobTasks(patterns, options);

	const tasks = globTasks.reduce((tasks, task) => {
		const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
		return tasks.concat(newTask);
	}, []);

	const filter = getFilterSync(options);
	const filterStream = new FilterStream(p => !filter(p));
	const uniqueStream = new UniqueStream();

	return merge2(tasks.map(task => fastGlob.stream(task.pattern, task.options)))
		.pipe(filterStream)
		.pipe(uniqueStream);
};

module.exports.generateGlobTasks = generateGlobTasks;

module.exports.hasMagic = (patterns, options) => []
	.concat(patterns)
	.some(pattern => fastGlob.isDynamicPattern(pattern, options));

module.exports.gitignore = gitignore;


/***/ }),

/***/ "./node_modules/globby/node_modules/ignore/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/globby/node_modules/ignore/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const EMPTY = ''
const SPACE = ' '
const ESCAPE = '\\'
const REGEX_TEST_BLANK_LINE = /^\s+$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g
// /foo,
// ./foo,
// ../foo,
// .
// ..
const REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/

const SLASH = '/'
const KEY_IGNORE = typeof Symbol !== 'undefined'
  ? Symbol.for('node-ignore')
  /* istanbul ignore next */
  : 'node-ignore'

const define = (object, key, value) =>
  Object.defineProperty(object, key, {value})

const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g

// Sanitize the range of a regular expression
// The cases are complicated, see test cases for details
const sanitizeRange = range => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0)
    ? match
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    : EMPTY
)

// See fixtures #59
const cleanRangeBackSlash = slashes => {
  const {length} = slashes
  return slashes.slice(0, length - length % 2)
}

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
const REPLACERS = [

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    match => match.indexOf('\\') === 0
      ? SPACE
      : EMPTY
  ],

  // replace (\ ) with ' '
  [
    /\\\s/g,
    () => SPACE
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\$.|*+(){^]/g,
    match => `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^'
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/'
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?'
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      // If has a slash `/` at the beginning or middle
      return !/\/(?!$)/.test(this)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      ? '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+'
  ],

  // intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule
    /(^|[^\\]+)\\\*(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1) => `${p1}[^\\/]*`
  ],

  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE
  ],

  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE
  ],

  [
    // > The range notation, e.g. [a-zA-Z],
    // > can be used to match one of the characters in a range.

    // `\` is escaped by step 3
    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE
      // '\\[bar]' -> '\\\\[bar\\]'
      ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}`
      : close === ']'
        ? endEscape.length % 2 === 0
          // A normal case, and it is a range notation
          // '[bar]'
          // '[bar\\\\]'
          ? `[${sanitizeRange(range)}${endEscape}]`
          // Invalid range notaton
          // '[bar\\]' -> '[bar\\\\]'
          : '[]'
        : '[]'
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => /\/$/.test(match)
      // foo/ will not match 'foo'
      ? `${match}$`
      // foo matches 'foo' and 'foo/'
      : `${match}(?=$|\\/$)`
  ],

  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1
        // '\^':
        // '/*' does not match EMPTY
        // '/*' does not match everything

        // '\\\/':
        // 'abc/*' does not match 'abc/'
        ? `${p1}[^/]+`

        // 'a*' matches 'a'
        // 'a*' matches 'aa'
        : '[^/]*'

      return `${prefix}(?=$|\\/$)`
    }
  ],
]

// A simple cache, because an ignore rule only has only one certain meaning
const regexCache = Object.create(null)

// @param {pattern}
const makeRegex = (pattern, negative, ignorecase) => {
  const r = regexCache[pattern]
  if (r) {
    return r
  }

  // const replacers = negative
  //   ? NEGATIVE_REPLACERS
  //   : POSITIVE_REPLACERS

  const source = REPLACERS.reduce(
    (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
    pattern
  )

  return regexCache[pattern] = ignorecase
    ? new RegExp(source, 'i')
    : new RegExp(source)
}

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern.split(REGEX_SPLITALL_CRLF)

class IgnoreRule {
  constructor (
    origin,
    pattern,
    negative,
    regex
  ) {
    this.origin = origin
    this.pattern = pattern
    this.negative = negative
    this.regex = regex
  }
}

const createRule = (pattern, ignorecase) => {
  const origin = pattern
  let negative = false

  // > An optional prefix "!" which negates the pattern;
  if (pattern.indexOf('!') === 0) {
    negative = true
    pattern = pattern.substr(1)
  }

  pattern = pattern
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regex = makeRegex(pattern, negative, ignorecase)

  return new IgnoreRule(
    origin,
    pattern,
    negative,
    regex
  )
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore EMPTY, so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

const isNotRelative = path => REGEX_TEST_INVALID_PATH.test(path)

checkPath.isNotRelative = isNotRelative
checkPath.convert = p => p

class Ignore {
  constructor ({
    ignorecase = true
  } = {}) {
    this._rules = []
    this._ignorecase = ignorecase
    define(this, KEY_IGNORE, true)
    this._initCache()
  }

  _initCache () {
    this._ignoreCache = Object.create(null)
    this._testCache = Object.create(null)
  }

  _addPattern (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules)
      this._added = true
      return
    }

    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignorecase)
      this._added = true
      this._rules.push(rule)
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._addPattern, this)

    // Some rules have just added to the ignore,
    // making the behavior changed.
    if (this._added) {
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X

  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen

  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.

  // @returns {TestResult} true if a file is ignored
  _testOne (path, checkUnignored) {
    let ignored = false
    let unignored = false

    this._rules.forEach(rule => {
      const {negative} = rule
      if (
        unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored
      ) {
        return
      }

      const matched = rule.regex.test(path)

      if (matched) {
        ignored = !negative
        unignored = negative
      }
    })

    return {
      ignored,
      unignored
    }
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored, slices) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(path, originalPath, throwError)

    return this._t(path, cache, checkUnignored, slices)
  }

  _t (path, cache, checkUnignored, slices) {
    if (path in cache) {
      return cache[path]
    }

    if (!slices) {
      // path/to/a.js
      // ['path', 'to', 'a.js']
      slices = path.split(SLASH)
    }

    slices.pop()

    // If the path has no parent directory, just test it
    if (!slices.length) {
      return cache[path] = this._testOne(path, checkUnignored)
    }

    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    )

    // If the path contains a parent directory, check the parent first
    return cache[path] = parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._testOne(path, checkUnignored)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const returnFalse = () => false

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, returnFalse)

factory.isPathValid = isPathValid

// Fixes typescript
factory.default = factory

module.exports = factory

// Windows
// --------------------------------------------------------------
/* istanbul ignore if  */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && (
    process.env && process.env.IGNORE_TEST_WIN32
    || process.platform === 'win32'
  )
) {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


/***/ }),

/***/ "./node_modules/globby/stream-utils.js":
/*!*********************************************!*\
  !*** ./node_modules/globby/stream-utils.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {Transform} = __webpack_require__(/*! stream */ "stream");

class ObjectTransform extends Transform {
	constructor() {
		super({
			objectMode: true
		});
	}
}

class FilterStream extends ObjectTransform {
	constructor(filter) {
		super();
		this._filter = filter;
	}

	_transform(data, encoding, callback) {
		if (this._filter(data)) {
			this.push(data);
		}

		callback();
	}
}

class UniqueStream extends ObjectTransform {
	constructor() {
		super();
		this._pushed = new Set();
	}

	_transform(data, encoding, callback) {
		if (!this._pushed.has(data)) {
			this.push(data);
			this._pushed.add(data);
		}

		callback();
	}
}

module.exports = {
	FilterStream,
	UniqueStream
};


/***/ }),

/***/ "./node_modules/is-extglob/index.js":
/*!******************************************!*\
  !*** ./node_modules/is-extglob/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  var match;
  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};


/***/ }),

/***/ "./node_modules/is-glob/index.js":
/*!***************************************!*\
  !*** ./node_modules/is-glob/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isExtglob = __webpack_require__(/*! is-extglob */ "./node_modules/is-extglob/index.js");
var chars = { '{': '}', '(': ')', '[': ']'};
var strictRegex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
var relaxedRegex = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;

module.exports = function isGlob(str, options) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  var regex = strictRegex;
  var match;

  // optionally relax regex
  if (options && options.strict === false) {
    regex = relaxedRegex;
  }

  while ((match = regex.exec(str))) {
    if (match[2]) return true;
    var idx = match.index + match[0].length;

    // if an open bracket/brace/paren is escaped,
    // set the index to the next closing character
    var open = match[1];
    var close = open ? chars[open] : null;
    if (open && close) {
      var n = str.indexOf(close, idx);
      if (n !== -1) {
        idx = n + 1;
      }
    }

    str = str.slice(idx);
  }
  return false;
};


/***/ }),

/***/ "./node_modules/is-number/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-number/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};


/***/ }),

/***/ "./node_modules/merge2/index.js":
/*!**************************************!*\
  !*** ./node_modules/merge2/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * merge2
 * https://github.com/teambition/merge2
 *
 * Copyright (c) 2014-2020 Teambition
 * Licensed under the MIT license.
 */
const Stream = __webpack_require__(/*! stream */ "stream")
const PassThrough = Stream.PassThrough
const slice = Array.prototype.slice

module.exports = merge2

function merge2 () {
  const streamsQueue = []
  const args = slice.call(arguments)
  let merging = false
  let options = args[args.length - 1]

  if (options && !Array.isArray(options) && options.pipe == null) {
    args.pop()
  } else {
    options = {}
  }

  const doEnd = options.end !== false
  const doPipeError = options.pipeError === true
  if (options.objectMode == null) {
    options.objectMode = true
  }
  if (options.highWaterMark == null) {
    options.highWaterMark = 64 * 1024
  }
  const mergedStream = PassThrough(options)

  function addStream () {
    for (let i = 0, len = arguments.length; i < len; i++) {
      streamsQueue.push(pauseStreams(arguments[i], options))
    }
    mergeStream()
    return this
  }

  function mergeStream () {
    if (merging) {
      return
    }
    merging = true

    let streams = streamsQueue.shift()
    if (!streams) {
      process.nextTick(endStream)
      return
    }
    if (!Array.isArray(streams)) {
      streams = [streams]
    }

    let pipesCount = streams.length + 1

    function next () {
      if (--pipesCount > 0) {
        return
      }
      merging = false
      mergeStream()
    }

    function pipe (stream) {
      function onend () {
        stream.removeListener('merge2UnpipeEnd', onend)
        stream.removeListener('end', onend)
        if (doPipeError) {
          stream.removeListener('error', onerror)
        }
        next()
      }
      function onerror (err) {
        mergedStream.emit('error', err)
      }
      // skip ended stream
      if (stream._readableState.endEmitted) {
        return next()
      }

      stream.on('merge2UnpipeEnd', onend)
      stream.on('end', onend)

      if (doPipeError) {
        stream.on('error', onerror)
      }

      stream.pipe(mergedStream, { end: false })
      // compatible for old stream
      stream.resume()
    }

    for (let i = 0; i < streams.length; i++) {
      pipe(streams[i])
    }

    next()
  }

  function endStream () {
    merging = false
    // emit 'queueDrain' when all streams merged.
    mergedStream.emit('queueDrain')
    if (doEnd) {
      mergedStream.end()
    }
  }

  mergedStream.setMaxListeners(0)
  mergedStream.add = addStream
  mergedStream.on('unpipe', function (stream) {
    stream.emit('merge2UnpipeEnd')
  })

  if (args.length) {
    addStream.apply(null, args)
  }
  return mergedStream
}

// check and pause streams for pipe.
function pauseStreams (streams, options) {
  if (!Array.isArray(streams)) {
    // Backwards-compat with old-style streams
    if (!streams._readableState && streams.pipe) {
      streams = streams.pipe(PassThrough(options))
    }
    if (!streams._readableState || !streams.pause || !streams.pipe) {
      throw new Error('Only readable stream can be merged.')
    }
    streams.pause()
  } else {
    for (let i = 0, len = streams.length; i < len; i++) {
      streams[i] = pauseStreams(streams[i], options)
    }
  }
  return streams
}


/***/ }),

/***/ "./node_modules/micromatch/index.js":
/*!******************************************!*\
  !*** ./node_modules/micromatch/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(/*! util */ "util");
const braces = __webpack_require__(/*! braces */ "./node_modules/braces/index.js");
const picomatch = __webpack_require__(/*! picomatch */ "./node_modules/picomatch/index.js");
const utils = __webpack_require__(/*! picomatch/lib/utils */ "./node_modules/picomatch/lib/utils.js");
const isEmptyString = val => typeof val === 'string' && (val === '' || val === './');

/**
 * Returns an array of strings that match one or more glob patterns.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {String|Array<string>} list List of strings to match.
 * @param {String|Array<string>} patterns One or more glob patterns to use for matching.
 * @param {Object} options See available [options](#options)
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

const micromatch = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  let onResult = state => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };

  for (let i = 0; i < patterns.length; i++) {
    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;

    for (let item of list) {
      let matched = isMatch(item, true);

      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter(item => !omit.has(item));

  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(', ')}"`);
    }

    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
    }
  }

  return matches;
};

/**
 * Backwards compatibility
 */

micromatch.match = micromatch;

/**
 * Returns a matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matcher(pattern[, options]);
 *
 * const isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch.matcher = (pattern, options) => picomatch(pattern, options);

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.isMatch(string, patterns[, options]);
 *
 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Backwards compatibility
 */

micromatch.any = micromatch.isMatch;

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

micromatch.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = new Set();
  let items = [];

  let onResult = state => {
    if (options.onResult) options.onResult(state);
    items.push(state.output);
  };

  let matches = micromatch(list, patterns, { ...options, onResult });

  for (let item of items) {
    if (!matches.includes(item)) {
      result.add(item);
    }
  }
  return [...result];
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * // mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

micromatch.contains = (str, pattern, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  if (Array.isArray(pattern)) {
    return pattern.some(p => micromatch.contains(str, p, options));
  }

  if (typeof pattern === 'string') {
    if (isEmptyString(str) || isEmptyString(pattern)) {
      return false;
    }

    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
      return true;
    }
  }

  return micromatch.isMatch(str, pattern, { ...options, contains: true });
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matchKeys(object, patterns[, options]);
 *
 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch.matchKeys = (obj, patterns, options) => {
  if (!utils.isObject(obj)) {
    throw new TypeError('Expected the first argument to be an object');
  }
  let keys = micromatch(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys) res[key] = obj[key];
  return res;
};

/**
 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.some = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (items.some(item => isMatch(item))) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.every = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (!items.every(item => isMatch(item))) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.all = (str, patterns, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }

  return [].concat(patterns).every(p => picomatch(p, options)(str));
};

/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `glob` Glob pattern to use for matching.
 * @param {String} `input` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
 * @api public
 */

micromatch.capture = (glob, input, options) => {
  let posix = utils.isWindows(options);
  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
  let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);

  if (match) {
    return match.slice(1).map(v => v === void 0 ? '' : v);
  }
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch.makeRe = (...args) => picomatch.makeRe(...args);

/**
 * Scan a glob pattern to separate the pattern into segments. Used
 * by the [split](#split) method.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.scan(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

micromatch.scan = (...args) => picomatch.scan(...args);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm(pattern[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
 * @api public
 */

micromatch.parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of braces(String(pattern), options)) {
      res.push(picomatch.parse(str, options));
    }
  }
  return res;
};

/**
 * Process the given brace `pattern`.
 *
 * ```js
 * const { braces } = require('micromatch');
 * console.log(braces('foo/{a,b,c}/bar'));
 * //=> [ 'foo/(a|b|c)/bar' ]
 *
 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
 * ```
 * @param {String} `pattern` String with brace pattern to process.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */

micromatch.braces = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  if ((options && options.nobrace === true) || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return braces(pattern, options);
};

/**
 * Expand braces
 */

micromatch.braceExpand = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  return micromatch.braces(pattern, { ...options, expand: true });
};

/**
 * Expose micromatch
 */

module.exports = micromatch;


/***/ }),

/***/ "./node_modules/path-type/index.js":
/*!*****************************************!*\
  !*** ./node_modules/path-type/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const {promisify} = __webpack_require__(/*! util */ "util");
const fs = __webpack_require__(/*! fs */ "fs");

async function isType(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		const stats = await promisify(fs[fsStatType])(filePath);
		return stats[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

function isTypeSync(fsStatType, statsMethodName, filePath) {
	if (typeof filePath !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filePath}`);
	}

	try {
		return fs[fsStatType](filePath)[statsMethodName]();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

exports.isFile = isType.bind(null, 'stat', 'isFile');
exports.isDirectory = isType.bind(null, 'stat', 'isDirectory');
exports.isSymlink = isType.bind(null, 'lstat', 'isSymbolicLink');
exports.isFileSync = isTypeSync.bind(null, 'statSync', 'isFile');
exports.isDirectorySync = isTypeSync.bind(null, 'statSync', 'isDirectory');
exports.isSymlinkSync = isTypeSync.bind(null, 'lstatSync', 'isSymbolicLink');


/***/ }),

/***/ "./node_modules/picomatch/index.js":
/*!*****************************************!*\
  !*** ./node_modules/picomatch/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(/*! ./lib/picomatch */ "./node_modules/picomatch/lib/picomatch.js");


/***/ }),

/***/ "./node_modules/picomatch/lib/constants.js":
/*!*************************************************!*\
  !*** ./node_modules/picomatch/lib/constants.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(/*! path */ "path");
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ "./node_modules/picomatch/lib/parse.js":
/*!*********************************************!*\
  !*** ./node_modules/picomatch/lib/parse.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const constants = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/picomatch/lib/utils.js");

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ "./node_modules/picomatch/lib/picomatch.js":
/*!*************************************************!*\
  !*** ./node_modules/picomatch/lib/picomatch.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(/*! path */ "path");
const scan = __webpack_require__(/*! ./scan */ "./node_modules/picomatch/lib/scan.js");
const parse = __webpack_require__(/*! ./parse */ "./node_modules/picomatch/lib/parse.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/picomatch/lib/utils.js");
const constants = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return parsed.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${parsed.output})${append}`;
  if (parsed && parsed.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = parsed;
  }

  return regex;
};

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  const opts = options || {};
  let parsed = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = parsed.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === undefined) {
    parsed = parse(input, options);
    parsed.prefix = prefix + (parsed.prefix || '');
  } else {
    parsed.output = output;
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ "./node_modules/picomatch/lib/scan.js":
/*!********************************************!*\
  !*** ./node_modules/picomatch/lib/scan.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(/*! ./utils */ "./node_modules/picomatch/lib/utils.js");
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ "./node_modules/picomatch/lib/utils.js":
/*!*********************************************!*\
  !*** ./node_modules/picomatch/lib/utils.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(/*! path */ "path");
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),

/***/ "./node_modules/pify/index.js":
/*!************************************!*\
  !*** ./node_modules/pify/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const processFn = (fn, options, proxy, unwrapped) => function (...arguments_) {
	const P = options.promiseModule;

	return new P((resolve, reject) => {
		if (options.multiArgs) {
			arguments_.push((...result) => {
				if (options.errorFirst) {
					if (result[0]) {
						reject(result);
					} else {
						result.shift();
						resolve(result);
					}
				} else {
					resolve(result);
				}
			});
		} else if (options.errorFirst) {
			arguments_.push((error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		} else {
			arguments_.push(resolve);
		}

		const self = this === proxy ? unwrapped : this;
		Reflect.apply(fn, self, arguments_);
	});
};

const filterCache = new WeakMap();

module.exports = (input, options) => {
	options = {
		exclude: [/.+(?:Sync|Stream)$/],
		errorFirst: true,
		promiseModule: Promise,
		...options
	};

	const objectType = typeof input;
	if (!(input !== null && (objectType === 'object' || objectType === 'function'))) {
		throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? 'null' : objectType}\``);
	}

	const filter = (target, key) => {
		let cached = filterCache.get(target);

		if (!cached) {
			cached = {};
			filterCache.set(target, cached);
		}

		if (key in cached) {
			return cached[key];
		}

		const match = pattern => (typeof pattern === 'string' || typeof key === 'symbol') ? key === pattern : pattern.test(key);
		const desc = Reflect.getOwnPropertyDescriptor(target, key);
		const writableOrConfigurableOwn = (desc === undefined || desc.writable || desc.configurable);
		const included = options.include ? options.include.some(match) : !options.exclude.some(match);
		const shouldFilter = included && writableOrConfigurableOwn;
		cached[key] = shouldFilter;
		return shouldFilter;
	};

	const cache = new WeakMap();

	const proxy = new Proxy(input, {
		apply(target, thisArg, args) {
			const cached = cache.get(target);

			if (cached) {
				return Reflect.apply(cached, thisArg, args);
			}

			const pified = options.excludeMain ? target : processFn(target, options, proxy, target);
			cache.set(target, pified);
			return Reflect.apply(pified, thisArg, args);
		},

		get(target, key) {
			const property = target[key];

			// eslint-disable-next-line no-use-extend-native/no-use-extend-native
			if (!filter(target, key) || property === Function.prototype[key]) {
				return property;
			}

			const cached = cache.get(property);

			if (cached) {
				return cached;
			}

			if (typeof property === 'function') {
				const pified = processFn(property, options, proxy, target);
				cache.set(property, pified);
				return pified;
			}

			return property;
		}
	});

	return proxy;
};


/***/ }),

/***/ "./node_modules/reprism/es/core.js":
/*!*****************************************!*\
  !*** ./node_modules/reprism/es/core.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlight = highlight;
exports.encode = encode;
exports.getType = getType;
exports.objId = objId;
exports.loadLanguages = loadLanguages;
exports.clone = clone;
exports.extend = extend;
exports.insertBefore = insertBefore;
exports.DFS = DFS;
exports.matchGrammar = matchGrammar;
exports.tokenize = tokenize;
exports.addHook = addHook;
exports.runHook = runHook;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uniqueID = 0;

var languages = exports.languages = {
  extend: extend,
  insertBefore: insertBefore,
  DFS: DFS
};
var plugins = exports.plugins = {};
var hooks = exports.hooks = {
  all: {},
  add: addHook,
  run: runHook
};

var Token = function Token(type, content, alias, matchedStr, greedy) {
  _classCallCheck(this, Token);

  this.type = type;
  this.content = content;
  this.alias = alias;
  // Copy of the full string this token was created from
  this.length = (matchedStr || '').length | 0;
  this.greedy = !!greedy;
};

Token.stringify = function (o, language, parent) {
  if (getType(o) === 'String') {
    return o;
  }

  if (getType(o) === 'Array') {
    return o.map(function (element) {
      return Token.stringify(element, language, o);
    }).join('');
  }

  var env = {
    type: o.type,
    content: Token.stringify(o.content, language, parent),
    tag: 'span',
    classes: ['token', o.type],
    attributes: {},
    language: language,
    parent: parent
  };

  if (o.alias) {
    var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
    Array.prototype.push.apply(env.classes, aliases);
  }

  hooks.run('wrap', env);

  var attributes = Object.keys(env.attributes).map(function (name) {
    return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
  }).join(' ');

  return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
};

var Prism = {
  languages: languages,
  plugins: plugins,
  insertBefore: insertBefore,
  matchGrammar: matchGrammar,
  tokenize: tokenize,
  hooks: hooks,
  util: {
    encode: encode,
    type: getType,
    objId: objId,
    clone: clone
  },
  Token: Token
};

exports.default = Prism;
function highlight(text, language) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$component = _ref.component,
      component = _ref$component === undefined ? 'pre' : _ref$component;

  if (!languages[language]) {
    if (!language) {
      throw new Error('A language is required!');
    }
    throw new Error('The language: ' + language + ' hasn\'t been loaded yet!');
  }
  var env = {
    code: text,
    grammar: languages[language],
    language: language
  };
  hooks.run('before-tokenize', env);
  env.tokens = tokenize(env.code, env.grammar);
  hooks.run('after-tokenize', env);
  return '' + (component ? '<' + component + ' class=\'reprism ' + language + ' language-' + language + '\'>' : '') + Token.stringify(encode(env.tokens), env.language) + (component ? '</' + component + '>' : '');
}

function encode(tokens) {
  if (tokens instanceof Token) {
    return new Token(tokens.type, encode(tokens.content), tokens.alias);
  } else if (getType(tokens) === 'Array') {
    return tokens.map(encode);
  }
  return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
}

function getType(o) {
  return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
}

function objId(obj) {
  if (!obj.__id) {
    uniqueID += 1;
    Object.defineProperty(obj, '__id', { value: uniqueID });
  }
  return obj.__id;
}

function loadLanguages() {
  for (var _len = arguments.length, langs = Array(_len), _key = 0; _key < _len; _key++) {
    langs[_key] = arguments[_key];
  }

  langs.forEach(function (lang) {
    if (getType(lang) === 'Array') {
      lang.forEach(function (subLang) {
        subLang.init(Prism);
      });
    } else {
      lang.init(Prism);
    }
  });
}

// Deep clone a language definition (e.g. to extend it)
function clone(o, visited) {
  visited = visited || {};

  if (getType(o) === 'Array') {
    if (visited[objId(o)]) {
      return visited[objId(o)];
    }
    var c = [];
    visited[objId(o)] = c;

    o.forEach(function (v, i) {
      c[i] = clone(v, visited);
    });

    return c;
  }

  if (getType(o) === 'Object') {
    if (visited[objId(o)]) {
      return visited[objId(o)];
    }
    var _c = {};
    visited[objId(o)] = _c;

    Object.keys(o).forEach(function (key) {
      _c[key] = clone(o[key], visited);
    });

    return _c;
  }

  return o;
}

function extend(id, redef) {
  var lang = clone(languages[id]);
  Object.keys(redef).forEach(function (key) {
    lang[key] = redef[key];
  });
  return lang;
}

function insertBefore() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var inside = args[0],
      before = args[1],
      insert = args[2],
      _args$ = args[3],
      base = _args$ === undefined ? languages : _args$;


  var grammar = base[inside];
  var resolvedInsert = insert;

  if (args.length === 2) {
    resolvedInsert = args[1];

    Object.keys(resolvedInsert).forEach(function (key) {
      grammar[key] = resolvedInsert[key];
    });

    return grammar;
  }

  var ret = {};

  Object.keys(grammar).forEach(function (key) {
    if (key === before) {
      Object.keys(insert).forEach(function (newKey) {
        ret[newKey] = insert[newKey];
      });
    }
    ret[key] = grammar[key];
  });

  // Update references in other language definitions
  DFS(languages, function callback(key, value) {
    if (value === base[inside] && key !== inside) {
      this[key] = ret;
    }
  });

  base[inside] = ret;

  return base[inside];
}

// Traverse a language definition with Depth First Search
function DFS() {
  var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments[1];
  var type = arguments[2];
  var visited = arguments[3];

  visited = visited || {};
  Object.keys(o).forEach(function (i) {
    callback.call(o, i, o[i], type || i);
    if (getType(o[i]) === 'Object' && !visited[objId(o[i])]) {
      visited[objId(o[i])] = true;
      DFS(o[i], callback, i, visited);
    } else if (getType(o[i]) === 'Array' && !visited[objId(o[i])]) {
      visited[objId(o[i])] = true;
      DFS(o[i], callback, null, visited);
    }
  });
}

function matchGrammar(text, strarr) {
  var grammar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var index = arguments[3];
  var startPos = arguments[4];
  var oneshot = arguments[5];
  var target = arguments[6];

  Object.keys(grammar).forEach(function (token) {
    if (!grammar[token]) {
      return;
    }

    if (token === target) {
      return;
    }

    var patterns = grammar[token];
    patterns = Array.isArray(patterns) ? patterns : [patterns];

    patterns.forEach(function (pattern) {
      var inside = pattern.inside;
      var lookbehind = !!pattern.lookbehind;
      var greedy = !!pattern.greedy;
      var lookbehindLength = 0;
      var alias = pattern.alias;

      if (greedy && !pattern.pattern.global) {
        // Without the global flag, lastIndex won't work
        var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
        pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
      }

      pattern = pattern.pattern || pattern;

      // Don’t cache length as it changes during the loop
      for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, i += 1) {
        var str = strarr[i];

        if (strarr.length > text.length) {
          // Something went terribly wrong, ABORT, ABORT!
          return;
        }

        if (str instanceof Token) {
          // eslint-disable-next-line
          continue;
        }

        var delNum = 0;
        var match = void 0;

        if (greedy && i !== strarr.length - 1) {
          pattern.lastIndex = pos;
          match = pattern.exec(text);
          if (!match) {
            break;
          }

          var _from = match.index + (lookbehind ? match[1].length : 0);
          var _to = match.index + match[0].length;
          var k = i;
          var p = pos;

          for (var len = strarr.length; k < len && (p < _to || !strarr[k].type && !strarr[k - 1].greedy); ++k) {
            p += strarr[k].length;
            // Move the index i to the element in strarr that is closest to from
            if (_from >= p) {
              i += 1;
              pos = p;
            }
          }

          // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
          if (strarr[i] instanceof Token) {
            // eslint-disable-next-line
            continue;
          }

          // Number of tokens to delete and replace with the new match
          delNum = k - i;
          str = text.slice(pos, p);
          match.index -= pos;
        } else {
          pattern.lastIndex = 0;

          match = pattern.exec(str);
          delNum = 1;
        }

        if (!match) {
          if (oneshot) {
            break;
          }

          // eslint-disable-next-line
          continue;
        }

        if (lookbehind) {
          lookbehindLength = match[1] ? match[1].length : 0;
        }

        var from = match.index + lookbehindLength;
        match = match[0].slice(lookbehindLength);
        var to = from + match.length;
        var before = str.slice(0, from);
        var after = str.slice(to);

        var _args = [i, delNum];

        if (before) {
          i += 1;
          pos += before.length;
          _args.push(before);
        }

        var wrapped = new Token(token, inside ? tokenize(match, inside) : match, alias, match, greedy);

        _args.push(wrapped);

        if (after) {
          _args.push(after);
        }

        Array.prototype.splice.apply(strarr, _args);

        if (delNum !== 1) matchGrammar(text, strarr, grammar, i, pos, true, token);

        if (oneshot) break;
      }
    });
  });
}

function tokenize(text, grammar) {
  var strarr = [text];

  var rest = grammar.rest;

  if (rest) {
    Object.keys(rest).forEach(function (token) {
      grammar[token] = rest[token];
    });

    delete grammar.rest;
  }

  matchGrammar(text, strarr, grammar, 0, 0, false);

  return strarr;
}

function addHook(name, callback) {
  var allHooks = hooks.all;

  allHooks[name] = allHooks[name] || [];

  allHooks[name].push(callback);
}

function runHook(name, env) {
  var callbacks = hooks.all[name];

  if (!callbacks || !callbacks.length) {
    return;
  }

  callbacks.forEach(function (callback) {
    return callback(env);
  });
}

/***/ }),

/***/ "./node_modules/reprism/es/index.js":
/*!******************************************!*\
  !*** ./node_modules/reprism/es/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadLanguages = exports.highlight = undefined;

var _markup = __webpack_require__(/*! ./languages/markup */ "./node_modules/reprism/es/languages/markup.js");

var _markup2 = _interopRequireDefault(_markup);

var _css = __webpack_require__(/*! ./languages/css */ "./node_modules/reprism/es/languages/css.js");

var _css2 = _interopRequireDefault(_css);

var _clike = __webpack_require__(/*! ./languages/clike */ "./node_modules/reprism/es/languages/clike.js");

var _clike2 = _interopRequireDefault(_clike);

var _javascript = __webpack_require__(/*! ./languages/javascript */ "./node_modules/reprism/es/languages/javascript.js");

var _javascript2 = _interopRequireDefault(_javascript);

var _core = __webpack_require__(/*! ./core */ "./node_modules/reprism/es/core.js");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.loadLanguages)([_markup2.default, _css2.default, _clike2.default, _javascript2.default]);

exports.default = _core2.default;
exports.highlight = _core.highlight;
exports.loadLanguages = _core.loadLanguages;

/***/ }),

/***/ "./node_modules/reprism/es/languages/clike.js":
/*!****************************************************!*\
  !*** ./node_modules/reprism/es/languages/clike.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'clike',
  init: function init(Prism) {
    Prism.languages.clike = {
      comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true
      }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true
      }],
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      'class-name': {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
        lookbehind: true,
        inside: {
          punctuation: /[.\\]/
        }
      },
      keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
      boolean: /\b(?:true|false)\b/,
      function: /[a-z0-9_]+(?=\()/i,
      number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
      operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/es/languages/css.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/es/languages/css.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'css',
  init: function init(Prism) {
    Prism.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
        inside: {
          rule: /@[\w-]+/
          // See rest below
        }
      },
      url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
      selector: /[^{}\s][^{};]*?(?=\s*\{)/,
      string: {
        pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
      important: /\B!important\b/i,
      function: /[-a-z0-9]+(?=\()/i,
      punctuation: /[(){};:]/
    };

    Prism.languages.css.atrule.inside.rest = Prism.languages.css;

    if (Prism.languages.markup) {
      Prism.languages.insertBefore('markup', 'tag', {
        style: {
          pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
          lookbehind: true,
          inside: Prism.languages.css,
          alias: 'language-css',
          greedy: true
        }
      });

      Prism.languages.insertBefore('inside', 'attr-value', {
        'style-attr': {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            'attr-name': {
              pattern: /^\s*style/i,
              inside: Prism.languages.markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': {
              pattern: /.+/i,
              inside: Prism.languages.css
            }
          },
          alias: 'language-css'
        }
      }, Prism.languages.markup.tag);
    }
  }
};

/***/ }),

/***/ "./node_modules/reprism/es/languages/javascript.js":
/*!*********************************************************!*\
  !*** ./node_modules/reprism/es/languages/javascript.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'javascript',
  init: function init(Prism) {
    Prism.languages.javascript = Prism.languages.extend('clike', {
      keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
      number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      function: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
      operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
    });

    Prism.languages.insertBefore('javascript', 'keyword', {
      regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: true,
        greedy: true
      },
      // This must be declared before keyword because we use "function" inside the look-forward
      'function-variable': {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
        alias: 'function'
      },
      constant: /\b[A-Z][A-Z\d_]*\b/
    });

    Prism.languages.insertBefore('javascript', 'string', {
      'template-string': {
        pattern: /`(?:\\[\s\S]|[^\\`])*`/,
        greedy: true,
        inside: {
          interpolation: {
            pattern: /\$\{[^}]+\}/,
            inside: {
              'interpolation-punctuation': {
                pattern: /^\$\{|\}$/,
                alias: 'punctuation'
              },
              rest: Prism.languages.javascript
            }
          },
          string: /[\s\S]+/
        }
      }
    });

    if (Prism.languages.markup) {
      Prism.languages.insertBefore('markup', 'tag', {
        script: {
          pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
          lookbehind: true,
          inside: Prism.languages.javascript,
          alias: 'language-javascript',
          greedy: true
        }
      });
    }

    Prism.languages.js = Prism.languages.javascript;
  }
};

/***/ }),

/***/ "./node_modules/reprism/es/languages/markup.js":
/*!*****************************************************!*\
  !*** ./node_modules/reprism/es/languages/markup.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'markup',
  init: function init(Prism) {
    Prism.languages.markup = {
      comment: /<!--[\s\S]*?-->/,
      prolog: /<\?[\s\S]+?\?>/,
      doctype: /<!DOCTYPE[\s\S]+?>/i,
      cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
      tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        greedy: true,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/i,
            inside: {
              punctuation: /^<\/?/,
              namespace: /^[^\s>\/:]+:/
            }
          },
          'attr-value': {
            pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
            inside: {
              punctuation: [/^=/, {
                pattern: /(^|[^\\])["']/,
                lookbehind: true
              }]
            }
          },
          punctuation: /\/?>/,
          'attr-name': {
            pattern: /[^\s>\/]+/,
            inside: {
              namespace: /^[^\s>\/:]+:/
            }
          }
        }
      },
      entity: /&#?[\da-z]{1,8};/i
    };

    Prism.languages.markup.tag.inside['attr-value'].inside.entity = Prism.languages.markup.entity;

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function (env) {
      if (env.type === 'entity') {
        env.attributes.title = env.content.replace(/&amp;/, '&');
      }
    });

    Prism.languages.xml = Prism.languages.markup;
    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/abap.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/abap.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'abap',
  init: function init(Prism) {
    Prism.languages.abap = {
      comment: /^\*.*/m,
      string: /(`|')(?:\\.|(?!\1)[^\\\r\n])*\1/m,
      'string-template': {
        pattern: /([|}])(?:\\.|[^\\|{\r\n])*(?=[|{])/,
        lookbehind: true,
        alias: 'string'
      },
      /* End Of Line comments should not interfere with strings when the
      quote character occurs within them. We assume a string being highlighted
      inside an EOL comment is more acceptable than the opposite.
      */
      'eol-comment': {
        pattern: /(^|\s)".*/m,
        lookbehind: true,
        alias: 'comment'
      },
      keyword: {
        pattern: /(\s|\.|^)(?:SCIENTIFIC_WITH_LEADING_ZERO|SCALE_PRESERVING_SCIENTIFIC|RMC_COMMUNICATION_FAILURE|END-ENHANCEMENT-SECTION|MULTIPLY-CORRESPONDING|SUBTRACT-CORRESPONDING|VERIFICATION-MESSAGE|DIVIDE-CORRESPONDING|ENHANCEMENT-SECTION|CURRENCY_CONVERSION|RMC_SYSTEM_FAILURE|START-OF-SELECTION|MOVE-CORRESPONDING|RMC_INVALID_STATUS|CUSTOMER-FUNCTION|END-OF-DEFINITION|ENHANCEMENT-POINT|SYSTEM-EXCEPTIONS|ADD-CORRESPONDING|SCALE_PRESERVING|SELECTION-SCREEN|CURSOR-SELECTION|END-OF-SELECTION|LOAD-OF-PROGRAM|SCROLL-BOUNDARY|SELECTION-TABLE|EXCEPTION-TABLE|IMPLEMENTATIONS|PARAMETER-TABLE|RIGHT-JUSTIFIED|UNIT_CONVERSION|AUTHORITY-CHECK|LIST-PROCESSING|SIGN_AS_POSTFIX|COL_BACKGROUND|IMPLEMENTATION|INTERFACE-POOL|TRANSFORMATION|IDENTIFICATION|ENDENHANCEMENT|LINE-SELECTION|INITIALIZATION|LEFT-JUSTIFIED|SELECT-OPTIONS|SELECTION-SETS|COMMUNICATION|CORRESPONDING|DECIMAL_SHIFT|PRINT-CONTROL|VALUE-REQUEST|CHAIN-REQUEST|FUNCTION-POOL|FIELD-SYMBOLS|FUNCTIONALITY|INVERTED-DATE|SELECTION-SET|CLASS-METHODS|OUTPUT-LENGTH|CLASS-CODING|COL_NEGATIVE|ERRORMESSAGE|FIELD-GROUPS|HELP-REQUEST|NO-EXTENSION|NO-TOPOFPAGE|REDEFINITION|DISPLAY-MODE|ENDINTERFACE|EXIT-COMMAND|FIELD-SYMBOL|NO-SCROLLING|SHORTDUMP-ID|ACCESSPOLICY|CLASS-EVENTS|COL_POSITIVE|DECLARATIONS|ENHANCEMENTS|FILTER-TABLE|SWITCHSTATES|SYNTAX-CHECK|TRANSPORTING|ASYNCHRONOUS|SYNTAX-TRACE|TOKENIZATION|USER-COMMAND|WITH-HEADING|ABAP-SOURCE|BREAK-POINT|CHAIN-INPUT|COMPRESSION|FIXED-POINT|NEW-SECTION|NON-UNICODE|OCCURRENCES|RESPONSIBLE|SYSTEM-CALL|TRACE-TABLE|ABBREVIATED|CHAR-TO-HEX|END-OF-FILE|ENDFUNCTION|ENVIRONMENT|ASSOCIATION|COL_HEADING|EDITOR-CALL|END-OF-PAGE|ENGINEERING|IMPLEMENTED|INTENSIFIED|RADIOBUTTON|SYSTEM-EXIT|TOP-OF-PAGE|TRANSACTION|APPLICATION|CONCATENATE|DESTINATION|ENHANCEMENT|IMMEDIATELY|NO-GROUPING|PRECOMPILED|REPLACEMENT|TITLE-LINES|ACTIVATION|BYTE-ORDER|CLASS-POOL|CONNECTION|CONVERSION|DEFINITION|DEPARTMENT|EXPIRATION|INHERITING|MESSAGE-ID|NO-HEADING|PERFORMING|QUEUE-ONLY|RIGHTSPACE|SCIENTIFIC|STATUSINFO|STRUCTURES|SYNCPOINTS|WITH-TITLE|ATTRIBUTES|BOUNDARIES|CLASS-DATA|COL_NORMAL|DD\/MM\/YYYY|DESCENDING|INTERFACES|LINE-COUNT|MM\/DD\/YYYY|NON-UNIQUE|PRESERVING|SELECTIONS|STATEMENTS|SUBROUTINE|TRUNCATION|TYPE-POOLS|ARITHMETIC|BACKGROUND|ENDPROVIDE|EXCEPTIONS|IDENTIFIER|INDEX-LINE|OBLIGATORY|PARAMETERS|PERCENTAGE|PUSHBUTTON|RESOLUTION|COMPONENTS|DEALLOCATE|DISCONNECT|DUPLICATES|FIRST-LINE|HEAD-LINES|NO-DISPLAY|OCCURRENCE|RESPECTING|RETURNCODE|SUBMATCHES|TRACE-FILE|ASCENDING|BYPASSING|ENDMODULE|EXCEPTION|EXCLUDING|EXPORTING|INCREMENT|MATCHCODE|PARAMETER|PARTIALLY|PREFERRED|REFERENCE|REPLACING|RETURNING|SELECTION|SEPARATED|SPECIFIED|STATEMENT|TIMESTAMP|TYPE-POOL|ACCEPTING|APPENDAGE|ASSIGNING|COL_GROUP|COMPARING|CONSTANTS|DANGEROUS|IMPORTING|INSTANCES|LEFTSPACE|LOG-POINT|QUICKINFO|READ-ONLY|SCROLLING|SQLSCRIPT|STEP-LOOP|TOP-LINES|TRANSLATE|APPENDING|AUTHORITY|CHARACTER|COMPONENT|CONDITION|DIRECTORY|DUPLICATE|MESSAGING|RECEIVING|SUBSCREEN|ACCORDING|COL_TOTAL|END-LINES|ENDMETHOD|ENDSELECT|EXPANDING|EXTENSION|INCLUDING|INFOTYPES|INTERFACE|INTERVALS|LINE-SIZE|PF-STATUS|PROCEDURE|PROTECTED|REQUESTED|RESUMABLE|RIGHTPLUS|SAP-SPOOL|SECONDARY|STRUCTURE|SUBSTRING|TABLEVIEW|NUMOFCHAR|ADJACENT|ANALYSIS|ASSIGNED|BACKWARD|CHANNELS|CHECKBOX|CONTINUE|CRITICAL|DATAINFO|DD\/MM\/YY|DURATION|ENCODING|ENDCLASS|FUNCTION|LEFTPLUS|LINEFEED|MM\/DD\/YY|OVERFLOW|RECEIVED|SKIPPING|SORTABLE|STANDARD|SUBTRACT|SUPPRESS|TABSTRIP|TITLEBAR|TRUNCATE|UNASSIGN|WHENEVER|ANALYZER|COALESCE|COMMENTS|CONDENSE|DECIMALS|DEFERRED|ENDWHILE|EXPLICIT|KEYWORDS|MESSAGES|POSITION|PRIORITY|RECEIVER|RENAMING|TIMEZONE|TRAILING|ALLOCATE|CENTERED|CIRCULAR|CONTROLS|CURRENCY|DELETING|DESCRIBE|DISTANCE|ENDCATCH|EXPONENT|EXTENDED|GENERATE|IGNORING|INCLUDES|INTERNAL|MAJOR-ID|MODIFIER|NEW-LINE|OPTIONAL|PROPERTY|ROLLBACK|STARTING|SUPPLIED|ABSTRACT|CHANGING|CONTEXTS|CREATING|CUSTOMER|DATABASE|DAYLIGHT|DEFINING|DISTINCT|DIVISION|ENABLING|ENDCHAIN|ESCAPING|HARMLESS|IMPLICIT|INACTIVE|LANGUAGE|MINOR-ID|MULTIPLY|NEW-PAGE|NO-TITLE|POS_HIGH|SEPARATE|TEXTPOOL|TRANSFER|SELECTOR|DBMAXLEN|ITERATOR|SELECTOR|ARCHIVE|BIT-XOR|BYTE-CO|COLLECT|COMMENT|CURRENT|DEFAULT|DISPLAY|ENDFORM|EXTRACT|LEADING|LISTBOX|LOCATOR|MEMBERS|METHODS|NESTING|POS_LOW|PROCESS|PROVIDE|RAISING|RESERVE|SECONDS|SUMMARY|VISIBLE|BETWEEN|BIT-AND|BYTE-CS|CLEANUP|COMPUTE|CONTROL|CONVERT|DATASET|ENDCASE|FORWARD|HEADERS|HOTSPOT|INCLUDE|INVERSE|KEEPING|NO-ZERO|OBJECTS|OVERLAY|PADDING|PATTERN|PROGRAM|REFRESH|SECTION|SUMMING|TESTING|VERSION|WINDOWS|WITHOUT|BIT-NOT|BYTE-CA|BYTE-NA|CASTING|CONTEXT|COUNTRY|DYNAMIC|ENABLED|ENDLOOP|EXECUTE|FRIENDS|HANDLER|HEADING|INITIAL|\*-INPUT|LOGFILE|MAXIMUM|MINIMUM|NO-GAPS|NO-SIGN|PRAGMAS|PRIMARY|PRIVATE|REDUCED|REPLACE|REQUEST|RESULTS|UNICODE|WARNING|ALIASES|BYTE-CN|BYTE-NS|CALLING|COL_KEY|COLUMNS|CONNECT|ENDEXEC|ENTRIES|EXCLUDE|FILTERS|FURTHER|HELP-ID|LOGICAL|MAPPING|MESSAGE|NAMETAB|OPTIONS|PACKAGE|PERFORM|RECEIVE|STATICS|VARYING|BINDING|CHARLEN|GREATER|XSTRLEN|ACCEPT|APPEND|DETAIL|ELSEIF|ENDING|ENDTRY|FORMAT|FRAMES|GIVING|HASHED|HEADER|IMPORT|INSERT|MARGIN|MODULE|NATIVE|OBJECT|OFFSET|REMOTE|RESUME|SAVING|SIMPLE|SUBMIT|TABBED|TOKENS|UNIQUE|UNPACK|UPDATE|WINDOW|YELLOW|ACTUAL|ASPECT|CENTER|CURSOR|DELETE|DIALOG|DIVIDE|DURING|ERRORS|EVENTS|EXTEND|FILTER|HANDLE|HAVING|IGNORE|LITTLE|MEMORY|NO-GAP|OCCURS|OPTION|PERSON|PLACES|PUBLIC|REDUCE|REPORT|RESULT|SINGLE|SORTED|SWITCH|SYNTAX|TARGET|VALUES|WRITER|ASSERT|BLOCKS|BOUNDS|BUFFER|CHANGE|COLUMN|COMMIT|CONCAT|COPIES|CREATE|DDMMYY|DEFINE|ENDIAN|ESCAPE|EXPAND|KERNEL|LAYOUT|LEGACY|LEVELS|MMDDYY|NUMBER|OUTPUT|RANGES|READER|RETURN|SCREEN|SEARCH|SELECT|SHARED|SOURCE|STABLE|STATIC|SUBKEY|SUFFIX|TABLES|UNWIND|YYMMDD|ASSIGN|BACKUP|BEFORE|BINARY|BIT-OR|BLANKS|CLIENT|CODING|COMMON|DEMAND|DYNPRO|EXCEPT|EXISTS|EXPORT|FIELDS|GLOBAL|GROUPS|LENGTH|LOCALE|MEDIUM|METHOD|MODIFY|NESTED|OTHERS|REJECT|SCROLL|SUPPLY|SYMBOL|ENDFOR|STRLEN|ALIGN|BEGIN|BOUND|ENDAT|ENTRY|EVENT|FINAL|FLUSH|GRANT|INNER|SHORT|USING|WRITE|AFTER|BLACK|BLOCK|CLOCK|COLOR|COUNT|DUMMY|EMPTY|ENDDO|ENDON|GREEN|INDEX|INOUT|LEAVE|LEVEL|LINES|MODIF|ORDER|OUTER|RANGE|RESET|RETRY|RIGHT|SMART|SPLIT|STYLE|TABLE|THROW|UNDER|UNTIL|UPPER|UTF-8|WHERE|ALIAS|BLANK|CLEAR|CLOSE|EXACT|FETCH|FIRST|FOUND|GROUP|LLANG|LOCAL|OTHER|REGEX|SPOOL|TITLE|TYPES|VALID|WHILE|ALPHA|BOXED|CATCH|CHAIN|CHECK|CLASS|COVER|ENDIF|EQUIV|FIELD|FLOOR|FRAME|INPUT|LOWER|MATCH|NODES|PAGES|PRINT|RAISE|ROUND|SHIFT|SPACE|SPOTS|STAMP|STATE|TASKS|TIMES|TRMAC|ULINE|UNION|VALUE|WIDTH|EQUAL|LOG10|TRUNC|BLOB|CASE|CEIL|CLOB|COND|EXIT|FILE|GAPS|HOLD|INCL|INTO|KEEP|KEYS|LAST|LINE|LONG|LPAD|MAIL|MODE|OPEN|PINK|READ|ROWS|TEST|THEN|ZERO|AREA|BACK|BADI|BYTE|CAST|EDIT|EXEC|FAIL|FIND|FKEQ|FONT|FREE|GKEQ|HIDE|INIT|ITNO|LATE|LOOP|MAIN|MARK|MOVE|NEXT|NULL|RISK|ROLE|UNIT|WAIT|ZONE|BASE|CALL|CODE|DATA|DATE|FKGE|GKGE|HIGH|KIND|LEFT|LIST|MASK|MESH|NAME|NODE|PACK|PAGE|POOL|SEND|SIGN|SIZE|SOME|STOP|TASK|TEXT|TIME|USER|VARY|WITH|WORD|BLUE|CONV|COPY|DEEP|ELSE|FORM|FROM|HINT|ICON|JOIN|LIKE|LOAD|ONLY|PART|SCAN|SKIP|SORT|TYPE|UNIX|VIEW|WHEN|WORK|ACOS|ASIN|ATAN|COSH|EACH|FRAC|LESS|RTTI|SINH|SQRT|TANH|AVG|BIT|DIV|ISO|LET|OUT|PAD|SQL|ALL|CI_|CPI|END|LOB|LPI|MAX|MIN|NEW|OLE|RUN|SET|\?TO|YES|ABS|ADD|AND|BIG|FOR|HDB|JOB|LOW|NOT|SAP|TRY|VIA|XML|ANY|GET|IDS|KEY|MOD|OFF|PUT|RAW|RED|REF|SUM|TAB|XSD|CNT|COS|EXP|LOG|SIN|TAN|XOR|AT|CO|CP|DO|GT|ID|IF|NS|OR|BT|CA|CS|GE|NA|NB|EQ|IN|LT|NE|NO|OF|ON|PF|TO|AS|BY|CN|IS|LE|NP|UP|E|I|M|O|Z|C|X)\b/i,
        lookbehind: true
      },
      /* Numbers can be only integers. Decimal or Hex appear only as strings */
      number: /\b\d+\b/,
      /* Operators must always be surrounded by whitespace, they cannot be put
      adjacent to operands.
      */
      operator: {
        pattern: /(\s)(?:\*\*?|<[=>]?|>=?|\?=|[-+\/=])(?=\s)/,
        lookbehind: true
      },
      'string-operator': {
        pattern: /(\s)&&?(?=\s)/,
        lookbehind: true,
        /* The official editor highlights */
        alias: 'keyword'
      },
      'token-operator': [{
        /* Special operators used to access structure components, class methods/attributes, etc. */
        pattern: /(\w)(?:->?|=>|[~|{}])(?=\w)/,
        lookbehind: true,
        alias: 'punctuation'
      }, {
        /* Special tokens used do delimit string templates */
        pattern: /[|{}]/,
        alias: 'punctuation'
      }],
      punctuation: /[,.:()]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/actionscript.js":
/*!********************************************************!*\
  !*** ./node_modules/reprism/languages/actionscript.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'actionscript',
  init: function init(Prism) {
    Prism.languages.actionscript = Prism.languages.extend('javascript', {
      keyword: /\b(?:as|break|case|catch|class|const|default|delete|do|else|extends|finally|for|function|if|implements|import|in|instanceof|interface|internal|is|native|new|null|package|private|protected|public|return|super|switch|this|throw|try|typeof|use|var|void|while|with|dynamic|each|final|get|include|namespace|native|override|set|static)\b/,
      operator: /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/
    });
    Prism.languages.actionscript['class-name'].alias = 'function';

    if (Prism.languages.markup) {
      Prism.languages.insertBefore('actionscript', 'string', {
        xml: {
          pattern: /(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\[\s\S]|(?!\2)[^\\])*\2)*\s*\/?>/,
          lookbehind: true,
          inside: {
            rest: Prism.languages.markup
          }
        }
      });
    }
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/ada.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/ada.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'ada',
  init: function init(Prism) {
    Prism.languages.ada = {
      comment: /--.*/,
      string: /"(?:""|[^"\r\f\n])*"/i,
      number: [{
        pattern: /\b\d(?:_?\d)*#[\dA-F](?:_?[\dA-F])*(?:\.[\dA-F](?:_?[\dA-F])*)?#(?:E[+-]?\d(?:_?\d)*)?/i
      }, {
        pattern: /\b\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:E[+-]?\d(?:_?\d)*)?\b/i
      }],
      'attr-name': /\b'\w+/i,
      keyword: /\b(?:abort|abs|abstract|accept|access|aliased|all|and|array|at|begin|body|case|constant|declare|delay|delta|digits|do|else|new|return|elsif|end|entry|exception|exit|for|function|generic|goto|if|in|interface|is|limited|loop|mod|not|null|of|others|out|overriding|package|pragma|private|procedure|protected|raise|range|record|rem|renames|requeue|reverse|select|separate|some|subtype|synchronized|tagged|task|terminate|then|type|until|use|when|while|with|xor)\b/i,
      boolean: /\b(?:true|false)\b/i,
      operator: /<[=>]?|>=?|=>?|:=|\/=?|\*\*?|[&+-]/,
      punctuation: /\.\.?|[,;():]/,
      char: /'.'/,
      variable: /\b[a-z](?:[_a-z\d])*\b/i
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/apacheconf.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/apacheconf.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'apacheconf',
  init: function init(Prism) {
    Prism.languages.apacheconf = {
      comment: /#.*/,
      'directive-inline': {
        pattern: /^(\s*)\b(?:AcceptFilter|AcceptPathInfo|AccessFileName|Action|AddAlt|AddAltByEncoding|AddAltByType|AddCharset|AddDefaultCharset|AddDescription|AddEncoding|AddHandler|AddIcon|AddIconByEncoding|AddIconByType|AddInputFilter|AddLanguage|AddModuleInfo|AddOutputFilter|AddOutputFilterByType|AddType|Alias|AliasMatch|Allow|AllowCONNECT|AllowEncodedSlashes|AllowMethods|AllowOverride|AllowOverrideList|Anonymous|Anonymous_LogEmail|Anonymous_MustGiveEmail|Anonymous_NoUserID|Anonymous_VerifyEmail|AsyncRequestWorkerFactor|AuthBasicAuthoritative|AuthBasicFake|AuthBasicProvider|AuthBasicUseDigestAlgorithm|AuthDBDUserPWQuery|AuthDBDUserRealmQuery|AuthDBMGroupFile|AuthDBMType|AuthDBMUserFile|AuthDigestAlgorithm|AuthDigestDomain|AuthDigestNonceLifetime|AuthDigestProvider|AuthDigestQop|AuthDigestShmemSize|AuthFormAuthoritative|AuthFormBody|AuthFormDisableNoStore|AuthFormFakeBasicAuth|AuthFormLocation|AuthFormLoginRequiredLocation|AuthFormLoginSuccessLocation|AuthFormLogoutLocation|AuthFormMethod|AuthFormMimetype|AuthFormPassword|AuthFormProvider|AuthFormSitePassphrase|AuthFormSize|AuthFormUsername|AuthGroupFile|AuthLDAPAuthorizePrefix|AuthLDAPBindAuthoritative|AuthLDAPBindDN|AuthLDAPBindPassword|AuthLDAPCharsetConfig|AuthLDAPCompareAsUser|AuthLDAPCompareDNOnServer|AuthLDAPDereferenceAliases|AuthLDAPGroupAttribute|AuthLDAPGroupAttributeIsDN|AuthLDAPInitialBindAsUser|AuthLDAPInitialBindPattern|AuthLDAPMaxSubGroupDepth|AuthLDAPRemoteUserAttribute|AuthLDAPRemoteUserIsDN|AuthLDAPSearchAsUser|AuthLDAPSubGroupAttribute|AuthLDAPSubGroupClass|AuthLDAPUrl|AuthMerging|AuthName|AuthnCacheContext|AuthnCacheEnable|AuthnCacheProvideFor|AuthnCacheSOCache|AuthnCacheTimeout|AuthnzFcgiCheckAuthnProvider|AuthnzFcgiDefineProvider|AuthType|AuthUserFile|AuthzDBDLoginToReferer|AuthzDBDQuery|AuthzDBDRedirectQuery|AuthzDBMType|AuthzSendForbiddenOnFailure|BalancerGrowth|BalancerInherit|BalancerMember|BalancerPersist|BrowserMatch|BrowserMatchNoCase|BufferedLogs|BufferSize|CacheDefaultExpire|CacheDetailHeader|CacheDirLength|CacheDirLevels|CacheDisable|CacheEnable|CacheFile|CacheHeader|CacheIgnoreCacheControl|CacheIgnoreHeaders|CacheIgnoreNoLastMod|CacheIgnoreQueryString|CacheIgnoreURLSessionIdentifiers|CacheKeyBaseURL|CacheLastModifiedFactor|CacheLock|CacheLockMaxAge|CacheLockPath|CacheMaxExpire|CacheMaxFileSize|CacheMinExpire|CacheMinFileSize|CacheNegotiatedDocs|CacheQuickHandler|CacheReadSize|CacheReadTime|CacheRoot|CacheSocache|CacheSocacheMaxSize|CacheSocacheMaxTime|CacheSocacheMinTime|CacheSocacheReadSize|CacheSocacheReadTime|CacheStaleOnError|CacheStoreExpired|CacheStoreNoStore|CacheStorePrivate|CGIDScriptTimeout|CGIMapExtension|CharsetDefault|CharsetOptions|CharsetSourceEnc|CheckCaseOnly|CheckSpelling|ChrootDir|ContentDigest|CookieDomain|CookieExpires|CookieName|CookieStyle|CookieTracking|CoreDumpDirectory|CustomLog|Dav|DavDepthInfinity|DavGenericLockDB|DavLockDB|DavMinTimeout|DBDExptime|DBDInitSQL|DBDKeep|DBDMax|DBDMin|DBDParams|DBDPersist|DBDPrepareSQL|DBDriver|DefaultIcon|DefaultLanguage|DefaultRuntimeDir|DefaultType|Define|DeflateBufferSize|DeflateCompressionLevel|DeflateFilterNote|DeflateInflateLimitRequestBody|DeflateInflateRatioBurst|DeflateInflateRatioLimit|DeflateMemLevel|DeflateWindowSize|Deny|DirectoryCheckHandler|DirectoryIndex|DirectoryIndexRedirect|DirectorySlash|DocumentRoot|DTracePrivileges|DumpIOInput|DumpIOOutput|EnableExceptionHook|EnableMMAP|EnableSendfile|Error|ErrorDocument|ErrorLog|ErrorLogFormat|Example|ExpiresActive|ExpiresByType|ExpiresDefault|ExtendedStatus|ExtFilterDefine|ExtFilterOptions|FallbackResource|FileETag|FilterChain|FilterDeclare|FilterProtocol|FilterProvider|FilterTrace|ForceLanguagePriority|ForceType|ForensicLog|GprofDir|GracefulShutdownTimeout|Group|Header|HeaderName|HeartbeatAddress|HeartbeatListen|HeartbeatMaxServers|HeartbeatStorage|HeartbeatStorage|HostnameLookups|IdentityCheck|IdentityCheckTimeout|ImapBase|ImapDefault|ImapMenu|Include|IncludeOptional|IndexHeadInsert|IndexIgnore|IndexIgnoreReset|IndexOptions|IndexOrderDefault|IndexStyleSheet|InputSed|ISAPIAppendLogToErrors|ISAPIAppendLogToQuery|ISAPICacheFile|ISAPIFakeAsync|ISAPILogNotSupported|ISAPIReadAheadBuffer|KeepAlive|KeepAliveTimeout|KeptBodySize|LanguagePriority|LDAPCacheEntries|LDAPCacheTTL|LDAPConnectionPoolTTL|LDAPConnectionTimeout|LDAPLibraryDebug|LDAPOpCacheEntries|LDAPOpCacheTTL|LDAPReferralHopLimit|LDAPReferrals|LDAPRetries|LDAPRetryDelay|LDAPSharedCacheFile|LDAPSharedCacheSize|LDAPTimeout|LDAPTrustedClientCert|LDAPTrustedGlobalCert|LDAPTrustedMode|LDAPVerifyServerCert|LimitInternalRecursion|LimitRequestBody|LimitRequestFields|LimitRequestFieldSize|LimitRequestLine|LimitXMLRequestBody|Listen|ListenBackLog|LoadFile|LoadModule|LogFormat|LogLevel|LogMessage|LuaAuthzProvider|LuaCodeCache|LuaHookAccessChecker|LuaHookAuthChecker|LuaHookCheckUserID|LuaHookFixups|LuaHookInsertFilter|LuaHookLog|LuaHookMapToStorage|LuaHookTranslateName|LuaHookTypeChecker|LuaInherit|LuaInputFilter|LuaMapHandler|LuaOutputFilter|LuaPackageCPath|LuaPackagePath|LuaQuickHandler|LuaRoot|LuaScope|MaxConnectionsPerChild|MaxKeepAliveRequests|MaxMemFree|MaxRangeOverlaps|MaxRangeReversals|MaxRanges|MaxRequestWorkers|MaxSpareServers|MaxSpareThreads|MaxThreads|MergeTrailers|MetaDir|MetaFiles|MetaSuffix|MimeMagicFile|MinSpareServers|MinSpareThreads|MMapFile|ModemStandard|ModMimeUsePathInfo|MultiviewsMatch|Mutex|NameVirtualHost|NoProxy|NWSSLTrustedCerts|NWSSLUpgradeable|Options|Order|OutputSed|PassEnv|PidFile|PrivilegesMode|Protocol|ProtocolEcho|ProxyAddHeaders|ProxyBadHeader|ProxyBlock|ProxyDomain|ProxyErrorOverride|ProxyExpressDBMFile|ProxyExpressDBMType|ProxyExpressEnable|ProxyFtpDirCharset|ProxyFtpEscapeWildcards|ProxyFtpListOnWildcard|ProxyHTMLBufSize|ProxyHTMLCharsetOut|ProxyHTMLDocType|ProxyHTMLEnable|ProxyHTMLEvents|ProxyHTMLExtended|ProxyHTMLFixups|ProxyHTMLInterp|ProxyHTMLLinks|ProxyHTMLMeta|ProxyHTMLStripComments|ProxyHTMLURLMap|ProxyIOBufferSize|ProxyMaxForwards|ProxyPass|ProxyPassInherit|ProxyPassInterpolateEnv|ProxyPassMatch|ProxyPassReverse|ProxyPassReverseCookieDomain|ProxyPassReverseCookiePath|ProxyPreserveHost|ProxyReceiveBufferSize|ProxyRemote|ProxyRemoteMatch|ProxyRequests|ProxySCGIInternalRedirect|ProxySCGISendfile|ProxySet|ProxySourceAddress|ProxyStatus|ProxyTimeout|ProxyVia|ReadmeName|ReceiveBufferSize|Redirect|RedirectMatch|RedirectPermanent|RedirectTemp|ReflectorHeader|RemoteIPHeader|RemoteIPInternalProxy|RemoteIPInternalProxyList|RemoteIPProxiesHeader|RemoteIPTrustedProxy|RemoteIPTrustedProxyList|RemoveCharset|RemoveEncoding|RemoveHandler|RemoveInputFilter|RemoveLanguage|RemoveOutputFilter|RemoveType|RequestHeader|RequestReadTimeout|Require|RewriteBase|RewriteCond|RewriteEngine|RewriteMap|RewriteOptions|RewriteRule|RLimitCPU|RLimitMEM|RLimitNPROC|Satisfy|ScoreBoardFile|Script|ScriptAlias|ScriptAliasMatch|ScriptInterpreterSource|ScriptLog|ScriptLogBuffer|ScriptLogLength|ScriptSock|SecureListen|SeeRequestTail|SendBufferSize|ServerAdmin|ServerAlias|ServerLimit|ServerName|ServerPath|ServerRoot|ServerSignature|ServerTokens|Session|SessionCookieName|SessionCookieName2|SessionCookieRemove|SessionCryptoCipher|SessionCryptoDriver|SessionCryptoPassphrase|SessionCryptoPassphraseFile|SessionDBDCookieName|SessionDBDCookieName2|SessionDBDCookieRemove|SessionDBDDeleteLabel|SessionDBDInsertLabel|SessionDBDPerUser|SessionDBDSelectLabel|SessionDBDUpdateLabel|SessionEnv|SessionExclude|SessionHeader|SessionInclude|SessionMaxAge|SetEnv|SetEnvIf|SetEnvIfExpr|SetEnvIfNoCase|SetHandler|SetInputFilter|SetOutputFilter|SSIEndTag|SSIErrorMsg|SSIETag|SSILastModified|SSILegacyExprParser|SSIStartTag|SSITimeFormat|SSIUndefinedEcho|SSLCACertificateFile|SSLCACertificatePath|SSLCADNRequestFile|SSLCADNRequestPath|SSLCARevocationCheck|SSLCARevocationFile|SSLCARevocationPath|SSLCertificateChainFile|SSLCertificateFile|SSLCertificateKeyFile|SSLCipherSuite|SSLCompression|SSLCryptoDevice|SSLEngine|SSLFIPS|SSLHonorCipherOrder|SSLInsecureRenegotiation|SSLOCSPDefaultResponder|SSLOCSPEnable|SSLOCSPOverrideResponder|SSLOCSPResponderTimeout|SSLOCSPResponseMaxAge|SSLOCSPResponseTimeSkew|SSLOCSPUseRequestNonce|SSLOpenSSLConfCmd|SSLOptions|SSLPassPhraseDialog|SSLProtocol|SSLProxyCACertificateFile|SSLProxyCACertificatePath|SSLProxyCARevocationCheck|SSLProxyCARevocationFile|SSLProxyCARevocationPath|SSLProxyCheckPeerCN|SSLProxyCheckPeerExpire|SSLProxyCheckPeerName|SSLProxyCipherSuite|SSLProxyEngine|SSLProxyMachineCertificateChainFile|SSLProxyMachineCertificateFile|SSLProxyMachineCertificatePath|SSLProxyProtocol|SSLProxyVerify|SSLProxyVerifyDepth|SSLRandomSeed|SSLRenegBufferSize|SSLRequire|SSLRequireSSL|SSLSessionCache|SSLSessionCacheTimeout|SSLSessionTicketKeyFile|SSLSRPUnknownUserSeed|SSLSRPVerifierFile|SSLStaplingCache|SSLStaplingErrorCacheTimeout|SSLStaplingFakeTryLater|SSLStaplingForceURL|SSLStaplingResponderTimeout|SSLStaplingResponseMaxAge|SSLStaplingResponseTimeSkew|SSLStaplingReturnResponderErrors|SSLStaplingStandardCacheTimeout|SSLStrictSNIVHostCheck|SSLUserName|SSLUseStapling|SSLVerifyClient|SSLVerifyDepth|StartServers|StartThreads|Substitute|Suexec|SuexecUserGroup|ThreadLimit|ThreadsPerChild|ThreadStackSize|TimeOut|TraceEnable|TransferLog|TypesConfig|UnDefine|UndefMacro|UnsetEnv|Use|UseCanonicalName|UseCanonicalPhysicalPort|User|UserDir|VHostCGIMode|VHostCGIPrivs|VHostGroup|VHostPrivs|VHostSecure|VHostUser|VirtualDocumentRoot|VirtualDocumentRootIP|VirtualScriptAlias|VirtualScriptAliasIP|WatchdogInterval|XBitHack|xml2EncAlias|xml2EncDefault|xml2StartParse)\b/im,
        lookbehind: true,
        alias: 'property'
      },
      'directive-block': {
        pattern: /<\/?\b(?:AuthnProviderAlias|AuthzProviderAlias|Directory|DirectoryMatch|Else|ElseIf|Files|FilesMatch|If|IfDefine|IfModule|IfVersion|Limit|LimitExcept|Location|LocationMatch|Macro|Proxy|RequireAll|RequireAny|RequireNone|VirtualHost)\b *.*>/i,
        inside: {
          'directive-block': {
            pattern: /^<\/?\w+/,
            inside: {
              punctuation: /^<\/?/
            },
            alias: 'tag'
          },
          'directive-block-parameter': {
            pattern: /.*[^>]/,
            inside: {
              punctuation: /:/,
              string: {
                pattern: /("|').*\1/,
                inside: {
                  variable: /[$%]\{?(?:\w\.?[-+:]?)+\}?/
                }
              }
            },
            alias: 'attr-value'
          },
          punctuation: />/
        },
        alias: 'tag'
      },
      'directive-flags': {
        pattern: /\[(?:\w,?)+\]/,
        alias: 'keyword'
      },
      string: {
        pattern: /("|').*\1/,
        inside: {
          variable: /[$%]\{?(?:\w\.?[-+:]?)+\}?/
        }
      },
      variable: /[$%]\{?(?:\w\.?[-+:]?)+\}?/,
      regex: /\^?.*\$|\^.*\$?/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/apl.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/apl.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'apl',
  init: function init(Prism) {
    Prism.languages.apl = {
      comment: /(?:⍝|#[! ]).*$/m,
      string: {
        pattern: /'(?:[^'\r\n]|'')*'/,
        greedy: true
      },
      number: /¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞)(?:j¯?(?:\d*\.?\d+(?:e[+¯]?\d+)?|¯|∞))?/i,
      statement: /:[A-Z][a-z][A-Za-z]*\b/,
      'system-function': {
        pattern: /⎕[A-Z]+/i,
        alias: 'function'
      },
      constant: /[⍬⌾#⎕⍞]/,
      function: /[-+×÷⌈⌊∣|⍳⍸?*⍟○!⌹<≤=>≥≠≡≢∊⍷∪∩~∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⊆⊇⌷⍋⍒⊤⊥⍕⍎⊣⊢⍁⍂≈⍯↗¤→]/,
      'monadic-operator': {
        pattern: /[\\\/⌿⍀¨⍨⌶&∥]/,
        alias: 'operator'
      },
      'dyadic-operator': {
        pattern: /[.⍣⍠⍤∘⌸@⌺]/,
        alias: 'operator'
      },
      assignment: {
        pattern: /←/,
        alias: 'keyword'
      },
      punctuation: /[\[;\]()◇⋄]/,
      dfn: {
        pattern: /[{}⍺⍵⍶⍹∇⍫:]/,
        alias: 'builtin'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/applescript.js":
/*!*******************************************************!*\
  !*** ./node_modules/reprism/languages/applescript.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'applescript',
  init: function init(Prism) {
    Prism.languages.applescript = {
      comment: [
      // Allow one level of nesting
      /\(\*(?:\(\*[\s\S]*?\*\)|[\s\S])*?\*\)/, /--.+/, /#.+/],
      string: /"(?:\\.|[^"\\\r\n])*"/,
      number: /(?:\b\d+\.?\d*|\B\.\d+)(?:e-?\d+)?\b/i,
      operator: [/[&=≠≤≥*+\-\/÷^]|[<>]=?/, /\b(?:(?:start|begin|end)s? with|(?:(?:does not|doesn't) contain|contains?)|(?:is|isn't|is not) (?:in|contained by)|(?:(?:is|isn't|is not) )?(?:greater|less) than(?: or equal)?(?: to)?|(?:(?:does not|doesn't) come|comes) (?:before|after)|(?:is|isn't|is not) equal(?: to)?|(?:(?:does not|doesn't) equal|equals|equal to|isn't|is not)|(?:a )?(?:ref(?: to)?|reference to)|(?:and|or|div|mod|as|not))\b/],
      keyword: /\b(?:about|above|after|against|apart from|around|aside from|at|back|before|beginning|behind|below|beneath|beside|between|but|by|considering|continue|copy|does|eighth|else|end|equal|error|every|exit|false|fifth|first|for|fourth|from|front|get|given|global|if|ignoring|in|instead of|into|is|it|its|last|local|me|middle|my|ninth|of|on|onto|out of|over|prop|property|put|repeat|return|returning|second|set|seventh|since|sixth|some|tell|tenth|that|the|then|third|through|thru|timeout|times|to|transaction|true|try|until|where|while|whose|with|without)\b/,
      class: {
        pattern: /\b(?:alias|application|boolean|class|constant|date|file|integer|list|number|POSIX file|real|record|reference|RGB color|script|text|centimetres|centimeters|feet|inches|kilometres|kilometers|metres|meters|miles|yards|square feet|square kilometres|square kilometers|square metres|square meters|square miles|square yards|cubic centimetres|cubic centimeters|cubic feet|cubic inches|cubic metres|cubic meters|cubic yards|gallons|litres|liters|quarts|grams|kilograms|ounces|pounds|degrees Celsius|degrees Fahrenheit|degrees Kelvin)\b/,
        alias: 'builtin'
      },
      punctuation: /[{}():,¬«»《》]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/arff.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/arff.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'arff',
  init: function init(Prism) {
    Prism.languages.arff = {
      comment: /%.*/,
      string: {
        pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      keyword: /@(?:attribute|data|end|relation)\b/i,
      number: /\b\d+(?:\.\d+)?\b/,
      punctuation: /[{},]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/asciidoc.js":
/*!****************************************************!*\
  !*** ./node_modules/reprism/languages/asciidoc.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'asciidoc',
  init: function init(Prism) {
    (function (Prism) {
      var attributes = {
        pattern: /(^[ \t]*)\[(?!\[)(?:(["'$`])(?:(?!\2)[^\\]|\\.)*\2|\[(?:[^\]\\]|\\.)*\]|[^\]\\]|\\.)*\]/m,
        lookbehind: true,
        inside: {
          quoted: {
            pattern: /([$`])(?:(?!\1)[^\\]|\\.)*\1/,
            inside: {
              punctuation: /^[$`]|[$`]$/
            }
          },
          interpreted: {
            pattern: /'(?:[^'\\]|\\.)*'/,
            inside: {
              punctuation: /^'|'$/
              // See rest below
            }
          },
          string: /"(?:[^"\\]|\\.)*"/,
          variable: /\w+(?==)/,
          punctuation: /^\[|\]$|,/,
          operator: /=/,
          // The negative look-ahead prevents blank matches
          'attr-value': /(?!^\s+$).+/
        }
      };
      Prism.languages.asciidoc = {
        'comment-block': {
          pattern: /^(\/{4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1/m,
          alias: 'comment'
        },
        table: {
          pattern: /^\|={3,}(?:(?:\r?\n|\r).*)*?(?:\r?\n|\r)\|={3,}$/m,
          inside: {
            specifiers: {
              pattern: /(?!\|)(?:(?:(?:\d+(?:\.\d+)?|\.\d+)[+*])?(?:[<^>](?:\.[<^>])?|\.[<^>])?[a-z]*)(?=\|)/,
              alias: 'attr-value'
            },
            punctuation: {
              pattern: /(^|[^\\])[|!]=*/,
              lookbehind: true
            }
            // See rest below
          }
        },

        'passthrough-block': {
          pattern: /^(\+{4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1$/m,
          inside: {
            punctuation: /^\++|\++$/
            // See rest below
          }
        },
        // Literal blocks and listing blocks
        'literal-block': {
          pattern: /^(-{4,}|\.{4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1$/m,
          inside: {
            punctuation: /^(?:-+|\.+)|(?:-+|\.+)$/
            // See rest below
          }
        },
        // Sidebar blocks, quote blocks, example blocks and open blocks
        'other-block': {
          pattern: /^(--|\*{4,}|_{4,}|={4,})(?:\r?\n|\r)(?:[\s\S]*(?:\r?\n|\r))??\1$/m,
          inside: {
            punctuation: /^(?:-+|\*+|_+|=+)|(?:-+|\*+|_+|=+)$/
            // See rest below
          }
        },

        // list-punctuation and list-label must appear before indented-block
        'list-punctuation': {
          pattern: /(^[ \t]*)(?:-|\*{1,5}|\.{1,5}|(?:[a-z]|\d+)\.|[xvi]+\))(?= )/im,
          lookbehind: true,
          alias: 'punctuation'
        },
        'list-label': {
          pattern: /(^[ \t]*)[a-z\d].+(?::{2,4}|;;)(?=\s)/im,
          lookbehind: true,
          alias: 'symbol'
        },
        'indented-block': {
          pattern: /((\r?\n|\r)\2)([ \t]+)\S.*(?:(?:\r?\n|\r)\3.+)*(?=\2{2}|$)/,
          lookbehind: true
        },

        comment: /^\/\/.*/m,
        title: {
          pattern: /^.+(?:\r?\n|\r)(?:={3,}|-{3,}|~{3,}|\^{3,}|\+{3,})$|^={1,5} +.+|^\.(?![\s.]).*/m,
          alias: 'important',
          inside: {
            punctuation: /^(?:\.|=+)|(?:=+|-+|~+|\^+|\++)$/
            // See rest below
          }
        },
        'attribute-entry': {
          pattern: /^:[^:\r\n]+:(?: .*?(?: \+(?:\r?\n|\r).*?)*)?$/m,
          alias: 'tag'
        },
        attributes: attributes,
        hr: {
          pattern: /^'{3,}$/m,
          alias: 'punctuation'
        },
        'page-break': {
          pattern: /^<{3,}$/m,
          alias: 'punctuation'
        },
        admonition: {
          pattern: /^(?:TIP|NOTE|IMPORTANT|WARNING|CAUTION):/m,
          alias: 'keyword'
        },
        callout: [{
          pattern: /(^[ \t]*)<?\d*>/m,
          lookbehind: true,
          alias: 'symbol'
        }, {
          pattern: /<\d+>/,
          alias: 'symbol'
        }],
        macro: {
          pattern: /\b[a-z\d][a-z\d-]*::?(?:(?:\S+)??\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
          inside: {
            function: /^[a-z\d-]+(?=:)/,
            punctuation: /^::?/,
            attributes: {
              pattern: /(?:\[(?:[^\]\\"]|(["'])(?:(?!\1)[^\\]|\\.)*\1|\\.)*\])/,
              inside: attributes.inside
            }
          }
        },
        inline: {
          /*
          The initial look-behind prevents the highlighting of escaped quoted text.
          Quoted text can be multi-line but cannot span an empty line.
          All quoted text can have attributes before [foobar, 'foobar', baz="bar"].
          First, we handle the constrained quotes.
          Those must be bounded by non-word chars and cannot have spaces between the delimiter and the first char.
          They are, in order: _emphasis_, ``double quotes'', `single quotes', `monospace`, 'emphasis', *strong*, +monospace+ and #unquoted#
          Then we handle the unconstrained quotes.
          Those do not have the restrictions of the constrained quotes.
          They are, in order: __emphasis__, **strong**, ++monospace++, +++passthrough+++, ##unquoted##, $$passthrough$$, ~subscript~, ^superscript^, {attribute-reference}, [[anchor]], [[[bibliography anchor]]], <<xref>>, (((indexes))) and ((indexes))
          */
          pattern: /(^|[^\\])(?:(?:\B\[(?:[^\]\\"]|(["'])(?:(?!\2)[^\\]|\\.)*\2|\\.)*\])?(?:\b_(?!\s)(?: _|[^_\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: _|[^_\\\r\n]|\\.)+)*_\b|\B``(?!\s).+?(?:(?:\r?\n|\r).+?)*''\B|\B`(?!\s)(?: ['`]|.)+?(?:(?:\r?\n|\r)(?: ['`]|.)+?)*['`]\B|\B(['*+#])(?!\s)(?: \3|(?!\3)[^\\\r\n]|\\.)+(?:(?:\r?\n|\r)(?: \3|(?!\3)[^\\\r\n]|\\.)+)*\3\B)|(?:\[(?:[^\]\\"]|(["'])(?:(?!\4)[^\\]|\\.)*\4|\\.)*\])?(?:(__|\*\*|\+\+\+?|##|\$\$|[~^]).+?(?:(?:\r?\n|\r).+?)*\5|\{[^}\r\n]+\}|\[\[\[?.+?(?:(?:\r?\n|\r).+?)*\]?\]\]|<<.+?(?:(?:\r?\n|\r).+?)*>>|\(\(\(?.+?(?:(?:\r?\n|\r).+?)*\)?\)\)))/m,
          lookbehind: true,
          inside: {
            attributes: attributes,
            url: {
              pattern: /^(?:\[\[\[?.+?\]?\]\]|<<.+?>>)$/,
              inside: {
                punctuation: /^(?:\[\[\[?|<<)|(?:\]\]\]?|>>)$/
              }
            },
            'attribute-ref': {
              pattern: /^\{.+\}$/,
              inside: {
                variable: {
                  pattern: /(^\{)[a-z\d,+_-]+/,
                  lookbehind: true
                },
                operator: /^[=?!#%@$]|!(?=[:}])/,
                punctuation: /^\{|\}$|::?/
              }
            },
            italic: {
              pattern: /^(['_])[\s\S]+\1$/,
              inside: {
                punctuation: /^(?:''?|__?)|(?:''?|__?)$/
              }
            },
            bold: {
              pattern: /^\*[\s\S]+\*$/,
              inside: {
                punctuation: /^\*\*?|\*\*?$/
              }
            },
            punctuation: /^(?:``?|\+{1,3}|##?|\$\$|[~^]|\(\(\(?)|(?:''?|\+{1,3}|##?|\$\$|[~^`]|\)?\)\))$/
          }
        },
        replacement: {
          pattern: /\((?:C|TM|R)\)/,
          alias: 'builtin'
        },
        entity: /&#?[\da-z]{1,8};/i,
        'line-continuation': {
          pattern: /(^| )\+$/m,
          lookbehind: true,
          alias: 'punctuation'
        }

        // Allow some nesting. There is no recursion though, so cloning should not be needed.

      };attributes.inside.interpreted.inside.rest = {
        macro: Prism.languages.asciidoc.macro,
        inline: Prism.languages.asciidoc.inline,
        replacement: Prism.languages.asciidoc.replacement,
        entity: Prism.languages.asciidoc.entity
      };

      Prism.languages.asciidoc['passthrough-block'].inside.rest = {
        macro: Prism.languages.asciidoc.macro
      };

      Prism.languages.asciidoc['literal-block'].inside.rest = {
        callout: Prism.languages.asciidoc.callout
      };

      Prism.languages.asciidoc.table.inside.rest = {
        'comment-block': Prism.languages.asciidoc['comment-block'],
        'passthrough-block': Prism.languages.asciidoc['passthrough-block'],
        'literal-block': Prism.languages.asciidoc['literal-block'],
        'other-block': Prism.languages.asciidoc['other-block'],
        'list-punctuation': Prism.languages.asciidoc['list-punctuation'],
        'indented-block': Prism.languages.asciidoc['indented-block'],
        comment: Prism.languages.asciidoc.comment,
        title: Prism.languages.asciidoc.title,
        'attribute-entry': Prism.languages.asciidoc['attribute-entry'],
        attributes: Prism.languages.asciidoc.attributes,
        hr: Prism.languages.asciidoc.hr,
        'page-break': Prism.languages.asciidoc['page-break'],
        admonition: Prism.languages.asciidoc.admonition,
        'list-label': Prism.languages.asciidoc['list-label'],
        callout: Prism.languages.asciidoc.callout,
        macro: Prism.languages.asciidoc.macro,
        inline: Prism.languages.asciidoc.inline,
        replacement: Prism.languages.asciidoc.replacement,
        entity: Prism.languages.asciidoc.entity,
        'line-continuation': Prism.languages.asciidoc['line-continuation']
      };

      Prism.languages.asciidoc['other-block'].inside.rest = {
        table: Prism.languages.asciidoc.table,
        'list-punctuation': Prism.languages.asciidoc['list-punctuation'],
        'indented-block': Prism.languages.asciidoc['indented-block'],
        comment: Prism.languages.asciidoc.comment,
        'attribute-entry': Prism.languages.asciidoc['attribute-entry'],
        attributes: Prism.languages.asciidoc.attributes,
        hr: Prism.languages.asciidoc.hr,
        'page-break': Prism.languages.asciidoc['page-break'],
        admonition: Prism.languages.asciidoc.admonition,
        'list-label': Prism.languages.asciidoc['list-label'],
        macro: Prism.languages.asciidoc.macro,
        inline: Prism.languages.asciidoc.inline,
        replacement: Prism.languages.asciidoc.replacement,
        entity: Prism.languages.asciidoc.entity,
        'line-continuation': Prism.languages.asciidoc['line-continuation']
      };

      Prism.languages.asciidoc.title.inside.rest = {
        macro: Prism.languages.asciidoc.macro,
        inline: Prism.languages.asciidoc.inline,
        replacement: Prism.languages.asciidoc.replacement,
        entity: Prism.languages.asciidoc.entity

        // Plugin to make entity title show the real entity, idea by Roman Komarov
      };Prism.hooks.add('wrap', function (env) {
        if (env.type === 'entity') {
          env.attributes.title = env.content.replace(/&amp;/, '&');
        }
      });
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/asm6502.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/asm6502.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'asm6502',
  init: function init(Prism) {
    Prism.languages.asm6502 = {
      comment: /;.*/,
      directive: {
        pattern: /\.\w+(?= )/,
        alias: 'keyword'
      },
      string: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
      opcode: {
        pattern: /\b(?:adc|and|asl|bcc|bcs|beq|bit|bmi|bne|bpl|brk|bvc|bvs|clc|cld|cli|clv|cmp|cpx|cpy|dec|dex|dey|eor|inc|inx|iny|jmp|jsr|lda|ldx|ldy|lsr|nop|ora|pha|php|pla|plp|rol|ror|rti|rts|sbc|sec|sed|sei|sta|stx|sty|tax|tay|tsx|txa|txs|tya|ADC|AND|ASL|BCC|BCS|BEQ|BIT|BMI|BNE|BPL|BRK|BVC|BVS|CLC|CLD|CLI|CLV|CMP|CPX|CPY|DEC|DEX|DEY|EOR|INC|INX|INY|JMP|JSR|LDA|LDX|LDY|LSR|NOP|ORA|PHA|PHP|PLA|PLP|ROL|ROR|RTI|RTS|SBC|SEC|SED|SEI|STA|STX|STY|TAX|TAY|TSX|TXA|TXS|TYA)\b/,
        alias: 'property'
      },
      hexnumber: {
        pattern: /#?\$[\da-f]{2,4}/i,
        alias: 'string'
      },
      binarynumber: {
        pattern: /#?%[01]+/,
        alias: 'string'
      },
      decimalnumber: {
        pattern: /#?\d+/,
        alias: 'string'
      },
      register: {
        pattern: /\b[xya]\b/i,
        alias: 'variable'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/aspnet.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/aspnet.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'aspnet',
  init: function init(Prism) {
    Prism.languages.aspnet = Prism.languages.extend('markup', {
      'page-directive tag': {
        pattern: /<%\s*@.*%>/i,
        inside: {
          'page-directive tag': /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
          rest: Prism.languages.markup.tag.inside
        }
      },
      'directive tag': {
        pattern: /<%.*%>/i,
        inside: {
          'directive tag': /<%\s*?[$=%#:]{0,2}|%>/i,
          rest: Prism.languages.csharp
        }
      }
    });
    // Regexp copied from prism-markup, with a negative look-ahead added
    Prism.languages.aspnet.tag.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i;

    // match directives of attribute value foo="<% Bar %>"
    Prism.languages.insertBefore('inside', 'punctuation', {
      'directive tag': Prism.languages.aspnet['directive tag']
    }, Prism.languages.aspnet.tag.inside['attr-value']);

    Prism.languages.insertBefore('aspnet', 'comment', {
      'asp comment': /<%--[\s\S]*?--%>/
    });

    // script runat="server" contains csharp, not javascript
    Prism.languages.insertBefore('aspnet', Prism.languages.javascript ? 'script' : 'tag', {
      'asp script': {
        pattern: /(<script(?=.*runat=['"]?server['"]?)[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: true,
        inside: Prism.languages.csharp || {}
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/autohotkey.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/autohotkey.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'autohotkey',
  init: function init(Prism) {
    // NOTES - follows first-first highlight method, block is locked after highlight, different from SyntaxHl
    Prism.languages.autohotkey = {
      comment: {
        pattern: /(^[^";\n]*("[^"\n]*?"[^"\n]*?)*)(?:;.*$|^\s*\/\*[\s\S]*\n\*\/)/m,
        lookbehind: true
      },
      string: /"(?:[^"\n\r]|"")*"/m,
      function: /[^(); \t,\n+*\-=?>:\\\/<&%\[\]]+?(?=\()/m, // function - don't use .*\) in the end bcoz string locks it
      tag: /^[ \t]*[^\s:]+?(?=:(?:[^:]|$))/m, // labels
      variable: /%\w+%/,
      number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
      operator: /\?|\/\/?=?|:=|\|[=|]?|&[=&]?|\+[=+]?|-[=-]?|\*[=*]?|<(?:<=?|>|=)?|>>?=?|[.^!=~]=?|\b(?:AND|NOT|OR)\b/,
      punctuation: /[{}[\]():,]/,
      boolean: /\b(?:true|false)\b/,

      selector: /\b(?:AutoTrim|BlockInput|Break|Click|ClipWait|Continue|Control|ControlClick|ControlFocus|ControlGet|ControlGetFocus|ControlGetPos|ControlGetText|ControlMove|ControlSend|ControlSendRaw|ControlSetText|CoordMode|Critical|DetectHiddenText|DetectHiddenWindows|Drive|DriveGet|DriveSpaceFree|EnvAdd|EnvDiv|EnvGet|EnvMult|EnvSet|EnvSub|EnvUpdate|Exit|ExitApp|FileAppend|FileCopy|FileCopyDir|FileCreateDir|FileCreateShortcut|FileDelete|FileEncoding|FileGetAttrib|FileGetShortcut|FileGetSize|FileGetTime|FileGetVersion|FileInstall|FileMove|FileMoveDir|FileRead|FileReadLine|FileRecycle|FileRecycleEmpty|FileRemoveDir|FileSelectFile|FileSelectFolder|FileSetAttrib|FileSetTime|FormatTime|GetKeyState|Gosub|Goto|GroupActivate|GroupAdd|GroupClose|GroupDeactivate|Gui|GuiControl|GuiControlGet|Hotkey|ImageSearch|IniDelete|IniRead|IniWrite|Input|InputBox|KeyWait|ListHotkeys|ListLines|ListVars|Loop|Menu|MouseClick|MouseClickDrag|MouseGetPos|MouseMove|MsgBox|OnExit|OutputDebug|Pause|PixelGetColor|PixelSearch|PostMessage|Process|Progress|Random|RegDelete|RegRead|RegWrite|Reload|Repeat|Return|Run|RunAs|RunWait|Send|SendEvent|SendInput|SendMessage|SendMode|SendPlay|SendRaw|SetBatchLines|SetCapslockState|SetControlDelay|SetDefaultMouseSpeed|SetEnv|SetFormat|SetKeyDelay|SetMouseDelay|SetNumlockState|SetScrollLockState|SetStoreCapslockMode|SetTimer|SetTitleMatchMode|SetWinDelay|SetWorkingDir|Shutdown|Sleep|Sort|SoundBeep|SoundGet|SoundGetWaveVolume|SoundPlay|SoundSet|SoundSetWaveVolume|SplashImage|SplashTextOff|SplashTextOn|SplitPath|StatusBarGetText|StatusBarWait|StringCaseSense|StringGetPos|StringLeft|StringLen|StringLower|StringMid|StringReplace|StringRight|StringSplit|StringTrimLeft|StringTrimRight|StringUpper|Suspend|SysGet|Thread|ToolTip|Transform|TrayTip|URLDownloadToFile|WinActivate|WinActivateBottom|WinClose|WinGet|WinGetActiveStats|WinGetActiveTitle|WinGetClass|WinGetPos|WinGetText|WinGetTitle|WinHide|WinKill|WinMaximize|WinMenuSelectItem|WinMinimize|WinMinimizeAll|WinMinimizeAllUndo|WinMove|WinRestore|WinSet|WinSetTitle|WinShow|WinWait|WinWaitActive|WinWaitClose|WinWaitNotActive)\b/i,

      constant: /\b(?:a_ahkpath|a_ahkversion|a_appdata|a_appdatacommon|a_autotrim|a_batchlines|a_caretx|a_carety|a_computername|a_controldelay|a_cursor|a_dd|a_ddd|a_dddd|a_defaultmousespeed|a_desktop|a_desktopcommon|a_detecthiddentext|a_detecthiddenwindows|a_endchar|a_eventinfo|a_exitreason|a_formatfloat|a_formatinteger|a_gui|a_guievent|a_guicontrol|a_guicontrolevent|a_guiheight|a_guiwidth|a_guix|a_guiy|a_hour|a_iconfile|a_iconhidden|a_iconnumber|a_icontip|a_index|a_ipaddress1|a_ipaddress2|a_ipaddress3|a_ipaddress4|a_isadmin|a_iscompiled|a_iscritical|a_ispaused|a_issuspended|a_isunicode|a_keydelay|a_language|a_lasterror|a_linefile|a_linenumber|a_loopfield|a_loopfileattrib|a_loopfiledir|a_loopfileext|a_loopfilefullpath|a_loopfilelongpath|a_loopfilename|a_loopfileshortname|a_loopfileshortpath|a_loopfilesize|a_loopfilesizekb|a_loopfilesizemb|a_loopfiletimeaccessed|a_loopfiletimecreated|a_loopfiletimemodified|a_loopreadline|a_loopregkey|a_loopregname|a_loopregsubkey|a_loopregtimemodified|a_loopregtype|a_mday|a_min|a_mm|a_mmm|a_mmmm|a_mon|a_mousedelay|a_msec|a_mydocuments|a_now|a_nowutc|a_numbatchlines|a_ostype|a_osversion|a_priorhotkey|programfiles|a_programfiles|a_programs|a_programscommon|a_screenheight|a_screenwidth|a_scriptdir|a_scriptfullpath|a_scriptname|a_sec|a_space|a_startmenu|a_startmenucommon|a_startup|a_startupcommon|a_stringcasesense|a_tab|a_temp|a_thisfunc|a_thishotkey|a_thislabel|a_thismenu|a_thismenuitem|a_thismenuitempos|a_tickcount|a_timeidle|a_timeidlephysical|a_timesincepriorhotkey|a_timesincethishotkey|a_titlematchmode|a_titlematchmodespeed|a_username|a_wday|a_windelay|a_windir|a_workingdir|a_yday|a_year|a_yweek|a_yyyy|clipboard|clipboardall|comspec|errorlevel)\b/i,

      builtin: /\b(?:abs|acos|asc|asin|atan|ceil|chr|class|cos|dllcall|exp|fileexist|Fileopen|floor|il_add|il_create|il_destroy|instr|substr|isfunc|islabel|IsObject|ln|log|lv_add|lv_delete|lv_deletecol|lv_getcount|lv_getnext|lv_gettext|lv_insert|lv_insertcol|lv_modify|lv_modifycol|lv_setimagelist|mod|onmessage|numget|numput|registercallback|regexmatch|regexreplace|round|sin|tan|sqrt|strlen|sb_seticon|sb_setparts|sb_settext|strsplit|tv_add|tv_delete|tv_getchild|tv_getcount|tv_getnext|tv_get|tv_getparent|tv_getprev|tv_getselection|tv_gettext|tv_modify|varsetcapacity|winactive|winexist|__New|__Call|__Get|__Set)\b/i,

      symbol: /\b(?:alt|altdown|altup|appskey|backspace|browser_back|browser_favorites|browser_forward|browser_home|browser_refresh|browser_search|browser_stop|bs|capslock|ctrl|ctrlbreak|ctrldown|ctrlup|del|delete|down|end|enter|esc|escape|f1|f10|f11|f12|f13|f14|f15|f16|f17|f18|f19|f2|f20|f21|f22|f23|f24|f3|f4|f5|f6|f7|f8|f9|home|ins|insert|joy1|joy10|joy11|joy12|joy13|joy14|joy15|joy16|joy17|joy18|joy19|joy2|joy20|joy21|joy22|joy23|joy24|joy25|joy26|joy27|joy28|joy29|joy3|joy30|joy31|joy32|joy4|joy5|joy6|joy7|joy8|joy9|joyaxes|joybuttons|joyinfo|joyname|joypov|joyr|joyu|joyv|joyx|joyy|joyz|lalt|launch_app1|launch_app2|launch_mail|launch_media|lbutton|lcontrol|lctrl|left|lshift|lwin|lwindown|lwinup|mbutton|media_next|media_play_pause|media_prev|media_stop|numlock|numpad0|numpad1|numpad2|numpad3|numpad4|numpad5|numpad6|numpad7|numpad8|numpad9|numpadadd|numpadclear|numpaddel|numpaddiv|numpaddot|numpaddown|numpadend|numpadenter|numpadhome|numpadins|numpadleft|numpadmult|numpadpgdn|numpadpgup|numpadright|numpadsub|numpadup|pgdn|pgup|printscreen|ralt|rbutton|rcontrol|rctrl|right|rshift|rwin|rwindown|rwinup|scrolllock|shift|shiftdown|shiftup|space|tab|up|volume_down|volume_mute|volume_up|wheeldown|wheelleft|wheelright|wheelup|xbutton1|xbutton2)\b/i,

      important: /#\b(?:AllowSameLineComments|ClipboardTimeout|CommentFlag|ErrorStdOut|EscapeChar|HotkeyInterval|HotkeyModifierTimeout|Hotstring|IfWinActive|IfWinExist|IfWinNotActive|IfWinNotExist|Include|IncludeAgain|InstallKeybdHook|InstallMouseHook|KeyHistory|LTrim|MaxHotkeysPerInterval|MaxMem|MaxThreads|MaxThreadsBuffer|MaxThreadsPerHotkey|NoEnv|NoTrayIcon|Persistent|SingleInstance|UseHook|WinActivateForce)\b/i,

      keyword: /\b(?:Abort|AboveNormal|Add|ahk_class|ahk_group|ahk_id|ahk_pid|All|Alnum|Alpha|AltSubmit|AltTab|AltTabAndMenu|AltTabMenu|AltTabMenuDismiss|AlwaysOnTop|AutoSize|Background|BackgroundTrans|BelowNormal|between|BitAnd|BitNot|BitOr|BitShiftLeft|BitShiftRight|BitXOr|Bold|Border|Button|ByRef|Checkbox|Checked|CheckedGray|Choose|ChooseString|Close|Color|ComboBox|Contains|ControlList|Count|Date|DateTime|Days|DDL|Default|DeleteAll|Delimiter|Deref|Destroy|Digit|Disable|Disabled|DropDownList|Edit|Eject|Else|Enable|Enabled|Error|Exist|Expand|ExStyle|FileSystem|First|Flash|Float|FloatFast|Focus|Font|for|global|Grid|Group|GroupBox|GuiClose|GuiContextMenu|GuiDropFiles|GuiEscape|GuiSize|Hdr|Hidden|Hide|High|HKCC|HKCR|HKCU|HKEY_CLASSES_ROOT|HKEY_CURRENT_CONFIG|HKEY_CURRENT_USER|HKEY_LOCAL_MACHINE|HKEY_USERS|HKLM|HKU|Hours|HScroll|Icon|IconSmall|ID|IDLast|If|IfEqual|IfExist|IfGreater|IfGreaterOrEqual|IfInString|IfLess|IfLessOrEqual|IfMsgBox|IfNotEqual|IfNotExist|IfNotInString|IfWinActive|IfWinExist|IfWinNotActive|IfWinNotExist|Ignore|ImageList|in|Integer|IntegerFast|Interrupt|is|italic|Join|Label|LastFound|LastFoundExist|Limit|Lines|List|ListBox|ListView|local|Lock|Logoff|Low|Lower|Lowercase|MainWindow|Margin|Maximize|MaximizeBox|MaxSize|Minimize|MinimizeBox|MinMax|MinSize|Minutes|MonthCal|Mouse|Move|Multi|NA|No|NoActivate|NoDefault|NoHide|NoIcon|NoMainWindow|norm|Normal|NoSort|NoSortHdr|NoStandard|Not|NoTab|NoTimers|Number|Off|Ok|On|OwnDialogs|Owner|Parse|Password|Picture|Pixel|Pos|Pow|Priority|ProcessName|Radio|Range|Read|ReadOnly|Realtime|Redraw|REG_BINARY|REG_DWORD|REG_EXPAND_SZ|REG_MULTI_SZ|REG_SZ|Region|Relative|Rename|Report|Resize|Restore|Retry|RGB|Screen|Seconds|Section|Serial|SetLabel|ShiftAltTab|Show|Single|Slider|SortDesc|Standard|static|Status|StatusBar|StatusCD|strike|Style|Submit|SysMenu|Tab2|TabStop|Text|Theme|Tile|ToggleCheck|ToggleEnable|ToolWindow|Top|Topmost|TransColor|Transparent|Tray|TreeView|TryAgain|Type|UnCheck|underline|Unicode|Unlock|UpDown|Upper|Uppercase|UseErrorLevel|Vis|VisFirst|Visible|VScroll|Wait|WaitClose|WantCtrlA|WantF2|WantReturn|While|Wrap|Xdigit|xm|xp|xs|Yes|ym|yp|ys)\b/i
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/autoit.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/autoit.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'autoit',
  init: function init(Prism) {
    Prism.languages.autoit = {
      comment: [/;.*/, {
        // The multi-line comments delimiters can actually be commented out with ";"
        pattern: /(^\s*)#(?:comments-start|cs)[\s\S]*?^\s*#(?:comments-end|ce)/m,
        lookbehind: true
      }],
      url: {
        pattern: /(^\s*#include\s+)(?:<[^\r\n>]+>|"[^\r\n"]+")/m,
        lookbehind: true
      },
      string: {
        pattern: /(["'])(?:\1\1|(?!\1)[^\r\n])*\1/,
        greedy: true,
        inside: {
          variable: /([%$@])\w+\1/
        }
      },
      directive: {
        pattern: /(^\s*)#\w+/m,
        lookbehind: true,
        alias: 'keyword'
      },
      function: /\b\w+(?=\()/,
      // Variables and macros
      variable: /[$@]\w+/,
      keyword: /\b(?:Case|Const|Continue(?:Case|Loop)|Default|Dim|Do|Else(?:If)?|End(?:Func|If|Select|Switch|With)|Enum|Exit(?:Loop)?|For|Func|Global|If|In|Local|Next|Null|ReDim|Select|Static|Step|Switch|Then|To|Until|Volatile|WEnd|While|With)\b/i,
      number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i,
      boolean: /\b(?:True|False)\b/i,
      operator: /<[=>]?|[-+*\/=&>]=?|[?^]|\b(?:And|Or|Not)\b/i,
      punctuation: /[\[\]().,:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/bash.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/bash.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'bash',
  init: function init(Prism) {
    (function (Prism) {
      var insideString = {
        variable: [
        // Arithmetic Environment
        {
          pattern: /\$?\(\([\s\S]+?\)\)/,
          inside: {
            // If there is a $ sign at the beginning highlight $(( and )) as variable
            variable: [{
              pattern: /(^\$\(\([\s\S]+)\)\)/,
              lookbehind: true
            }, /^\$\(\(/],
            number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
            // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
            operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
            // If there is no $ sign at the beginning highlight (( and )) as punctuation
            punctuation: /\(\(?|\)\)?|,|;/
          }
        },
        // Command Substitution
        {
          pattern: /\$\([^)]+\)|`[^`]+`/,
          greedy: true,
          inside: {
            variable: /^\$\(|^`|\)$|`$/
          }
        }, /\$(?:[\w#?*!@]+|\{[^}]+\})/i]
      };

      Prism.languages.bash = {
        shebang: {
          pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
          alias: 'important'
        },
        comment: {
          pattern: /(^|[^"{\\])#.*/,
          lookbehind: true
        },
        string: [
        // Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
        {
          pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
          lookbehind: true,
          greedy: true,
          inside: insideString
        }, {
          pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,
          greedy: true,
          inside: insideString
        }],
        variable: insideString.variable,
        // Originally based on http://ss64.com/bash/
        function: {
          pattern: /(^|[\s;|&])(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|[\s;|&])/,
          lookbehind: true
        },
        keyword: {
          pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
          lookbehind: true
        },
        boolean: {
          pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,
          lookbehind: true
        },
        operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
      };

      var inside = insideString.variable[1].inside;
      inside.string = Prism.languages.bash.string;
      inside.function = Prism.languages.bash.function;
      inside.keyword = Prism.languages.bash.keyword;
      inside.boolean = Prism.languages.bash.boolean;
      inside.operator = Prism.languages.bash.operator;
      inside.punctuation = Prism.languages.bash.punctuation;

      Prism.languages.shell = Prism.languages.bash;
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/basic.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/basic.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'basic',
  init: function init(Prism) {
    Prism.languages.basic = {
      comment: {
        pattern: /(?:!|REM\b).+/i,
        inside: {
          keyword: /^REM/i
        }
      },
      string: {
        pattern: /"(?:""|[!#$%&'()*,\/:;<=>?^_ +\-.A-Z\d])*"/i,
        greedy: true
      },
      number: /(?:\b\d+\.?\d*|\B\.\d+)(?:E[+-]?\d+)?/i,
      keyword: /\b(?:AS|BEEP|BLOAD|BSAVE|CALL(?: ABSOLUTE)?|CASE|CHAIN|CHDIR|CLEAR|CLOSE|CLS|COM|COMMON|CONST|DATA|DECLARE|DEF(?: FN| SEG|DBL|INT|LNG|SNG|STR)|DIM|DO|DOUBLE|ELSE|ELSEIF|END|ENVIRON|ERASE|ERROR|EXIT|FIELD|FILES|FOR|FUNCTION|GET|GOSUB|GOTO|IF|INPUT|INTEGER|IOCTL|KEY|KILL|LINE INPUT|LOCATE|LOCK|LONG|LOOP|LSET|MKDIR|NAME|NEXT|OFF|ON(?: COM| ERROR| KEY| TIMER)?|OPEN|OPTION BASE|OUT|POKE|PUT|READ|REDIM|REM|RESTORE|RESUME|RETURN|RMDIR|RSET|RUN|SHARED|SINGLE|SELECT CASE|SHELL|SLEEP|STATIC|STEP|STOP|STRING|SUB|SWAP|SYSTEM|THEN|TIMER|TO|TROFF|TRON|TYPE|UNLOCK|UNTIL|USING|VIEW PRINT|WAIT|WEND|WHILE|WRITE)(?:\$|\b)/i,
      function: /\b(?:ABS|ACCESS|ACOS|ANGLE|AREA|ARITHMETIC|ARRAY|ASIN|ASK|AT|ATN|BASE|BEGIN|BREAK|CAUSE|CEIL|CHR|CLIP|COLLATE|COLOR|CON|COS|COSH|COT|CSC|DATE|DATUM|DEBUG|DECIMAL|DEF|DEG|DEGREES|DELETE|DET|DEVICE|DISPLAY|DOT|ELAPSED|EPS|ERASABLE|EXLINE|EXP|EXTERNAL|EXTYPE|FILETYPE|FIXED|FP|GO|GRAPH|HANDLER|IDN|IMAGE|IN|INT|INTERNAL|IP|IS|KEYED|LBOUND|LCASE|LEFT|LEN|LENGTH|LET|LINE|LINES|LOG|LOG10|LOG2|LTRIM|MARGIN|MAT|MAX|MAXNUM|MID|MIN|MISSING|MOD|NATIVE|NUL|NUMERIC|OF|OPTION|ORD|ORGANIZATION|OUTIN|OUTPUT|PI|POINT|POINTER|POINTS|POS|PRINT|PROGRAM|PROMPT|RAD|RADIANS|RANDOMIZE|RECORD|RECSIZE|RECTYPE|RELATIVE|REMAINDER|REPEAT|REST|RETRY|REWRITE|RIGHT|RND|ROUND|RTRIM|SAME|SEC|SELECT|SEQUENTIAL|SET|SETTER|SGN|SIN|SINH|SIZE|SKIP|SQR|STANDARD|STATUS|STR|STREAM|STYLE|TAB|TAN|TANH|TEMPLATE|TEXT|THERE|TIME|TIMEOUT|TRACE|TRANSFORM|TRUNCATE|UBOUND|UCASE|USE|VAL|VARIABLE|VIEWPORT|WHEN|WINDOW|WITH|ZER|ZONEWIDTH)(?:\$|\b)/i,
      operator: /<[=>]?|>=?|[+\-*\/^=&]|\b(?:AND|EQV|IMP|NOT|OR|XOR)\b/i,
      punctuation: /[,;:()]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/batch.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/batch.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'batch',
  init: function init(Prism) {
    (function (Prism) {
      var variable = /%%?[~:\w]+%?|!\S+!/;
      var parameter = {
        pattern: /\/[a-z?]+(?=[ :]|$):?|-[a-z]\b|--[a-z-]+\b/im,
        alias: 'attr-name',
        inside: {
          punctuation: /:/
        }
      };
      var string = /"[^"]*"/;
      var number = /(?:\b|-)\d+\b/;

      Prism.languages.batch = {
        comment: [/^::.*/m, {
          pattern: /((?:^|[&(])[ \t]*)rem\b(?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
          lookbehind: true
        }],
        label: {
          pattern: /^:.*/m,
          alias: 'property'
        },
        command: [{
          // FOR command
          pattern: /((?:^|[&(])[ \t]*)for(?: ?\/[a-z?](?:[ :](?:"[^"]*"|\S+))?)* \S+ in \([^)]+\) do/im,
          lookbehind: true,
          inside: {
            keyword: /^for\b|\b(?:in|do)\b/i,
            string: string,
            parameter: parameter,
            variable: variable,
            number: number,
            punctuation: /[()',]/
          }
        }, {
          // IF command
          pattern: /((?:^|[&(])[ \t]*)if(?: ?\/[a-z?](?:[ :](?:"[^"]*"|\S+))?)* (?:not )?(?:cmdextversion \d+|defined \w+|errorlevel \d+|exist \S+|(?:"[^"]*"|\S+)?(?:==| (?:equ|neq|lss|leq|gtr|geq) )(?:"[^"]*"|\S+))/im,
          lookbehind: true,
          inside: {
            keyword: /^if\b|\b(?:not|cmdextversion|defined|errorlevel|exist)\b/i,
            string: string,
            parameter: parameter,
            variable: variable,
            number: number,
            operator: /\^|==|\b(?:equ|neq|lss|leq|gtr|geq)\b/i
          }
        }, {
          // ELSE command
          pattern: /((?:^|[&()])[ \t]*)else\b/im,
          lookbehind: true,
          inside: {
            keyword: /^else\b/i
          }
        }, {
          // SET command
          pattern: /((?:^|[&(])[ \t]*)set(?: ?\/[a-z](?:[ :](?:"[^"]*"|\S+))?)* (?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
          lookbehind: true,
          inside: {
            keyword: /^set\b/i,
            string: string,
            parameter: parameter,
            variable: [variable, /\w+(?=(?:[*\/%+\-&^|]|<<|>>)?=)/],
            number: number,
            operator: /[*\/%+\-&^|]=?|<<=?|>>=?|[!~_=]/,
            punctuation: /[()',]/
          }
        }, {
          // Other commands
          pattern: /((?:^|[&(])[ \t]*@?)\w+\b(?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
          lookbehind: true,
          inside: {
            keyword: /^\w+\b/i,
            string: string,
            parameter: parameter,
            label: {
              pattern: /(^\s*):\S+/m,
              lookbehind: true,
              alias: 'property'
            },
            variable: variable,
            number: number,
            operator: /\^/
          }
        }],
        operator: /[&@]/,
        punctuation: /[()']/
      };
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/brainfuck.js":
/*!*****************************************************!*\
  !*** ./node_modules/reprism/languages/brainfuck.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'brainfuck',
  init: function init(Prism) {
    Prism.languages.brainfuck = {
      pointer: {
        pattern: /<|>/,
        alias: 'keyword'
      },
      increment: {
        pattern: /\+/,
        alias: 'inserted'
      },
      decrement: {
        pattern: /-/,
        alias: 'deleted'
      },
      branching: {
        pattern: /\[|\]/,
        alias: 'important'
      },
      operator: /[.,]/,
      comment: /\S+/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/bro.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/bro.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'bro',
  init: function init(Prism) {
    Prism.languages.bro = {
      comment: {
        pattern: /(^|[^\\$])#.*/,
        lookbehind: true,
        inside: {
          italic: /\b(?:TODO|FIXME|XXX)\b/
        }
      },

      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },

      boolean: /\b[TF]\b/,

      function: {
        pattern: /(?:function|hook|event) \w+(?:::\w+)?/,
        inside: {
          keyword: /^(?:function|hook|event)/
        }
      },

      variable: {
        pattern: /(?:global|local) \w+/i,
        inside: {
          keyword: /(?:global|local)/
        }
      },

      builtin: /(?:@(?:load(?:-(?:sigs|plugin))?|unload|prefixes|ifn?def|else|(?:end)?if|DIR|FILENAME))|(?:&?(?:redef|priority|log|optional|default|add_func|delete_func|expire_func|read_expire|write_expire|create_expire|synchronized|persistent|rotate_interval|rotate_size|encrypt|raw_output|mergeable|group|error_handler|type_column))/,

      constant: {
        pattern: /const \w+/i,
        inside: {
          keyword: /const/
        }
      },

      keyword: /\b(?:break|next|continue|alarm|using|of|add|delete|export|print|return|schedule|when|timeout|addr|any|bool|count|double|enum|file|int|interval|pattern|opaque|port|record|set|string|subnet|table|time|vector|for|if|else|in|module|function)\b/,

      operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&|\|\|?|\?|\*|\/|~|\^|%/,

      number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,

      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/c.js":
/*!*********************************************!*\
  !*** ./node_modules/reprism/languages/c.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'c',
  init: function init(Prism) {
    Prism.languages.c = Prism.languages.extend('clike', {
      keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
      operator: /-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/]/,
      number: /(?:\b0x[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i
    });

    Prism.languages.insertBefore('c', 'string', {
      macro: {
        // allow for multiline macro definitions
        // spaces after the # character compile fine with gcc
        pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\]|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: true,
        alias: 'property',
        inside: {
          // highlight the path of the include statement as a string
          string: {
            pattern: /(#\s*include\s*)(?:<.+?>|("|')(?:\\?.)+?\2)/,
            lookbehind: true
          },
          // highlight macro directives as keywords
          directive: {
            pattern: /(#\s*)\b(?:define|defined|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
            lookbehind: true,
            alias: 'keyword'
          }
        }
      },
      // highlight predefined macros as constants
      constant: /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
    });

    delete Prism.languages.c['class-name'];
    delete Prism.languages.c.boolean;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/clike.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/clike.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'clike',
  init: function init(Prism) {
    Prism.languages.clike = {
      comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true
      }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true
      }],
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      'class-name': {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
        lookbehind: true,
        inside: {
          punctuation: /[.\\]/
        }
      },
      keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
      boolean: /\b(?:true|false)\b/,
      function: /[a-z0-9_]+(?=\()/i,
      number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
      operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/clojure.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/clojure.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'clojure',
  init: function init(Prism) {
    // Copied from https://github.com/jeluard/prism-clojure
    Prism.languages.clojure = {
      comment: /;+.*/,
      string: /"(?:\\.|[^\\"\r\n])*"/,
      operator: /(?:::|[:|'])\b[a-z][\w*+!?-]*\b/i, // used for symbols and keywords
      keyword: {
        pattern: /([^\w+*'?-])(?:def|if|do|let|\.\.|quote|var|->>|->|fn|loop|recur|throw|try|monitor-enter|\.|new|set!|def\-|defn|defn\-|defmacro|defmulti|defmethod|defstruct|defonce|declare|definline|definterface|defprotocol|==|defrecord|>=|deftype|<=|defproject|ns|\*|\+|\-|\/|<|=|>|accessor|agent|agent-errors|aget|alength|all-ns|alter|and|append-child|apply|array-map|aset|aset-boolean|aset-byte|aset-char|aset-double|aset-float|aset-int|aset-long|aset-short|assert|assoc|await|await-for|bean|binding|bit-and|bit-not|bit-or|bit-shift-left|bit-shift-right|bit-xor|boolean|branch\?|butlast|byte|cast|char|children|class|clear-agent-errors|comment|commute|comp|comparator|complement|concat|conj|cons|constantly|cond|if-not|construct-proxy|contains\?|count|create-ns|create-struct|cycle|dec|deref|difference|disj|dissoc|distinct|doall|doc|dorun|doseq|dosync|dotimes|doto|double|down|drop|drop-while|edit|end\?|ensure|eval|every\?|false\?|ffirst|file-seq|filter|find|find-doc|find-ns|find-var|first|float|flush|for|fnseq|frest|gensym|get-proxy-class|get|hash-map|hash-set|identical\?|identity|if-let|import|in-ns|inc|index|insert-child|insert-left|insert-right|inspect-table|inspect-tree|instance\?|int|interleave|intersection|into|into-array|iterate|join|key|keys|keyword|keyword\?|last|lazy-cat|lazy-cons|left|lefts|line-seq|list\*|list|load|load-file|locking|long|loop|macroexpand|macroexpand-1|make-array|make-node|map|map-invert|map\?|mapcat|max|max-key|memfn|merge|merge-with|meta|min|min-key|name|namespace|neg\?|new|newline|next|nil\?|node|not|not-any\?|not-every\?|not=|ns-imports|ns-interns|ns-map|ns-name|ns-publics|ns-refers|ns-resolve|ns-unmap|nth|nthrest|or|parse|partial|path|peek|pop|pos\?|pr|pr-str|print|print-str|println|println-str|prn|prn-str|project|proxy|proxy-mappings|quot|rand|rand-int|range|re-find|re-groups|re-matcher|re-matches|re-pattern|re-seq|read|read-line|reduce|ref|ref-set|refer|rem|remove|remove-method|remove-ns|rename|rename-keys|repeat|replace|replicate|resolve|rest|resultset-seq|reverse|rfirst|right|rights|root|rrest|rseq|second|select|select-keys|send|send-off|seq|seq-zip|seq\?|set|short|slurp|some|sort|sort-by|sorted-map|sorted-map-by|sorted-set|special-symbol\?|split-at|split-with|str|string\?|struct|struct-map|subs|subvec|symbol|symbol\?|sync|take|take-nth|take-while|test|time|to-array|to-array-2d|tree-seq|true\?|union|up|update-proxy|val|vals|var-get|var-set|var\?|vector|vector-zip|vector\?|when|when-first|when-let|when-not|with-local-vars|with-meta|with-open|with-out-str|xml-seq|xml-zip|zero\?|zipmap|zipper)(?=[^\w+*'?-])/,
        lookbehind: true
      },
      boolean: /\b(?:true|false|nil)\b/,
      number: /\b[0-9A-Fa-f]+\b/,
      punctuation: /[{}\[\](),]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/coffeescript.js":
/*!********************************************************!*\
  !*** ./node_modules/reprism/languages/coffeescript.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'coffeescript',
  init: function init(Prism) {
    (function (Prism) {
      // Ignore comments starting with { to privilege string interpolation highlighting
      var comment = /#(?!\{).+/,
          interpolation = {
        pattern: /#\{[^}]+\}/,
        alias: 'variable'
      };

      Prism.languages.coffeescript = Prism.languages.extend('javascript', {
        comment: comment,
        string: [
        // Strings are multiline
        {
          pattern: /'(?:\\[\s\S]|[^\\'])*'/,
          greedy: true
        }, {
          // Strings are multiline
          pattern: /"(?:\\[\s\S]|[^\\"])*"/,
          greedy: true,
          inside: {
            interpolation: interpolation
          }
        }],
        keyword: /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
        'class-member': {
          pattern: /@(?!\d)\w+/,
          alias: 'variable'
        }
      });

      Prism.languages.insertBefore('coffeescript', 'comment', {
        'multiline-comment': {
          pattern: /###[\s\S]+?###/,
          alias: 'comment'
        },

        // Block regexp can contain comments and interpolation
        'block-regex': {
          pattern: /\/{3}[\s\S]*?\/{3}/,
          alias: 'regex',
          inside: {
            comment: comment,
            interpolation: interpolation
          }
        }
      });

      Prism.languages.insertBefore('coffeescript', 'string', {
        'inline-javascript': {
          pattern: /`(?:\\[\s\S]|[^\\`])*`/,
          inside: {
            delimiter: {
              pattern: /^`|`$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.javascript
          }
        },

        // Block strings
        'multiline-string': [{
          pattern: /'''[\s\S]*?'''/,
          greedy: true,
          alias: 'string'
        }, {
          pattern: /"""[\s\S]*?"""/,
          greedy: true,
          alias: 'string',
          inside: {
            interpolation: interpolation
          }
        }]
      });

      Prism.languages.insertBefore('coffeescript', 'keyword', {
        // Object property
        property: /(?!\d)\w+(?=\s*:(?!:))/
      });

      delete Prism.languages.coffeescript['template-string'];
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/cpp.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/cpp.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'cpp',
  init: function init(Prism) {
    Prism.languages.cpp = Prism.languages.extend('c', {
      keyword: /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
      boolean: /\b(?:true|false)\b/,
      operator: /--?|\+\+?|!=?|<{1,2}=?|>{1,2}=?|->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|\|?|\?|\*|\/|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
    });

    Prism.languages.insertBefore('cpp', 'keyword', {
      'class-name': {
        pattern: /(class\s+)\w+/i,
        lookbehind: true
      }
    });

    Prism.languages.insertBefore('cpp', 'string', {
      'raw-string': {
        pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
        alias: 'string',
        greedy: true
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/csharp.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/csharp.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'csharp',
  init: function init(Prism) {
    Prism.languages.csharp = Prism.languages.extend('clike', {
      keyword: /\b(?:abstract|add|alias|as|ascending|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|do|double|dynamic|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|from|get|global|goto|group|if|implicit|in|int|interface|internal|into|is|join|let|lock|long|namespace|new|null|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/,
      string: [{
        pattern: /@("|')(?:\1\1|\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: true
      }, {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*?\1/,
        greedy: true
      }],
      'class-name': [{
        // (Foo bar, Bar baz)
        pattern: /\b[A-Z]\w*(?:\.\w+)*\b(?=\s+\w+)/,
        inside: {
          punctuation: /\./
        }
      }, {
        // [Foo]
        pattern: /(\[)[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      }, {
        // class Foo : Bar
        pattern: /(\b(?:class|interface)\s+[A-Z]\w*(?:\.\w+)*\s*:\s*)[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      }, {
        // class Foo
        pattern: /((?:\b(?:class|interface|new)\s+)|(?:catch\s+\())[A-Z]\w*(?:\.\w+)*\b/,
        lookbehind: true,
        inside: {
          punctuation: /\./
        }
      }],
      number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)f?/i
    });

    Prism.languages.insertBefore('csharp', 'class-name', {
      'generic-method': {
        pattern: /\w+\s*<[^>\r\n]+?>\s*(?=\()/,
        inside: {
          function: /^\w+/,
          'class-name': {
            pattern: /\b[A-Z]\w*(?:\.\w+)*\b/,
            inside: {
              punctuation: /\./
            }
          },
          keyword: Prism.languages.csharp.keyword,
          punctuation: /[<>(),.:]/
        }
      },
      preprocessor: {
        pattern: /(^\s*)#.*/m,
        lookbehind: true,
        alias: 'property',
        inside: {
          // highlight preprocessor directives as keywords
          directive: {
            pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
            lookbehind: true,
            alias: 'keyword'
          }
        }
      }
    });

    Prism.languages.dotnet = Prism.languages.csharp;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/csp.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/csp.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'csp',
  init: function init(Prism) {
    /**
     * Original by Scott Helme.
     *
     * Reference: https://scotthelme.co.uk/csp-cheat-sheet/
     *
     * Supports the following:
     *  - CSP Level 1
     *  - CSP Level 2
     *  - CSP Level 3
     */

    Prism.languages.csp = {
      directive: {
        pattern: /\b(?:(?:base-uri|form-action|frame-ancestors|plugin-types|referrer|reflected-xss|report-to|report-uri|require-sri-for|sandbox) |(?:block-all-mixed-content|disown-opener|upgrade-insecure-requests)(?: |;)|(?:child|connect|default|font|frame|img|manifest|media|object|script|style|worker)-src )/i,
        alias: 'keyword'
      },
      safe: {
        pattern: /'(?:self|none|strict-dynamic|(?:nonce-|sha(?:256|384|512)-)[a-zA-Z\d+=/]+)'/,
        alias: 'selector'
      },
      unsafe: {
        pattern: /(?:'unsafe-inline'|'unsafe-eval'|'unsafe-hashed-attributes'|\*)/,
        alias: 'function'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/css-extras.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/css-extras.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'css-extras',
  init: function init(Prism) {
    Prism.languages.css.selector = {
      pattern: /[^{}\s][^{}]*(?=\s*\{)/,
      inside: {
        'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
        'pseudo-class': /:[-\w]+(?:\(.*\))?/,
        class: /\.[-:.\w]+/,
        id: /#[-:.\w]+/,
        attribute: /\[[^\]]+\]/
      }
    };

    Prism.languages.insertBefore('css', 'function', {
      hexcode: /#[\da-f]{3,8}/i,
      entity: /\\[\da-f]{1,8}/i,
      number: /[\d%.]+/
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/css.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/css.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'css',
  init: function init(Prism) {
    Prism.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
        inside: {
          rule: /@[\w-]+/
          // See rest below
        }
      },
      url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
      selector: /[^{}\s][^{};]*?(?=\s*\{)/,
      string: {
        pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
      important: /\B!important\b/i,
      function: /[-a-z0-9]+(?=\()/i,
      punctuation: /[(){};:]/
    };

    Prism.languages.css.atrule.inside.rest = Prism.languages.css;

    if (Prism.languages.markup) {
      Prism.languages.insertBefore('markup', 'tag', {
        style: {
          pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
          lookbehind: true,
          inside: Prism.languages.css,
          alias: 'language-css',
          greedy: true
        }
      });

      Prism.languages.insertBefore('inside', 'attr-value', {
        'style-attr': {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            'attr-name': {
              pattern: /^\s*style/i,
              inside: Prism.languages.markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': {
              pattern: /.+/i,
              inside: Prism.languages.css
            }
          },
          alias: 'language-css'
        }
      }, Prism.languages.markup.tag);
    }
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/d.js":
/*!*********************************************!*\
  !*** ./node_modules/reprism/languages/d.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'd',
  init: function init(Prism) {
    Prism.languages.d = Prism.languages.extend('clike', {
      string: [
      // r"", x""
      /\b[rx]"(?:\\[\s\S]|[^\\"])*"[cwd]?/,
      // q"[]", q"()", q"<>", q"{}"
      /\bq"(?:\[[\s\S]*?\]|\([\s\S]*?\)|<[\s\S]*?>|\{[\s\S]*?\})"/,
      // q"IDENT
      // ...
      // IDENT"
      /\bq"([_a-zA-Z][_a-zA-Z\d]*)(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\1"/,
      // q"//", q"||", etc.
      /\bq"(.)[\s\S]*?\1"/,
      // Characters
      /'(?:\\'|\\?[^']+)'/, /(["`])(?:\\[\s\S]|(?!\1)[^\\])*\1[cwd]?/],

      number: [
      // The lookbehind and the negative look-ahead try to prevent bad highlighting of the .. operator
      // Hexadecimal numbers must be handled separately to avoid problems with exponent "e"
      /\b0x\.?[a-f\d_]+(?:(?!\.\.)\.[a-f\d_]*)?(?:p[+-]?[a-f\d_]+)?[ulfi]*/i, {
        pattern: /((?:\.\.)?)(?:\b0b\.?|\b|\.)\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:e[+-]?\d[\d_]*)?[ulfi]*/i,
        lookbehind: true
      }],

      // In order: $, keywords and special tokens, globally defined symbols
      keyword: /\$|\b(?:abstract|alias|align|asm|assert|auto|body|bool|break|byte|case|cast|catch|cdouble|cent|cfloat|char|class|const|continue|creal|dchar|debug|default|delegate|delete|deprecated|do|double|else|enum|export|extern|false|final|finally|float|for|foreach|foreach_reverse|function|goto|idouble|if|ifloat|immutable|import|inout|int|interface|invariant|ireal|lazy|long|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|public|pure|real|ref|return|scope|shared|short|static|struct|super|switch|synchronized|template|this|throw|true|try|typedef|typeid|typeof|ubyte|ucent|uint|ulong|union|unittest|ushort|version|void|volatile|wchar|while|with|__(?:(?:FILE|MODULE|LINE|FUNCTION|PRETTY_FUNCTION|DATE|EOF|TIME|TIMESTAMP|VENDOR|VERSION)__|gshared|traits|vector|parameters)|string|wstring|dstring|size_t|ptrdiff_t)\b/,
      operator: /\|[|=]?|&[&=]?|\+[+=]?|-[-=]?|\.?\.\.|=[>=]?|!(?:i[ns]\b|<>?=?|>=?|=)?|\bi[ns]\b|(?:<[<>]?|>>?>?|\^\^|[*\/%^~])=?/
    });

    Prism.languages.d.comment = [
    // Shebang
    /^\s*#!.+/,
    // /+ +/
    {
      // Allow one level of nesting
      pattern: /(^|[^\\])\/\+(?:\/\+[\s\S]*?\+\/|[\s\S])*?\+\//,
      lookbehind: true
    }].concat(Prism.languages.d.comment);

    Prism.languages.insertBefore('d', 'comment', {
      'token-string': {
        // Allow one level of nesting
        pattern: /\bq\{(?:\{[^}]*\}|[^}])*\}/,
        alias: 'string'
      }
    });

    Prism.languages.insertBefore('d', 'keyword', {
      property: /\B@\w*/
    });

    Prism.languages.insertBefore('d', 'function', {
      register: {
        // Iasm registers
        pattern: /\b(?:[ABCD][LHX]|E[ABCD]X|E?(?:BP|SP|DI|SI)|[ECSDGF]S|CR[0234]|DR[012367]|TR[3-7]|X?MM[0-7]|R[ABCD]X|[BS]PL|R[BS]P|[DS]IL|R[DS]I|R(?:[89]|1[0-5])[BWD]?|XMM(?:[89]|1[0-5])|YMM(?:1[0-5]|\d))\b|\bST(?:\([0-7]\)|\b)/,
        alias: 'variable'
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/dart.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/dart.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'dart',
  init: function init(Prism) {
    Prism.languages.dart = Prism.languages.extend('clike', {
      string: [{
        pattern: /r?("""|''')[\s\S]*?\1/,
        greedy: true
      }, {
        pattern: /r?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      }],
      keyword: [/\b(?:async|sync|yield)\*/, /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|default|deferred|do|dynamic|else|enum|export|external|extends|factory|final|finally|for|get|if|implements|import|in|library|new|null|operator|part|rethrow|return|set|static|super|switch|this|throw|try|typedef|var|void|while|with|yield)\b/],
      operator: /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
    });

    Prism.languages.insertBefore('dart', 'function', {
      metadata: {
        pattern: /@\w+/,
        alias: 'symbol'
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/diff.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/diff.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'diff',
  init: function init(Prism) {
    Prism.languages.diff = {
      coord: [
      // Match all kinds of coord lines (prefixed by "+++", "---" or "***").
      /^(?:\*{3}|-{3}|\+{3}).*$/m,
      // Match "@@ ... @@" coord lines in unified diff.
      /^@@.*@@$/m,
      // Match coord lines in normal diff (starts with a number).
      /^\d+.*$/m],

      // Match inserted and deleted lines. Support both +/- and >/< styles.
      deleted: /^[-<].*$/m,
      inserted: /^[+>].*$/m,

      // Match "different" lines (prefixed with "!") in context diff.
      diff: {
        pattern: /^!(?!!).+$/m,
        alias: 'important'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/django.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/django.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'django',
  init: function init(Prism) {
    // Django/Jinja2 syntax definition for Prism.js <http://prismjs.com> syntax highlighter.
    // Mostly it works OK but can paint code incorrectly on complex html/template tag combinations.

    var _django_template = {
      property: {
        pattern: /(?:{{|{%)[\s\S]*?(?:%}|}})/g,
        greedy: true,
        inside: {
          string: {
            pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
            greedy: true
          },
          keyword: /\b(?:\||load|verbatim|widthratio|ssi|firstof|for|url|ifchanged|csrf_token|lorem|ifnotequal|autoescape|now|templatetag|debug|cycle|ifequal|regroup|comment|filter|endfilter|if|spaceless|with|extends|block|include|else|empty|endif|endfor|as|endblock|endautoescape|endverbatim|trans|endtrans|[Tt]rue|[Ff]alse|[Nn]one|in|is|static|macro|endmacro|call|endcall|set|endset|raw|endraw)\b/,
          operator: /[-+=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
          function: /\b(?:_|abs|add|addslashes|attr|batch|callable|capfirst|capitalize|center|count|cut|d|date|default|default_if_none|defined|dictsort|dictsortreversed|divisibleby|e|equalto|escape|escaped|escapejs|even|filesizeformat|first|float|floatformat|force_escape|forceescape|format|get_digit|groupby|indent|int|iriencode|iterable|join|last|length|length_is|linebreaks|linebreaksbr|linenumbers|list|ljust|lower|make_list|map|mapping|number|odd|phone2numeric|pluralize|pprint|random|reject|rejectattr|removetags|replace|reverse|rjust|round|safe|safeseq|sameas|select|selectattr|sequence|slice|slugify|sort|string|stringformat|striptags|sum|time|timesince|timeuntil|title|trim|truncate|truncatechars|truncatechars_html|truncatewords|truncatewords_html|undefined|unordered_list|upper|urlencode|urlize|urlizetrunc|wordcount|wordwrap|xmlattr|yesno)\b/,
          important: /\b-?\d+(?:\.\d+)?\b/,
          variable: /\b\w+?\b/,
          punctuation: /[[\];(),.:]/
        }
      }
    };

    Prism.languages.django = Prism.languages.extend('markup', {
      comment: /(?:<!--|{#)[\s\S]*?(?:#}|-->)/
    });
    // Updated html tag pattern to allow template tags inside html tags
    Prism.languages.django.tag.pattern = /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^>=]+))?)*\s*\/?>/i;
    Prism.languages.insertBefore('django', 'entity', _django_template);
    Prism.languages.insertBefore('inside', 'tag', _django_template, Prism.languages.django.tag);

    if (Prism.languages.javascript) {
      // Combine js code and template tags painting inside <script> blocks
      Prism.languages.insertBefore('inside', 'string', _django_template, Prism.languages.django.script);
      Prism.languages.django.script.inside.string.inside = _django_template;
    }
    if (Prism.languages.css) {
      // Combine css code and template tags painting inside <style> blocks
      Prism.languages.insertBefore('inside', 'atrule', { tag: _django_template.property }, Prism.languages.django.style);
      Prism.languages.django.style.inside.string.inside = _django_template;
    }

    // Add an Jinja2 alias
    Prism.languages.jinja2 = Prism.languages.django;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/docker.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/docker.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'docker',
  init: function init(Prism) {
    Prism.languages.docker = {
      keyword: {
        pattern: /(^\s*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)/im,
        lookbehind: true
      },
      string: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/,
      comment: /#.*/,
      punctuation: /---|\.\.\.|[:[\]{}\-,|>?]/
    };

    Prism.languages.dockerfile = Prism.languages.docker;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/eiffel.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/eiffel.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'eiffel',
  init: function init(Prism) {
    Prism.languages.eiffel = {
      comment: /--.*/,
      string: [
      // Aligned-verbatim-strings
      {
        pattern: /"([^[]*)\[[\s\S]*?\]\1"/,
        greedy: true
      },
      // Non-aligned-verbatim-strings
      {
        pattern: /"([^{]*)\{[\s\S]*?\}\1"/,
        greedy: true
      },
      // Single-line string
      {
        pattern: /"(?:%\s+%|%.|[^%"\r\n])*"/,
        greedy: true
      }],
      // normal char | special char | char code
      char: /'(?:%.|[^%'\r\n])+'/,
      keyword: /\b(?:across|agent|alias|all|and|attached|as|assign|attribute|check|class|convert|create|Current|debug|deferred|detachable|do|else|elseif|end|ensure|expanded|export|external|feature|from|frozen|if|implies|inherit|inspect|invariant|like|local|loop|not|note|obsolete|old|once|or|Precursor|redefine|rename|require|rescue|Result|retry|select|separate|some|then|undefine|until|variant|Void|when|xor)\b/i,
      boolean: /\b(?:True|False)\b/i,
      // Convention: class-names are always all upper-case characters
      'class-name': {
        pattern: /\b[A-Z][\dA-Z_]*\b/,
        alias: 'builtin'
      },
      number: [
      // hexa | octal | bin
      /\b0[xcb][\da-f](?:_*[\da-f])*\b/i,
      // Decimal
      /(?:\d(?:_*\d)*)?\.(?:(?:\d(?:_*\d)*)?e[+-]?)?\d(?:_*\d)*|\d(?:_*\d)*\.?/i],
      punctuation: /:=|<<|>>|\(\||\|\)|->|\.(?=\w)|[{}[\];(),:?]/,
      operator: /\\\\|\|\.\.\||\.\.|\/[~\/=]?|[><]=?|[-+*^=~]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/elixir.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/elixir.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'elixir',
  init: function init(Prism) {
    Prism.languages.elixir = {
      comment: {
        pattern: /#.*/m,
        lookbehind: true
      },
      // ~r"""foo""" (multi-line), ~r'''foo''' (multi-line), ~r/foo/, ~r|foo|, ~r"foo", ~r'foo', ~r(foo), ~r[foo], ~r{foo}, ~r<foo>
      regex: {
        pattern: /~[rR](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|[^\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[uismxfr]*/,
        greedy: true
      },
      string: [{
        // ~s"""foo""" (multi-line), ~s'''foo''' (multi-line), ~s/foo/, ~s|foo|, ~s"foo", ~s'foo', ~s(foo), ~s[foo], ~s{foo} (with interpolation care), ~s<foo>
        pattern: /~[cCsSwW](?:("""|''')(?:\\[\s\S]|(?!\1)[^\\])+\1|([\/|"'])(?:\\.|(?!\2)[^\\\r\n])+\2|\((?:\\.|[^\\)\r\n])+\)|\[(?:\\.|[^\\\]\r\n])+\]|\{(?:\\.|#\{[^}]+\}|[^\\}\r\n])+\}|<(?:\\.|[^\\>\r\n])+>)[csa]?/,
        greedy: true,
        inside: {
          // See interpolation below
        }
      }, {
        pattern: /("""|''')[\s\S]*?\1/,
        greedy: true,
        inside: {
          // See interpolation below
        }
      }, {
        // Multi-line strings are allowed
        pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true,
        inside: {
          // See interpolation below
        }
      }],
      atom: {
        // Look-behind prevents bad highlighting of the :: operator
        pattern: /(^|[^:]):\w+/,
        lookbehind: true,
        alias: 'symbol'
      },
      // Look-ahead prevents bad highlighting of the :: operator
      'attr-name': /\w+:(?!:)/,
      capture: {
        // Look-behind prevents bad highlighting of the && operator
        pattern: /(^|[^&])&(?:[^&\s\d()][^\s()]*|(?=\())/,
        lookbehind: true,
        alias: 'function'
      },
      argument: {
        // Look-behind prevents bad highlighting of the && operator
        pattern: /(^|[^&])&\d+/,
        lookbehind: true,
        alias: 'variable'
      },
      attribute: {
        pattern: /@[\S]+/,
        alias: 'variable'
      },
      number: /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
      keyword: /\b(?:after|alias|and|case|catch|cond|def(?:callback|exception|impl|module|p|protocol|struct)?|do|else|end|fn|for|if|import|not|or|require|rescue|try|unless|use|when)\b/,
      boolean: /\b(?:true|false|nil)\b/,
      operator: [/\bin\b|&&?|\|[|>]?|\\\\|::|\.\.\.?|\+\+?|-[->]?|<[-=>]|>=|!==?|\B!|=(?:==?|[>~])?|[*\/^]/, {
        // We don't want to match <<
        pattern: /([^<])<(?!<)/,
        lookbehind: true
      }, {
        // We don't want to match >>
        pattern: /([^>])>(?!>)/,
        lookbehind: true
      }],
      punctuation: /<<|>>|[.,%\[\]{}()]/
    };

    Prism.languages.elixir.string.forEach(function (o) {
      o.inside = {
        interpolation: {
          pattern: /#\{[^}]+\}/,
          inside: {
            delimiter: {
              pattern: /^#\{|\}$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.elixir
          }
        }
      };
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/erlang.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/erlang.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'erlang',
  init: function init(Prism) {
    Prism.languages.erlang = {
      comment: /%.+/,
      string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"/,
        greedy: true
      },
      'quoted-function': {
        pattern: /'(?:\\.|[^\\'\r\n])+'(?=\()/,
        alias: 'function'
      },
      'quoted-atom': {
        pattern: /'(?:\\.|[^\\'\r\n])+'/,
        alias: 'atom'
      },
      boolean: /\b(?:true|false)\b/,
      keyword: /\b(?:fun|when|case|of|end|if|receive|after|try|catch)\b/,
      number: [/\$\\?./, /\d+#[a-z0-9]+/i, /(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i],
      function: /\b[a-z][\w@]*(?=\()/,
      variable: {
        // Look-behind is used to prevent wrong highlighting of atoms containing "@"
        pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
        lookbehind: true
      },
      operator: [/[=\/<>:]=|=[:\/]=|\+\+?|--?|[=*\/!]|\b(?:bnot|div|rem|band|bor|bxor|bsl|bsr|not|and|or|xor|orelse|andalso)\b/, {
        // We don't want to match <<
        pattern: /(^|[^<])<(?!<)/,
        lookbehind: true
      }, {
        // We don't want to match >>
        pattern: /(^|[^>])>(?!>)/,
        lookbehind: true
      }],
      atom: /\b[a-z][\w@]*/,
      punctuation: /[()[\]{}:;,.#|]|<<|>>/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/flow.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/flow.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'flow',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.flow = Prism.languages.extend('javascript', {});

      Prism.languages.insertBefore('flow', 'keyword', {
        type: [{
          pattern: /\b(?:[Nn]umber|[Ss]tring|[Bb]oolean|Function|any|mixed|null|void)\b/,
          alias: 'tag'
        }]
      });
      Prism.languages.flow['function-variable'].pattern = /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i;

      Prism.languages.insertBefore('flow', 'operator', {
        'flow-punctuation': {
          pattern: /\{\||\|\}/,
          alias: 'punctuation'
        }
      });

      if (Prism.util.type(Prism.languages.flow.keyword) !== 'Array') {
        Prism.languages.flow.keyword = [Prism.languages.flow.keyword];
      }
      Prism.languages.flow.keyword.unshift({
        pattern: /(^|[^$]\b)(?:type|opaque|declare|Class)\b(?!\$)/,
        lookbehind: true
      }, {
        pattern: /(^|[^$]\B)\$(?:await|Diff|Exact|Keys|ObjMap|PropertyType|Shape|Record|Supertype|Subtype|Enum)\b(?!\$)/,
        lookbehind: true
      });
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/fortran.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/fortran.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'fortran',
  init: function init(Prism) {
    Prism.languages.fortran = {
      'quoted-number': {
        pattern: /[BOZ](['"])[A-F0-9]+\1/i,
        alias: 'number'
      },
      string: {
        pattern: /(?:\w+_)?(['"])(?:\1\1|&(?:\r\n?|\n)(?:\s*!.+(?:\r\n?|\n))?|(?!\1).)*(?:\1|&)/,
        inside: {
          comment: {
            pattern: /(&(?:\r\n?|\n)\s*)!.*/,
            lookbehind: true
          }
        }
      },
      comment: {
        pattern: /!.*/,
        greedy: true
      },
      boolean: /\.(?:TRUE|FALSE)\.(?:_\w+)?/i,
      number: /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[ED][+-]?\d+)?(?:_\w+)?/i,
      keyword: [
      // Types
      /\b(?:INTEGER|REAL|DOUBLE ?PRECISION|COMPLEX|CHARACTER|LOGICAL)\b/i,
      // END statements
      /\b(?:END ?)?(?:BLOCK ?DATA|DO|FILE|FORALL|FUNCTION|IF|INTERFACE|MODULE(?! PROCEDURE)|PROGRAM|SELECT|SUBROUTINE|TYPE|WHERE)\b/i,
      // Statements
      /\b(?:ALLOCATABLE|ALLOCATE|BACKSPACE|CALL|CASE|CLOSE|COMMON|CONTAINS|CONTINUE|CYCLE|DATA|DEALLOCATE|DIMENSION|DO|END|EQUIVALENCE|EXIT|EXTERNAL|FORMAT|GO ?TO|IMPLICIT(?: NONE)?|INQUIRE|INTENT|INTRINSIC|MODULE PROCEDURE|NAMELIST|NULLIFY|OPEN|OPTIONAL|PARAMETER|POINTER|PRINT|PRIVATE|PUBLIC|READ|RETURN|REWIND|SAVE|SELECT|STOP|TARGET|WHILE|WRITE)\b/i,
      // Others
      /\b(?:ASSIGNMENT|DEFAULT|ELEMENTAL|ELSE|ELSEWHERE|ELSEIF|ENTRY|IN|INCLUDE|INOUT|KIND|NULL|ONLY|OPERATOR|OUT|PURE|RECURSIVE|RESULT|SEQUENCE|STAT|THEN|USE)\b/i],
      operator: [/\*\*|\/\/|=>|[=\/]=|[<>]=?|::|[+\-*=%]|\.(?:EQ|NE|LT|LE|GT|GE|NOT|AND|OR|EQV|NEQV)\.|\.[A-Z]+\./i, {
        // Use lookbehind to prevent confusion with (/ /)
        pattern: /(^|(?!\().)\/(?!\))/,
        lookbehind: true
      }],
      punctuation: /\(\/|\/\)|[(),;:&]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/fsharp.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/fsharp.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'fsharp',
  init: function init(Prism) {
    Prism.languages.fsharp = Prism.languages.extend('clike', {
      comment: [{
        pattern: /(^|[^\\])\(\*[\s\S]*?\*\)/,
        lookbehind: true
      }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true
      }],
      keyword: /\b(?:let|return|use|yield)(?:!\B|\b)|\b(abstract|and|as|assert|base|begin|class|default|delegate|do|done|downcast|downto|elif|else|end|exception|extern|false|finally|for|fun|function|global|if|in|inherit|inline|interface|internal|lazy|match|member|module|mutable|namespace|new|not|null|of|open|or|override|private|public|rec|select|static|struct|then|to|true|try|type|upcast|val|void|when|while|with|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|include|method|mixin|object|parallel|process|protected|pure|sealed|tailcall|trait|virtual|volatile)\b/,
      string: {
        pattern: /(?:"""[\s\S]*?"""|@"(?:""|[^"])*"|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1)B?/,
        greedy: true
      },
      number: [/\b0x[\da-fA-F]+(?:un|lf|LF)?\b/, /\b0b[01]+(?:y|uy)?\b/, /(?:\b\d+\.?\d*|\B\.\d+)(?:[fm]|e[+-]?\d+)?\b/i, /\b\d+(?:[IlLsy]|u[lsy]?|UL)?\b/]
    });
    Prism.languages.insertBefore('fsharp', 'keyword', {
      preprocessor: {
        pattern: /^[^\r\n\S]*#.*/m,
        alias: 'property',
        inside: {
          directive: {
            pattern: /(\s*#)\b(?:else|endif|if|light|line|nowarn)\b/,
            lookbehind: true,
            alias: 'keyword'
          }
        }
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/gedcom.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/gedcom.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'gedcom',
  init: function init(Prism) {
    Prism.languages.gedcom = {
      'line-value': {
        // Preceded by level, optional pointer, and tag
        pattern: /(^\s*\d+ +(?:@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@ +)?\w+ +).+/m,
        lookbehind: true,
        inside: {
          pointer: {
            pattern: /^@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@$/,
            alias: 'variable'
          }
        }
      },
      tag: {
        // Preceded by level and optional pointer
        pattern: /(^\s*\d+ +(?:@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@ +)?)\w+/m,
        lookbehind: true,
        alias: 'string'
      },
      level: {
        pattern: /(^\s*)\d+/m,
        lookbehind: true,
        alias: 'number'
      },
      pointer: {
        pattern: /@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@/,
        alias: 'variable'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/gherkin.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/gherkin.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'gherkin',
  init: function init(Prism) {
    Prism.languages.gherkin = {
      pystring: {
        pattern: /("""|''')[\s\S]+?\1/,
        alias: 'string'
      },
      comment: {
        pattern: /((?:^|\r?\n|\r)[ \t]*)#.*/,
        lookbehind: true
      },
      tag: {
        pattern: /((?:^|\r?\n|\r)[ \t]*)@\S*/,
        lookbehind: true
      },
      feature: {
        pattern: /((?:^|\r?\n|\r)[ \t]*)(?:Ability|Ahoy matey!|Arwedd|Aspekt|Besigheid Behoefte|Business Need|Caracteristica|Característica|Egenskab|Egenskap|Eiginleiki|Feature|Fīča|Fitur|Fonctionnalité|Fonksyonalite|Funcionalidade|Funcionalitat|Functionalitate|Funcţionalitate|Funcționalitate|Functionaliteit|Fungsi|Funkcia|Funkcija|Funkcionalitāte|Funkcionalnost|Funkcja|Funksie|Funktionalität|Funktionalitéit|Funzionalità|Hwaet|Hwæt|Jellemző|Karakteristik|laH|Lastnost|Mak|Mogucnost|Mogućnost|Moznosti|Možnosti|OH HAI|Omadus|Ominaisuus|Osobina|Özellik|perbogh|poQbogh malja'|Potrzeba biznesowa|Požadavek|Požiadavka|Pretty much|Qap|Qu'meH 'ut|Savybė|Tính năng|Trajto|Vermoë|Vlastnosť|Właściwość|Značilnost|Δυνατότητα|Λειτουργία|Могућност|Мөмкинлек|Особина|Свойство|Үзенчәлеклелек|Функционал|Функционалност|Функция|Функціонал|תכונה|خاصية|خصوصیت|صلاحیت|کاروبار کی ضرورت|وِیژگی|रूप लेख|ਖਾਸੀਅਤ|ਨਕਸ਼ ਨੁਹਾਰ|ਮੁਹਾਂਦਰਾ|గుణము|ಹೆಚ್ಚಳ|ความต้องการทางธุรกิจ|ความสามารถ|โครงหลัก|기능|フィーチャ|功能|機能):(?:[^:]+(?:\r?\n|\r|$))*/,
        lookbehind: true,
        inside: {
          important: {
            pattern: /(:)[^\r\n]+/,
            lookbehind: true
          },
          keyword: /[^:\r\n]+:/
        }
      },
      scenario: {
        pattern: /((?:^|\r?\n|\r)[ \t]*)(?:Abstract Scenario|Abstrakt Scenario|Achtergrond|Aer|Ær|Agtergrond|All y'all|Antecedentes|Antecedents|Atburðarás|Atburðarásir|Awww, look mate|B4|Background|Baggrund|Bakgrund|Bakgrunn|Bakgrunnur|Beispiele|Beispiller|Bối cảnh|Cefndir|Cenario|Cenário|Cenario de Fundo|Cenário de Fundo|Cenarios|Cenários|Contesto|Context|Contexte|Contexto|Conto|Contoh|Contone|Dæmi|Dasar|Dead men tell no tales|Delineacao do Cenario|Delineação do Cenário|Dis is what went down|Dữ liệu|Dyagram senaryo|Dyagram Senaryo|Egzanp|Ejemplos|Eksempler|Ekzemploj|Enghreifftiau|Esbozo do escenario|Escenari|Escenario|Esempi|Esquema de l'escenari|Esquema del escenario|Esquema do Cenario|Esquema do Cenário|Examples|EXAMPLZ|Exempel|Exemple|Exemples|Exemplos|First off|Fono|Forgatókönyv|Forgatókönyv vázlat|Fundo|Geçmiş|ghantoH|Grundlage|Hannergrond|Háttér|Heave to|Istorik|Juhtumid|Keadaan|Khung kịch bản|Khung tình huống|Kịch bản|Koncept|Konsep skenario|Kontèks|Kontekst|Kontekstas|Konteksts|Kontext|Konturo de la scenaro|Latar Belakang|lut|lut chovnatlh|lutmey|Lýsing Atburðarásar|Lýsing Dæma|Menggariskan Senario|MISHUN|MISHUN SRSLY|mo'|Náčrt Scenára|Náčrt Scénáře|Náčrt Scenáru|Oris scenarija|Örnekler|Osnova|Osnova Scenára|Osnova scénáře|Osnutek|Ozadje|Paraugs|Pavyzdžiai|Példák|Piemēri|Plan du scénario|Plan du Scénario|Plan senaryo|Plan Senaryo|Plang vum Szenario|Pozadí|Pozadie|Pozadina|Príklady|Příklady|Primer|Primeri|Primjeri|Przykłady|Raamstsenaarium|Reckon it's like|Rerefons|Scenár|Scénář|Scenarie|Scenarij|Scenarijai|Scenarijaus šablonas|Scenariji|Scenārijs|Scenārijs pēc parauga|Scenarijus|Scenario|Scénario|Scenario Amlinellol|Scenario Outline|Scenario Template|Scenariomal|Scenariomall|Scenarios|Scenariu|Scenariusz|Scenaro|Schema dello scenario|Se ðe|Se the|Se þe|Senario|Senaryo|Senaryo deskripsyon|Senaryo Deskripsyon|Senaryo taslağı|Shiver me timbers|Situācija|Situai|Situasie|Situasie Uiteensetting|Skenario|Skenario konsep|Skica|Structura scenariu|Structură scenariu|Struktura scenarija|Stsenaarium|Swa|Swa hwaer swa|Swa hwær swa|Szablon scenariusza|Szenario|Szenariogrundriss|Tapaukset|Tapaus|Tapausaihio|Taust|Tausta|Template Keadaan|Template Senario|Template Situai|The thing of it is|Tình huống|Variantai|Voorbeelde|Voorbeelden|Wharrimean is|Yo\-ho\-ho|You'll wanna|Założenia|Παραδείγματα|Περιγραφή Σεναρίου|Σενάρια|Σενάριο|Υπόβαθρο|Кереш|Контекст|Концепт|Мисаллар|Мисоллар|Основа|Передумова|Позадина|Предистория|Предыстория|Приклади|Пример|Примери|Примеры|Рамка на сценарий|Скица|Структура сценарија|Структура сценария|Структура сценарію|Сценарий|Сценарий структураси|Сценарийның төзелеше|Сценарији|Сценарио|Сценарій|Тарих|Үрнәкләр|דוגמאות|רקע|תבנית תרחיש|תרחיש|الخلفية|الگوی سناریو|امثلة|پس منظر|زمینه|سناریو|سيناريو|سيناريو مخطط|مثالیں|منظر نامے کا خاکہ|منظرنامہ|نمونه ها|उदाहरण|परिदृश्य|परिदृश्य रूपरेखा|पृष्ठभूमि|ਉਦਾਹਰਨਾਂ|ਪਟਕਥਾ|ਪਟਕਥਾ ਢਾਂਚਾ|ਪਟਕਥਾ ਰੂਪ ਰੇਖਾ|ਪਿਛੋਕੜ|ఉదాహరణలు|కథనం|నేపథ్యం|సన్నివేశం|ಉದಾಹರಣೆಗಳು|ಕಥಾಸಾರಾಂಶ|ವಿವರಣೆ|ಹಿನ್ನೆಲೆ|โครงสร้างของเหตุการณ์|ชุดของตัวอย่าง|ชุดของเหตุการณ์|แนวคิด|สรุปเหตุการณ์|เหตุการณ์|배경|시나리오|시나리오 개요|예|サンプル|シナリオ|シナリオアウトライン|シナリオテンプレ|シナリオテンプレート|テンプレ|例|例子|剧本|剧本大纲|劇本|劇本大綱|场景|场景大纲|場景|場景大綱|背景):[^:\r\n]*/,
        lookbehind: true,
        inside: {
          important: {
            pattern: /(:)[^\r\n]*/,
            lookbehind: true
          },
          keyword: /[^:\r\n]+:/
        }
      },
      'table-body': {
        // Look-behind is used to skip the table head, which has the same format as any table row
        pattern: /((?:\r?\n|\r)[ \t]*\|.+\|[^\r\n]*)+/,
        lookbehind: true,
        inside: {
          outline: {
            pattern: /<[^>]+?>/,
            alias: 'variable'
          },
          td: {
            pattern: /\s*[^\s|][^|]*/,
            alias: 'string'
          },
          punctuation: /\|/
        }
      },
      'table-head': {
        pattern: /(?:\r?\n|\r)[ \t]*\|.+\|[^\r\n]*/,
        inside: {
          th: {
            pattern: /\s*[^\s|][^|]*/,
            alias: 'variable'
          },
          punctuation: /\|/
        }
      },
      atrule: {
        pattern: /((?:\r?\n|\r)[ \t]+)(?:'ach|'a|'ej|7|a|A také|A taktiež|A tiež|A zároveň|Aber|Ac|Adott|Akkor|Ak|Aleshores|Ale|Ali|Allora|Alors|Als|Ama|Amennyiben|Amikor|Ampak|an|AN|Ananging|And y'all|And|Angenommen|Anrhegedig a|An|Apabila|Atès|Atesa|Atunci|Avast!|Aye|A|awer|Bagi|Banjur|Bet|Biết|Blimey!|Buh|But at the end of the day I reckon|But y'all|But|BUT|Cal|Când|Cando|Cand|Ce|Cuando|Če|Ða ðe|Ða|Dadas|Dada|Dados|Dado|DaH ghu' bejlu'|dann|Dann|Dano|Dan|Dar|Dat fiind|Data|Date fiind|Date|Dati fiind|Dati|Daţi fiind|Dați fiind|Dato|DEN|Den youse gotta|Dengan|De|Diberi|Diyelim ki|Donada|Donat|Donitaĵo|Do|Dun|Duota|Ðurh|Eeldades|Ef|Eğer ki|Entao|Então|Entón|Entonces|En|Epi|E|És|Etant donnée|Etant donné|Et|Étant données|Étant donnée|Étant donné|Etant données|Etant donnés|Étant donnés|Fakat|Gangway!|Gdy|Gegeben seien|Gegeben sei|Gegeven|Gegewe|ghu' noblu'|Gitt|Given y'all|Given|Givet|Givun|Ha|Cho|I CAN HAZ|In|Ir|It's just unbelievable|I|Ja|Jeśli|Jeżeli|Kadar|Kada|Kad|Kai|Kaj|Když|Keď|Kemudian|Ketika|Khi|Kiedy|Ko|Kuid|Kui|Kun|Lan|latlh|Le sa a|Let go and haul|Le|Lè sa a|Lè|Logo|Lorsqu'<|Lorsque|mä|Maar|Mais|Mając|Majd|Maka|Manawa|Mas|Ma|Menawa|Men|Mutta|Nalikaning|Nalika|Nanging|Når|När|Nato|Nhưng|Niin|Njuk|O zaman|Og|Och|Oletetaan|Onda|Ond|Oraz|Pak|Pero|Però|Podano|Pokiaľ|Pokud|Potem|Potom|Privzeto|Pryd|qaSDI'|Quando|Quand|Quan|Så|Sed|Se|Siis|Sipoze ke|Sipoze Ke|Sipoze|Si|Şi|Și|Soit|Stel|Tada|Tad|Takrat|Tak|Tapi|Ter|Tetapi|Tha the|Tha|Then y'all|Then|Thì|Thurh|Toda|Too right|ugeholl|Und|Un|Và|vaj|Vendar|Ve|wann|Wanneer|WEN|Wenn|When y'all|When|Wtedy|Wun|Y'know|Yeah nah|Yna|Youse know like when|Youse know when youse got|Y|Za predpokladu|Za předpokladu|Zadani|Zadano|Zadan|Zadate|Zadato|Zakładając|Zaradi|Zatati|Þa þe|Þa|Þá|Þegar|Þurh|Αλλά|Δεδομένου|Και|Όταν|Τότε|А також|Агар|Але|Али|Аммо|А|Әгәр|Әйтик|Әмма|Бирок|Ва|Вә|Дадено|Дано|Допустим|Если|Задате|Задати|Задато|И|І|К тому же|Када|Кад|Когато|Когда|Коли|Ләкин|Лекин|Нәтиҗәдә|Нехай|Но|Онда|Припустимо, що|Припустимо|Пусть|Также|Та|Тогда|Тоді|То|Унда|Һәм|Якщо|אבל|אזי|אז|בהינתן|וגם|כאשר|آنگاه|اذاً|اگر|اما|اور|با فرض|بالفرض|بفرض|پھر|تب|ثم|جب|عندما|فرض کیا|لكن|لیکن|متى|هنگامی|و|अगर|और|कदा|किन्तु|चूंकि|जब|तथा|तदा|तब|परन्तु|पर|यदि|ਅਤੇ|ਜਦੋਂ|ਜਿਵੇਂ ਕਿ|ਜੇਕਰ|ਤਦ|ਪਰ|అప్పుడు|ఈ పరిస్థితిలో|కాని|చెప్పబడినది|మరియు|ಆದರೆ|ನಂತರ|ನೀಡಿದ|ಮತ್ತು|ಸ್ಥಿತಿಯನ್ನು|กำหนดให้|ดังนั้น|แต่|เมื่อ|และ|그러면<|그리고<|단<|만약<|만일<|먼저<|조건<|하지만<|かつ<|しかし<|ただし<|ならば<|もし<|並且<|但し<|但是<|假如<|假定<|假設<|假设<|前提<|同时<|同時<|并且<|当<|當<|而且<|那么<|那麼<)(?=[ \t]+)/,
        lookbehind: true
      },
      string: {
        pattern: /"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/,
        inside: {
          outline: {
            pattern: /<[^>]+?>/,
            alias: 'variable'
          }
        }
      },
      outline: {
        pattern: /<[^>]+?>/,
        alias: 'variable'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/git.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/git.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
					value: true
});
exports.default = {
					language: 'git',
					init: function init(Prism) {
										Prism.languages.git = {
															/*
               * A simple one line comment like in a git status command
               * For instance:
               * $ git status
               * # On branch infinite-scroll
               * # Your branch and 'origin/sharedBranches/frontendTeam/infinite-scroll' have diverged,
               * # and have 1 and 2 different commits each, respectively.
               * nothing to commit (working directory clean)
               */
															comment: /^#.*/m,

															/*
               * Regexp to match the changed lines in a git diff output. Check the example below.
               */
															deleted: /^[-–].*/m,
															inserted: /^\+.*/m,

															/*
               * a string (double and simple quote)
               */
															string: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/m,

															/*
               * a git command. It starts with a random prompt finishing by a $, then "git" then some other parameters
               * For instance:
               * $ git add file.txt
               */
															command: {
																				pattern: /^.*\$ git .*$/m,
																				inside: {
																									/*
                         * A git command can contain a parameter starting by a single or a double dash followed by a string
                         * For instance:
                         * $ git diff --cached
                         * $ git log -p
                         */
																									parameter: /\s--?\w+/m
																				}
															},

															/*
               * Coordinates displayed in a git diff command
               * For instance:
               * $ git diff
               * diff --git file.txt file.txt
               * index 6214953..1d54a52 100644
               * --- file.txt
               * +++ file.txt
               * @@ -1 +1,2 @@
               * -Here's my tetx file
               * +Here's my text file
               * +And this is the second line
               */
															coord: /^@@.*@@$/m,

															/*
               * Match a "commit [SHA1]" line in a git log output.
               * For instance:
               * $ git log
               * commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09
               * Author: lgiraudel
               * Date:   Mon Feb 17 11:18:34 2014 +0100
               *
               *     Add of a new line
               */
															commit_sha1: /^commit \w{40}$/m
										};
					}
};

/***/ }),

/***/ "./node_modules/reprism/languages/glsl.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/glsl.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'glsl',
  init: function init(Prism) {
    Prism.languages.glsl = Prism.languages.extend('clike', {
      comment: [/\/\*[\s\S]*?\*\//, /\/\/(?:\\(?:\r\n|[\s\S])|[^\\\r\n])*/],
      number: /(?:\b0x[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ulf]*/i,
      keyword: /\b(?:attribute|const|uniform|varying|buffer|shared|coherent|volatile|restrict|readonly|writeonly|atomic_uint|layout|centroid|flat|smooth|noperspective|patch|sample|break|continue|do|for|while|switch|case|default|if|else|subroutine|in|out|inout|float|double|int|void|bool|true|false|invariant|precise|discard|return|d?mat[234](?:x[234])?|[ibdu]?vec[234]|uint|lowp|mediump|highp|precision|[iu]?sampler[123]D|[iu]?samplerCube|sampler[12]DShadow|samplerCubeShadow|[iu]?sampler[12]DArray|sampler[12]DArrayShadow|[iu]?sampler2DRect|sampler2DRectShadow|[iu]?samplerBuffer|[iu]?sampler2DMS(?:Array)?|[iu]?samplerCubeArray|samplerCubeArrayShadow|[iu]?image[123]D|[iu]?image2DRect|[iu]?imageCube|[iu]?imageBuffer|[iu]?image[12]DArray|[iu]?imageCubeArray|[iu]?image2DMS(?:Array)?|struct|common|partition|active|asm|class|union|enum|typedef|template|this|resource|goto|inline|noinline|public|static|extern|external|interface|long|short|half|fixed|unsigned|superp|input|output|hvec[234]|fvec[234]|sampler3DRect|filter|sizeof|cast|namespace|using)\b/
    });

    Prism.languages.insertBefore('glsl', 'comment', {
      preprocessor: {
        pattern: /(^[ \t]*)#(?:(?:define|undef|if|ifdef|ifndef|else|elif|endif|error|pragma|extension|version|line)\b)?/m,
        lookbehind: true,
        alias: 'builtin'
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/go.js":
/*!**********************************************!*\
  !*** ./node_modules/reprism/languages/go.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'go',
  init: function init(Prism) {
    Prism.languages.go = Prism.languages.extend('clike', {
      keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
      builtin: /\b(?:bool|byte|complex(?:64|128)|error|float(?:32|64)|rune|string|u?int(?:8|16|32|64)?|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(?:ln)?|real|recover)\b/,
      boolean: /\b(?:_|iota|nil|true|false)\b/,
      operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
      number: /(?:\b0x[a-f\d]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
      string: {
        pattern: /(["'`])(\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: true
      }
    });
    delete Prism.languages.go['class-name'];
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/graphql.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/graphql.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'graphql',
  init: function init(Prism) {
    Prism.languages.graphql = {
      comment: /#.*/,
      string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"/,
        greedy: true
      },
      number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
      boolean: /\b(?:true|false)\b/,
      variable: /\$[a-z_]\w*/i,
      directive: {
        pattern: /@[a-z_]\w*/i,
        alias: 'function'
      },
      'attr-name': /[a-z_]\w*(?=\s*:)/i,
      keyword: [{
        pattern: /(fragment\s+(?!on)[a-z_]\w*\s+|\.{3}\s*)on\b/,
        lookbehind: true
      }, /\b(?:query|fragment|mutation)\b/],
      operator: /!|=|\.{3}/,
      punctuation: /[!(){}\[\]:=,]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/groovy.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/groovy.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'groovy',
  init: function init(Prism) {
    Prism.languages.groovy = Prism.languages.extend('clike', {
      keyword: /\b(?:as|def|in|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
      string: [{
        pattern: /("""|''')[\s\S]*?\1|(?:\$\/)(?:\$\/\$|[\s\S])*?\/\$/,
        greedy: true
      }, {
        pattern: /(["'\/])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      }],
      number: /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?[\d]+)?)[glidf]?\b/i,
      operator: {
        pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.{1,2}(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
        lookbehind: true
      },
      punctuation: /\.+|[{}[\];(),:$]/
    });

    Prism.languages.insertBefore('groovy', 'string', {
      shebang: {
        pattern: /#!.+/,
        alias: 'comment'
      }
    });

    Prism.languages.insertBefore('groovy', 'punctuation', {
      'spock-block': /\b(?:setup|given|when|then|and|cleanup|expect|where):/
    });

    Prism.languages.insertBefore('groovy', 'function', {
      annotation: {
        alias: 'punctuation',
        pattern: /(^|[^.])@\w+/,
        lookbehind: true
      }
    });

    // Handle string interpolation
    Prism.hooks.add('wrap', function (env) {
      if (env.language === 'groovy' && env.type === 'string') {
        var delimiter = env.content[0];

        if (delimiter != "'") {
          var pattern = /([^\\])(?:\$(?:\{.*?\}|[\w.]+))/;
          if (delimiter === '$') {
            pattern = /([^\$])(?:\$(?:\{.*?\}|[\w.]+))/;
          }

          // To prevent double HTML-encoding we have to decode env.content first
          env.content = env.content.replace(/&lt;/g, '<').replace(/&amp;/g, '&');

          env.content = Prism.highlight(env.content, {
            expression: {
              pattern: pattern,
              lookbehind: true,
              inside: Prism.languages.groovy
            }
          });

          env.classes.push(delimiter === '/' ? 'regex' : 'gstring');
        }
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/haml.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/haml.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'haml',
  init: function init(Prism) {
    /* TODO
    Handle multiline code after tag
     %foo= some |
    multiline |
    code |
    */

    (function (Prism) {
      Prism.languages.haml = {
        // Multiline stuff should appear before the rest

        'multiline-comment': {
          pattern: /((?:^|\r?\n|\r)([\t ]*))(?:\/|-#).*(?:(?:\r?\n|\r)\2[\t ]+.+)*/,
          lookbehind: true,
          alias: 'comment'
        },

        'multiline-code': [{
          pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*,[\t ]*(?:(?:\r?\n|\r)\2[\t ]+.*,[\t ]*)*(?:(?:\r?\n|\r)\2[\t ]+.+)/,
          lookbehind: true,
          inside: {
            rest: Prism.languages.ruby
          }
        }, {
          pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*\|[\t ]*(?:(?:\r?\n|\r)\2[\t ]+.*\|[\t ]*)*/,
          lookbehind: true,
          inside: {
            rest: Prism.languages.ruby
          }
        }],

        // See at the end of the file for known filters
        filter: {
          pattern: /((?:^|\r?\n|\r)([\t ]*)):[\w-]+(?:(?:\r?\n|\r)(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/,
          lookbehind: true,
          inside: {
            'filter-name': {
              pattern: /^:[\w-]+/,
              alias: 'variable'
            }
          }
        },

        markup: {
          pattern: /((?:^|\r?\n|\r)[\t ]*)<.+/,
          lookbehind: true,
          inside: {
            rest: Prism.languages.markup
          }
        },
        doctype: {
          pattern: /((?:^|\r?\n|\r)[\t ]*)!!!(?: .+)?/,
          lookbehind: true
        },
        tag: {
          // Allows for one nested group of braces
          pattern: /((?:^|\r?\n|\r)[\t ]*)[%.#][\w\-#.]*[\w\-](?:\([^)]+\)|\{(?:\{[^}]+\}|[^}])+\}|\[[^\]]+\])*[\/<>]*/,
          lookbehind: true,
          inside: {
            attributes: [{
              // Lookbehind tries to prevent interpolations from breaking it all
              // Allows for one nested group of braces
              pattern: /(^|[^#])\{(?:\{[^}]+\}|[^}])+\}/,
              lookbehind: true,
              inside: {
                rest: Prism.languages.ruby
              }
            }, {
              pattern: /\([^)]+\)/,
              inside: {
                'attr-value': {
                  pattern: /(=\s*)(?:"(?:\\.|[^\\"\r\n])*"|[^)\s]+)/,
                  lookbehind: true
                },
                'attr-name': /[\w:-]+(?=\s*!?=|\s*[,)])/,
                punctuation: /[=(),]/
              }
            }, {
              pattern: /\[[^\]]+\]/,
              inside: {
                rest: Prism.languages.ruby
              }
            }],
            punctuation: /[<>]/
          }
        },
        code: {
          pattern: /((?:^|\r?\n|\r)[\t ]*(?:[~-]|[&!]?=)).+/,
          lookbehind: true,
          inside: {
            rest: Prism.languages.ruby
          }
        },
        // Interpolations in plain text
        interpolation: {
          pattern: /#\{[^}]+\}/,
          inside: {
            delimiter: {
              pattern: /^#\{|\}$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.ruby
          }
        },
        punctuation: {
          pattern: /((?:^|\r?\n|\r)[\t ]*)[~=\-&!]+/,
          lookbehind: true
        }
      };

      var filter_pattern = '((?:^|\\r?\\n|\\r)([\\t ]*)):{{filter_name}}(?:(?:\\r?\\n|\\r)(?:\\2[\\t ]+.+|\\s*?(?=\\r?\\n|\\r)))+';

      // Non exhaustive list of available filters and associated languages
      var filters = ['css', { filter: 'coffee', language: 'coffeescript' }, 'erb', 'javascript', 'less', 'markdown', 'ruby', 'scss', 'textile'];
      var all_filters = {};
      for (var i = 0, l = filters.length; i < l; i++) {
        var filter = filters[i];
        filter = typeof filter === 'string' ? { filter: filter, language: filter } : filter;
        if (Prism.languages[filter.language]) {
          all_filters['filter-' + filter.filter] = {
            pattern: RegExp(filter_pattern.replace('{{filter_name}}', filter.filter)),
            lookbehind: true,
            inside: {
              'filter-name': {
                pattern: /^:[\w-]+/,
                alias: 'variable'
              },
              rest: Prism.languages[filter.language]
            }
          };
        }
      }

      Prism.languages.insertBefore('haml', 'filter', all_filters);
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/handlebars.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/handlebars.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'handlebars',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.handlebars = {
        comment: /\{\{![\s\S]*?\}\}/,
        delimiter: {
          pattern: /^\{\{\{?|\}\}\}?$/i,
          alias: 'punctuation'
        },
        string: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
        boolean: /\b(?:true|false)\b/,
        block: {
          pattern: /^(\s*~?\s*)[#\/]\S+?(?=\s*~?\s*$|\s)/i,
          lookbehind: true,
          alias: 'keyword'
        },
        brackets: {
          pattern: /\[[^\]]+\]/,
          inside: {
            punctuation: /\[|\]/,
            variable: /[\s\S]+/
          }
        },
        punctuation: /[!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]/,
        variable: /[^!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~\s]+/
      };

      Prism.hooks.add('before-tokenize', function (env) {
        var handlebarsPattern = /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g;
        Prism.languages['markup-templating'].buildPlaceholders(env, 'handlebars', handlebarsPattern);
      });

      Prism.hooks.add('after-tokenize', function (env) {
        Prism.languages['markup-templating'].tokenizePlaceholders(env, 'handlebars');
      });
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/haskell.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/haskell.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'haskell',
  init: function init(Prism) {
    Prism.languages.haskell = {
      comment: {
        pattern: /(^|[^-!#$%*+=?&@|~.:<>^\\\/])(?:--[^-!#$%*+=?&@|~.:<>^\\\/].*|{-[\s\S]*?-})/m,
        lookbehind: true
      },
      char: /'(?:[^\\']|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|\d+|o[0-7]+|x[0-9a-fA-F]+))'/,
      string: {
        pattern: /"(?:[^\\"]|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|\d+|o[0-7]+|x[0-9a-fA-F]+)|\\\s+\\)*"/,
        greedy: true
      },
      keyword: /\b(?:case|class|data|deriving|do|else|if|in|infixl|infixr|instance|let|module|newtype|of|primitive|then|type|where)\b/,
      import_statement: {
        // The imported or hidden names are not included in this import
        // statement. This is because we want to highlight those exactly like
        // we do for the names in the program.
        pattern: /((?:\r?\n|\r|^)\s*)import\s+(?:qualified\s+)?(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*(?:\s+as\s+(?:[A-Z][_a-zA-Z0-9']*)(?:\.[A-Z][\w']*)*)?(?:\s+hiding\b)?/m,
        lookbehind: true,
        inside: {
          keyword: /\b(?:import|qualified|as|hiding)\b/
        }
      },
      // These are builtin variables only. Constructors are highlighted later as a constant.
      builtin: /\b(?:abs|acos|acosh|all|and|any|appendFile|approxRational|asTypeOf|asin|asinh|atan|atan2|atanh|basicIORun|break|catch|ceiling|chr|compare|concat|concatMap|const|cos|cosh|curry|cycle|decodeFloat|denominator|digitToInt|div|divMod|drop|dropWhile|either|elem|encodeFloat|enumFrom|enumFromThen|enumFromThenTo|enumFromTo|error|even|exp|exponent|fail|filter|flip|floatDigits|floatRadix|floatRange|floor|fmap|foldl|foldl1|foldr|foldr1|fromDouble|fromEnum|fromInt|fromInteger|fromIntegral|fromRational|fst|gcd|getChar|getContents|getLine|group|head|id|inRange|index|init|intToDigit|interact|ioError|isAlpha|isAlphaNum|isAscii|isControl|isDenormalized|isDigit|isHexDigit|isIEEE|isInfinite|isLower|isNaN|isNegativeZero|isOctDigit|isPrint|isSpace|isUpper|iterate|last|lcm|length|lex|lexDigits|lexLitChar|lines|log|logBase|lookup|map|mapM|mapM_|max|maxBound|maximum|maybe|min|minBound|minimum|mod|negate|not|notElem|null|numerator|odd|or|ord|otherwise|pack|pi|pred|primExitWith|print|product|properFraction|putChar|putStr|putStrLn|quot|quotRem|range|rangeSize|read|readDec|readFile|readFloat|readHex|readIO|readInt|readList|readLitChar|readLn|readOct|readParen|readSigned|reads|readsPrec|realToFrac|recip|rem|repeat|replicate|return|reverse|round|scaleFloat|scanl|scanl1|scanr|scanr1|seq|sequence|sequence_|show|showChar|showInt|showList|showLitChar|showParen|showSigned|showString|shows|showsPrec|significand|signum|sin|sinh|snd|sort|span|splitAt|sqrt|subtract|succ|sum|tail|take|takeWhile|tan|tanh|threadToIOResult|toEnum|toInt|toInteger|toLower|toRational|toUpper|truncate|uncurry|undefined|unlines|until|unwords|unzip|unzip3|userError|words|writeFile|zip|zip3|zipWith|zipWith3)\b/,
      // decimal integers and floating point numbers | octal integers | hexadecimal integers
      number: /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0o[0-7]+|0x[0-9a-f]+)\b/i,
      // Most of this is needed because of the meaning of a single '.'.
      // If it stands alone freely, it is the function composition.
      // It may also be a separator between a module name and an identifier => no
      // operator. If it comes together with other special characters it is an
      // operator too.
      operator: /\s\.\s|[-!#$%*+=?&@|~.:<>^\\\/]*\.[-!#$%*+=?&@|~.:<>^\\\/]+|[-!#$%*+=?&@|~.:<>^\\\/]+\.[-!#$%*+=?&@|~.:<>^\\\/]*|[-!#$%*+=?&@|~:<>^\\\/]+|`([A-Z][\w']*\.)*[_a-z][\w']*`/,
      // In Haskell, nearly everything is a variable, do not highlight these.
      hvariable: /\b(?:[A-Z][\w']*\.)*[_a-z][\w']*\b/,
      constant: /\b(?:[A-Z][\w']*\.)*[A-Z][\w']*\b/,
      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/haxe.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/haxe.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'haxe',
  init: function init(Prism) {
    Prism.languages.haxe = Prism.languages.extend('clike', {
      // Strings can be multi-line
      string: {
        pattern: /(["'])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
        greedy: true,
        inside: {
          interpolation: {
            pattern: /(^|[^\\])\$(?:\w+|\{[^}]+\})/,
            lookbehind: true,
            inside: {
              interpolation: {
                pattern: /^\$\w*/,
                alias: 'variable'
              }
              // See rest below
            }
          }
        }
      },
      // The final look-ahead prevents highlighting of keywords if expressions such as "haxe.macro.Expr"
      keyword: /\bthis\b|\b(?:abstract|as|break|case|cast|catch|class|continue|default|do|dynamic|else|enum|extends|extern|from|for|function|if|implements|import|in|inline|interface|macro|new|null|override|public|private|return|static|super|switch|throw|to|try|typedef|using|var|while)(?!\.)\b/,
      operator: /\.{3}|\+\+?|-[->]?|[=!]=?|&&?|\|\|?|<[<=]?|>[>=]?|[*\/%~^]/
    });
    Prism.languages.insertBefore('haxe', 'class-name', {
      regex: {
        pattern: /~\/(?:[^\/\\\r\n]|\\.)+\/[igmsu]*/,
        greedy: true
      }
    });
    Prism.languages.insertBefore('haxe', 'keyword', {
      preprocessor: {
        pattern: /#\w+/,
        alias: 'builtin'
      },
      metadata: {
        pattern: /@:?\w+/,
        alias: 'symbol'
      },
      reification: {
        pattern: /\$(?:\w+|(?=\{))/,
        alias: 'variable'
      }
    });
    Prism.languages.haxe.string.inside.interpolation.inside.rest = Prism.languages.haxe;
    delete Prism.languages.haxe['class-name'];
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/hpkp.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/hpkp.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'hpkp',
  init: function init(Prism) {
    /**
     * Original by Scott Helme.
     *
     * Reference: https://scotthelme.co.uk/hpkp-cheat-sheet/
     */

    Prism.languages.hpkp = {
      directive: {
        pattern: /\b(?:(?:includeSubDomains|preload|strict)(?: |;)|pin-sha256="[a-zA-Z\d+=/]+"|(?:max-age|report-uri)=|report-to )/,
        alias: 'keyword'
      },
      safe: {
        pattern: /\d{7,}/,
        alias: 'selector'
      },
      unsafe: {
        pattern: /\d{0,6}/,
        alias: 'function'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/hsts.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/hsts.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'hsts',
  init: function init(Prism) {
    /**
     * Original by Scott Helme.
     *
     * Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
     */

    Prism.languages.hsts = {
      directive: {
        pattern: /\b(?:max-age=|includeSubDomains|preload)/,
        alias: 'keyword'
      },
      safe: {
        pattern: /\d{8,}/,
        alias: 'selector'
      },
      unsafe: {
        pattern: /\d{0,7}/,
        alias: 'function'
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/http.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/http.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'http',
  init: function init(Prism) {
    Prism.languages.http = {
      'request-line': {
        pattern: /^(?:POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\shttps?:\/\/\S+\sHTTP\/[0-9.]+/m,
        inside: {
          // HTTP Verb
          property: /^(?:POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/,
          // Path or query argument
          'attr-name': /:\w+/
        }
      },
      'response-status': {
        pattern: /^HTTP\/1.[01] \d+.*/m,
        inside: {
          // Status, e.g. 200 OK
          property: {
            pattern: /(^HTTP\/1.[01] )\d+.*/i,
            lookbehind: true
          }
        }
      },
      // HTTP header name
      'header-name': {
        pattern: /^[\w-]+:(?=.)/m,
        alias: 'keyword'
      }

      // Create a mapping of Content-Type headers to language definitions
    };var httpLanguages = {
      'application/json': Prism.languages.javascript,
      'application/xml': Prism.languages.markup,
      'text/xml': Prism.languages.markup,
      'text/html': Prism.languages.markup

      // Insert each content type parser that has its associated language
      // currently loaded.
    };for (var contentType in httpLanguages) {
      if (httpLanguages[contentType]) {
        var options = {};
        options[contentType] = {
          pattern: new RegExp('(content-type:\\s*' + contentType + '[\\w\\W]*?)(?:\\r?\\n|\\r){2}[\\w\\W]*', 'i'),
          lookbehind: true,
          inside: {
            rest: httpLanguages[contentType]
          }
        };
        Prism.languages.insertBefore('http', 'header-name', options);
      }
    }
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/ichigojam.js":
/*!*****************************************************!*\
  !*** ./node_modules/reprism/languages/ichigojam.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'ichigojam',
  init: function init(Prism) {
    // according to the offical reference (EN)
    // https://ichigojam.net/IchigoJam-en.html
    Prism.languages.ichigojam = {
      comment: /(?:\B'|REM)(?:[^\n\r]*)/i,
      string: {
        pattern: /"(?:""|[!#$%&'()*,\/:;<=>?^_ +\-.A-Z\d])*"/i,
        greedy: true
      },
      number: /\B#[0-9A-F]+|\B`[01]+|(?:\b\d+\.?\d*|\B\.\d+)(?:E[+-]?\d+)?/i,
      keyword: /\b(?:BEEP|BPS|CASE|CLEAR|CLK|CLO|CLP|CLS|CLT|CLV|CONT|COPY|ELSE|END|FILE|FILES|FOR|GOSUB|GSB|GOTO|IF|INPUT|KBD|LED|LET|LIST|LOAD|LOCATE|LRUN|NEW|NEXT|OUT|RIGHT|PLAY|POKE|PRINT|PWM|REM|RENUM|RESET|RETURN|RTN|RUN|SAVE|SCROLL|SLEEP|SRND|STEP|STOP|SUB|TEMPO|THEN|TO|UART|VIDEO|WAIT)(?:\$|\b)/i,
      function: /\b(?:ABS|ANA|ASC|BIN|BTN|DEC|END|FREE|HELP|HEX|I2CR|I2CW|IN|INKEY|LEN|LINE|PEEK|RND|SCR|SOUND|STR|TICK|USR|VER|VPEEK|ZER)(?:\$|\b)/i,
      label: /(?:\B@[^\s]+)/i,
      operator: /<[=>]?|>=?|\|\||&&|[+\-*\/=|&^~!]|\b(?:AND|NOT|OR)\b/i,
      punctuation: /[\[,;:()\]]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/icon.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/icon.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'icon',
  init: function init(Prism) {
    Prism.languages.icon = {
      comment: /#.*/,
      string: {
        pattern: /(["'])(?:(?!\1)[^\\\r\n_]|\\.|_(?!\1)(?:\r\n|[\s\S]))*\1/,
        greedy: true
      },
      number: /\b(?:\d+r[a-z\d]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b|\.\d+\b/i,
      'builtin-keyword': {
        pattern: /&(?:allocated|ascii|clock|collections|cset|current|date|dateline|digits|dump|e|error(?:number|text|value)?|errout|fail|features|file|host|input|lcase|letters|level|line|main|null|output|phi|pi|pos|progname|random|regions|source|storage|subject|time|trace|ucase|version)\b/,
        alias: 'variable'
      },
      directive: {
        pattern: /\$\w+/,
        alias: 'builtin'
      },
      keyword: /\b(?:break|by|case|create|default|do|else|end|every|fail|global|if|initial|invocable|link|local|next|not|of|procedure|record|repeat|return|static|suspend|then|to|until|while)\b/,
      function: /(?!\d)\w+(?=\s*[({]|\s*!\s*\[)/,
      operator: /[+-]:(?!=)|(?:[\/?@^%&]|\+\+?|--?|==?=?|~==?=?|\*\*?|\|\|\|?|<(?:->?|<?=?)|>>?=?)(?::=)?|:(?:=:?)?|[!.\\|~]/,
      punctuation: /[\[\](){},;]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/inform7.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/inform7.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'inform7',
  init: function init(Prism) {
    Prism.languages.inform7 = {
      string: {
        pattern: /"[^"]*"/,
        inside: {
          substitution: {
            pattern: /\[[^\]]+\]/,
            inside: {
              delimiter: {
                pattern: /\[|\]/,
                alias: 'punctuation'
              }
              // See rest below
            }
          }
        }
      },
      comment: {
        pattern: /\[[^\]]+\]/,
        greedy: true
      },
      title: {
        pattern: /^[ \t]*(?:volume|book|part(?! of)|chapter|section|table)\b.+/im,
        alias: 'important'
      },
      number: {
        pattern: /(^|[^-])(?:\b\d+(?:\.\d+)?(?:\^\d+)?\w*|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve))\b(?!-)/i,
        lookbehind: true
      },
      verb: {
        pattern: /(^|[^-])\b(?:applying to|are|attacking|answering|asking|be(?:ing)?|burning|buying|called|carries|carry(?! out)|carrying|climbing|closing|conceal(?:s|ing)?|consulting|contain(?:s|ing)?|cutting|drinking|dropping|eating|enclos(?:es?|ing)|entering|examining|exiting|getting|giving|going|ha(?:ve|s|ving)|hold(?:s|ing)?|impl(?:y|ies)|incorporat(?:es?|ing)|inserting|is|jumping|kissing|listening|locking|looking|mean(?:s|ing)?|opening|provid(?:es?|ing)|pulling|pushing|putting|relat(?:es?|ing)|removing|searching|see(?:s|ing)?|setting|showing|singing|sleeping|smelling|squeezing|switching|support(?:s|ing)?|swearing|taking|tasting|telling|thinking|throwing|touching|turning|tying|unlock(?:s|ing)?|var(?:y|ies|ying)|waiting|waking|waving|wear(?:s|ing)?)\b(?!-)/i,
        lookbehind: true,
        alias: 'operator'
      },
      keyword: {
        pattern: /(^|[^-])\b(?:after|before|carry out|check|continue the action|definition(?= *:)|do nothing|else|end (?:if|unless|the story)|every turn|if|include|instead(?: of)?|let|move|no|now|otherwise|repeat|report|resume the story|rule for|running through|say(?:ing)?|stop the action|test|try(?:ing)?|understand|unless|use|when|while|yes)\b(?!-)/i,
        lookbehind: true
      },
      property: {
        pattern: /(^|[^-])\b(?:adjacent(?! to)|carried|closed|concealed|contained|dark|described|edible|empty|enclosed|enterable|even|female|fixed in place|full|handled|held|improper-named|incorporated|inedible|invisible|lighted|lit|lock(?:able|ed)|male|marked for listing|mentioned|negative|neuter|non-(?:empty|full|recurring)|odd|opaque|open(?:able)?|plural-named|portable|positive|privately-named|proper-named|provided|publically-named|pushable between rooms|recurring|related|rubbing|scenery|seen|singular-named|supported|swinging|switch(?:able|ed(?: on| off)?)|touch(?:able|ed)|transparent|unconcealed|undescribed|unlit|unlocked|unmarked for listing|unmentioned|unopenable|untouchable|unvisited|variable|visible|visited|wearable|worn)\b(?!-)/i,
        lookbehind: true,
        alias: 'symbol'
      },
      position: {
        pattern: /(^|[^-])\b(?:above|adjacent to|back side of|below|between|down|east|everywhere|front side|here|in|inside(?: from)?|north(?:east|west)?|nowhere|on(?: top of)?|other side|outside(?: from)?|parts? of|regionally in|south(?:east|west)?|through|up|west|within)\b(?!-)/i,
        lookbehind: true,
        alias: 'keyword'
      },
      type: {
        pattern: /(^|[^-])\b(?:actions?|activit(?:y|ies)|actors?|animals?|backdrops?|containers?|devices?|directions?|doors?|holders?|kinds?|lists?|m[ae]n|nobody|nothing|nouns?|numbers?|objects?|people|persons?|player(?:'s holdall)?|regions?|relations?|rooms?|rule(?:book)?s?|scenes?|someone|something|supporters?|tables?|texts?|things?|time|vehicles?|wom[ae]n)\b(?!-)/i,
        lookbehind: true,
        alias: 'variable'
      },
      punctuation: /[.,:;(){}]/
    };

    Prism.languages.inform7.string.inside.substitution.inside.rest = Prism.languages.inform7;
    // We don't want the remaining text in the substitution to be highlighted as the string.
    Prism.languages.inform7.string.inside.substitution.inside.rest.text = {
      pattern: /\S(?:\s*\S)*/,
      alias: 'comment'
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/ini.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/ini.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'ini',
  init: function init(Prism) {
    Prism.languages.ini = {
      comment: /^[ \t]*;.*$/m,
      selector: /^[ \t]*\[.*?\]/m,
      constant: /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
      'attr-value': {
        pattern: /=.*/,
        inside: {
          punctuation: /^[=]/
        }
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/io.js":
/*!**********************************************!*\
  !*** ./node_modules/reprism/languages/io.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'io',
  init: function init(Prism) {
    Prism.languages.io = {
      comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true
      }, {
        pattern: /(^|[^\\])\/\/.*/,
        lookbehind: true
      }, {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
      }],
      'triple-quoted-string': {
        pattern: /"""(?:\\[\s\S]|(?!""")[^\\])*"""/,
        greedy: true,
        alias: 'string'
      },
      string: {
        pattern: /"(?:\\.|[^\\\r\n"])*"/,
        greedy: true
      },
      keyword: /\b(?:activate|activeCoroCount|asString|block|break|catch|clone|collectGarbage|compileString|continue|do|doFile|doMessage|doString|else|elseif|exit|for|foreach|forward|getSlot|getEnvironmentVariable|hasSlot|if|ifFalse|ifNil|ifNilEval|ifTrue|isActive|isNil|isResumable|list|message|method|parent|pass|pause|perform|performWithArgList|print|println|proto|raise|raiseResumable|removeSlot|resend|resume|schedulerSleepSeconds|self|sender|setSchedulerSleepSeconds|setSlot|shallowCopy|slotNames|super|system|then|thisBlock|thisContext|call|try|type|uniqueId|updateSlot|wait|while|write|yield)\b/,
      builtin: /\b(?:Array|AudioDevice|AudioMixer|Block|Box|Buffer|CFunction|CGI|Color|Curses|DBM|DNSResolver|DOConnection|DOProxy|DOServer|Date|Directory|Duration|DynLib|Error|Exception|FFT|File|Fnmatch|Font|Future|GL|GLE|GLScissor|GLU|GLUCylinder|GLUQuadric|GLUSphere|GLUT|Host|Image|Importer|LinkList|List|Lobby|Locals|MD5|MP3Decoder|MP3Encoder|Map|Message|Movie|Notification|Number|Object|OpenGL|Point|Protos|Regex|SGML|SGMLElement|SGMLParser|SQLite|Server|Sequence|ShowMessage|SleepyCat|SleepyCatCursor|Socket|SocketManager|Sound|Soup|Store|String|Tree|UDPSender|UPDReceiver|URL|User|Warning|WeakLink|Random|BigNum|Sequence)\b/,
      boolean: /\b(?:true|false|nil)\b/,
      number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e-?\d+)?/i,
      operator: /[=!*/%+-^&|]=|>>?=?|<<?=?|:?:?=|\+\+?|--?|\*\*?|\/\/?|%|\|\|?|&&?|(\b(?:return|and|or|not)\b)|@@?|\?\??|\.\./,
      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/j.js":
/*!*********************************************!*\
  !*** ./node_modules/reprism/languages/j.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'j',
  init: function init(Prism) {
    Prism.languages.j = {
      comment: /\bNB\..*/,
      string: {
        pattern: /'(?:''|[^'\r\n])*'/,
        greedy: true
      },
      keyword: /\b(?:(?:adverb|conjunction|CR|def|define|dyad|LF|monad|noun|verb)\b|(?:assert|break|case|catch[dt]?|continue|do|else|elseif|end|fcase|for|for_\w+|goto_\w+|if|label_\w+|return|select|throw|try|while|whilst)\.)/,
      verb: {
        // Negative look-ahead prevents bad highlighting
        // of ^: ;. =. =: !. !:
        pattern: /(?!\^:|;\.|[=!][.:])(?:\{(?:\.|::?)?|p(?:\.\.?|:)|[=!\]]|[<>+*\-%$|,#][.:]?|[?^]\.?|[;\[]:?|[~}"i][.:]|[ACeEIjLor]\.|(?:[_\/\\qsux]|_?\d):)/,
        alias: 'keyword'
      },
      number: /\b_?(?:(?!\d:)\d+(?:\.\d+)?(?:(?:[ejpx]|ad|ar)_?\d+(?:\.\d+)?)*(?:b_?[\da-z]+(?:\.[\da-z]+)?)?|_(?!\.))/,
      adverb: {
        pattern: /[~}]|[\/\\]\.?|[bfM]\.|t[.:]/,
        alias: 'builtin'
      },
      operator: /[=a][.:]|_\./,
      conjunction: {
        pattern: /&(?:\.:?|:)?|[.:@][.:]?|[!D][.:]|[;dHT]\.|`:?|[\^LS]:|"/,
        alias: 'variable'
      },
      punctuation: /[()]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/java.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/java.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'java',
  init: function init(Prism) {
    Prism.languages.java = Prism.languages.extend('clike', {
      keyword: /\b(?:abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
      number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp-]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
      operator: {
        pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
        lookbehind: true
      }
    });

    Prism.languages.insertBefore('java', 'function', {
      annotation: {
        alias: 'punctuation',
        pattern: /(^|[^.])@\w+/,
        lookbehind: true
      }
    });

    Prism.languages.insertBefore('java', 'class-name', {
      generics: {
        pattern: /<\s*\w+(?:\.\w+)?(?:\s*,\s*\w+(?:\.\w+)?)*>/i,
        alias: 'function',
        inside: {
          keyword: Prism.languages.java.keyword,
          punctuation: /[<>(),.:]/
        }
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/javascript.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/javascript.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'javascript',
  init: function init(Prism) {
    Prism.languages.javascript = Prism.languages.extend('clike', {
      keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
      number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      function: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
      operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
    });

    Prism.languages.insertBefore('javascript', 'keyword', {
      regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: true,
        greedy: true
      },
      // This must be declared before keyword because we use "function" inside the look-forward
      'function-variable': {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
        alias: 'function'
      },
      constant: /\b[A-Z][A-Z\d_]*\b/
    });

    Prism.languages.insertBefore('javascript', 'string', {
      'template-string': {
        pattern: /`(?:\\[\s\S]|[^\\`])*`/,
        greedy: true,
        inside: {
          interpolation: {
            pattern: /\$\{[^}]+\}/,
            inside: {
              'interpolation-punctuation': {
                pattern: /^\$\{|\}$/,
                alias: 'punctuation'
              },
              rest: Prism.languages.javascript
            }
          },
          string: /[\s\S]+/
        }
      }
    });

    if (Prism.languages.markup) {
      Prism.languages.insertBefore('markup', 'tag', {
        script: {
          pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
          lookbehind: true,
          inside: Prism.languages.javascript,
          alias: 'language-javascript',
          greedy: true
        }
      });
    }

    Prism.languages.js = Prism.languages.javascript;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/jolie.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/jolie.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'jolie',
  init: function init(Prism) {
    Prism.languages.jolie = Prism.languages.extend('clike', {
      keyword: /\b(?:include|define|is_defined|undef|main|init|outputPort|inputPort|Location|Protocol|Interfaces|RequestResponse|OneWay|type|interface|extender|throws|cset|csets|forward|Aggregates|Redirects|embedded|courier|execution|sequential|concurrent|single|scope|install|throw|comp|cH|default|global|linkIn|linkOut|synchronized|this|new|for|if|else|while|in|Jolie|Java|Javascript|nullProcess|spawn|constants|with|provide|until|exit|foreach|instanceof|over|service)\b/,
      builtin: /\b(?:undefined|string|int|void|long|Byte|bool|double|float|char|any)\b/,
      number: /(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?l?/i,
      operator: /-[-=>]?|\+[+=]?|<[<=]?|[>=*!]=?|&&|\|\||[:?\/%^]/,
      symbol: /[|;@]/,
      punctuation: /[,.]/,
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      }
    });

    delete Prism.languages.jolie['class-name'];
    delete Prism.languages.jolie.function;

    Prism.languages.insertBefore('jolie', 'keyword', {
      function: {
        pattern: /((?:\b(?:outputPort|inputPort|in|service|courier)\b|@)\s*)\w+/,
        lookbehind: true
      },
      aggregates: {
        pattern: /(\bAggregates\s*:\s*)(?:\w+(?:\s+with\s+\w+)?\s*,\s*)*\w+(?:\s+with\s+\w+)?/,
        lookbehind: true,
        inside: {
          withExtension: {
            pattern: /\bwith\s+\w+/,
            inside: {
              keyword: /\bwith\b/
            }
          },
          function: {
            pattern: /\w+/
          },
          punctuation: {
            pattern: /,/
          }
        }
      },
      redirects: {
        pattern: /(\bRedirects\s*:\s*)(?:\w+\s*=>\s*\w+\s*,\s*)*(?:\w+\s*=>\s*\w+)/,
        lookbehind: true,
        inside: {
          punctuation: {
            pattern: /,/
          },
          function: {
            pattern: /\w+/
          },
          symbol: {
            pattern: /=>/
          }
        }
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/json.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/json.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'json',
  init: function init(Prism) {
    Prism.languages.json = {
      property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
      string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: true
      },
      number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
      punctuation: /[{}[\]);,]/,
      operator: /:/g,
      boolean: /\b(?:true|false)\b/i,
      null: /\bnull\b/i
    };

    Prism.languages.jsonp = Prism.languages.json;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/jsx.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/jsx.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'jsx',
  init: function init(Prism) {
    var javascript = Prism.util.clone(Prism.languages.javascript);

    Prism.languages.jsx = Prism.languages.extend('markup', javascript);
    Prism.languages.jsx.tag.pattern = /<\/?[\w.:-]+\s*(?:\s+(?:[\w.:-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{[^}]*\}|[^{}])+\}))?|\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}))*\s*\/?>/i;

    Prism.languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i;

    Prism.languages.insertBefore('inside', 'attr-name', {
      spread: {
        pattern: /\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}/,
        inside: {
          punctuation: /\.{3}|[{}.]/,
          'attr-value': /\w+/
        }
      }
    }, Prism.languages.jsx.tag);

    Prism.languages.insertBefore('inside', 'attr-value', {
      script: {
        // Allow for one level of nesting
        pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
        inside: {
          'script-punctuation': {
            pattern: /^=(?={)/,
            alias: 'punctuation'
          },
          rest: Prism.languages.jsx
        },
        alias: 'language-javascript'
      }
    }, Prism.languages.jsx.tag);

    // The following will handle plain text inside tags
    var stringifyToken = function stringifyToken(token) {
      if (typeof token === 'string') {
        return token;
      }
      if (typeof token.content === 'string') {
        return token.content;
      }
      return token.content.map(stringifyToken).join('');
    };

    var walkTokens = function walkTokens(tokens) {
      var openedTags = [];
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var notTagNorBrace = false;

        if (typeof token !== 'string') {
          if (token.type === 'tag' && token.content[0] && token.content[0].type === 'tag') {
            // We found a tag, now find its kind

            if (token.content[0].content[0].content === '</') {
              // Closing tag
              if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
                // Pop matching opening tag
                openedTags.pop();
              }
            } else if (token.content[token.content.length - 1].content === '/>') {
              // Autoclosed tag, ignore
            } else {
              // Opening tag
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          } else if (openedTags.length > 0 && token.type === 'punctuation' && token.content === '{') {
            // Here we might have entered a JSX context inside a tag
            openedTags[openedTags.length - 1].openedBraces++;
          } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {
            // Here we might have left a JSX context inside a tag
            openedTags[openedTags.length - 1].openedBraces--;
          } else {
            notTagNorBrace = true;
          }
        }
        if (notTagNorBrace || typeof token === 'string') {
          if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
            // Here we are inside a tag, and not inside a JSX context.
            // That's plain text: drop any tokens matched.
            var plainText = stringifyToken(token);

            // And merge text with adjacent text
            if (i < tokens.length - 1 && (typeof tokens[i + 1] === 'string' || tokens[i + 1].type === 'plain-text')) {
              plainText += stringifyToken(tokens[i + 1]);
              tokens.splice(i + 1, 1);
            }
            if (i > 0 && (typeof tokens[i - 1] === 'string' || tokens[i - 1].type === 'plain-text')) {
              plainText = stringifyToken(tokens[i - 1]) + plainText;
              tokens.splice(i - 1, 1);
              i--;
            }

            tokens[i] = new Prism.Token('plain-text', plainText, null, plainText);
          }
        }

        if (token.content && typeof token.content !== 'string') {
          walkTokens(token.content);
        }
      }
    };

    Prism.hooks.add('after-tokenize', function (env) {
      if (env.language !== 'jsx' && env.language !== 'tsx') {
        return;
      }
      walkTokens(env.tokens);
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/julia.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/julia.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'julia',
  init: function init(Prism) {
    Prism.languages.julia = {
      comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
      },
      string: /("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2/,
      keyword: /\b(?:abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|let|local|macro|module|print|println|quote|return|try|type|typealias|using|while)\b/,
      boolean: /\b(?:true|false)\b/,
      number: /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?/i,
      operator: /[-+*^%÷&$\\]=?|\/[\/=]?|!=?=?|\|[=>]?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥]/,
      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/keyman.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/keyman.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'keyman',
  init: function init(Prism) {
    Prism.languages.keyman = {
      comment: /\bc\s.*/i,
      function: /\[\s*(?:(?:CTRL|SHIFT|ALT|LCTRL|RCTRL|LALT|RALT|CAPS|NCAPS)\s+)*(?:[TKU]_[\w?]+|".+?"|'.+?')\s*\]/i, // virtual key
      string: /("|').*?\1/,
      bold: [
      // header statements, system stores and variable system stores
      /&(?:baselayout|bitmap|capsononly|capsalwaysoff|shiftfreescaps|copyright|ethnologuecode|hotkey|includecodes|keyboardversion|kmw_embedcss|kmw_embedjs|kmw_helpfile|kmw_helptext|kmw_rtl|language|layer|layoutfile|message|mnemoniclayout|name|oldcharposmatching|platform|targets|version|visualkeyboard|windowslanguages)\b/i, /\b(?:bitmap|bitmaps|caps on only|caps always off|shift frees caps|copyright|hotkey|language|layout|message|name|version)\b/i],
      keyword: /\b(?:any|baselayout|beep|call|context|deadkey|dk|if|index|layer|notany|nul|outs|platform|return|reset|save|set|store|use)\b/i, // rule keywords
      atrule: /\b(?:ansi|begin|unicode|group|using keys|match|nomatch)\b/i, // structural keywords
      number: /\b(?:U\+[\dA-F]+|d\d+|x[\da-f]+|\d+)\b/i, // U+####, x###, d### characters and numbers
      operator: /[+>\\,()]/,
      tag: /\$(?:keyman|kmfl|weaver|keymanweb|keymanonly):/i // prefixes
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/kotlin.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/kotlin.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'kotlin',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.kotlin = Prism.languages.extend('clike', {
        keyword: {
          // The lookbehind prevents wrong highlighting of e.g. kotlin.properties.get
          pattern: /(^|[^.])\b(?:abstract|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|else|enum|final|finally|for|fun|get|if|import|in|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|out|override|package|private|protected|public|reified|return|sealed|set|super|tailrec|this|throw|to|try|val|var|when|where|while)\b/,
          lookbehind: true
        },
        function: [/\w+(?=\s*\()/, {
          pattern: /(\.)\w+(?=\s*\{)/,
          lookbehind: true
        }],
        number: /\b(?:0[bx][\da-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?[fFL]?)\b/,
        operator: /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
      });

      delete Prism.languages.kotlin['class-name'];

      Prism.languages.insertBefore('kotlin', 'string', {
        'raw-string': {
          pattern: /("""|''')[\s\S]*?\1/,
          alias: 'string'
          // See interpolation below
        }
      });
      Prism.languages.insertBefore('kotlin', 'keyword', {
        annotation: {
          pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
          alias: 'builtin'
        }
      });
      Prism.languages.insertBefore('kotlin', 'function', {
        label: {
          pattern: /\w+@|@\w+/,
          alias: 'symbol'
        }
      });

      var interpolation = [{
        pattern: /\$\{[^}]+\}/,
        inside: {
          delimiter: {
            pattern: /^\$\{|\}$/,
            alias: 'variable'
          },
          rest: Prism.languages.kotlin
        }
      }, {
        pattern: /\$\w+/,
        alias: 'variable'
      }];

      Prism.languages.kotlin.string.inside = Prism.languages.kotlin['raw-string'].inside = {
        interpolation: interpolation
      };
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/latex.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/latex.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'latex',
  init: function init(Prism) {
    (function (Prism) {
      var funcPattern = /\\(?:[^a-z()[\]]|[a-z*]+)/i,
          insideEqu = {
        'equation-command': {
          pattern: funcPattern,
          alias: 'regex'
        }
      };

      Prism.languages.latex = {
        comment: /%.*/m,
        // the verbatim environment prints whitespace to the document
        cdata: {
          pattern: /(\\begin\{((?:verbatim|lstlisting)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
          lookbehind: true
        },
        /*
        * equations can be between $ $ or \( \) or \[ \]
        * (all are multiline)
        */
        equation: [{
          pattern: /\$(?:\\[\s\S]|[^\\$])*\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/,
          inside: insideEqu,
          alias: 'string'
        }, {
          pattern: /(\\begin\{((?:equation|math|eqnarray|align|multline|gather)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
          lookbehind: true,
          inside: insideEqu,
          alias: 'string'
        }],
        /*
        * arguments which are keywords or references are highlighted
        * as keywords
        */
        keyword: {
          pattern: /(\\(?:begin|end|ref|cite|label|usepackage|documentclass)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
          lookbehind: true
        },
        url: {
          pattern: /(\\url\{)[^}]+(?=\})/,
          lookbehind: true
        },
        /*
        * section or chapter headlines are highlighted as bold so that
        * they stand out more
        */
        headline: {
          pattern: /(\\(?:part|chapter|section|subsection|frametitle|subsubsection|paragraph|subparagraph|subsubparagraph|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\}(?:\[[^\]]+\])?)/,
          lookbehind: true,
          alias: 'class-name'
        },
        function: {
          pattern: funcPattern,
          alias: 'selector'
        },
        punctuation: /[[\]{}&]/
      };
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/less.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/less.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'less',
  init: function init(Prism) {
    /* FIXME :
    :extend() is not handled specifically : its highlighting is buggy.
    Mixin usage must be inside a ruleset to be highlighted.
    At-rules (e.g. import) containing interpolations are buggy.
    Detached rulesets are highlighted as at-rules.
    A comment before a mixin usage prevents the latter to be properly highlighted.
    */

    Prism.languages.less = Prism.languages.extend('css', {
      comment: [/\/\*[\s\S]*?\*\//, {
        pattern: /(^|[^\\])\/\/.*/,
        lookbehind: true
      }],
      atrule: {
        pattern: /@[\w-]+?(?:\([^{}]+\)|[^(){};])*?(?=\s*\{)/i,
        inside: {
          punctuation: /[:()]/
        }
      },
      // selectors and mixins are considered the same
      selector: {
        pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\([^{}]*\)|[^{};@])*?(?=\s*\{)/,
        inside: {
          // mixin parameters
          variable: /@+[\w-]+/
        }
      },

      property: /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/i,
      punctuation: /[{}();:,]/,
      operator: /[+\-*\/]/
    });

    // Invert function and punctuation positions
    Prism.languages.insertBefore('less', 'punctuation', {
      function: Prism.languages.less.function
    });

    Prism.languages.insertBefore('less', 'property', {
      variable: [
      // Variable declaration (the colon must be consumed!)
      {
        pattern: /@[\w-]+\s*:/,
        inside: {
          punctuation: /:/
        }
      },

      // Variable usage
      /@@?[\w-]+/],
      'mixin-usage': {
        pattern: /([{;]\s*)[.#](?!\d)[\w-]+.*?(?=[(;])/,
        lookbehind: true,
        alias: 'function'
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/liquid.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/liquid.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'liquid',
  init: function init(Prism) {
    Prism.languages.liquid = {
      keyword: /\b(?:comment|endcomment|if|elsif|else|endif|unless|endunless|for|endfor|case|endcase|when|in|break|assign|continue|limit|offset|range|reversed|raw|endraw|capture|endcapture|tablerow|endtablerow)\b/,
      number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp-]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?[df]?/i,
      operator: {
        pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
        lookbehind: true
      },
      function: {
        pattern: /(^|[\s;|&])(?:append|prepend|capitalize|cycle|cols|increment|decrement|abs|at_least|at_most|ceil|compact|concat|date|default|divided_by|downcase|escape|escape_once|first|floor|join|last|lstrip|map|minus|modulo|newline_to_br|plus|remove|remove_first|replace|replace_first|reverse|round|rstrip|size|slice|sort|sort_natural|split|strip|strip_html|strip_newlines|times|truncate|truncatewords|uniq|upcase|url_decode|url_encode|include|paginate)(?=$|[\s;|&])/,
        lookbehind: true
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/lisp.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/lisp.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'lisp',
  init: function init(Prism) {
    (function (Prism) {
      // Functions to construct regular expressions
      // simple form
      // e.g. (interactive ... or (interactive)
      function simple_form(name) {
        return new RegExp('(\\()' + name + '(?=[\\s\\)])');
      }
      // booleans and numbers
      function primitive(pattern) {
        return new RegExp('([\\s([])' + pattern + '(?=[\\s)])');
      }

      // Patterns in regular expressions

      // Symbol name. See https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Type.html
      // & and : are excluded as they are usually used for special purposes
      var symbol = '[-+*/_~!@$%^=<>{}\\w]+';
      // symbol starting with & used in function arguments
      var marker = '&' + symbol;
      // Open parenthesis for look-behind
      var par = '(\\()';
      var endpar = '(?=\\))';
      // End the pattern with look-ahead space
      var space = '(?=\\s)';

      var language = {
        // Three or four semicolons are considered a heading.
        // See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
        heading: {
          pattern: /;;;.*/,
          alias: ['comment', 'title']
        },
        comment: /;.*/,
        string: {
          pattern: /"(?:[^"\\]*|\\.)*"/,
          greedy: true,
          inside: {
            argument: /[-A-Z]+(?=[.,\s])/,
            symbol: new RegExp('`' + symbol + '\'')
          }
        },
        'quoted-symbol': {
          pattern: new RegExp('#?\'' + symbol),
          alias: ['variable', 'symbol']
        },
        'lisp-property': {
          pattern: new RegExp(':' + symbol),
          alias: 'property'
        },
        splice: {
          pattern: new RegExp(',@?' + symbol),
          alias: ['symbol', 'variable']
        },
        keyword: [{
          pattern: new RegExp(par + '(?:(?:lexical-)?let\\*?|(?:cl-)?letf|if|when|while|unless|cons|cl-loop|and|or|not|cond|setq|error|message|null|require|provide|use-package)' + space),
          lookbehind: true
        }, {
          pattern: new RegExp(par + '(?:for|do|collect|return|finally|append|concat|in|by)' + space),
          lookbehind: true
        }],
        declare: {
          pattern: simple_form('declare'),
          lookbehind: true,
          alias: 'keyword'
        },
        interactive: {
          pattern: simple_form('interactive'),
          lookbehind: true,
          alias: 'keyword'
        },
        boolean: {
          pattern: primitive('(?:t|nil)'),
          lookbehind: true
        },
        number: {
          pattern: primitive('[-+]?\\d+(?:\\.\\d*)?'),
          lookbehind: true
        },
        defvar: {
          pattern: new RegExp(par + 'def(?:var|const|custom|group)\\s+' + symbol),
          lookbehind: true,
          inside: {
            keyword: /^def[a-z]+/,
            variable: new RegExp(symbol)
          }
        },
        defun: {
          pattern: new RegExp(par + '(?:cl-)?(?:defun\\*?|defmacro)\\s+' + symbol + '\\s+\\([\\s\\S]*?\\)'),
          lookbehind: true,
          inside: {
            keyword: /^(?:cl-)?def\S+/,
            // See below, this property needs to be defined later so that it can
            // reference the language object.
            arguments: null,
            function: {
              pattern: new RegExp('(^\\s)' + symbol),
              lookbehind: true
            },
            punctuation: /[()]/
          }
        },
        lambda: {
          pattern: new RegExp(par + 'lambda\\s+\\((?:&?' + symbol + '\\s*)*\\)'),
          lookbehind: true,
          inside: {
            keyword: /^lambda/,
            // See below, this property needs to be defined later so that it can
            // reference the language object.
            arguments: null,
            punctuation: /[()]/
          }
        },
        car: {
          pattern: new RegExp(par + symbol),
          lookbehind: true
        },
        punctuation: [
        // open paren, brackets, and close paren
        /(['`,]?\(|[)\[\]])/,
        // cons
        {
          pattern: /(\s)\.(?=\s)/,
          lookbehind: true
        }]
      };

      var arg = {
        'lisp-marker': new RegExp(marker),
        rest: {
          argument: {
            pattern: new RegExp(symbol),
            alias: 'variable'
          },
          varform: {
            pattern: new RegExp(par + symbol + '\\s+\\S[\\s\\S]*' + endpar),
            lookbehind: true,
            inside: {
              string: language.string,
              boolean: language.boolean,
              number: language.number,
              symbol: language.symbol,
              punctuation: /[()]/
            }
          }
        }
      };

      var forms = '\\S+(?:\\s+\\S+)*';

      var arglist = {
        pattern: new RegExp(par + '[\\s\\S]*' + endpar),
        lookbehind: true,
        inside: {
          'rest-vars': {
            pattern: new RegExp('&(?:rest|body)\\s+' + forms),
            inside: arg
          },
          'other-marker-vars': {
            pattern: new RegExp('&(?:optional|aux)\\s+' + forms),
            inside: arg
          },
          keys: {
            pattern: new RegExp('&key\\s+' + forms + '(?:\\s+&allow-other-keys)?'),
            inside: arg
          },
          argument: {
            pattern: new RegExp(symbol),
            alias: 'variable'
          },
          punctuation: /[()]/
        }
      };

      language.lambda.inside.arguments = arglist;
      language.defun.inside.arguments = Prism.util.clone(arglist);
      language.defun.inside.arguments.inside.sublist = arglist;

      Prism.languages.lisp = language;
      Prism.languages.elisp = language;
      Prism.languages.emacs = language;
      Prism.languages['emacs-lisp'] = language;
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/livescript.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/livescript.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'livescript',
  init: function init(Prism) {
    Prism.languages.livescript = {
      comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
        lookbehind: true
      }, {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
      }],
      'interpolated-string': {
        /* Look-behind and look-ahead prevents wrong behavior of the greedy pattern
        * forcing it to match """-quoted string when it would otherwise match "-quoted first. */
        pattern: /(^|[^"])("""|")(?:\\[\s\S]|(?!\2)[^\\])*\2(?!")/,
        lookbehind: true,
        greedy: true,
        inside: {
          variable: {
            pattern: /(^|[^\\])#[a-z_](?:-?[a-z]|[\d_])*/m,
            lookbehind: true
          },
          interpolation: {
            pattern: /(^|[^\\])#\{[^}]+\}/m,
            lookbehind: true,
            inside: {
              'interpolation-punctuation': {
                pattern: /^#\{|\}$/,
                alias: 'variable'
              }
              // See rest below
            }
          },
          string: /[\s\S]+/
        }
      },
      string: [{
        pattern: /('''|')(?:\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: true
      }, {
        pattern: /<\[[\s\S]*?\]>/,
        greedy: true
      }, /\\[^\s,;\])}]+/],
      regex: [{
        pattern: /\/\/(\[.+?]|\\.|(?!\/\/)[^\\])+\/\/[gimyu]{0,5}/,
        greedy: true,
        inside: {
          comment: {
            pattern: /(^|[^\\])#.*/,
            lookbehind: true
          }
        }
      }, {
        pattern: /\/(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}/,
        greedy: true
      }],
      keyword: {
        pattern: /(^|(?!-).)\b(?:break|case|catch|class|const|continue|default|do|else|extends|fallthrough|finally|for(?: ever)?|function|if|implements|it|let|loop|new|null|otherwise|own|return|super|switch|that|then|this|throw|try|unless|until|var|void|when|while|yield)(?!-)\b/m,
        lookbehind: true
      },
      'keyword-operator': {
        pattern: /(^|[^-])\b(?:(?:delete|require|typeof)!|(?:and|by|delete|export|from|import(?: all)?|in|instanceof|is(?:nt| not)?|not|of|or|til|to|typeof|with|xor)(?!-)\b)/m,
        lookbehind: true,
        alias: 'operator'
      },
      boolean: {
        pattern: /(^|[^-])\b(?:false|no|off|on|true|yes)(?!-)\b/m,
        lookbehind: true
      },
      argument: {
        // Don't match .&. nor &&
        pattern: /(^|(?!\.&\.)[^&])&(?!&)\d*/m,
        lookbehind: true,
        alias: 'variable'
      },
      number: /\b(?:\d+~[\da-z]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[a-z]\w*)?)/i,
      identifier: /[a-z_](?:-?[a-z]|[\d_])*/i,
      operator: [
      // Spaced .
      {
        pattern: /( )\.(?= )/,
        lookbehind: true
      },
      // Full list, in order:
      // .= .~ .. ...
      // .&. .^. .<<. .>>. .>>>.
      // := :: ::=
      // &&
      // || |>
      // < << <<< <<<<
      // <- <-- <-! <--!
      // <~ <~~ <~! <~~!
      // <| <= <?
      // > >> >= >?
      // - -- -> -->
      // + ++
      // @ @@
      // % %%
      // * **
      // ! != !~=
      // !~> !~~>
      // !-> !-->
      // ~ ~> ~~> ~=
      // = ==
      // ^ ^^
      // / ?
      /\.(?:[=~]|\.\.?)|\.(?:[&|^]|<<|>>>?)\.|:(?:=|:=?)|&&|\|[|>]|<(?:<<?<?|--?!?|~~?!?|[|=?])?|>[>=?]?|-(?:->?|>)?|\+\+?|@@?|%%?|\*\*?|!(?:~?=|--?>|~?~>)?|~(?:~?>|=)?|==?|\^\^?|[\/?]/],
      punctuation: /[(){}\[\]|.,:;`]/
    };

    Prism.languages.livescript['interpolated-string'].inside.interpolation.inside.rest = Prism.languages.livescript;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/lolcode.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/lolcode.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'lolcode',
  init: function init(Prism) {
    Prism.languages.lolcode = {
      comment: [/\bOBTW\s+[\s\S]*?\s+TLDR\b/, /\bBTW.+/],
      string: {
        pattern: /"(?::.|[^"])*"/,
        inside: {
          variable: /:\{[^}]+\}/,
          symbol: [/:\([a-f\d]+\)/i, /:\[[^\]]+\]/, /:[)>o":]/]
        },
        greedy: true
      },
      number: /(?:\B-)?(?:\b\d+\.?\d*|\B\.\d+)/,
      symbol: {
        pattern: /(^|\s)(?:A )?(?:YARN|NUMBR|NUMBAR|TROOF|BUKKIT|NOOB)(?=\s|,|$)/,
        lookbehind: true,
        inside: {
          keyword: /A(?=\s)/
        }
      },
      label: {
        pattern: /((?:^|\s)(?:IM IN YR|IM OUTTA YR) )[a-zA-Z]\w*/,
        lookbehind: true,
        alias: 'string'
      },
      function: {
        pattern: /((?:^|\s)(?:I IZ|HOW IZ I|IZ) )[a-zA-Z]\w*/,
        lookbehind: true
      },
      keyword: [{
        pattern: /(^|\s)(?:O HAI IM|KTHX|HAI|KTHXBYE|I HAS A|ITZ(?: A)?|R|AN|MKAY|SMOOSH|MAEK|IS NOW(?: A)?|VISIBLE|GIMMEH|O RLY\?|YA RLY|NO WAI|OIC|MEBBE|WTF\?|OMG|OMGWTF|GTFO|IM IN YR|IM OUTTA YR|FOUND YR|YR|TIL|WILE|UPPIN|NERFIN|I IZ|HOW IZ I|IF U SAY SO|SRS|HAS A|LIEK(?: A)?|IZ)(?=\s|,|$)/,
        lookbehind: true
      }, /'Z(?=\s|,|$)/],
      boolean: {
        pattern: /(^|\s)(?:WIN|FAIL)(?=\s|,|$)/,
        lookbehind: true
      },
      variable: {
        pattern: /(^|\s)IT(?=\s|,|$)/,
        lookbehind: true
      },
      operator: {
        pattern: /(^|\s)(?:NOT|BOTH SAEM|DIFFRINT|(?:SUM|DIFF|PRODUKT|QUOSHUNT|MOD|BIGGR|SMALLR|BOTH|EITHER|WON|ALL|ANY) OF)(?=\s|,|$)/,
        lookbehind: true
      },
      punctuation: /\.{3}|…|,|!/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/lua.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/lua.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'lua',
  init: function init(Prism) {
    Prism.languages.lua = {
      comment: /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
      // \z may be used to skip the following space
      string: {
        pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
        greedy: true
      },
      number: /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
      keyword: /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
      function: /(?!\d)\w+(?=\s*(?:[({]))/,
      operator: [/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/, {
        // Match ".." but don't break "..."
        pattern: /(^|[^.])\.\.(?!\.)/,
        lookbehind: true
      }],
      punctuation: /[\[\](){},;]|\.+|:+/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/makefile.js":
/*!****************************************************!*\
  !*** ./node_modules/reprism/languages/makefile.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'makefile',
  init: function init(Prism) {
    Prism.languages.makefile = {
      comment: {
        pattern: /(^|[^\\])#(?:\\(?:\r\n|[\s\S])|[^\\\r\n])*/,
        lookbehind: true
      },
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },

      // Built-in target names
      builtin: /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,

      // Targets
      symbol: {
        pattern: /^[^:=\r\n]+(?=\s*:(?!=))/m,
        inside: {
          variable: /\$+(?:[^(){}:#=\s]+|(?=[({]))/
        }
      },
      variable: /\$+(?:[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,

      keyword: [
      // Directives
      /-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|include|override|private|sinclude|undefine|unexport|vpath)\b/,
      // Functions
      {
        pattern: /(\()(?:addsuffix|abspath|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:s|list)?)(?=[ \t])/,
        lookbehind: true
      }],
      operator: /(?:::|[?:+!])?=|[|@]/,
      punctuation: /[:;(){}]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/markdown.js":
/*!****************************************************!*\
  !*** ./node_modules/reprism/languages/markdown.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'markdown',
  init: function init(Prism) {
    Prism.languages.markdown = Prism.languages.extend('markup', {});
    Prism.languages.insertBefore('markdown', 'prolog', {
      blockquote: {
        // > ...
        pattern: /^>(?:[\t ]*>)*/m,
        alias: 'punctuation'
      },
      code: [{
        // Prefixed by 4 spaces or 1 tab
        pattern: /^(?: {4}|\t).+/m,
        alias: 'keyword'
      }, {
        // `code`
        // ``code``
        pattern: /``.+?``|`[^`\n]+`/,
        alias: 'keyword'
      }],
      title: [{
        // title 1
        // =======

        // title 2
        // -------
        pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
        alias: 'important',
        inside: {
          punctuation: /==+$|--+$/
        }
      }, {
        // # title 1
        // ###### title 6
        pattern: /(^\s*)#+.+/m,
        lookbehind: true,
        alias: 'important',
        inside: {
          punctuation: /^#+|#+$/
        }
      }],
      hr: {
        // ***
        // ---
        // * * *
        // -----------
        pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
        lookbehind: true,
        alias: 'punctuation'
      },
      list: {
        // * item
        // + item
        // - item
        // 1. item
        pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
        lookbehind: true,
        alias: 'punctuation'
      },
      'url-reference': {
        // [id]: http://example.com "Optional title"
        // [id]: http://example.com 'Optional title'
        // [id]: http://example.com (Optional title)
        // [id]: <http://example.com> "Optional title"
        pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
        inside: {
          variable: {
            pattern: /^(!?\[)[^\]]+/,
            lookbehind: true
          },
          string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
          punctuation: /^[\[\]!:]|[<>]/
        },
        alias: 'url'
      },
      bold: {
        // **strong**
        // __strong__

        // Allow only one line break
        pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
        lookbehind: true,
        inside: {
          punctuation: /^\*\*|^__|\*\*$|__$/
        }
      },
      italic: {
        // *em*
        // _em_

        // Allow only one line break
        pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
        lookbehind: true,
        inside: {
          punctuation: /^[*_]|[*_]$/
        }
      },
      url: {
        // [example](http://example.com "Optional title")
        // [example] [id]
        pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
        inside: {
          variable: {
            pattern: /(!?\[)[^\]]+(?=\]$)/,
            lookbehind: true
          },
          string: {
            pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
          }
        }
      }
    });

    Prism.languages.markdown.bold.inside.url = Prism.languages.markdown.url;
    Prism.languages.markdown.italic.inside.url = Prism.languages.markdown.url;
    Prism.languages.markdown.bold.inside.italic = Prism.languages.markdown.italic;
    Prism.languages.markdown.italic.inside.bold = Prism.languages.markdown.bold;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/markup-templating.js":
/*!*************************************************************!*\
  !*** ./node_modules/reprism/languages/markup-templating.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'markup-templating',
  init: function init(Prism) {
    Prism.languages['markup-templating'] = {};

    Object.defineProperties(Prism.languages['markup-templating'], {
      buildPlaceholders: {
        // Tokenize all inline templating expressions matching placeholderPattern
        // If the replaceFilter function is provided, it will be called with every match.
        // If it returns false, the match will not be replaced.
        value: function value(env, language, placeholderPattern, replaceFilter) {
          if (env.language !== language) {
            return;
          }

          env.tokenStack = [];

          env.code = env.code.replace(placeholderPattern, function (match) {
            if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
              return match;
            }
            var i = env.tokenStack.length;
            // Check for existing strings
            while (env.code.indexOf('___' + language.toUpperCase() + i + '___') !== -1) {
              ++i;
            }

            // Create a sparse array
            env.tokenStack[i] = match;

            return '___' + language.toUpperCase() + i + '___';
          });

          // Switch the grammar to markup
          env.grammar = Prism.languages.markup;
        }
      },
      tokenizePlaceholders: {
        // Replace placeholders with proper tokens after tokenizing
        value: function value(env, language) {
          if (env.language !== language || !env.tokenStack) {
            return;
          }

          // Switch the grammar back
          env.grammar = Prism.languages[language];

          var j = 0;
          var keys = Object.keys(env.tokenStack);
          var walkTokens = function walkTokens(tokens) {
            if (j >= keys.length) {
              return;
            }
            for (var i = 0; i < tokens.length; i++) {
              var token = tokens[i];
              if (typeof token === 'string' || token.content && typeof token.content === 'string') {
                var k = keys[j];
                var t = env.tokenStack[k];
                var s = typeof token === 'string' ? token : token.content;

                var index = s.indexOf('___' + language.toUpperCase() + k + '___');
                if (index > -1) {
                  ++j;
                  var before = s.substring(0, index);
                  var middle = new Prism.Token(language, Prism.tokenize(t, env.grammar, language), 'language-' + language, t);
                  var after = s.substring(index + ('___' + language.toUpperCase() + k + '___').length);
                  var replacement;
                  if (before || after) {
                    replacement = [before, middle, after].filter(function (v) {
                      return !!v;
                    });
                    walkTokens(replacement);
                  } else {
                    replacement = middle;
                  }
                  if (typeof token === 'string') {
                    Array.prototype.splice.apply(tokens, [i, 1].concat(replacement));
                  } else {
                    token.content = replacement;
                  }

                  if (j >= keys.length) {
                    break;
                  }
                }
              } else if (token.content && typeof token.content !== 'string') {
                walkTokens(token.content);
              }
            }
          };

          walkTokens(env.tokens);
        }
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/markup.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/markup.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'markup',
  init: function init(Prism) {
    Prism.languages.markup = {
      comment: /<!--[\s\S]*?-->/,
      prolog: /<\?[\s\S]+?\?>/,
      doctype: /<!DOCTYPE[\s\S]+?>/i,
      cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
      tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        greedy: true,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/i,
            inside: {
              punctuation: /^<\/?/,
              namespace: /^[^\s>\/:]+:/
            }
          },
          'attr-value': {
            pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
            inside: {
              punctuation: [/^=/, {
                pattern: /(^|[^\\])["']/,
                lookbehind: true
              }]
            }
          },
          punctuation: /\/?>/,
          'attr-name': {
            pattern: /[^\s>\/]+/,
            inside: {
              namespace: /^[^\s>\/:]+:/
            }
          }
        }
      },
      entity: /&#?[\da-z]{1,8};/i
    };

    Prism.languages.markup.tag.inside['attr-value'].inside.entity = Prism.languages.markup.entity;

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function (env) {
      if (env.type === 'entity') {
        env.attributes.title = env.content.replace(/&amp;/, '&');
      }
    });

    Prism.languages.xml = Prism.languages.markup;
    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/matlab.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/matlab.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'matlab',
  init: function init(Prism) {
    Prism.languages.matlab = {
      comment: [/%\{[\s\S]*?\}%/, /%.+/],
      string: {
        pattern: /\B'(?:''|[^'\r\n])*'/,
        greedy: true
      },
      // FIXME We could handle imaginary numbers as a whole
      number: /(?:\b\d+\.?\d*|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
      keyword: /\b(?:break|case|catch|continue|else|elseif|end|for|function|if|inf|NaN|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
      function: /(?!\d)\w+(?=\s*\()/,
      operator: /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/,
      punctuation: /\.{3}|[.,;\[\](){}!]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/mel.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/mel.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'mel',
  init: function init(Prism) {
    Prism.languages.mel = {
      comment: /\/\/.*/,
      code: {
        pattern: /`(?:\\.|[^\\`\r\n])*`/,
        greedy: true,
        alias: 'italic',
        inside: {
          delimiter: {
            pattern: /^`|`$/,
            alias: 'punctuation'
          }
          // See rest below
        }
      },
      string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"/,
        greedy: true
      },
      variable: /\$\w+/,
      number: /\b0x[\da-fA-F]+\b|\b\d+\.?\d*|\B\.\d+/,
      flag: {
        pattern: /-[^\d\W]\w*/,
        alias: 'operator'
      },
      keyword: /\b(?:break|case|continue|default|do|else|float|for|global|if|in|int|matrix|proc|return|string|switch|vector|while)\b/,
      function: /\w+(?=\()|\b(?:about|abs|addAttr|addAttributeEditorNodeHelp|addDynamic|addNewShelfTab|addPP|addPanelCategory|addPrefixToName|advanceToNextDrivenKey|affectedNet|affects|aimConstraint|air|alias|aliasAttr|align|alignCtx|alignCurve|alignSurface|allViewFit|ambientLight|angle|angleBetween|animCone|animCurveEditor|animDisplay|animView|annotate|appendStringArray|applicationName|applyAttrPreset|applyTake|arcLenDimContext|arcLengthDimension|arclen|arrayMapper|art3dPaintCtx|artAttrCtx|artAttrPaintVertexCtx|artAttrSkinPaintCtx|artAttrTool|artBuildPaintMenu|artFluidAttrCtx|artPuttyCtx|artSelectCtx|artSetPaintCtx|artUserPaintCtx|assignCommand|assignInputDevice|assignViewportFactories|attachCurve|attachDeviceAttr|attachSurface|attrColorSliderGrp|attrCompatibility|attrControlGrp|attrEnumOptionMenu|attrEnumOptionMenuGrp|attrFieldGrp|attrFieldSliderGrp|attrNavigationControlGrp|attrPresetEditWin|attributeExists|attributeInfo|attributeMenu|attributeQuery|autoKeyframe|autoPlace|bakeClip|bakeFluidShading|bakePartialHistory|bakeResults|bakeSimulation|basename|basenameEx|batchRender|bessel|bevel|bevelPlus|binMembership|bindSkin|blend2|blendShape|blendShapeEditor|blendShapePanel|blendTwoAttr|blindDataType|boneLattice|boundary|boxDollyCtx|boxZoomCtx|bufferCurve|buildBookmarkMenu|buildKeyframeMenu|button|buttonManip|CBG|cacheFile|cacheFileCombine|cacheFileMerge|cacheFileTrack|camera|cameraView|canCreateManip|canvas|capitalizeString|catch|catchQuiet|ceil|changeSubdivComponentDisplayLevel|changeSubdivRegion|channelBox|character|characterMap|characterOutlineEditor|characterize|chdir|checkBox|checkBoxGrp|checkDefaultRenderGlobals|choice|circle|circularFillet|clamp|clear|clearCache|clip|clipEditor|clipEditorCurrentTimeCtx|clipSchedule|clipSchedulerOutliner|clipTrimBefore|closeCurve|closeSurface|cluster|cmdFileOutput|cmdScrollFieldExecuter|cmdScrollFieldReporter|cmdShell|coarsenSubdivSelectionList|collision|color|colorAtPoint|colorEditor|colorIndex|colorIndexSliderGrp|colorSliderButtonGrp|colorSliderGrp|columnLayout|commandEcho|commandLine|commandPort|compactHairSystem|componentEditor|compositingInterop|computePolysetVolume|condition|cone|confirmDialog|connectAttr|connectControl|connectDynamic|connectJoint|connectionInfo|constrain|constrainValue|constructionHistory|container|containsMultibyte|contextInfo|control|convertFromOldLayers|convertIffToPsd|convertLightmap|convertSolidTx|convertTessellation|convertUnit|copyArray|copyFlexor|copyKey|copySkinWeights|cos|cpButton|cpCache|cpClothSet|cpCollision|cpConstraint|cpConvClothToMesh|cpForces|cpGetSolverAttr|cpPanel|cpProperty|cpRigidCollisionFilter|cpSeam|cpSetEdit|cpSetSolverAttr|cpSolver|cpSolverTypes|cpTool|cpUpdateClothUVs|createDisplayLayer|createDrawCtx|createEditor|createLayeredPsdFile|createMotionField|createNewShelf|createNode|createRenderLayer|createSubdivRegion|cross|crossProduct|ctxAbort|ctxCompletion|ctxEditMode|ctxTraverse|currentCtx|currentTime|currentTimeCtx|currentUnit|curve|curveAddPtCtx|curveCVCtx|curveEPCtx|curveEditorCtx|curveIntersect|curveMoveEPCtx|curveOnSurface|curveSketchCtx|cutKey|cycleCheck|cylinder|dagPose|date|defaultLightListCheckBox|defaultNavigation|defineDataServer|defineVirtualDevice|deformer|deg_to_rad|delete|deleteAttr|deleteShadingGroupsAndMaterials|deleteShelfTab|deleteUI|deleteUnusedBrushes|delrandstr|detachCurve|detachDeviceAttr|detachSurface|deviceEditor|devicePanel|dgInfo|dgdirty|dgeval|dgtimer|dimWhen|directKeyCtx|directionalLight|dirmap|dirname|disable|disconnectAttr|disconnectJoint|diskCache|displacementToPoly|displayAffected|displayColor|displayCull|displayLevelOfDetail|displayPref|displayRGBColor|displaySmoothness|displayStats|displayString|displaySurface|distanceDimContext|distanceDimension|doBlur|dolly|dollyCtx|dopeSheetEditor|dot|dotProduct|doubleProfileBirailSurface|drag|dragAttrContext|draggerContext|dropoffLocator|duplicate|duplicateCurve|duplicateSurface|dynCache|dynControl|dynExport|dynExpression|dynGlobals|dynPaintEditor|dynParticleCtx|dynPref|dynRelEdPanel|dynRelEditor|dynamicLoad|editAttrLimits|editDisplayLayerGlobals|editDisplayLayerMembers|editRenderLayerAdjustment|editRenderLayerGlobals|editRenderLayerMembers|editor|editorTemplate|effector|emit|emitter|enableDevice|encodeString|endString|endsWith|env|equivalent|equivalentTol|erf|error|eval|evalDeferred|evalEcho|event|exactWorldBoundingBox|exclusiveLightCheckBox|exec|executeForEachObject|exists|exp|expression|expressionEditorListen|extendCurve|extendSurface|extrude|fcheck|fclose|feof|fflush|fgetline|fgetword|file|fileBrowserDialog|fileDialog|fileExtension|fileInfo|filetest|filletCurve|filter|filterCurve|filterExpand|filterStudioImport|findAllIntersections|findAnimCurves|findKeyframe|findMenuItem|findRelatedSkinCluster|finder|firstParentOf|fitBspline|flexor|floatEq|floatField|floatFieldGrp|floatScrollBar|floatSlider|floatSlider2|floatSliderButtonGrp|floatSliderGrp|floor|flow|fluidCacheInfo|fluidEmitter|fluidVoxelInfo|flushUndo|fmod|fontDialog|fopen|formLayout|format|fprint|frameLayout|fread|freeFormFillet|frewind|fromNativePath|fwrite|gamma|gauss|geometryConstraint|getApplicationVersionAsFloat|getAttr|getClassification|getDefaultBrush|getFileList|getFluidAttr|getInputDeviceRange|getMayaPanelTypes|getModifiers|getPanel|getParticleAttr|getPluginResource|getenv|getpid|glRender|glRenderEditor|globalStitch|gmatch|goal|gotoBindPose|grabColor|gradientControl|gradientControlNoAttr|graphDollyCtx|graphSelectContext|graphTrackCtx|gravity|grid|gridLayout|group|groupObjectsByName|HfAddAttractorToAS|HfAssignAS|HfBuildEqualMap|HfBuildFurFiles|HfBuildFurImages|HfCancelAFR|HfConnectASToHF|HfCreateAttractor|HfDeleteAS|HfEditAS|HfPerformCreateAS|HfRemoveAttractorFromAS|HfSelectAttached|HfSelectAttractors|HfUnAssignAS|hardenPointCurve|hardware|hardwareRenderPanel|headsUpDisplay|headsUpMessage|help|helpLine|hermite|hide|hilite|hitTest|hotBox|hotkey|hotkeyCheck|hsv_to_rgb|hudButton|hudSlider|hudSliderButton|hwReflectionMap|hwRender|hwRenderLoad|hyperGraph|hyperPanel|hyperShade|hypot|iconTextButton|iconTextCheckBox|iconTextRadioButton|iconTextRadioCollection|iconTextScrollList|iconTextStaticLabel|ikHandle|ikHandleCtx|ikHandleDisplayScale|ikSolver|ikSplineHandleCtx|ikSystem|ikSystemInfo|ikfkDisplayMethod|illustratorCurves|image|imfPlugins|inheritTransform|insertJoint|insertJointCtx|insertKeyCtx|insertKnotCurve|insertKnotSurface|instance|instanceable|instancer|intField|intFieldGrp|intScrollBar|intSlider|intSliderGrp|interToUI|internalVar|intersect|iprEngine|isAnimCurve|isConnected|isDirty|isParentOf|isSameObject|isTrue|isValidObjectName|isValidString|isValidUiName|isolateSelect|itemFilter|itemFilterAttr|itemFilterRender|itemFilterType|joint|jointCluster|jointCtx|jointDisplayScale|jointLattice|keyTangent|keyframe|keyframeOutliner|keyframeRegionCurrentTimeCtx|keyframeRegionDirectKeyCtx|keyframeRegionDollyCtx|keyframeRegionInsertKeyCtx|keyframeRegionMoveKeyCtx|keyframeRegionScaleKeyCtx|keyframeRegionSelectKeyCtx|keyframeRegionSetKeyCtx|keyframeRegionTrackCtx|keyframeStats|lassoContext|lattice|latticeDeformKeyCtx|launch|launchImageEditor|layerButton|layeredShaderPort|layeredTexturePort|layout|layoutDialog|lightList|lightListEditor|lightListPanel|lightlink|lineIntersection|linearPrecision|linstep|listAnimatable|listAttr|listCameras|listConnections|listDeviceAttachments|listHistory|listInputDeviceAxes|listInputDeviceButtons|listInputDevices|listMenuAnnotation|listNodeTypes|listPanelCategories|listRelatives|listSets|listTransforms|listUnselected|listerEditor|loadFluid|loadNewShelf|loadPlugin|loadPluginLanguageResources|loadPrefObjects|localizedPanelLabel|lockNode|loft|log|longNameOf|lookThru|ls|lsThroughFilter|lsType|lsUI|Mayatomr|mag|makeIdentity|makeLive|makePaintable|makeRoll|makeSingleSurface|makeTubeOn|makebot|manipMoveContext|manipMoveLimitsCtx|manipOptions|manipRotateContext|manipRotateLimitsCtx|manipScaleContext|manipScaleLimitsCtx|marker|match|max|memory|menu|menuBarLayout|menuEditor|menuItem|menuItemToShelf|menuSet|menuSetPref|messageLine|min|minimizeApp|mirrorJoint|modelCurrentTimeCtx|modelEditor|modelPanel|mouse|movIn|movOut|move|moveIKtoFK|moveKeyCtx|moveVertexAlongDirection|multiProfileBirailSurface|mute|nParticle|nameCommand|nameField|namespace|namespaceInfo|newPanelItems|newton|nodeCast|nodeIconButton|nodeOutliner|nodePreset|nodeType|noise|nonLinear|normalConstraint|normalize|nurbsBoolean|nurbsCopyUVSet|nurbsCube|nurbsEditUV|nurbsPlane|nurbsSelect|nurbsSquare|nurbsToPoly|nurbsToPolygonsPref|nurbsToSubdiv|nurbsToSubdivPref|nurbsUVSet|nurbsViewDirectionVector|objExists|objectCenter|objectLayer|objectType|objectTypeUI|obsoleteProc|oceanNurbsPreviewPlane|offsetCurve|offsetCurveOnSurface|offsetSurface|openGLExtension|openMayaPref|optionMenu|optionMenuGrp|optionVar|orbit|orbitCtx|orientConstraint|outlinerEditor|outlinerPanel|overrideModifier|paintEffectsDisplay|pairBlend|palettePort|paneLayout|panel|panelConfiguration|panelHistory|paramDimContext|paramDimension|paramLocator|parent|parentConstraint|particle|particleExists|particleInstancer|particleRenderInfo|partition|pasteKey|pathAnimation|pause|pclose|percent|performanceOptions|pfxstrokes|pickWalk|picture|pixelMove|planarSrf|plane|play|playbackOptions|playblast|plugAttr|plugNode|pluginInfo|pluginResourceUtil|pointConstraint|pointCurveConstraint|pointLight|pointMatrixMult|pointOnCurve|pointOnSurface|pointPosition|poleVectorConstraint|polyAppend|polyAppendFacetCtx|polyAppendVertex|polyAutoProjection|polyAverageNormal|polyAverageVertex|polyBevel|polyBlendColor|polyBlindData|polyBoolOp|polyBridgeEdge|polyCacheMonitor|polyCheck|polyChipOff|polyClipboard|polyCloseBorder|polyCollapseEdge|polyCollapseFacet|polyColorBlindData|polyColorDel|polyColorPerVertex|polyColorSet|polyCompare|polyCone|polyCopyUV|polyCrease|polyCreaseCtx|polyCreateFacet|polyCreateFacetCtx|polyCube|polyCut|polyCutCtx|polyCylinder|polyCylindricalProjection|polyDelEdge|polyDelFacet|polyDelVertex|polyDuplicateAndConnect|polyDuplicateEdge|polyEditUV|polyEditUVShell|polyEvaluate|polyExtrudeEdge|polyExtrudeFacet|polyExtrudeVertex|polyFlipEdge|polyFlipUV|polyForceUV|polyGeoSampler|polyHelix|polyInfo|polyInstallAction|polyLayoutUV|polyListComponentConversion|polyMapCut|polyMapDel|polyMapSew|polyMapSewMove|polyMergeEdge|polyMergeEdgeCtx|polyMergeFacet|polyMergeFacetCtx|polyMergeUV|polyMergeVertex|polyMirrorFace|polyMoveEdge|polyMoveFacet|polyMoveFacetUV|polyMoveUV|polyMoveVertex|polyNormal|polyNormalPerVertex|polyNormalizeUV|polyOptUvs|polyOptions|polyOutput|polyPipe|polyPlanarProjection|polyPlane|polyPlatonicSolid|polyPoke|polyPrimitive|polyPrism|polyProjection|polyPyramid|polyQuad|polyQueryBlindData|polyReduce|polySelect|polySelectConstraint|polySelectConstraintMonitor|polySelectCtx|polySelectEditCtx|polySeparate|polySetToFaceNormal|polySewEdge|polyShortestPathCtx|polySmooth|polySoftEdge|polySphere|polySphericalProjection|polySplit|polySplitCtx|polySplitEdge|polySplitRing|polySplitVertex|polyStraightenUVBorder|polySubdivideEdge|polySubdivideFacet|polyToSubdiv|polyTorus|polyTransfer|polyTriangulate|polyUVSet|polyUnite|polyWedgeFace|popen|popupMenu|pose|pow|preloadRefEd|print|progressBar|progressWindow|projFileViewer|projectCurve|projectTangent|projectionContext|projectionManip|promptDialog|propModCtx|propMove|psdChannelOutliner|psdEditTextureFile|psdExport|psdTextureFile|putenv|pwd|python|querySubdiv|quit|rad_to_deg|radial|radioButton|radioButtonGrp|radioCollection|radioMenuItemCollection|rampColorPort|rand|randomizeFollicles|randstate|rangeControl|readTake|rebuildCurve|rebuildSurface|recordAttr|recordDevice|redo|reference|referenceEdit|referenceQuery|refineSubdivSelectionList|refresh|refreshAE|registerPluginResource|rehash|reloadImage|removeJoint|removeMultiInstance|removePanelCategory|rename|renameAttr|renameSelectionList|renameUI|render|renderGlobalsNode|renderInfo|renderLayerButton|renderLayerParent|renderLayerPostProcess|renderLayerUnparent|renderManip|renderPartition|renderQualityNode|renderSettings|renderThumbnailUpdate|renderWindowEditor|renderWindowSelectContext|renderer|reorder|reorderDeformers|requires|reroot|resampleFluid|resetAE|resetPfxToPolyCamera|resetTool|resolutionNode|retarget|reverseCurve|reverseSurface|revolve|rgb_to_hsv|rigidBody|rigidSolver|roll|rollCtx|rootOf|rot|rotate|rotationInterpolation|roundConstantRadius|rowColumnLayout|rowLayout|runTimeCommand|runup|sampleImage|saveAllShelves|saveAttrPreset|saveFluid|saveImage|saveInitialState|saveMenu|savePrefObjects|savePrefs|saveShelf|saveToolSettings|scale|scaleBrushBrightness|scaleComponents|scaleConstraint|scaleKey|scaleKeyCtx|sceneEditor|sceneUIReplacement|scmh|scriptCtx|scriptEditorInfo|scriptJob|scriptNode|scriptTable|scriptToShelf|scriptedPanel|scriptedPanelType|scrollField|scrollLayout|sculpt|searchPathArray|seed|selLoadSettings|select|selectContext|selectCurveCV|selectKey|selectKeyCtx|selectKeyframeRegionCtx|selectMode|selectPref|selectPriority|selectType|selectedNodes|selectionConnection|separator|setAttr|setAttrEnumResource|setAttrMapping|setAttrNiceNameResource|setConstraintRestPosition|setDefaultShadingGroup|setDrivenKeyframe|setDynamic|setEditCtx|setEditor|setFluidAttr|setFocus|setInfinity|setInputDeviceMapping|setKeyCtx|setKeyPath|setKeyframe|setKeyframeBlendshapeTargetWts|setMenuMode|setNodeNiceNameResource|setNodeTypeFlag|setParent|setParticleAttr|setPfxToPolyCamera|setPluginResource|setProject|setStampDensity|setStartupMessage|setState|setToolTo|setUITemplate|setXformManip|sets|shadingConnection|shadingGeometryRelCtx|shadingLightRelCtx|shadingNetworkCompare|shadingNode|shapeCompare|shelfButton|shelfLayout|shelfTabLayout|shellField|shortNameOf|showHelp|showHidden|showManipCtx|showSelectionInTitle|showShadingGroupAttrEditor|showWindow|sign|simplify|sin|singleProfileBirailSurface|size|sizeBytes|skinCluster|skinPercent|smoothCurve|smoothTangentSurface|smoothstep|snap2to2|snapKey|snapMode|snapTogetherCtx|snapshot|soft|softMod|softModCtx|sort|sound|soundControl|source|spaceLocator|sphere|sphrand|spotLight|spotLightPreviewPort|spreadSheetEditor|spring|sqrt|squareSurface|srtContext|stackTrace|startString|startsWith|stitchAndExplodeShell|stitchSurface|stitchSurfacePoints|strcmp|stringArrayCatenate|stringArrayContains|stringArrayCount|stringArrayInsertAtIndex|stringArrayIntersector|stringArrayRemove|stringArrayRemoveAtIndex|stringArrayRemoveDuplicates|stringArrayRemoveExact|stringArrayToString|stringToStringArray|strip|stripPrefixFromName|stroke|subdAutoProjection|subdCleanTopology|subdCollapse|subdDuplicateAndConnect|subdEditUV|subdListComponentConversion|subdMapCut|subdMapSewMove|subdMatchTopology|subdMirror|subdToBlind|subdToPoly|subdTransferUVsToCache|subdiv|subdivCrease|subdivDisplaySmoothness|substitute|substituteAllString|substituteGeometry|substring|surface|surfaceSampler|surfaceShaderList|swatchDisplayPort|switchTable|symbolButton|symbolCheckBox|sysFile|system|tabLayout|tan|tangentConstraint|texLatticeDeformContext|texManipContext|texMoveContext|texMoveUVShellContext|texRotateContext|texScaleContext|texSelectContext|texSelectShortestPathCtx|texSmudgeUVContext|texWinToolCtx|text|textCurves|textField|textFieldButtonGrp|textFieldGrp|textManip|textScrollList|textToShelf|textureDisplacePlane|textureHairColor|texturePlacementContext|textureWindow|threadCount|threePointArcCtx|timeControl|timePort|timerX|toNativePath|toggle|toggleAxis|toggleWindowVisibility|tokenize|tokenizeList|tolerance|tolower|toolButton|toolCollection|toolDropped|toolHasOptions|toolPropertyWindow|torus|toupper|trace|track|trackCtx|transferAttributes|transformCompare|transformLimits|translator|trim|trunc|truncateFluidCache|truncateHairCache|tumble|tumbleCtx|turbulence|twoPointArcCtx|uiRes|uiTemplate|unassignInputDevice|undo|undoInfo|ungroup|uniform|unit|unloadPlugin|untangleUV|untitledFileName|untrim|upAxis|updateAE|userCtx|uvLink|uvSnapshot|validateShelfName|vectorize|view2dToolCtx|viewCamera|viewClipPlane|viewFit|viewHeadOn|viewLookAt|viewManip|viewPlace|viewSet|visor|volumeAxis|vortex|waitCursor|warning|webBrowser|webBrowserPrefs|whatIs|window|windowPref|wire|wireContext|workspace|wrinkle|wrinkleContext|writeTake|xbmLangPathList|xform)\b/,

      operator: [/\+[+=]?|-[-=]?|&&|\|\||[<>]=|[*\/!=]=?|[%^]/, {
        // We don't want to match <<
        pattern: /(^|[^<])<(?!<)/,
        lookbehind: true
      }, {
        // We don't want to match >>
        pattern: /(^|[^>])>(?!>)/,
        lookbehind: true
      }],
      punctuation: /<<|>>|[.,:;?\[\](){}]/
    };
    Prism.languages.mel.code.inside.rest = Prism.languages.mel;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/mizar.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/mizar.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'mizar',
  init: function init(Prism) {
    Prism.languages.mizar = {
      comment: /::.+/,
      keyword: /@proof\b|\b(?:according|aggregate|all|and|antonym|are|as|associativity|assume|asymmetry|attr|be|begin|being|by|canceled|case|cases|clusters?|coherence|commutativity|compatibility|connectedness|consider|consistency|constructors|contradiction|correctness|def|deffunc|define|definitions?|defpred|do|does|equals|end|environ|ex|exactly|existence|for|from|func|given|hence|hereby|holds|idempotence|identity|iff?|implies|involutiveness|irreflexivity|is|it|let|means|mode|non|not|notations?|now|of|or|otherwise|over|per|pred|prefix|projectivity|proof|provided|qua|reconsider|redefine|reduce|reducibility|reflexivity|registrations?|requirements|reserve|sch|schemes?|section|selector|set|sethood|st|struct|such|suppose|symmetry|synonym|take|that|the|then|theorems?|thesis|thus|to|transitivity|uniqueness|vocabular(?:y|ies)|when|where|with|wrt)\b/,
      parameter: {
        pattern: /\$(?:10|\d)/,
        alias: 'variable'
      },
      variable: /\w+(?=:)/,
      number: /(?:\b|-)\d+\b/,
      operator: /\.\.\.|->|&|\.?=/,
      punctuation: /\(#|#\)|[,:;\[\](){}]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/monkey.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/monkey.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'monkey',
  init: function init(Prism) {
    Prism.languages.monkey = {
      string: /"[^"\r\n]*"/,
      comment: [{
        pattern: /^#Rem\s+[\s\S]*?^#End/im,
        greedy: true
      }, {
        pattern: /'.+/,
        greedy: true
      }],
      preprocessor: {
        pattern: /(^[ \t]*)#.+/m,
        lookbehind: true,
        alias: 'comment'
      },
      function: /\w+(?=\()/,
      'type-char': {
        pattern: /(\w)[?%#$]/,
        lookbehind: true,
        alias: 'variable'
      },
      number: {
        pattern: /((?:\.\.)?)(?:(?:\b|\B-\.?|\B\.)\d+(?:(?!\.\.)\.\d*)?|\$[\da-f]+)/i,
        lookbehind: true
      },
      keyword: /\b(?:Void|Strict|Public|Private|Property|Bool|Int|Float|String|Array|Object|Continue|Exit|Import|Extern|New|Self|Super|Try|Catch|Eachin|True|False|Extends|Abstract|Final|Select|Case|Default|Const|Local|Global|Field|Method|Function|Class|End|If|Then|Else|ElseIf|EndIf|While|Wend|Repeat|Until|Forever|For|To|Step|Next|Return|Module|Interface|Implements|Inline|Throw|Null)\b/i,
      operator: /\.\.|<[=>]?|>=?|:?=|(?:[+\-*\/&~|]|\b(?:Mod|Shl|Shr)\b)=?|\b(?:And|Not|Or)\b/i,
      punctuation: /[.,:;()\[\]]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/n4js.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/n4js.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'n4js',
  init: function init(Prism) {
    Prism.languages.n4js = Prism.languages.extend('javascript', {
      // Keywords from N4JS language spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html
      keyword: /\b(?:any|Array|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/
    });

    Prism.languages.insertBefore('n4js', 'constant', {
      // Annotations in N4JS spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html#_annotations
      annotation: {
        pattern: /@+\w+/,
        alias: 'operator'
      }
    });

    Prism.languages.n4jsd = Prism.languages.n4js;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/nasm.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/nasm.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'nasm',
  init: function init(Prism) {
    Prism.languages.nasm = {
      comment: /;.*$/m,
      string: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
      label: {
        pattern: /(^\s*)[A-Za-z._?$][\w.?$@~#]*:/m,
        lookbehind: true,
        alias: 'function'
      },
      keyword: [/\[?BITS (?:16|32|64)\]?/, {
        pattern: /(^\s*)section\s*[a-zA-Z.]+:?/im,
        lookbehind: true
      }, /(?:extern|global)[^;\r\n]*/i, /(?:CPU|FLOAT|DEFAULT).*$/m],
      register: {
        pattern: /\b(?:st\d|[xyz]mm\d\d?|[cdt]r\d|r\d\d?[bwd]?|[er]?[abcd]x|[abcd][hl]|[er]?(?:bp|sp|si|di)|[cdefgs]s)\b/i,
        alias: 'variable'
      },
      number: /(?:\b|(?=\$))(?:0[hx][\da-f]*\.?[\da-f]+(?:p[+-]?\d+)?|\d[\da-f]+[hx]|\$\d[\da-f]*|0[oq][0-7]+|[0-7]+[oq]|0[by][01]+|[01]+[by]|0[dt]\d+|\d*\.?\d+(?:\.?e[+-]?\d+)?[dt]?)\b/i,
      operator: /[\[\]*+\-\/%<>=&|$!]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/nginx.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/nginx.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'nginx',
  init: function init(Prism) {
    Prism.languages.nginx = Prism.languages.extend('clike', {
      comment: {
        pattern: /(^|[^"{\\])#.*/,
        lookbehind: true
      },
      keyword: /\b(?:CONTENT_|DOCUMENT_|GATEWAY_|HTTP_|HTTPS|if_not_empty|PATH_|QUERY_|REDIRECT_|REMOTE_|REQUEST_|SCGI|SCRIPT_|SERVER_|http|events|accept_mutex|accept_mutex_delay|access_log|add_after_body|add_before_body|add_header|addition_types|aio|alias|allow|ancient_browser|ancient_browser_value|auth|auth_basic|auth_basic_user_file|auth_http|auth_http_header|auth_http_timeout|autoindex|autoindex_exact_size|autoindex_localtime|break|charset|charset_map|charset_types|chunked_transfer_encoding|client_body_buffer_size|client_body_in_file_only|client_body_in_single_buffer|client_body_temp_path|client_body_timeout|client_header_buffer_size|client_header_timeout|client_max_body_size|connection_pool_size|create_full_put_path|daemon|dav_access|dav_methods|debug_connection|debug_points|default_type|deny|devpoll_changes|devpoll_events|directio|directio_alignment|disable_symlinks|empty_gif|env|epoll_events|error_log|error_page|expires|fastcgi_buffer_size|fastcgi_buffers|fastcgi_busy_buffers_size|fastcgi_cache|fastcgi_cache_bypass|fastcgi_cache_key|fastcgi_cache_lock|fastcgi_cache_lock_timeout|fastcgi_cache_methods|fastcgi_cache_min_uses|fastcgi_cache_path|fastcgi_cache_purge|fastcgi_cache_use_stale|fastcgi_cache_valid|fastcgi_connect_timeout|fastcgi_hide_header|fastcgi_ignore_client_abort|fastcgi_ignore_headers|fastcgi_index|fastcgi_intercept_errors|fastcgi_keep_conn|fastcgi_max_temp_file_size|fastcgi_next_upstream|fastcgi_no_cache|fastcgi_param|fastcgi_pass|fastcgi_pass_header|fastcgi_read_timeout|fastcgi_redirect_errors|fastcgi_send_timeout|fastcgi_split_path_info|fastcgi_store|fastcgi_store_access|fastcgi_temp_file_write_size|fastcgi_temp_path|flv|geo|geoip_city|geoip_country|google_perftools_profiles|gzip|gzip_buffers|gzip_comp_level|gzip_disable|gzip_http_version|gzip_min_length|gzip_proxied|gzip_static|gzip_types|gzip_vary|if|if_modified_since|ignore_invalid_headers|image_filter|image_filter_buffer|image_filter_jpeg_quality|image_filter_sharpen|image_filter_transparency|imap_capabilities|imap_client_buffer|include|index|internal|ip_hash|keepalive|keepalive_disable|keepalive_requests|keepalive_timeout|kqueue_changes|kqueue_events|large_client_header_buffers|limit_conn|limit_conn_log_level|limit_conn_zone|limit_except|limit_rate|limit_rate_after|limit_req|limit_req_log_level|limit_req_zone|limit_zone|lingering_close|lingering_time|lingering_timeout|listen|location|lock_file|log_format|log_format_combined|log_not_found|log_subrequest|map|map_hash_bucket_size|map_hash_max_size|master_process|max_ranges|memcached_buffer_size|memcached_connect_timeout|memcached_next_upstream|memcached_pass|memcached_read_timeout|memcached_send_timeout|merge_slashes|min_delete_depth|modern_browser|modern_browser_value|mp4|mp4_buffer_size|mp4_max_buffer_size|msie_padding|msie_refresh|multi_accept|open_file_cache|open_file_cache_errors|open_file_cache_min_uses|open_file_cache_valid|open_log_file_cache|optimize_server_names|override_charset|pcre_jit|perl|perl_modules|perl_require|perl_set|pid|pop3_auth|pop3_capabilities|port_in_redirect|post_action|postpone_output|protocol|proxy|proxy_buffer|proxy_buffer_size|proxy_buffering|proxy_buffers|proxy_busy_buffers_size|proxy_cache|proxy_cache_bypass|proxy_cache_key|proxy_cache_lock|proxy_cache_lock_timeout|proxy_cache_methods|proxy_cache_min_uses|proxy_cache_path|proxy_cache_use_stale|proxy_cache_valid|proxy_connect_timeout|proxy_cookie_domain|proxy_cookie_path|proxy_headers_hash_bucket_size|proxy_headers_hash_max_size|proxy_hide_header|proxy_http_version|proxy_ignore_client_abort|proxy_ignore_headers|proxy_intercept_errors|proxy_max_temp_file_size|proxy_method|proxy_next_upstream|proxy_no_cache|proxy_pass|proxy_pass_error_message|proxy_pass_header|proxy_pass_request_body|proxy_pass_request_headers|proxy_read_timeout|proxy_redirect|proxy_redirect_errors|proxy_send_lowat|proxy_send_timeout|proxy_set_body|proxy_set_header|proxy_ssl_session_reuse|proxy_store|proxy_store_access|proxy_temp_file_write_size|proxy_temp_path|proxy_timeout|proxy_upstream_fail_timeout|proxy_upstream_max_fails|random_index|read_ahead|real_ip_header|recursive_error_pages|request_pool_size|reset_timedout_connection|resolver|resolver_timeout|return|rewrite|root|rtsig_overflow_events|rtsig_overflow_test|rtsig_overflow_threshold|rtsig_signo|satisfy|satisfy_any|secure_link_secret|send_lowat|send_timeout|sendfile|sendfile_max_chunk|server|server_name|server_name_in_redirect|server_names_hash_bucket_size|server_names_hash_max_size|server_tokens|set|set_real_ip_from|smtp_auth|smtp_capabilities|so_keepalive|source_charset|split_clients|ssi|ssi_silent_errors|ssi_types|ssi_value_length|ssl|ssl_certificate|ssl_certificate_key|ssl_ciphers|ssl_client_certificate|ssl_crl|ssl_dhparam|ssl_engine|ssl_prefer_server_ciphers|ssl_protocols|ssl_session_cache|ssl_session_timeout|ssl_verify_client|ssl_verify_depth|starttls|stub_status|sub_filter|sub_filter_once|sub_filter_types|tcp_nodelay|tcp_nopush|timeout|timer_resolution|try_files|types|types_hash_bucket_size|types_hash_max_size|underscores_in_headers|uninitialized_variable_warn|upstream|use|user|userid|userid_domain|userid_expires|userid_name|userid_p3p|userid_path|userid_service|valid_referers|variables_hash_bucket_size|variables_hash_max_size|worker_connections|worker_cpu_affinity|worker_priority|worker_processes|worker_rlimit_core|worker_rlimit_nofile|worker_rlimit_sigpending|working_directory|xclient|xml_entities|xslt_entities|xslt_stylesheet|xslt_types)\b/i
    });

    Prism.languages.insertBefore('nginx', 'keyword', {
      variable: /\$[a-z_]+/i
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/nim.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/nim.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'nim',
  init: function init(Prism) {
    Prism.languages.nim = {
      comment: /#.*/,
      // Double-quoted strings can be prefixed by an identifier (Generalized raw string literals)
      // Character literals are handled specifically to prevent issues with numeric type suffixes
      string: {
        pattern: /(?:(?:\b(?!\d)(?:\w|\\x[8-9a-fA-F][0-9a-fA-F])+)?(?:"""[\s\S]*?"""(?!")|"(?:\\[\s\S]|""|[^"\\])*")|'(?:\\(?:\d+|x[\da-fA-F]{2}|.)|[^'])')/,
        greedy: true
      },
      // The negative look ahead prevents wrong highlighting of the .. operator
      number: /\b(?:0[xXoObB][\da-fA-F_]+|\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)(?:'?[iuf]\d*)?/,
      keyword: /\b(?:addr|as|asm|atomic|bind|block|break|case|cast|concept|const|continue|converter|defer|discard|distinct|do|elif|else|end|enum|except|export|finally|for|from|func|generic|if|import|include|interface|iterator|let|macro|method|mixin|nil|object|out|proc|ptr|raise|ref|return|static|template|try|tuple|type|using|var|when|while|with|without|yield)\b/,
      function: {
        pattern: /(?:(?!\d)(?:\w|\\x[8-9a-fA-F][0-9a-fA-F])+|`[^`\r\n]+`)\*?(?:\[[^\]]+\])?(?=\s*\()/,
        inside: {
          operator: /\*$/
        }
      },
      // We don't want to highlight operators inside backticks
      ignore: {
        pattern: /`[^`\r\n]+`/,
        inside: {
          punctuation: /`/
        }
      },
      operator: {
        // Look behind and look ahead prevent wrong highlighting of punctuations [. .] {. .} (. .)
        // but allow the slice operator .. to take precedence over them
        // One can define his own operators in Nim so all combination of operators might be an operator.
        pattern: /(^|[({\[](?=\.\.)|(?![({\[]\.).)(?:(?:[=+\-*\/<>@$~&%|!?^:\\]|\.\.|\.(?![)}\]]))+|\b(?:and|div|of|or|in|is|isnot|mod|not|notin|shl|shr|xor)\b)/m,
        lookbehind: true
      },
      punctuation: /[({\[]\.|\.[)}\]]|[`(){}\[\],:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/nix.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/nix.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'nix',
  init: function init(Prism) {
    Prism.languages.nix = {
      comment: /\/\*[\s\S]*?\*\/|#.*/,
      string: {
        pattern: /"(?:[^"\\]|\\[\s\S])*"|''(?:(?!'')[\s\S]|''(?:'|\\|\$\{))*''/,
        greedy: true,
        inside: {
          interpolation: {
            // The lookbehind ensures the ${} is not preceded by \ or ''
            pattern: /(^|(?:^|(?!'').)[^\\])\$\{(?:[^}]|\{[^}]*\})*}/,
            lookbehind: true,
            inside: {
              antiquotation: {
                pattern: /^\$(?=\{)/,
                alias: 'variable'
              }
              // See rest below
            }
          }
        }
      },
      url: [/\b(?:[a-z]{3,7}:\/\/)[\w\-+%~\/.:#=?&]+/, {
        pattern: /([^\/])(?:[\w\-+%~.:#=?&]*(?!\/\/)[\w\-+%~\/.:#=?&])?(?!\/\/)\/[\w\-+%~\/.:#=?&]*/,
        lookbehind: true
      }],
      antiquotation: {
        pattern: /\$(?=\{)/,
        alias: 'variable'
      },
      number: /\b\d+\b/,
      keyword: /\b(?:assert|builtins|else|if|in|inherit|let|null|or|then|with)\b/,
      function: /\b(?:abort|add|all|any|attrNames|attrValues|baseNameOf|compareVersions|concatLists|currentSystem|deepSeq|derivation|dirOf|div|elem(?:At)?|fetch(?:url|Tarball)|filter(?:Source)?|fromJSON|genList|getAttr|getEnv|hasAttr|hashString|head|import|intersectAttrs|is(?:Attrs|Bool|Function|Int|List|Null|String)|length|lessThan|listToAttrs|map|mul|parseDrvName|pathExists|read(?:Dir|File)|removeAttrs|replaceStrings|seq|sort|stringLength|sub(?:string)?|tail|throw|to(?:File|JSON|Path|String|XML)|trace|typeOf)\b|\bfoldl'\B/,
      boolean: /\b(?:true|false)\b/,
      operator: /[=!<>]=?|\+\+?|\|\||&&|\/\/|->?|[?@]/,
      punctuation: /[{}()[\].,:;]/
    };

    Prism.languages.nix.string.inside.interpolation.inside.rest = Prism.languages.nix;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/nsis.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/nsis.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'nsis',
  init: function init(Prism) {
    /**
     * Original by Jan T. Sott (http://github.com/idleberg)
     *
     * Includes all commands and plug-ins shipped with NSIS 3.02
     */
    Prism.languages.nsis = {
      comment: {
        pattern: /(^|[^\\])(\/\*[\s\S]*?\*\/|[#;].*)/,
        lookbehind: true
      },
      string: {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      keyword: {
        pattern: /(^\s*)(?:Abort|Add(?:BrandingImage|Size)|AdvSplash|Allow(?:RootDirInstall|SkipFiles)|AutoCloseWindow|Banner|BG(?:Font|Gradient|Image)|BrandingText|BringToFront|Call(?:InstDLL)?|Caption|ChangeUI|CheckBitmap|ClearErrors|CompletedText|ComponentText|CopyFiles|CRCCheck|Create(?:Directory|Font|ShortCut)|Delete(?:INISec|INIStr|RegKey|RegValue)?|Detail(?:Print|sButtonText)|Dialer|Dir(?:Text|Var|Verify)|EnableWindow|Enum(?:RegKey|RegValue)|Exch|Exec(?:Shell(?:Wait)?|Wait)?|ExpandEnvStrings|File(?:BufSize|Close|ErrorText|Open|Read|ReadByte|ReadUTF16LE|ReadWord|WriteUTF16LE|Seek|Write|WriteByte|WriteWord)?|Find(?:Close|First|Next|Window)|FlushINI|Get(?:CurInstType|CurrentAddress|DlgItem|DLLVersion(?:Local)?|ErrorLevel|FileTime(?:Local)?|FullPathName|Function(?:Address|End)?|InstDirError|LabelAddress|TempFileName)|Goto|HideWindow|Icon|If(?:Abort|Errors|FileExists|RebootFlag|Silent)|InitPluginsDir|Install(?:ButtonText|Colors|Dir(?:RegKey)?)|InstProgressFlags|Inst(?:Type(?:GetText|SetText)?)|Int(?:64|Ptr)?CmpU?|Int(?:64)?Fmt|Int(?:Ptr)?Op|IsWindow|Lang(?:DLL|String)|License(?:BkColor|Data|ForceSelection|LangString|Text)|LoadLanguageFile|LockWindow|Log(?:Set|Text)|Manifest(?:DPIAware|SupportedOS)|Math|MessageBox|MiscButtonText|Name|Nop|ns(?:Dialogs|Exec)|NSISdl|OutFile|Page(?:Callbacks)?|PE(?:DllCharacteristics|SubsysVer)|Pop|Push|Quit|Read(?:EnvStr|INIStr|RegDWORD|RegStr)|Reboot|RegDLL|Rename|RequestExecutionLevel|ReserveFile|Return|RMDir|SearchPath|Section(?:End|GetFlags|GetInstTypes|GetSize|GetText|Group|In|SetFlags|SetInstTypes|SetSize|SetText)?|SendMessage|Set(?:AutoClose|BrandingImage|Compress|Compressor(?:DictSize)?|CtlColors|CurInstType|DatablockOptimize|DateSave|Details(?:Print|View)|ErrorLevel|Errors|FileAttributes|Font|OutPath|Overwrite|PluginUnload|RebootFlag|RegView|ShellVarContext|Silent)|Show(?:InstDetails|UninstDetails|Window)|Silent(?:Install|UnInstall)|Sleep|SpaceTexts|Splash|StartMenu|Str(?:CmpS?|Cpy|Len)|SubCaption|System|Unicode|Uninstall(?:ButtonText|Caption|Icon|SubCaption|Text)|UninstPage|UnRegDLL|UserInfo|Var|VI(?:AddVersionKey|FileVersion|ProductVersion)|VPatch|WindowIcon|Write(?:INIStr|Reg(?:Bin|DWORD|ExpandStr|MultiStr|None|Str)|Uninstaller)|XPStyle)\b/m,
        lookbehind: true
      },
      property: /\b(?:admin|all|auto|both|colored|false|force|hide|highest|lastused|leave|listonly|none|normal|notset|off|on|open|print|show|silent|silentlog|smooth|textonly|true|user|ARCHIVE|FILE_(ATTRIBUTE_ARCHIVE|ATTRIBUTE_NORMAL|ATTRIBUTE_OFFLINE|ATTRIBUTE_READONLY|ATTRIBUTE_SYSTEM|ATTRIBUTE_TEMPORARY)|HK((CR|CU|LM)(32|64)?|DD|PD|U)|HKEY_(CLASSES_ROOT|CURRENT_CONFIG|CURRENT_USER|DYN_DATA|LOCAL_MACHINE|PERFORMANCE_DATA|USERS)|ID(ABORT|CANCEL|IGNORE|NO|OK|RETRY|YES)|MB_(ABORTRETRYIGNORE|DEFBUTTON1|DEFBUTTON2|DEFBUTTON3|DEFBUTTON4|ICONEXCLAMATION|ICONINFORMATION|ICONQUESTION|ICONSTOP|OK|OKCANCEL|RETRYCANCEL|RIGHT|RTLREADING|SETFOREGROUND|TOPMOST|USERICON|YESNO)|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SYSTEM|TEMPORARY)\b/,
      constant: /\${[\w\.:\^-]+}|\$\([\w\.:\^-]+\)/i,
      variable: /\$\w+/i,
      number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
      operator: /--?|\+\+?|<=?|>=?|==?=?|&&?|\|\|?|[?*\/~^%]/,
      punctuation: /[{}[\];(),.:]/,
      important: {
        pattern: /(^\s*)!(?:addincludedir|addplugindir|appendfile|cd|define|delfile|echo|else|endif|error|execute|finalize|getdllversion|gettlbversion|ifdef|ifmacrodef|ifmacrondef|ifndef|if|include|insertmacro|macroend|macro|makensis|packhdr|pragma|searchparse|searchreplace|system|tempfile|undef|verbose|warning)\b/im,
        lookbehind: true
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/objectivec.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/objectivec.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'objectivec',
  init: function init(Prism) {
    Prism.languages.objectivec = Prism.languages.extend('c', {
      keyword: /\b(?:asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|in|self|super)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
      string: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|@"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
      operator: /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/ocaml.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/ocaml.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'ocaml',
  init: function init(Prism) {
    Prism.languages.ocaml = {
      comment: /\(\*[\s\S]*?\*\)/,
      string: [{
        pattern: /"(?:\\.|[^\\\r\n"])*"/,
        greedy: true
      }, {
        pattern: /(['`])(?:\\(?:\d+|x[\da-f]+|.)|(?!\1)[^\\\r\n])\1/i,
        greedy: true
      }],
      number: /\b(?:0x[\da-f][\da-f_]+|(?:0[bo])?\d[\d_]*\.?[\d_]*(?:e[+-]?[\d_]+)?)/i,
      type: {
        pattern: /\B['`]\w*/,
        alias: 'variable'
      },
      directive: {
        pattern: /\B#\w+/,
        alias: 'function'
      },
      keyword: /\b(?:as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|match|method|module|mutable|new|object|of|open|prefix|private|rec|then|sig|struct|to|try|type|val|value|virtual|where|while|with)\b/,
      boolean: /\b(?:false|true)\b/,
      // Custom operators are allowed
      operator: /:=|[=<>@^|&+\-*\/$%!?~][!$%&*+\-.\/:<=>?@^|~]*|\b(?:and|asr|land|lor|lxor|lsl|lsr|mod|nor|or)\b/,
      punctuation: /[(){}\[\]|_.,:;]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/opencl.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/opencl.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'opencl',
  init: function init(Prism) {
    (function (Prism) {
      /* OpenCL kernel language */
      Prism.languages.opencl = Prism.languages.extend('c', {
        // Extracted from the official specs (2.0) and http://streamcomputing.eu/downloads/?opencl.lang (opencl-keywords, opencl-types) and http://sourceforge.net/tracker/?func=detail&aid=2957794&group_id=95717&atid=612384 (Words2, partly Words3)
        keyword: /\b(?:__attribute__|(?:__)?(?:constant|global|kernel|local|private|read_only|read_write|write_only)|_cl_(?:command_queue|context|device_id|event|kernel|mem|platform_id|program|sampler)|auto|break|case|cl_(?:image_format|mem_fence_flags)|clk_event_t|complex|const|continue|default|do|(?:float|double)(?:16(?:x(?:1|16|2|4|8))?|1x(?:1|16|2|4|8)|2(?:x(?:1|16|2|4|8))?|3|4(?:x(?:1|16|2|4|8))?|8(?:x(?:1|16|2|4|8))?)?|else|enum|event_t|extern|for|goto|(?:u?(?:char|short|int|long)|half|quad|bool)(?:2|3|4|8|16)?|if|image(?:1d_(?:array_|buffer_)?t|2d_(?:array_(?:depth_|msaa_depth_|msaa_)?|depth_|msaa_depth_|msaa_)?t|3d_t)|imaginary|inline|intptr_t|ndrange_t|packed|pipe|ptrdiff_t|queue_t|register|reserve_id_t|restrict|return|sampler_t|signed|size_t|sizeof|static|struct|switch|typedef|uintptr_t|uniform|union|unsigned|void|volatile|while)\b/,
        // Extracted from http://streamcomputing.eu/downloads/?opencl.lang (global-vars, opencl-dev)
        'function-opencl-kernel': {
          pattern: /\b(?:abs(?:_diff)?|a?(?:cos|sin)(?:h|pi)?|add_sat|aligned|all|and|any|async(?:_work_group_copy|_work_group_strided_copy)?|atan(?:2?(?:pi)?|h)?|atom_(?:add|and|cmpxchg|dec|inc|max|min|or|sub|xchg|xor)|barrier|bitselect|cbrt|ceil|clamp|clz|copies|copysign|cross|degrees|distance|dot|endian|erf|erfc|exp(?:2|10)?|expm1|fabs|fast_(?:distance|length|normalize)|fdim|floor|fma|fmax|fmin|fract|frexp|fro|from|get_(?:global_(?:id|offset|size)|group_id|image_(?:channel_data_type|channel_order|depth|dim|height|width)|local(?:_id|_size)|num_groups|work_dim)|hadd|(?:half|native)_(?:cos|divide|exp(?:2|10)?|log(?:2|10)?|powr|recip|r?sqrt|sin|tan)|hypot|ilogb|is(?:equal|finite|greater(?:equal)?|inf|less(?:equal|greater)?|nan|normal|notequal|(?:un)?ordered)|ldexp|length|lgamma|lgamma_r|log(?:b|1p|2|10)?|mad(?:24|_hi|_sat)?|max|mem(?:_fence)?|min|mix|modf|mul24|mul_hi|nan|nextafter|normalize|pow[nr]?|prefetch|radians|read_(?:image)(?:f|h|u?i)|read_mem_fence|remainder|remquo|reqd_work_group_size|rhadd|rint|rootn|rotate|round|rsqrt|select|shuffle2?|sign|signbit|sincos|smoothstep|sqrt|step|sub_sat|tan|tanh|tanpi|tgamma|to|trunc|upsample|vec_(?:step|type_hint)|v(?:load|store)(?:_half)?(?:2|3|4|8|16)?|v(?:loada_half|storea?(?:_half)?)(?:2|3|4|8|16)?(?:_(?:rte|rtn|rtp|rtz))?|wait_group_events|work_group_size_hint|write_image(?:f|h|u?i)|write_mem_fence)\b/,
          alias: 'function'
        },
        // Extracted from http://streamcomputing.eu/downloads/?opencl.lang (opencl-const)
        'constant-opencl-kernel': {
          pattern: /\b(?:CHAR_(?:BIT|MAX|MIN)|CLK_(?:ADDRESS_(?:CLAMP(?:_TO_EDGE)?|NONE|REPEAT)|FILTER_(?:LINEAR|NEAREST)|(?:LOCAL|GLOBAL)_MEM_FENCE|NORMALIZED_COORDS_(?:FALSE|TRUE))|CL_(?:BGRA|(?:HALF_)?FLOAT|INTENSITY|LUMINANCE|A?R?G?B?[Ax]?|(?:(?:UN)?SIGNED|[US]NORM)_(?:INT(?:8|16|32))|UNORM_(?:INT_101010|SHORT_(?:555|565)))|(?:DBL|FLT)_(?:DIG|EPSILON|MANT_DIG|(?:MIN|MAX)(?:(?:_10)?_EXP)?)|FLT_RADIX|HUGE_VALF|INFINITY|(?:INT|LONG|SCHAR|SHRT|UCHAR|UINT|ULONG)_(?:MAX|MIN)|MAXFLOAT|M_(?:[12]_PI|2_SQRTPI|E|LN(?:2|10)|LOG(?:10|2)E?|PI[24]?|SQRT(?:1_2|2))|NAN)\b/,
          alias: 'constant'
        }
      });

      var attributes = {
        // Extracted from http://streamcomputing.eu/downloads/?opencl_host.lang (opencl-types and opencl-host)
        'type-opencl-host': {
          pattern: /\b(?:cl_(?:GLenum|GLint|GLuin|addressing_mode|bitfield|bool|buffer_create_type|build_status|channel_(?:order|type)|(?:u?(?:char|short|int|long)|float|double)(?:2|3|4|8|16)?|command_(?:queue(?:_info|_properties)?|type)|context(?:_info|_properties)?|device_(?:exec_capabilities|fp_config|id|info|local_mem_type|mem_cache_type|type)|(?:event|sampler)(?:_info)?|filter_mode|half|image_info|kernel(?:_info|_work_group_info)?|map_flags|mem(?:_flags|_info|_object_type)?|platform_(?:id|info)|profiling_info|program(?:_build_info|_info)?))\b/,
          alias: 'keyword'
        },
        'boolean-opencl-host': {
          pattern: /\bCL_(?:TRUE|FALSE)\b/,
          alias: 'boolean'
        },
        // Extracted from cl.h (2.0) and http://streamcomputing.eu/downloads/?opencl_host.lang (opencl-const)
        'constant-opencl-host': {
          pattern: /\bCL_(?:A|ABGR|ADDRESS_(?:CLAMP(?:_TO_EDGE)?|MIRRORED_REPEAT|NONE|REPEAT)|ARGB|BGRA|BLOCKING|BUFFER_CREATE_TYPE_REGION|BUILD_(?:ERROR|IN_PROGRESS|NONE|PROGRAM_FAILURE|SUCCESS)|COMMAND_(?:ACQUIRE_GL_OBJECTS|BARRIER|COPY_(?:BUFFER(?:_RECT|_TO_IMAGE)?|IMAGE(?:_TO_BUFFER)?)|FILL_(?:BUFFER|IMAGE)|MAP(?:_BUFFER|_IMAGE)|MARKER|MIGRATE(?:_SVM)?_MEM_OBJECTS|NATIVE_KERNEL|NDRANGE_KERNEL|READ_(?:BUFFER(?:_RECT)?|IMAGE)|RELEASE_GL_OBJECTS|SVM_(?:FREE|MAP|MEMCPY|MEMFILL|UNMAP)|TASK|UNMAP_MEM_OBJECT|USER|WRITE_(?:BUFFER(?:_RECT)?|IMAGE))|COMPILER_NOT_AVAILABLE|COMPILE_PROGRAM_FAILURE|COMPLETE|CONTEXT_(?:DEVICES|INTEROP_USER_SYNC|NUM_DEVICES|PLATFORM|PROPERTIES|REFERENCE_COUNT)|DEPTH(?:_STENCIL)?|DEVICE_(?:ADDRESS_BITS|AFFINITY_DOMAIN_(?:L[1-4]_CACHE|NEXT_PARTITIONABLE|NUMA)|AVAILABLE|BUILT_IN_KERNELS|COMPILER_AVAILABLE|DOUBLE_FP_CONFIG|ENDIAN_LITTLE|ERROR_CORRECTION_SUPPORT|EXECUTION_CAPABILITIES|EXTENSIONS|GLOBAL_(?:MEM_(?:CACHELINE_SIZE|CACHE_SIZE|CACHE_TYPE|SIZE)|VARIABLE_PREFERRED_TOTAL_SIZE)|HOST_UNIFIED_MEMORY|IL_VERSION|IMAGE(?:2D_MAX_(?:HEIGHT|WIDTH)|3D_MAX_(?:DEPTH|HEIGHT|WIDTH)|_BASE_ADDRESS_ALIGNMENT|_MAX_ARRAY_SIZE|_MAX_BUFFER_SIZE|_PITCH_ALIGNMENT|_SUPPORT)|LINKER_AVAILABLE|LOCAL_MEM_SIZE|LOCAL_MEM_TYPE|MAX_(?:CLOCK_FREQUENCY|COMPUTE_UNITS|CONSTANT_ARGS|CONSTANT_BUFFER_SIZE|GLOBAL_VARIABLE_SIZE|MEM_ALLOC_SIZE|NUM_SUB_GROUPS|ON_DEVICE_(?:EVENTS|QUEUES)|PARAMETER_SIZE|PIPE_ARGS|READ_IMAGE_ARGS|READ_WRITE_IMAGE_ARGS|SAMPLERS|WORK_GROUP_SIZE|WORK_ITEM_DIMENSIONS|WORK_ITEM_SIZES|WRITE_IMAGE_ARGS)|MEM_BASE_ADDR_ALIGN|MIN_DATA_TYPE_ALIGN_SIZE|NAME|NATIVE_VECTOR_WIDTH_(?:CHAR|DOUBLE|FLOAT|HALF|INT|LONG|SHORT)|NOT_(?:AVAILABLE|FOUND)|OPENCL_C_VERSION|PARENT_DEVICE|PARTITION_(?:AFFINITY_DOMAIN|BY_AFFINITY_DOMAIN|BY_COUNTS|BY_COUNTS_LIST_END|EQUALLY|FAILED|MAX_SUB_DEVICES|PROPERTIES|TYPE)|PIPE_MAX_(?:ACTIVE_RESERVATIONS|PACKET_SIZE)|PLATFORM|PREFERRED_(?:GLOBAL_ATOMIC_ALIGNMENT|INTEROP_USER_SYNC|LOCAL_ATOMIC_ALIGNMENT|PLATFORM_ATOMIC_ALIGNMENT|VECTOR_WIDTH_(?:CHAR|DOUBLE|FLOAT|HALF|INT|LONG|SHORT))|PRINTF_BUFFER_SIZE|PROFILE|PROFILING_TIMER_RESOLUTION|QUEUE_(?:ON_(?:DEVICE_(?:MAX_SIZE|PREFERRED_SIZE|PROPERTIES)|HOST_PROPERTIES)|PROPERTIES)|REFERENCE_COUNT|SINGLE_FP_CONFIG|SUB_GROUP_INDEPENDENT_FORWARD_PROGRESS|SVM_(?:ATOMICS|CAPABILITIES|COARSE_GRAIN_BUFFER|FINE_GRAIN_BUFFER|FINE_GRAIN_SYSTEM)|TYPE(?:_ACCELERATOR|_ALL|_CPU|_CUSTOM|_DEFAULT|_GPU)?|VENDOR(?:_ID)?|VERSION)|DRIVER_VERSION|EVENT_(?:COMMAND_(?:EXECUTION_STATUS|QUEUE|TYPE)|CONTEXT|REFERENCE_COUNT)|EXEC_(?:KERNEL|NATIVE_KERNEL|STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST)|FILTER_(?:LINEAR|NEAREST)|FLOAT|FP_(?:CORRECTLY_ROUNDED_DIVIDE_SQRT|DENORM|FMA|INF_NAN|ROUND_TO_INF|ROUND_TO_NEAREST|ROUND_TO_ZERO|SOFT_FLOAT)|GLOBAL|HALF_FLOAT|IMAGE_(?:ARRAY_SIZE|BUFFER|DEPTH|ELEMENT_SIZE|FORMAT|FORMAT_MISMATCH|FORMAT_NOT_SUPPORTED|HEIGHT|NUM_MIP_LEVELS|NUM_SAMPLES|ROW_PITCH|SLICE_PITCH|WIDTH)|INTENSITY|INVALID_(?:ARG_INDEX|ARG_SIZE|ARG_VALUE|BINARY|BUFFER_SIZE|BUILD_OPTIONS|COMMAND_QUEUE|COMPILER_OPTIONS|CONTEXT|DEVICE|DEVICE_PARTITION_COUNT|DEVICE_QUEUE|DEVICE_TYPE|EVENT|EVENT_WAIT_LIST|GLOBAL_OFFSET|GLOBAL_WORK_SIZE|GL_OBJECT|HOST_PTR|IMAGE_DESCRIPTOR|IMAGE_FORMAT_DESCRIPTOR|IMAGE_SIZE|KERNEL|KERNEL_ARGS|KERNEL_DEFINITION|KERNEL_NAME|LINKER_OPTIONS|MEM_OBJECT|MIP_LEVEL|OPERATION|PIPE_SIZE|PLATFORM|PROGRAM|PROGRAM_EXECUTABLE|PROPERTY|QUEUE_PROPERTIES|SAMPLER|VALUE|WORK_DIMENSION|WORK_GROUP_SIZE|WORK_ITEM_SIZE)|KERNEL_(?:ARG_(?:ACCESS_(?:NONE|QUALIFIER|READ_ONLY|READ_WRITE|WRITE_ONLY)|ADDRESS_(?:CONSTANT|GLOBAL|LOCAL|PRIVATE|QUALIFIER)|INFO_NOT_AVAILABLE|NAME|TYPE_(?:CONST|NAME|NONE|PIPE|QUALIFIER|RESTRICT|VOLATILE))|ATTRIBUTES|COMPILE_NUM_SUB_GROUPS|COMPILE_WORK_GROUP_SIZE|CONTEXT|EXEC_INFO_SVM_FINE_GRAIN_SYSTEM|EXEC_INFO_SVM_PTRS|FUNCTION_NAME|GLOBAL_WORK_SIZE|LOCAL_MEM_SIZE|LOCAL_SIZE_FOR_SUB_GROUP_COUNT|MAX_NUM_SUB_GROUPS|MAX_SUB_GROUP_SIZE_FOR_NDRANGE|NUM_ARGS|PREFERRED_WORK_GROUP_SIZE_MULTIPLE|PRIVATE_MEM_SIZE|PROGRAM|REFERENCE_COUNT|SUB_GROUP_COUNT_FOR_NDRANGE|WORK_GROUP_SIZE)|LINKER_NOT_AVAILABLE|LINK_PROGRAM_FAILURE|LOCAL|LUMINANCE|MAP_(?:FAILURE|READ|WRITE|WRITE_INVALIDATE_REGION)|MEM_(?:ALLOC_HOST_PTR|ASSOCIATED_MEMOBJECT|CONTEXT|COPY_HOST_PTR|COPY_OVERLAP|FLAGS|HOST_NO_ACCESS|HOST_PTR|HOST_READ_ONLY|HOST_WRITE_ONLY|KERNEL_READ_AND_WRITE|MAP_COUNT|OBJECT_(?:ALLOCATION_FAILURE|BUFFER|IMAGE1D|IMAGE1D_ARRAY|IMAGE1D_BUFFER|IMAGE2D|IMAGE2D_ARRAY|IMAGE3D|PIPE)|OFFSET|READ_ONLY|READ_WRITE|REFERENCE_COUNT|SIZE|SVM_ATOMICS|SVM_FINE_GRAIN_BUFFER|TYPE|USES_SVM_POINTER|USE_HOST_PTR|WRITE_ONLY)|MIGRATE_MEM_OBJECT_(?:CONTENT_UNDEFINED|HOST)|MISALIGNED_SUB_BUFFER_OFFSET|NONE|NON_BLOCKING|OUT_OF_(?:HOST_MEMORY|RESOURCES)|PIPE_(?:MAX_PACKETS|PACKET_SIZE)|PLATFORM_(?:EXTENSIONS|HOST_TIMER_RESOLUTION|NAME|PROFILE|VENDOR|VERSION)|PROFILING_(?:COMMAND_(?:COMPLETE|END|QUEUED|START|SUBMIT)|INFO_NOT_AVAILABLE)|PROGRAM_(?:BINARIES|BINARY_SIZES|BINARY_TYPE(?:_COMPILED_OBJECT|_EXECUTABLE|_LIBRARY|_NONE)?|BUILD_(?:GLOBAL_VARIABLE_TOTAL_SIZE|LOG|OPTIONS|STATUS)|CONTEXT|DEVICES|IL|KERNEL_NAMES|NUM_DEVICES|NUM_KERNELS|REFERENCE_COUNT|SOURCE)|QUEUED|QUEUE_(?:CONTEXT|DEVICE|DEVICE_DEFAULT|ON_DEVICE|ON_DEVICE_DEFAULT|OUT_OF_ORDER_EXEC_MODE_ENABLE|PROFILING_ENABLE|PROPERTIES|REFERENCE_COUNT|SIZE)|R|RA|READ_(?:ONLY|WRITE)_CACHE|RG|RGB|RGBA|RGBx|RGx|RUNNING|Rx|SAMPLER_(?:ADDRESSING_MODE|CONTEXT|FILTER_MODE|LOD_MAX|LOD_MIN|MIP_FILTER_MODE|NORMALIZED_COORDS|REFERENCE_COUNT)|(?:UN)?SIGNED_INT(?:8|16|32)|SNORM_INT(?:8|16)|SUBMITTED|SUCCESS|UNORM_INT(?:16|24|8|_101010|_101010_2)|UNORM_SHORT_(?:555|565)|VERSION_(?:1_0|1_1|1_2|2_0|2_1)|sBGRA|sRGB|sRGBA|sRGBx)\b/,
          alias: 'constant'
        },
        // Extracted from cl.h (2.0) and http://streamcomputing.eu/downloads/?opencl_host.lang (opencl-host)
        'function-opencl-host': {
          pattern: /\bcl(?:BuildProgram|CloneKernel|CompileProgram|Create(?:Buffer|CommandQueue(?:WithProperties)?|Context|ContextFromType|Image|Image2D|Image3D|Kernel|KernelsInProgram|Pipe|ProgramWith(?:Binary|BuiltInKernels|IL|Source)|Sampler|SamplerWithProperties|SubBuffer|SubDevices|UserEvent)|Enqueue(?:(?:Barrier|Marker)(?:WithWaitList)?|Copy(?:Buffer(?:Rect|ToImage)?|Image(?:ToBuffer)?)|(?:Fill|Map)(?:Buffer|Image)|MigrateMemObjects|NDRangeKernel|NativeKernel|(?:Read|Write)(?:Buffer(?:Rect)?|Image)|SVM(?:Free|Map|MemFill|Memcpy|MigrateMem|Unmap)|Task|UnmapMemObject|WaitForEvents)|Finish|Flush|Get(?:CommandQueueInfo|ContextInfo|Device(?:AndHostTimer|IDs|Info)|Event(?:Profiling)?Info|ExtensionFunctionAddress(?:ForPlatform)?|HostTimer|ImageInfo|Kernel(?:ArgInfo|Info|SubGroupInfo|WorkGroupInfo)|MemObjectInfo|PipeInfo|Platform(?:IDs|Info)|Program(?:Build)?Info|SamplerInfo|SupportedImageFormats)|LinkProgram|(?:Release|Retain)(?:CommandQueue|Context|Device|Event|Kernel|MemObject|Program|Sampler)|SVM(?:Alloc|Free)|Set(?:CommandQueueProperty|DefaultDeviceCommandQueue|EventCallback|Kernel(?:Arg(?:SVMPointer)?|ExecInfo)|Kernel|MemObjectDestructorCallback|UserEventStatus)|Unload(?:Platform)?Compiler|WaitForEvents)\b/,
          alias: 'function'
        }

        /* OpenCL host API */
      };Prism.languages.insertBefore('c', 'keyword', attributes);
      // Extracted from doxygen class list http://github.khronos.org/OpenCL-CLHPP/annotated.html
      attributes['type-opencl-host-c++'] = {
        pattern: /\b(?:Buffer|BufferGL|BufferRenderGL|CommandQueue|Context|Device|DeviceCommandQueue|EnqueueArgs|Event|Image|Image1D|Image1DArray|Image1DBuffer|Image2D|Image2DArray|Image2DGL|Image3D|Image3DGL|ImageFormat|ImageGL|Kernel|KernelFunctor|LocalSpaceArg|Memory|NDRange|Pipe|Platform|Program|Sampler|SVMAllocator|SVMTraitAtomic|SVMTraitCoarse|SVMTraitFine|SVMTraitReadOnly|SVMTraitReadWrite|SVMTraitWriteOnly|UserEvent)\b/,
        alias: 'keyword'
        // C++ includes everything from the OpenCL C host API plus the classes defined in cl2.h
      };Prism.languages.insertBefore('cpp', 'keyword', attributes);
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/oz.js":
/*!**********************************************!*\
  !*** ./node_modules/reprism/languages/oz.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'oz',
  init: function init(Prism) {
    Prism.languages.oz = {
      comment: /\/\*[\s\S]*?\*\/|%.*/,
      string: {
        pattern: /"(?:[^"\\]|\\[\s\S])*"/,
        greedy: true
      },
      atom: {
        pattern: /'(?:[^'\\]|\\[\s\S])*'/,
        greedy: true,
        alias: 'builtin'
      },
      keyword: /[$_]|\[\]|\b(?:at|attr|case|catch|choice|class|cond|declare|define|dis|else(?:case|if)?|end|export|fail|false|feat|finally|from|fun|functor|if|import|in|local|lock|meth|nil|not|of|or|prepare|proc|prop|raise|require|self|skip|then|thread|true|try|unit)\b/,
      function: [/[a-z][A-Za-z\d]*(?=\()/, {
        pattern: /(\{)[A-Z][A-Za-z\d]*/,
        lookbehind: true
      }],
      number: /\b(?:0[bx][\da-f]+|\d+\.?\d*(?:e~?\d+)?\b)|&(?:[^\\]|\\(?:\d{3}|.))/i,
      variable: /\b[A-Z][A-Za-z\d]*|`(?:[^`\\]|\\.)+`/,
      'attr-name': /\w+(?=:)/,
      operator: /:(?:=|::?)|<[-:=]?|=(?:=|<?:?)|>=?:?|\\=:?|!!?|[|#+\-*\/,~^@]|\b(?:andthen|div|mod|orelse)\b/,
      punctuation: /[\[\](){}.:;?]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/parigp.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/parigp.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'parigp',
  init: function init(Prism) {
    Prism.languages.parigp = {
      comment: /\/\*[\s\S]*?\*\/|\\\\.*/,
      string: {
        pattern: /"(?:[^"\\\r\n]|\\.)*"/,
        greedy: true
      },
      // PARI/GP does not care about white spaces at all
      // so let's process the keywords to build an appropriate regexp
      // (e.g. "b *r *e *a *k", etc.)
      keyword: function () {
        var keywords = ['breakpoint', 'break', 'dbg_down', 'dbg_err', 'dbg_up', 'dbg_x', 'forcomposite', 'fordiv', 'forell', 'forpart', 'forprime', 'forstep', 'forsubgroup', 'forvec', 'for', 'iferr', 'if', 'local', 'my', 'next', 'return', 'until', 'while'];
        keywords = keywords.map(function (keyword) {
          return keyword.split('').join(' *');
        }).join('|');
        return RegExp('\\b(?:' + keywords + ')\\b');
      }(),
      function: /\w[\w ]*?(?= *\()/,
      number: {
        // The lookbehind and the negative lookahead prevent from breaking the .. operator
        pattern: /((?:\. *\. *)?)(?:\d(?: *\d)*(?: *(?!\. *\.)\.(?: *\d)*)?|\. *\d(?: *\d)*)(?: *e *[+-]? *\d(?: *\d)*)?/i,
        lookbehind: true
      },
      operator: /\. *\.|[*\/!](?: *=)?|%(?: *=|(?: *#)?(?: *')*)?|\+(?: *[+=])?|-(?: *[-=>])?|<(?:(?: *<)?(?: *=)?| *>)?|>(?: *>)?(?: *=)?|=(?: *=){0,2}|\\(?: *\/)?(?: *=)?|&(?: *&)?|\| *\||['#~^]/,
      punctuation: /[\[\]{}().,:;|]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/parser.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/parser.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'parser',
  init: function init(Prism) {
    Prism.languages.parser = Prism.languages.extend('markup', {
      keyword: {
        pattern: /(^|[^^])(?:\^(?:case|eval|for|if|switch|throw)\b|@(?:BASE|CLASS|GET(?:_DEFAULT)?|OPTIONS|SET_DEFAULT|USE)\b)/,
        lookbehind: true
      },
      variable: {
        pattern: /(^|[^^])\B\$(?:\w+|(?=[.{]))(?:(?:\.|::?)\w+)*(?:\.|::?)?/,
        lookbehind: true,
        inside: {
          punctuation: /\.|:+/
        }
      },
      function: {
        pattern: /(^|[^^])\B[@^]\w+(?:(?:\.|::?)\w+)*(?:\.|::?)?/,
        lookbehind: true,
        inside: {
          keyword: {
            pattern: /(^@)(?:GET_|SET_)/,
            lookbehind: true
          },
          punctuation: /\.|:+/
        }
      },
      escape: {
        pattern: /\^(?:[$^;@()\[\]{}"':]|#[a-f\d]*)/i,
        alias: 'builtin'
      },
      punctuation: /[\[\](){};]/
    });
    Prism.languages.insertBefore('parser', 'keyword', {
      'parser-comment': {
        pattern: /(\s)#.*/,
        lookbehind: true,
        alias: 'comment'
      },
      expression: {
        // Allow for 3 levels of depth
        pattern: /(^|[^^])\((?:[^()]|\((?:[^()]|\((?:[^()])*\))*\))*\)/,
        greedy: true,
        lookbehind: true,
        inside: {
          string: {
            pattern: /(^|[^^])(["'])(?:(?!\2)[^^]|\^[\s\S])*\2/,
            lookbehind: true
          },
          keyword: Prism.languages.parser.keyword,
          variable: Prism.languages.parser.variable,
          function: Prism.languages.parser.function,
          boolean: /\b(?:true|false)\b/,
          number: /\b(?:0x[a-f\d]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/i,
          escape: Prism.languages.parser.escape,
          operator: /[~+*\/\\%]|!(?:\|\|?|=)?|&&?|\|\|?|==|<[<=]?|>[>=]?|-[fd]?|\b(?:def|eq|ge|gt|in|is|le|lt|ne)\b/,
          punctuation: Prism.languages.parser.punctuation
        }
      }
    });
    Prism.languages.insertBefore('inside', 'punctuation', {
      expression: Prism.languages.parser.expression,
      keyword: Prism.languages.parser.keyword,
      variable: Prism.languages.parser.variable,
      function: Prism.languages.parser.function,
      escape: Prism.languages.parser.escape,
      'parser-punctuation': {
        pattern: Prism.languages.parser.punctuation,
        alias: 'punctuation'
      }
    }, Prism.languages.parser.tag.inside['attr-value']);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/pascal.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/pascal.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'pascal',
  init: function init(Prism) {
    // Based on Free Pascal

    /* TODO
    Support inline asm ?
    */

    Prism.languages.pascal = {
      comment: [/\(\*[\s\S]+?\*\)/, /\{[\s\S]+?\}/, /\/\/.*/],
      string: {
        pattern: /(?:'(?:''|[^'\r\n])*'|#[&$%]?[a-f\d]+)+|\^[a-z]/i,
        greedy: true
      },
      keyword: [{
        // Turbo Pascal
        pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|interface|label|nil|object|of|operator|packed|procedure|program|record|reintroduce|repeat|self|set|string|then|to|type|unit|until|uses|var|while|with)\b/i,
        lookbehind: true
      }, {
        // Free Pascal
        pattern: /(^|[^&])\b(?:dispose|exit|false|new|true)\b/i,
        lookbehind: true
      }, {
        // Object Pascal
        pattern: /(^|[^&])\b(?:class|dispinterface|except|exports|finalization|finally|initialization|inline|library|on|out|packed|property|raise|resourcestring|threadvar|try)\b/i,
        lookbehind: true
      }, {
        // Modifiers
        pattern: /(^|[^&])\b(?:absolute|abstract|alias|assembler|bitpacked|break|cdecl|continue|cppdecl|cvar|default|deprecated|dynamic|enumerator|experimental|export|external|far|far16|forward|generic|helper|implements|index|interrupt|iochecks|local|message|name|near|nodefault|noreturn|nostackframe|oldfpccall|otherwise|overload|override|pascal|platform|private|protected|public|published|read|register|reintroduce|result|safecall|saveregisters|softfloat|specialize|static|stdcall|stored|strict|unaligned|unimplemented|varargs|virtual|write)\b/i,
        lookbehind: true
      }],
      number: [
      // Hexadecimal, octal and binary
      /(?:[&%]\d+|\$[a-f\d]+)/i,
      // Decimal
      /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i],
      operator: [/\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/i, {
        pattern: /(^|[^&])\b(?:and|as|div|exclude|in|include|is|mod|not|or|shl|shr|xor)\b/,
        lookbehind: true
      }],
      punctuation: /\(\.|\.\)|[()\[\]:;,.]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/perl.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/perl.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'perl',
  init: function init(Prism) {
    Prism.languages.perl = {
      comment: [{
        // POD
        pattern: /(^\s*)=\w+[\s\S]*?=cut.*/m,
        lookbehind: true
      }, {
        pattern: /(^|[^\\$])#.*/,
        lookbehind: true
      }],
      // TODO Could be nice to handle Heredoc too.
      string: [
      // q/.../
      {
        pattern: /\b(?:q|qq|qx|qw)\s*([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
        greedy: true
      },

      // q a...a
      {
        pattern: /\b(?:q|qq|qx|qw)\s+([a-zA-Z0-9])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
        greedy: true
      },

      // q(...)
      {
        pattern: /\b(?:q|qq|qx|qw)\s*\((?:[^()\\]|\\[\s\S])*\)/,
        greedy: true
      },

      // q{...}
      {
        pattern: /\b(?:q|qq|qx|qw)\s*\{(?:[^{}\\]|\\[\s\S])*\}/,
        greedy: true
      },

      // q[...]
      {
        pattern: /\b(?:q|qq|qx|qw)\s*\[(?:[^[\]\\]|\\[\s\S])*\]/,
        greedy: true
      },

      // q<...>
      {
        pattern: /\b(?:q|qq|qx|qw)\s*<(?:[^<>\\]|\\[\s\S])*>/,
        greedy: true
      },

      // "...", `...`
      {
        pattern: /("|`)(?:(?!\1)[^\\]|\\[\s\S])*\1/,
        greedy: true
      },

      // '...'
      // FIXME Multi-line single-quoted strings are not supported as they would break variables containing '
      {
        pattern: /'(?:[^'\\\r\n]|\\.)*'/,
        greedy: true
      }],
      regex: [
      // m/.../
      {
        pattern: /\b(?:m|qr)\s*([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1[msixpodualngc]*/,
        greedy: true
      },

      // m a...a
      {
        pattern: /\b(?:m|qr)\s+([a-zA-Z0-9])(?:(?!\1)[^\\]|\\[\s\S])*\1[msixpodualngc]*/,
        greedy: true
      },

      // m(...)
      {
        pattern: /\b(?:m|qr)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngc]*/,
        greedy: true
      },

      // m{...}
      {
        pattern: /\b(?:m|qr)\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngc]*/,
        greedy: true
      },

      // m[...]
      {
        pattern: /\b(?:m|qr)\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngc]*/,
        greedy: true
      },

      // m<...>
      {
        pattern: /\b(?:m|qr)\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngc]*/,
        greedy: true
      },

      // The lookbehinds prevent -s from breaking
      // FIXME We don't handle change of separator like s(...)[...]
      // s/.../.../
      {
        pattern: /(^|[^-]\b)(?:s|tr|y)\s*([^a-zA-Z0-9\s{(\[<])(?:(?!\2)[^\\]|\\[\s\S])*\2(?:(?!\2)[^\\]|\\[\s\S])*\2[msixpodualngcer]*/,
        lookbehind: true,
        greedy: true
      },

      // s a...a...a
      {
        pattern: /(^|[^-]\b)(?:s|tr|y)\s+([a-zA-Z0-9])(?:(?!\2)[^\\]|\\[\s\S])*\2(?:(?!\2)[^\\]|\\[\s\S])*\2[msixpodualngcer]*/,
        lookbehind: true,
        greedy: true
      },

      // s(...)(...)
      {
        pattern: /(^|[^-]\b)(?:s|tr|y)\s*\((?:[^()\\]|\\[\s\S])*\)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngcer]*/,
        lookbehind: true,
        greedy: true
      },

      // s{...}{...}
      {
        pattern: /(^|[^-]\b)(?:s|tr|y)\s*\{(?:[^{}\\]|\\[\s\S])*\}\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngcer]*/,
        lookbehind: true,
        greedy: true
      },

      // s[...][...]
      {
        pattern: /(^|[^-]\b)(?:s|tr|y)\s*\[(?:[^[\]\\]|\\[\s\S])*\]\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngcer]*/,
        lookbehind: true,
        greedy: true
      },

      // s<...><...>
      {
        pattern: /(^|[^-]\b)(?:s|tr|y)\s*<(?:[^<>\\]|\\[\s\S])*>\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngcer]*/,
        lookbehind: true,
        greedy: true
      },

      // /.../
      // The look-ahead tries to prevent two divisions on
      // the same line from being highlighted as regex.
      // This does not support multi-line regex.
      {
        pattern: /\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(lt|gt|le|ge|eq|ne|cmp|not|and|or|xor|x)\b))/,
        greedy: true
      }],

      // FIXME Not sure about the handling of ::, ', and #
      variable: [
      // ${^POSTMATCH}
      /[&*$@%]\{\^[A-Z]+\}/,
      // $^V
      /[&*$@%]\^[A-Z_]/,
      // ${...}
      /[&*$@%]#?(?=\{)/,
      // $foo
      /[&*$@%]#?(?:(?:::)*'?(?!\d)[\w$]+)+(?:::)*/i,
      // $1
      /[&*$@%]\d+/,
      // $_, @_, %!
      // The negative lookahead prevents from breaking the %= operator
      /(?!%=)[$@%][!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/],
      filehandle: {
        // <>, <FOO>, _
        pattern: /<(?![<=])\S*>|\b_\b/,
        alias: 'symbol'
      },
      vstring: {
        // v1.2, 1.2.3
        pattern: /v\d+(?:\.\d+)*|\d+(?:\.\d+){2,}/,
        alias: 'string'
      },
      function: {
        pattern: /sub [a-z0-9_]+/i,
        inside: {
          keyword: /sub/
        }
      },
      keyword: /\b(?:any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
      number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0b[01](?:_?[01])*|(?:\d(?:_?\d)*)?\.?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)\b/,
      operator: /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(?:lt|gt|le|ge|eq|ne|cmp|not|and|or|xor)\b/,
      punctuation: /[{}[\];(),:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/php-extras.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/php-extras.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'php-extras',
  init: function init(Prism) {
    Prism.languages.insertBefore('php', 'variable', {
      this: /\$this\b/,
      global: /\$(?:_(?:SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE)|GLOBALS|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)\b/,
      scope: {
        pattern: /\b[\w\\]+::/,
        inside: {
          keyword: /static|self|parent/,
          punctuation: /::|\\/
        }
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/php.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/php.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'php',
  init: function init(Prism) {
    /**
     * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
     * Modified by Miles Johnson: http://milesj.me
     *
     * Supports the following:
     * 		- Extends clike syntax
     * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
     * 		- Smarter constant and function matching
     *
     * Adds the following new token classes:
     * 		constant, delimiter, variable, function, package
     */
    (function (Prism) {
      Prism.languages.php = Prism.languages.extend('clike', {
        keyword: /\b(?:and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
        constant: /\b[A-Z0-9_]{2,}\b/,
        comment: {
          pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
          lookbehind: true
        }
      });

      Prism.languages.insertBefore('php', 'string', {
        'shell-comment': {
          pattern: /(^|[^\\])#.*/,
          lookbehind: true,
          alias: 'comment'
        }
      });

      Prism.languages.insertBefore('php', 'keyword', {
        delimiter: {
          pattern: /\?>|<\?(?:php|=)?/i,
          alias: 'important'
        },
        variable: /\$+(?:\w+\b|(?={))/i,
        package: {
          pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
          lookbehind: true,
          inside: {
            punctuation: /\\/
          }
        }
      });

      // Must be defined after the function pattern
      Prism.languages.insertBefore('php', 'operator', {
        property: {
          pattern: /(->)[\w]+/,
          lookbehind: true
        }
      });

      Prism.languages.insertBefore('php', 'string', {
        'nowdoc-string': {
          pattern: /<<<'([^']+)'(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;/,
          greedy: true,
          alias: 'string',
          inside: {
            delimiter: {
              pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
              alias: 'symbol',
              inside: {
                punctuation: /^<<<'?|[';]$/
              }
            }
          }
        },
        'heredoc-string': {
          pattern: /<<<(?:"([^"]+)"(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\1;|([a-z_]\w*)(?:\r\n?|\n)(?:.*(?:\r\n?|\n))*?\2;)/i,
          greedy: true,
          alias: 'string',
          inside: {
            delimiter: {
              pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
              alias: 'symbol',
              inside: {
                punctuation: /^<<<"?|[";]$/
              }
            },
            interpolation: null // See below
          }
        },
        'single-quoted-string': {
          pattern: /'(?:\\[\s\S]|[^\\'])*'/,
          greedy: true,
          alias: 'string'
        },
        'double-quoted-string': {
          pattern: /"(?:\\[\s\S]|[^\\"])*"/,
          greedy: true,
          alias: 'string',
          inside: {
            interpolation: null // See below
          }
        }
      });
      // The different types of PHP strings "replace" the C-like standard string
      delete Prism.languages.php.string;

      var string_interpolation = {
        pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[.+?]|->\w+)*)/,
        lookbehind: true,
        inside: {
          rest: Prism.languages.php
        }
      };
      Prism.languages.php['heredoc-string'].inside.interpolation = string_interpolation;
      Prism.languages.php['double-quoted-string'].inside.interpolation = string_interpolation;

      Prism.hooks.add('before-tokenize', function (env) {
        if (!/(?:<\?php|<\?)/gi.test(env.code)) {
          return;
        }

        var phpPattern = /(?:<\?php|<\?)[\s\S]*?(?:\?>|$)/gi;
        Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
      });

      Prism.hooks.add('after-tokenize', function (env) {
        Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
      });
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/powershell.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/powershell.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'powershell',
  init: function init(Prism) {
    Prism.languages.powershell = {
      comment: [{
        pattern: /(^|[^`])<#[\s\S]*?#>/,
        lookbehind: true
      }, {
        pattern: /(^|[^`])#.*/,
        lookbehind: true
      }],
      string: [{
        pattern: /"(?:`[\s\S]|[^`"])*"/,
        greedy: true,
        inside: {
          function: {
            pattern: /(^|[^`])\$\(.*?\)/,
            lookbehind: true,
            // Populated at end of file
            inside: {}
          }
        }
      }, {
        pattern: /'(?:[^']|'')*'/,
        greedy: true
      }],
      // Matches name spaces as well as casts, attribute decorators. Force starting with letter to avoid matching array indices
      // Supports two levels of nested brackets (e.g. `[OutputType([System.Collections.Generic.List[int]])]`)
      namespace: /\[[a-z](?:\[(?:\[[^\]]*]|[^\[\]])*]|[^\[\]])*]/i,
      boolean: /\$(?:true|false)\b/i,
      variable: /\$\w+\b/i,
      // Cmdlets and aliases. Aliases should come last, otherwise "write" gets preferred over "write-host" for example
      // Get-Command | ?{ $_.ModuleName -match "Microsoft.PowerShell.(Util|Core|Management)" }
      // Get-Alias | ?{ $_.ReferencedCommand.Module.Name -match "Microsoft.PowerShell.(Util|Core|Management)" }
      function: [/\b(?:Add-(?:Computer|Content|History|Member|PSSnapin|Type)|Checkpoint-Computer|Clear-(?:Content|EventLog|History|Item|ItemProperty|Variable)|Compare-Object|Complete-Transaction|Connect-PSSession|ConvertFrom-(?:Csv|Json|StringData)|Convert-Path|ConvertTo-(?:Csv|Html|Json|Xml)|Copy-(?:Item|ItemProperty)|Debug-Process|Disable-(?:ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Disconnect-PSSession|Enable-(?:ComputerRestore|PSBreakpoint|PSRemoting|PSSessionConfiguration)|Enter-PSSession|Exit-PSSession|Export-(?:Alias|Clixml|Console|Csv|FormatData|ModuleMember|PSSession)|ForEach-Object|Format-(?:Custom|List|Table|Wide)|Get-(?:Alias|ChildItem|Command|ComputerRestorePoint|Content|ControlPanelItem|Culture|Date|Event|EventLog|EventSubscriber|FormatData|Help|History|Host|HotFix|Item|ItemProperty|Job|Location|Member|Module|Process|PSBreakpoint|PSCallStack|PSDrive|PSProvider|PSSession|PSSessionConfiguration|PSSnapin|Random|Service|TraceSource|Transaction|TypeData|UICulture|Unique|Variable|WmiObject)|Group-Object|Import-(?:Alias|Clixml|Csv|LocalizedData|Module|PSSession)|Invoke-(?:Command|Expression|History|Item|RestMethod|WebRequest|WmiMethod)|Join-Path|Limit-EventLog|Measure-(?:Command|Object)|Move-(?:Item|ItemProperty)|New-(?:Alias|Event|EventLog|Item|ItemProperty|Module|ModuleManifest|Object|PSDrive|PSSession|PSSessionConfigurationFile|PSSessionOption|PSTransportOption|Service|TimeSpan|Variable|WebServiceProxy)|Out-(?:Default|File|GridView|Host|Null|Printer|String)|Pop-Location|Push-Location|Read-Host|Receive-(?:Job|PSSession)|Register-(?:EngineEvent|ObjectEvent|PSSessionConfiguration|WmiEvent)|Remove-(?:Computer|Event|EventLog|Item|ItemProperty|Job|Module|PSBreakpoint|PSDrive|PSSession|PSSnapin|TypeData|Variable|WmiObject)|Rename-(?:Computer|Item|ItemProperty)|Reset-ComputerMachinePassword|Resolve-Path|Restart-(?:Computer|Service)|Restore-Computer|Resume-(?:Job|Service)|Save-Help|Select-(?:Object|String|Xml)|Send-MailMessage|Set-(?:Alias|Content|Date|Item|ItemProperty|Location|PSBreakpoint|PSDebug|PSSessionConfiguration|Service|StrictMode|TraceSource|Variable|WmiInstance)|Show-(?:Command|ControlPanelItem|EventLog)|Sort-Object|Split-Path|Start-(?:Job|Process|Service|Sleep|Transaction)|Stop-(?:Computer|Job|Process|Service)|Suspend-(?:Job|Service)|Tee-Object|Test-(?:ComputerSecureChannel|Connection|ModuleManifest|Path|PSSessionConfigurationFile)|Trace-Command|Unblock-File|Undo-Transaction|Unregister-(?:Event|PSSessionConfiguration)|Update-(?:FormatData|Help|List|TypeData)|Use-Transaction|Wait-(?:Event|Job|Process)|Where-Object|Write-(?:Debug|Error|EventLog|Host|Output|Progress|Verbose|Warning))\b/i, /\b(?:ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i],
      // per http://technet.microsoft.com/en-us/library/hh847744.aspx
      keyword: /\b(?:Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
      operator: {
        pattern: /(\W?)(?:!|-(eq|ne|gt|ge|lt|le|sh[lr]|not|b?(?:and|x?or)|(?:Not)?(?:Like|Match|Contains|In)|Replace|Join|is(?:Not)?|as)\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
        lookbehind: true
      },
      punctuation: /[|{}[\];(),.]/

      // Variable interpolation inside strings, and nested expressions
    };Prism.languages.powershell.string[0].inside.boolean = Prism.languages.powershell.boolean;
    Prism.languages.powershell.string[0].inside.variable = Prism.languages.powershell.variable;
    Prism.languages.powershell.string[0].inside.function.inside = Prism.languages.powershell;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/processing.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/processing.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'processing',
  init: function init(Prism) {
    Prism.languages.processing = Prism.languages.extend('clike', {
      keyword: /\b(?:break|catch|case|class|continue|default|else|extends|final|for|if|implements|import|new|null|private|public|return|static|super|switch|this|try|void|while)\b/,
      operator: /<[<=]?|>[>=]?|&&?|\|\|?|[%?]|[!=+\-*\/]=?/
    });
    Prism.languages.insertBefore('processing', 'number', {
      // Special case: XML is a type
      constant: /\b(?!XML\b)[A-Z][A-Z\d_]+\b/,
      type: {
        pattern: /\b(?:boolean|byte|char|color|double|float|int|XML|[A-Z]\w*)\b/,
        alias: 'variable'
      }
    });

    // Spaces are allowed between function name and parenthesis
    Prism.languages.processing.function.pattern = /\w+(?=\s*\()/;

    // Class-names is not styled by default
    Prism.languages.processing['class-name'].alias = 'variable';
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/prolog.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/prolog.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'prolog',
  init: function init(Prism) {
    Prism.languages.prolog = {
      // Syntax depends on the implementation
      comment: [/%.+/, /\/\*[\s\S]*?\*\//],
      // Depending on the implementation, strings may allow escaped newlines and quote-escape
      string: {
        pattern: /(["'])(?:\1\1|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      builtin: /\b(?:fx|fy|xf[xy]?|yfx?)\b/,
      variable: /\b[A-Z_]\w*/,
      // FIXME: Should we list all null-ary predicates (not followed by a parenthesis) like halt, trace, etc.?
      function: /\b[a-z]\w*(?:(?=\()|\/\d+)/,
      number: /\b\d+\.?\d*/,
      // Custom operators are allowed
      operator: /[:\\=><\-?*@\/;+^|!$.]+|\b(?:is|mod|not|xor)\b/,
      punctuation: /[(){}\[\],]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/properties.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/properties.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'properties',
  init: function init(Prism) {
    Prism.languages.properties = {
      comment: /^[ \t]*[#!].*$/m,
      'attr-value': {
        pattern: /(^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+?(?: *[=:] *| ))(?:\\(?:\r\n|[\s\S])|[^\\\r\n])+/m,
        lookbehind: true
      },
      'attr-name': /^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+?(?= *[=:] *| )/m,
      punctuation: /[=:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/protobuf.js":
/*!****************************************************!*\
  !*** ./node_modules/reprism/languages/protobuf.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'protobuf',
  init: function init(Prism) {
    Prism.languages.protobuf = Prism.languages.extend('clike', {
      keyword: /\b(?:package|import|message|enum)\b/,
      builtin: /\b(?:required|repeated|optional|reserved)\b/,
      primitive: {
        pattern: /\b(?:double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes)\b/,
        alias: 'symbol'
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/pug.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/pug.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'pug',
  init: function init(Prism) {
    (function (Prism) {
      // TODO:
      // - Add CSS highlighting inside <style> tags
      // - Add support for multi-line code blocks
      // - Add support for interpolation #{} and !{}
      // - Add support for tag interpolation #[]
      // - Add explicit support for plain text using |
      // - Add support for markup embedded in plain text

      Prism.languages.pug = {
        // Multiline stuff should appear before the rest

        // This handles both single-line and multi-line comments
        comment: {
          pattern: /(^([\t ]*))\/\/.*(?:(?:\r?\n|\r)\2[\t ]+.+)*/m,
          lookbehind: true
        },

        // All the tag-related part is in lookbehind
        // so that it can be highlighted by the "tag" pattern
        'multiline-script': {
          pattern: /(^([\t ]*)script\b.*\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
          lookbehind: true,
          inside: {
            rest: Prism.languages.javascript
          }
        },

        // See at the end of the file for known filters
        filter: {
          pattern: /(^([\t ]*)):.+(?:(?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
          lookbehind: true,
          inside: {
            'filter-name': {
              pattern: /^:[\w-]+/,
              alias: 'variable'
            }
          }
        },

        'multiline-plain-text': {
          pattern: /(^([\t ]*)[\w\-#.]+\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ]+.+|\s*?(?=\r?\n|\r)))+/m,
          lookbehind: true
        },
        markup: {
          pattern: /(^[\t ]*)<.+/m,
          lookbehind: true,
          inside: {
            rest: Prism.languages.markup
          }
        },
        doctype: {
          pattern: /((?:^|\n)[\t ]*)doctype(?: .+)?/,
          lookbehind: true
        },

        // This handle all conditional and loop keywords
        'flow-control': {
          pattern: /(^[\t ]*)(?:if|unless|else|case|when|default|each|while)\b(?: .+)?/m,
          lookbehind: true,
          inside: {
            each: {
              pattern: /^each .+? in\b/,
              inside: {
                keyword: /\b(?:each|in)\b/,
                punctuation: /,/
              }
            },
            branch: {
              pattern: /^(?:if|unless|else|case|when|default|while)\b/,
              alias: 'keyword'
            },
            rest: Prism.languages.javascript
          }
        },
        keyword: {
          pattern: /(^[\t ]*)(?:block|extends|include|append|prepend)\b.+/m,
          lookbehind: true
        },
        mixin: [
        // Declaration
        {
          pattern: /(^[\t ]*)mixin .+/m,
          lookbehind: true,
          inside: {
            keyword: /^mixin/,
            function: /\w+(?=\s*\(|\s*$)/,
            punctuation: /[(),.]/
          }
        },
        // Usage
        {
          pattern: /(^[\t ]*)\+.+/m,
          lookbehind: true,
          inside: {
            name: {
              pattern: /^\+\w+/,
              alias: 'function'
            },
            rest: Prism.languages.javascript
          }
        }],
        script: {
          pattern: /(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]+).+/m,
          lookbehind: true,
          inside: {
            rest: Prism.languages.javascript
          }
        },

        'plain-text': {
          pattern: /(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]+).+/m,
          lookbehind: true
        },
        tag: {
          pattern: /(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,
          lookbehind: true,
          inside: {
            attributes: [{
              pattern: /&[^(]+\([^)]+\)/,
              inside: {
                rest: Prism.languages.javascript
              }
            }, {
              pattern: /\([^)]+\)/,
              inside: {
                'attr-value': {
                  pattern: /(=\s*)(?:\{[^}]*\}|[^,)\r\n]+)/,
                  lookbehind: true,
                  inside: {
                    rest: Prism.languages.javascript
                  }
                },
                'attr-name': /[\w-]+(?=\s*!?=|\s*[,)])/,
                punctuation: /[!=(),]+/
              }
            }],
            punctuation: /:/
          }
        },
        code: [{
          pattern: /(^[\t ]*(?:-|!?=)).+/m,
          lookbehind: true,
          inside: {
            rest: Prism.languages.javascript
          }
        }],
        punctuation: /[.\-!=|]+/
      };

      var filter_pattern = '(^([\\t ]*)):{{filter_name}}(?:(?:\\r?\\n|\\r(?!\\n))(?:\\2[\\t ]+.+|\\s*?(?=\\r?\\n|\\r)))+';

      // Non exhaustive list of available filters and associated languages
      var filters = [{ filter: 'atpl', language: 'twig' }, { filter: 'coffee', language: 'coffeescript' }, 'ejs', 'handlebars', 'hogan', 'less', 'livescript', 'markdown', 'mustache', 'plates', { filter: 'sass', language: 'scss' }, 'stylus', 'swig'];
      var all_filters = {};
      for (var i = 0, l = filters.length; i < l; i++) {
        var filter = filters[i];
        filter = typeof filter === 'string' ? { filter: filter, language: filter } : filter;
        if (Prism.languages[filter.language]) {
          all_filters['filter-' + filter.filter] = {
            pattern: RegExp(filter_pattern.replace('{{filter_name}}', filter.filter), 'm'),
            lookbehind: true,
            inside: {
              'filter-name': {
                pattern: /^:[\w-]+/,
                alias: 'variable'
              },
              rest: Prism.languages[filter.language]
            }
          };
        }
      }

      Prism.languages.insertBefore('pug', 'filter', all_filters);
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/puppet.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/puppet.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'puppet',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.puppet = {
        heredoc: [
        // Matches the content of a quoted heredoc string (subject to interpolation)
        {
          pattern: /(@\("([^"\r\n\/):]+)"(?:\/[nrts$uL]*)?\).*(?:\r?\n|\r))(?:.*(?:\r?\n|\r))*?[ \t]*\|?[ \t]*-?[ \t]*\2/,
          lookbehind: true,
          alias: 'string',
          inside: {
            // Matches the end tag
            punctuation: /(?=\S).*\S(?= *$)/
            // See interpolation below
          }
        },
        // Matches the content of an unquoted heredoc string (no interpolation)
        {
          pattern: /(@\(([^"\r\n\/):]+)(?:\/[nrts$uL]*)?\).*(?:\r?\n|\r))(?:.*(?:\r?\n|\r))*?[ \t]*\|?[ \t]*-?[ \t]*\2/,
          lookbehind: true,
          greedy: true,
          alias: 'string',
          inside: {
            // Matches the end tag
            punctuation: /(?=\S).*\S(?= *$)/
          }
        },
        // Matches the start tag of heredoc strings
        {
          pattern: /@\("?(?:[^"\r\n\/):]+)"?(?:\/[nrts$uL]*)?\)/,
          alias: 'string',
          inside: {
            punctuation: {
              pattern: /(\().+?(?=\))/,
              lookbehind: true
            }
          }
        }],
        'multiline-comment': {
          pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
          lookbehind: true,
          greedy: true,
          alias: 'comment'
        },
        regex: {
          // Must be prefixed with the keyword "node" or a non-word char
          pattern: /((?:\bnode\s+|[~=\(\[\{,]\s*|[=+]>\s*|^\s*))\/(?:[^\/\\]|\\[\s\S])+\/(?:[imx]+\b|\B)/,
          lookbehind: true,
          greedy: true,
          inside: {
            // Extended regexes must have the x flag. They can contain single-line comments.
            'extended-regex': {
              pattern: /^\/(?:[^\/\\]|\\[\s\S])+\/[im]*x[im]*$/,
              inside: {
                comment: /#.*/
              }
            }
          }
        },
        comment: {
          pattern: /(^|[^\\])#.*/,
          lookbehind: true,
          greedy: true
        },
        string: {
          // Allow for one nested level of double quotes inside interpolation
          pattern: /(["'])(?:\$\{(?:[^'"}]|(["'])(?:(?!\2)[^\\]|\\[\s\S])*\2)+\}|(?!\1)[^\\]|\\[\s\S])*\1/,
          greedy: true,
          inside: {
            'double-quoted': {
              pattern: /^"[\s\S]*"$/,
              inside: {
                // See interpolation below
              }
            }
          }
        },
        variable: {
          pattern: /\$(?:::)?\w+(?:::\w+)*/,
          inside: {
            punctuation: /::/
          }
        },
        'attr-name': /(?:\w+|\*)(?=\s*=>)/,
        function: [{
          pattern: /(\.)(?!\d)\w+/,
          lookbehind: true
        }, /\b(?:contain|debug|err|fail|include|info|notice|realize|require|tag|warning)\b|\b(?!\d)\w+(?=\()/],
        number: /\b(?:0x[a-f\d]+|\d+(?:\.\d+)?(?:e-?\d+)?)\b/i,
        boolean: /\b(?:true|false)\b/,
        // Includes words reserved for future use
        keyword: /\b(?:application|attr|case|class|consumes|default|define|else|elsif|function|if|import|inherits|node|private|produces|type|undef|unless)\b/,
        datatype: {
          pattern: /\b(?:Any|Array|Boolean|Callable|Catalogentry|Class|Collection|Data|Default|Enum|Float|Hash|Integer|NotUndef|Numeric|Optional|Pattern|Regexp|Resource|Runtime|Scalar|String|Struct|Tuple|Type|Undef|Variant)\b/,
          alias: 'symbol'
        },
        operator: /=[=~>]?|![=~]?|<(?:<\|?|[=~|-])?|>[>=]?|->?|~>|\|>?>?|[*\/%+?]|\b(?:and|in|or)\b/,
        punctuation: /[\[\]{}().,;]|:+/
      };

      var interpolation = [{
        // Allow for one nested level of braces inside interpolation
        pattern: /(^|[^\\])\$\{(?:[^'"{}]|\{[^}]*\}|(["'])(?:(?!\2)[^\\]|\\[\s\S])*\2)+\}/,
        lookbehind: true,
        inside: {
          'short-variable': {
            // Negative look-ahead prevent wrong highlighting of functions
            pattern: /(^\$\{)(?!\w+\()(?:::)?\w+(?:::\w+)*/,
            lookbehind: true,
            alias: 'variable',
            inside: {
              punctuation: /::/
            }
          },
          delimiter: {
            pattern: /^\$/,
            alias: 'variable'
          },
          rest: Prism.languages.puppet
        }
      }, {
        pattern: /(^|[^\\])\$(?:::)?\w+(?:::\w+)*/,
        lookbehind: true,
        alias: 'variable',
        inside: {
          punctuation: /::/
        }
      }];
      Prism.languages.puppet.heredoc[0].inside.interpolation = interpolation;
      Prism.languages.puppet.string.inside['double-quoted'].inside.interpolation = interpolation;
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/pure.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/pure.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'pure',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.pure = {
        comment: [{
          pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
          lookbehind: true
        }, {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: true
        }, /#!.+/],
        'inline-lang': {
          pattern: /%<[\s\S]+?%>/,
          greedy: true,
          inside: {
            lang: {
              pattern: /(^%< *)-\*-.+?-\*-/,
              lookbehind: true,
              alias: 'comment'
            },
            delimiter: {
              pattern: /^%<.*|%>$/,
              alias: 'punctuation'
            }
          }
        },
        string: {
          pattern: /"(?:\\.|[^"\\\r\n])*"/,
          greedy: true
        },
        number: {
          // The look-behind prevents wrong highlighting of the .. operator
          pattern: /((?:\.\.)?)(?:\b(?:inf|nan)\b|\b0x[\da-f]+|(?:\b(?:0b)?\d+(?:\.\d)?|\B\.\d)\d*(?:e[+-]?\d+)?L?)/i,
          lookbehind: true
        },
        keyword: /\b(?:ans|break|bt|case|catch|cd|clear|const|def|del|dump|else|end|exit|extern|false|force|help|if|infix[lr]?|interface|let|ls|mem|namespace|nonfix|NULL|of|otherwise|outfix|override|postfix|prefix|private|public|pwd|quit|run|save|show|stats|then|throw|trace|true|type|underride|using|when|with)\b/,
        function: /\b(?:abs|add_(?:(?:fundef|interface|macdef|typedef)(?:_at)?|addr|constdef|vardef)|all|any|applp?|arity|bigintp?|blob(?:_crc|_size|p)?|boolp?|byte_(?:matrix|pointer)|byte_c?string(?:_pointer)?|calloc|cat|catmap|ceil|char[ps]?|check_ptrtag|chr|clear_sentry|clearsym|closurep?|cmatrixp?|cols?|colcat(?:map)?|colmap|colrev|colvector(?:p|seq)?|complex(?:_float_(?:matrix|pointer)|_matrix(?:_view)?|_pointer|p)?|conj|cookedp?|cst|cstring(?:_(?:dup|list|vector))?|curry3?|cyclen?|del_(?:constdef|fundef|interface|macdef|typedef|vardef)|delete|diag(?:mat)?|dim|dmatrixp?|do|double(?:_matrix(?:_view)?|_pointer|p)?|dowith3?|drop|dropwhile|eval(?:cmd)?|exactp|filter|fix|fixity|flip|float(?:_matrix|_pointer)|floor|fold[lr]1?|frac|free|funp?|functionp?|gcd|get(?:_(?:byte|constdef|double|float|fundef|int(?:64)?|interface(?:_typedef)?|long|macdef|pointer|ptrtag|short|sentry|string|typedef|vardef))?|globsym|hash|head|id|im|imatrixp?|index|inexactp|infp|init|insert|int(?:_matrix(?:_view)?|_pointer|p)?|int64_(?:matrix|pointer)|integerp?|iteraten?|iterwhile|join|keys?|lambdap?|last(?:err(?:pos)?)?|lcd|list[2p]?|listmap|make_ptrtag|malloc|map|matcat|matrixp?|max|member|min|nanp|nargs|nmatrixp?|null|numberp?|ord|pack(?:ed)?|pointer(?:_cast|_tag|_type|p)?|pow|pred|ptrtag|put(?:_(?:byte|double|float|int(?:64)?|long|pointer|short|string))?|rationalp?|re|realp?|realloc|recordp?|redim|reduce(?:_with)?|refp?|repeatn?|reverse|rlistp?|round|rows?|rowcat(?:map)?|rowmap|rowrev|rowvector(?:p|seq)?|same|scan[lr]1?|sentry|sgn|short_(?:matrix|pointer)|slice|smatrixp?|sort|split|str|strcat|stream|stride|string(?:_(?:dup|list|vector)|p)?|subdiag(?:mat)?|submat|subseq2?|substr|succ|supdiag(?:mat)?|symbolp?|tail|take|takewhile|thunkp?|transpose|trunc|tuplep?|typep|ubyte|uint(?:64)?|ulong|uncurry3?|unref|unzip3?|update|ushort|vals?|varp?|vector(?:p|seq)?|void|zip3?|zipwith3?)\b/,
        special: {
          pattern: /\b__[a-z]+__\b/i,
          alias: 'builtin'
        },
        // Any combination of operator chars can be an operator
        operator: /(?=\b_|[^_])[!"#$%&'*+,\-.\/:<=>?@\\^_`|~\u00a1-\u00bf\u00d7-\u00f7\u20d0-\u2bff]+|\b(?:and|div|mod|not|or)\b/,
        // FIXME: How can we prevent | and , to be highlighted as operator when they are used alone?
        punctuation: /[(){}\[\];,|]/
      };

      var inlineLanguages = ['c', { lang: 'c++', alias: 'cpp' }, 'fortran', 'ats', 'dsp'];
      var inlineLanguageRe = '%< *-\\*- *{lang}\\d* *-\\*-[\\s\\S]+?%>';

      inlineLanguages.forEach(function (lang) {
        var alias = lang;
        if (typeof lang !== 'string') {
          alias = lang.alias;
          lang = lang.lang;
        }
        if (Prism.languages[alias]) {
          var o = {};
          o['inline-lang-' + alias] = {
            pattern: RegExp(inlineLanguageRe.replace('{lang}', lang.replace(/([.+*?\/\\(){}\[\]])/g, '\\$1')), 'i'),
            inside: Prism.util.clone(Prism.languages.pure['inline-lang'].inside)
          };
          o['inline-lang-' + alias].inside.rest = Prism.util.clone(Prism.languages[alias]);
          Prism.languages.insertBefore('pure', 'inline-lang', o);
        }
      });

      // C is the default inline language
      if (Prism.languages.c) {
        Prism.languages.pure['inline-lang'].inside.rest = Prism.util.clone(Prism.languages.c);
      }
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/python.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/python.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'python',
  init: function init(Prism) {
    Prism.languages.python = {
      comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
      },
      'triple-quoted-string': {
        pattern: /("""|''')[\s\S]+?\1/,
        greedy: true,
        alias: 'string'
      },
      string: {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      function: {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: true
      },
      'class-name': {
        pattern: /(\bclass\s+)\w+/i,
        lookbehind: true
      },
      keyword: /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|pass|print|raise|return|try|while|with|yield)\b/,
      builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
      boolean: /\b(?:True|False|None)\b/,
      number: /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
      operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/q.js":
/*!*********************************************!*\
  !*** ./node_modules/reprism/languages/q.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'q',
  init: function init(Prism) {
    Prism.languages.q = {
      string: /"(?:\\.|[^"\\\r\n])*"/,
      comment: [
      // From http://code.kx.com/wiki/Reference/Slash:
      // When / is following a space (or a right parenthesis, bracket, or brace), it is ignored with the rest of the line.
      {
        pattern: /([\t )\]}])\/.*/,
        lookbehind: true,
        greedy: true
      },
      // From http://code.kx.com/wiki/Reference/Slash:
      // A line which has / as its first character and contains at least one other non-whitespace character is a whole-line comment and is ignored entirely.
      // A / on a line by itself begins a multiline comment which is terminated by the next \ on a line by itself.
      // If a / is not matched by a \, the multiline comment is unterminated and continues to end of file.
      // The / and \ must be the first char on the line, but may be followed by any amount of whitespace.
      {
        pattern: /(^|\r?\n|\r)\/[\t ]*(?:(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?(?:\\(?=[\t ]*(?:\r?\n|\r))|$)|\S.*)/,
        lookbehind: true,
        greedy: true
      },
      // From http://code.kx.com/wiki/Reference/Slash:
      // A \ on a line by itself with no preceding matching / will comment to end of file.
      {
        pattern: /^\\[\t ]*(?:\r?\n|\r)[\s\S]+/m,
        greedy: true
      }, {
        pattern: /^#!.+/m,
        greedy: true
      }],
      symbol: /`(?::\S+|[\w.]*)/,
      datetime: {
        pattern: /0N[mdzuvt]|0W[dtz]|\d{4}\.\d\d(?:m|\.\d\d(?:T(?:\d\d(?::\d\d(?::\d\d(?:[.:]\d\d\d)?)?)?)?)?[dz]?)|\d\d:\d\d(?::\d\d(?:[.:]\d\d\d)?)?[uvt]?/,
        alias: 'number'
      },
      // The negative look-ahead prevents bad highlighting
      // of verbs 0: and 1:
      number: /\b(?![01]:)(?:0[wn]|0W[hj]?|0N[hje]?|0x[\da-fA-F]+|\d+\.?\d*(?:e[+-]?\d+)?[hjfeb]?)/,
      keyword: /\\\w+\b|\b(?:abs|acos|aj0?|all|and|any|asc|asin|asof|atan|attr|avgs?|binr?|by|ceiling|cols|cor|cos|count|cov|cross|csv|cut|delete|deltas|desc|dev|differ|distinct|div|do|dsave|ej|enlist|eval|except|exec|exit|exp|fby|fills|first|fkeys|flip|floor|from|get|getenv|group|gtime|hclose|hcount|hdel|hopen|hsym|iasc|identity|idesc|if|ij|in|insert|inter|inv|keys?|last|like|list|ljf?|load|log|lower|lsq|ltime|ltrim|mavg|maxs?|mcount|md5|mdev|med|meta|mins?|mmax|mmin|mmu|mod|msum|neg|next|not|null|or|over|parse|peach|pj|plist|prds?|prev|prior|rand|rank|ratios|raze|read0|read1|reciprocal|reval|reverse|rload|rotate|rsave|rtrim|save|scan|scov|sdev|select|set|setenv|show|signum|sin|sqrt|ssr?|string|sublist|sums?|sv|svar|system|tables|tan|til|trim|txf|type|uj|ungroup|union|update|upper|upsert|value|var|views?|vs|wavg|where|while|within|wj1?|wsum|ww|xasc|xbar|xcols?|xdesc|xexp|xgroup|xkey|xlog|xprev|xrank)\b/,
      adverb: {
        pattern: /['\/\\]:?|\beach\b/,
        alias: 'function'
      },
      verb: {
        pattern: /(?:\B\.\B|\b[01]:|<[=>]?|>=?|[:+\-*%,!?_~=|$&#@^]):?/,
        alias: 'operator'
      },
      punctuation: /[(){}\[\];.]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/qore.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/qore.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'qore',
  init: function init(Prism) {
    Prism.languages.qore = Prism.languages.extend('clike', {
      comment: {
        pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:\/\/|#).*)/,
        lookbehind: true
      },
      // Overridden to allow unescaped multi-line strings
      string: {
        pattern: /("|')(\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: true
      },
      variable: /\$(?!\d)\w+\b/,
      keyword: /\b(?:abstract|any|assert|binary|bool|boolean|break|byte|case|catch|char|class|code|const|continue|data|default|do|double|else|enum|extends|final|finally|float|for|goto|hash|if|implements|import|inherits|instanceof|int|interface|long|my|native|new|nothing|null|object|our|own|private|reference|rethrow|return|short|soft(?:int|float|number|bool|string|date|list)|static|strictfp|string|sub|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/,
      number: /\b(?:0b[01]+|0x[\da-f]*\.?[\da-fp\-]+|\d*\.?\d+e?\d*[df]|\d*\.?\d+)\b/i,
      boolean: /\b(?:true|false)\b/i,
      operator: {
        pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|[!=](?:==?|~)?|>>?=?|<(?:=>?|<=?)?|&[&=]?|\|[|=]?|[*\/%^]=?|[~?])/,
        lookbehind: true
      },
      function: /\$?\b(?!\d)\w+(?=\()/
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/r.js":
/*!*********************************************!*\
  !*** ./node_modules/reprism/languages/r.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'r',
  init: function init(Prism) {
    Prism.languages.r = {
      comment: /#.*/,
      string: {
        pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      'percent-operator': {
        // Includes user-defined operators
        // and %%, %*%, %/%, %in%, %o%, %x%
        pattern: /%[^%\s]*%/,
        alias: 'operator'
      },
      boolean: /\b(?:TRUE|FALSE)\b/,
      ellipsis: /\.\.(?:\.|\d+)/,
      number: [/\b(?:NaN|Inf)\b/, /(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+\.?\d*|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/],
      keyword: /\b(?:if|else|repeat|while|function|for|in|next|break|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/,
      operator: /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
      punctuation: /[(){}\[\],;]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/reason.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/reason.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'reason',
  init: function init(Prism) {
    Prism.languages.reason = Prism.languages.extend('clike', {
      comment: {
        pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
        lookbehind: true
      },
      string: {
        pattern: /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"/,
        greedy: true
      },
      // 'class-name' must be matched *after* 'constructor' defined below
      'class-name': /\b[A-Z]\w*/,
      keyword: /\b(?:and|as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|sig|struct|switch|then|to|try|type|val|virtual|when|while|with)\b/,
      operator: /\.{3}|:[:=]|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:mod|land|lor|lxor|lsl|lsr|asr)\b/
    });
    Prism.languages.insertBefore('reason', 'class-name', {
      character: {
        pattern: /'(?:\\x[\da-f]{2}|\\o[0-3][0-7][0-7]|\\\d{3}|\\.|[^'\\\r\n])'/,
        alias: 'string'
      },
      constructor: {
        // Negative look-ahead prevents from matching things like String.capitalize
        pattern: /\b[A-Z]\w*\b(?!\s*\.)/,
        alias: 'variable'
      },
      label: {
        pattern: /\b[a-z]\w*(?=::)/,
        alias: 'symbol'
      }
    });

    // We can't match functions property, so let's not even try.
    delete Prism.languages.reason.function;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/renpy.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/renpy.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'renpy',
  init: function init(Prism) {
    Prism.languages.renpy = {
      // TODO Write tests.

      comment: {
        pattern: /(^|[^\\])#.+/,
        lookbehind: true
      },

      string: {
        pattern: /("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2|(?:^#?(?:(?:[0-9a-fA-F]{2}){3}|(?:[0-9a-fA-F]){3})$)/m,
        greedy: true
      },

      function: /[a-z_]\w*(?=\()/i,

      property: /\b(?:insensitive|idle|hover|selected_idle|selected_hover|background|position|alt|xpos|ypos|pos|xanchor|yanchor|anchor|xalign|yalign|align|xcenter|ycenter|xofsset|yoffset|ymaximum|maximum|xmaximum|xminimum|yminimum|minimum|xsize|ysizexysize|xfill|yfill|area|antialias|black_color|bold|caret|color|first_indent|font|size|italic|justify|kerning|language|layout|line_leading|line_overlap_split|line_spacing|min_width|newline_indent|outlines|rest_indent|ruby_style|slow_cps|slow_cps_multiplier|strikethrough|text_align|underline|hyperlink_functions|vertical|hinting|foreground|left_margin|xmargin|top_margin|bottom_margin|ymargin|left_padding|right_padding|xpadding|top_padding|bottom_padding|ypadding|size_group|child|hover_sound|activate_sound|mouse|focus_mask|keyboard_focus|bar_vertical|bar_invert|bar_resizing|left_gutter|right_gutter|top_gutter|bottom_gutter|left_bar|right_bar|top_bar|bottom_bar|thumb|thumb_shadow|thumb_offset|unscrollable|spacing|first_spacing|box_reverse|box_wrap|order_reverse|fit_first|ysize|thumbnail_width|thumbnail_height|help|text_ypos|text_xpos|idle_color|hover_color|selected_idle_color|selected_hover_color|insensitive_color|alpha|insensitive_background|hover_background|zorder|value|width|xadjustment|xanchoraround|xaround|xinitial|xoffset|xzoom|yadjustment|yanchoraround|yaround|yinitial|yzoom|zoom|ground|height|text_style|text_y_fudge|selected_insensitive|has_sound|has_music|has_voice|focus|hovered|image_style|length|minwidth|mousewheel|offset|prefix|radius|range|right_margin|rotate|rotate_pad|developer|screen_width|screen_height|window_title|name|version|windows_icon|default_fullscreen|default_text_cps|default_afm_time|main_menu_music|sample_sound|enter_sound|exit_sound|save_directory|enter_transition|exit_transition|intra_transition|main_game_transition|game_main_transition|end_splash_transition|end_game_transition|after_load_transition|window_show_transition|window_hide_transition|adv_nvl_transition|nvl_adv_transition|enter_yesno_transition|exit_yesno_transition|enter_replay_transition|exit_replay_transition|say_attribute_transition|directory_name|executable_name|include_update|window_icon|modal|google_play_key|google_play_salt|drag_name|drag_handle|draggable|dragged|droppable|dropped|narrator_menu|action|default_afm_enable|version_name|version_tuple|inside|fadeout|fadein|layers|layer_clipping|linear|scrollbars|side_xpos|side_ypos|side_spacing|edgescroll|drag_joined|drag_raise|drop_shadow|drop_shadow_color|subpixel|easein|easeout|time|crop|auto|update|get_installed_packages|can_update|UpdateVersion|Update|overlay_functions|translations|window_left_padding|show_side_image|show_two_window)\b/,

      tag: /\b(?:label|image|menu|[hv]box|frame|text|imagemap|imagebutton|bar|vbar|screen|textbutton|buttoscreenn|fixed|grid|input|key|mousearea|side|timer|viewport|window|hotspot|hotbar|self|button|drag|draggroup|tag|mm_menu_frame|nvl|block|parallel)\b|\$/,

      keyword: /\b(?:as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|yield|adjustment|alignaround|allow|angle|around|box_layout|cache|changed|child_size|clicked|clipping|corner1|corner2|default|delay|exclude|scope|slow|slow_abortable|slow_done|sound|style_group|substitute|suffix|transform_anchor|transpose|unhovered|config|theme|mm_root|gm_root|rounded_window|build|disabled_text|disabled|widget_selected|widget_text|widget_hover|widget|updater|behind|call|expression|hide|init|jump|onlayer|python|renpy|scene|set|show|transform|play|queue|stop|pause|define|window|repeat|contains|choice|on|function|event|animation|clockwise|counterclockwise|circles|knot|null|None|random|has|add|use|fade|dissolve|style|store|id|voice|center|left|right|less_rounded|music|movie|clear|persistent|ui)\b/,

      boolean: /\b(?:[Tt]rue|[Ff]alse)\b/,

      number: /(?:\b(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*)|\B\.\d+)(?:e[+-]?\d+)?j?/i,

      operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not|with|at)\b/,

      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/rest.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/rest.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'rest',
  init: function init(Prism) {
    Prism.languages.rest = {
      table: [{
        pattern: /(\s*)(?:\+[=-]+)+\+(?:\r?\n|\r)(?:\1(?:[+|].+)+[+|](?:\r?\n|\r))+\1(?:\+[=-]+)+\+/,
        lookbehind: true,
        inside: {
          punctuation: /\||(?:\+[=-]+)+\+/
        }
      }, {
        pattern: /(\s*)(?:=+ +)+=+(?:(?:\r?\n|\r)\1.+)+(?:\r?\n|\r)\1(?:=+ +)+=+(?=(?:\r?\n|\r){2}|\s*$)/,
        lookbehind: true,
        inside: {
          punctuation: /[=-]+/
        }
      }],

      // Directive-like patterns

      'substitution-def': {
        pattern: /(^\s*\.\. )\|(?:[^|\s](?:[^|]*[^|\s])?)\| [^:]+::/m,
        lookbehind: true,
        inside: {
          substitution: {
            pattern: /^\|(?:[^|\s]|[^|\s][^|]*[^|\s])\|/,
            alias: 'attr-value',
            inside: {
              punctuation: /^\||\|$/
            }
          },
          directive: {
            pattern: /( +)[^:]+::/,
            lookbehind: true,
            alias: 'function',
            inside: {
              punctuation: /::$/
            }
          }
        }
      },
      'link-target': [{
        pattern: /(^\s*\.\. )\[[^\]]+\]/m,
        lookbehind: true,
        alias: 'string',
        inside: {
          punctuation: /^\[|\]$/
        }
      }, {
        pattern: /(^\s*\.\. )_(?:`[^`]+`|(?:[^:\\]|\\.)+):/m,
        lookbehind: true,
        alias: 'string',
        inside: {
          punctuation: /^_|:$/
        }
      }],
      directive: {
        pattern: /(^\s*\.\. )[^:]+::/m,
        lookbehind: true,
        alias: 'function',
        inside: {
          punctuation: /::$/
        }
      },
      comment: {
        // The two alternatives try to prevent highlighting of blank comments
        pattern: /(^\s*\.\.)(?:(?: .+)?(?:(?:\r?\n|\r).+)+| .+)(?=(?:\r?\n|\r){2}|$)/m,
        lookbehind: true
      },

      title: [
      // Overlined and underlined
      {
        pattern: /^(([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2+)(?:\r?\n|\r).+(?:\r?\n|\r)\1$/m,
        inside: {
          punctuation: /^[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+|[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
          important: /.+/
        }
      },

      // Underlined only
      {
        pattern: /(^|(?:\r?\n|\r){2}).+(?:\r?\n|\r)([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2+(?=\r?\n|\r|$)/,
        lookbehind: true,
        inside: {
          punctuation: /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
          important: /.+/
        }
      }],
      hr: {
        pattern: /((?:\r?\n|\r){2})([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2{3,}(?=(?:\r?\n|\r){2})/,
        lookbehind: true,
        alias: 'punctuation'
      },
      field: {
        pattern: /(^\s*):[^:\r\n]+:(?= )/m,
        lookbehind: true,
        alias: 'attr-name'
      },
      'command-line-option': {
        pattern: /(^\s*)(?:[+-][a-z\d]|(?:--|\/)[a-z\d-]+)(?:[ =](?:[a-z][\w-]*|<[^<>]+>))?(?:, (?:[+-][a-z\d]|(?:--|\/)[a-z\d-]+)(?:[ =](?:[a-z][\w-]*|<[^<>]+>))?)*(?=(?:\r?\n|\r)? {2,}\S)/im,
        lookbehind: true,
        alias: 'symbol'
      },
      'literal-block': {
        pattern: /::(?:\r?\n|\r){2}([ \t]+).+(?:(?:\r?\n|\r)\1.+)*/,
        inside: {
          'literal-block-punctuation': {
            pattern: /^::/,
            alias: 'punctuation'
          }
        }
      },
      'quoted-literal-block': {
        pattern: /::(?:\r?\n|\r){2}([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]).*(?:(?:\r?\n|\r)\1.*)*/,
        inside: {
          'literal-block-punctuation': {
            pattern: /^(?:::|([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\1*)/m,
            alias: 'punctuation'
          }
        }
      },
      'list-bullet': {
        pattern: /(^\s*)(?:[*+\-•‣⁃]|\(?(?:\d+|[a-z]|[ivxdclm]+)\)|(?:\d+|[a-z]|[ivxdclm]+)\.)(?= )/im,
        lookbehind: true,
        alias: 'punctuation'
      },
      'doctest-block': {
        pattern: /(^\s*)>>> .+(?:(?:\r?\n|\r).+)*/m,
        lookbehind: true,
        inside: {
          punctuation: /^>>>/
        }
      },

      inline: [{
        pattern: /(^|[\s\-:\/'"<(\[{])(?::[^:]+:`.*?`|`.*?`:[^:]+:|(\*\*?|``?|\|)(?!\s).*?[^\s]\2(?=[\s\-.,:;!?\\\/'")\]}]|$))/m,
        lookbehind: true,
        inside: {
          bold: {
            pattern: /(^\*\*).+(?=\*\*$)/,
            lookbehind: true
          },
          italic: {
            pattern: /(^\*).+(?=\*$)/,
            lookbehind: true
          },
          'inline-literal': {
            pattern: /(^``).+(?=``$)/,
            lookbehind: true,
            alias: 'symbol'
          },
          role: {
            pattern: /^:[^:]+:|:[^:]+:$/,
            alias: 'function',
            inside: {
              punctuation: /^:|:$/
            }
          },
          'interpreted-text': {
            pattern: /(^`).+(?=`$)/,
            lookbehind: true,
            alias: 'attr-value'
          },
          substitution: {
            pattern: /(^\|).+(?=\|$)/,
            lookbehind: true,
            alias: 'attr-value'
          },
          punctuation: /\*\*?|``?|\|/
        }
      }],

      link: [{
        pattern: /\[[^\]]+\]_(?=[\s\-.,:;!?\\\/'")\]}]|$)/,
        alias: 'string',
        inside: {
          punctuation: /^\[|\]_$/
        }
      }, {
        pattern: /(?:\b[a-z\d](?:[_.:+]?[a-z\d]+)*_?_|`[^`]+`_?_|_`[^`]+`)(?=[\s\-.,:;!?\\\/'")\]}]|$)/i,
        alias: 'string',
        inside: {
          punctuation: /^_?`|`$|`?_?_$/
        }
      }],

      // Line block start,
      // quote attribution,
      // explicit markup start,
      // and anonymous hyperlink target shortcut (__)
      punctuation: {
        pattern: /(^\s*)(?:\|(?= |$)|(?:---?|—|\.\.|__)(?= )|\.\.$)/m,
        lookbehind: true
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/rip.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/rip.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'rip',
  init: function init(Prism) {
    Prism.languages.rip = {
      comment: /#.*/,

      keyword: /(?:=>|->)|\b(?:class|if|else|switch|case|return|exit|try|catch|finally|raise)\b/,

      builtin: /@|\bSystem\b/,

      boolean: /\b(?:true|false)\b/,

      date: /\b\d{4}-\d{2}-\d{2}\b/,
      time: /\b\d{2}:\d{2}:\d{2}\b/,
      datetime: /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\b/,

      character: /\B`[^\s`'",.:;#\/\\()<>\[\]{}]\b/,

      regex: {
        pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/(?=\s*($|[\r\n,.;})]))/,
        lookbehind: true,
        greedy: true
      },

      symbol: /:[^\d\s`'",.:;#\/\\()<>\[\]{}][^\s`'",.:;#\/\\()<>\[\]{}]*/,
      string: {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      number: /[+-]?(?:(?:\d+\.\d+)|(?:\d+))/,

      punctuation: /(?:\.{2,3})|[`,.:;=\/\\()<>\[\]{}]/,

      reference: /[^\d\s`'",.:;#\/\\()<>\[\]{}][^\s`'",.:;#\/\\()<>\[\]{}]*/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/roboconf.js":
/*!****************************************************!*\
  !*** ./node_modules/reprism/languages/roboconf.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'roboconf',
  init: function init(Prism) {
    Prism.languages.roboconf = {
      comment: /#.*/,
      keyword: {
        pattern: /(^|\s)(?:(?:facet|instance of)(?=[ \t]+[\w-]+[ \t]*\{)|(?:external|import)\b)/,
        lookbehind: true
      },
      component: {
        pattern: /[\w-]+(?=[ \t]*\{)/,
        alias: 'variable'
      },
      property: /[\w.-]+(?=[ \t]*:)/,
      value: {
        pattern: /(=[ \t]*)[^,;]+/,
        lookbehind: true,
        alias: 'attr-value'
      },
      optional: {
        pattern: /\(optional\)/,
        alias: 'builtin'
      },
      wildcard: {
        pattern: /(\.)\*/,
        lookbehind: true,
        alias: 'operator'
      },
      punctuation: /[{},.;:=]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/ruby.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/ruby.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'ruby',
  init: function init(Prism) {
    /**
     * Original by Samuel Flores
     *
     * Adds the following new token classes:
     * 		constant, builtin, variable, symbol, regex
     */
    (function (Prism) {
      Prism.languages.ruby = Prism.languages.extend('clike', {
        comment: [/#.*/, {
          pattern: /^=begin(?:\r?\n|\r)(?:.*(?:\r?\n|\r))*?=end/m,
          greedy: true
        }],
        keyword: /\b(?:alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|protected|private|public|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/
      });

      var interpolation = {
        pattern: /#\{[^}]+\}/,
        inside: {
          delimiter: {
            pattern: /^#\{|\}$/,
            alias: 'tag'
          },
          rest: Prism.languages.ruby
        }
      };

      Prism.languages.insertBefore('ruby', 'keyword', {
        regex: [{
          pattern: /%r([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1[gim]{0,3}/,
          greedy: true,
          inside: {
            interpolation: interpolation
          }
        }, {
          pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,
          greedy: true,
          inside: {
            interpolation: interpolation
          }
        }, {
          // Here we need to specifically allow interpolation
          pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,
          greedy: true,
          inside: {
            interpolation: interpolation
          }
        }, {
          pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,
          greedy: true,
          inside: {
            interpolation: interpolation
          }
        }, {
          pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,
          greedy: true,
          inside: {
            interpolation: interpolation
          }
        }, {
          pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
          lookbehind: true,
          greedy: true
        }],
        variable: /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
        symbol: {
          pattern: /(^|[^:]):[a-zA-Z_]\w*(?:[?!]|\b)/,
          lookbehind: true
        }
      });

      Prism.languages.insertBefore('ruby', 'number', {
        builtin: /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
        constant: /\b[A-Z]\w*(?:[?!]|\b)/
      });

      Prism.languages.ruby.string = [{
        pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/,
        greedy: true,
        inside: {
          interpolation: interpolation
        }
      }, {
        pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,
        greedy: true,
        inside: {
          interpolation: interpolation
        }
      }, {
        // Here we need to specifically allow interpolation
        pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,
        greedy: true,
        inside: {
          interpolation: interpolation
        }
      }, {
        pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,
        greedy: true,
        inside: {
          interpolation: interpolation
        }
      }, {
        pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,
        greedy: true,
        inside: {
          interpolation: interpolation
        }
      }, {
        pattern: /("|')(?:#\{[^}]+\}|\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true,
        inside: {
          interpolation: interpolation
        }
      }];
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/rust.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/rust.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'rust',
  init: function init(Prism) {
    /* TODO
    Add support for Markdown notation inside doc comments
    Add support for nested block comments...
    Match closure params even when not followed by dash or brace
    Add better support for macro definition
    */

    Prism.languages.rust = {
      comment: [{
        pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
        lookbehind: true
      }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true
      }],
      string: [{
        pattern: /b?r(#*)"(?:\\.|(?!"\1)[^\\\r\n])*"\1/,
        greedy: true
      }, {
        pattern: /b?"(?:\\.|[^\\\r\n"])*"/,
        greedy: true
      }],
      char: {
        pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u{(?:[\da-fA-F]_*){1,6}|.)|[^\\\r\n\t'])'/,
        alias: 'string'
      },
      'lifetime-annotation': {
        pattern: /'[^\s>']+/,
        alias: 'symbol'
      },
      keyword: /\b(?:abstract|alignof|as|be|box|break|const|continue|crate|do|else|enum|extern|false|final|fn|for|if|impl|in|let|loop|match|mod|move|mut|offsetof|once|override|priv|pub|pure|ref|return|sizeof|static|self|struct|super|true|trait|type|typeof|unsafe|unsized|use|virtual|where|while|yield)\b/,

      attribute: {
        pattern: /#!?\[.+?\]/,
        greedy: true,
        alias: 'attr-name'
      },

      function: [/\w+(?=\s*\()/,
      // Macros can use parens or brackets
      /\w+!(?=\s*\(|\[)/],
      'macro-rules': {
        pattern: /\w+!/,
        alias: 'function'
      },

      // Hex, oct, bin, dec numbers with visual separators and type suffix
      number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(\d(?:_?\d)*)?\.?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64)?|f32|f64))?\b/,

      // Closure params should not be confused with bitwise OR |
      'closure-params': {
        pattern: /\|[^|]*\|(?=\s*[{-])/,
        inside: {
          punctuation: /[|:,]/,
          operator: /[&*]/
        }
      },
      punctuation: /[{}[\];(),:]|\.+|->/,
      operator: /[-+*\/%!^]=?|=[=>]?|@|&[&=]?|\|[|=]?|<<?=?|>>?=?/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/sas.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/sas.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'sas',
  init: function init(Prism) {
    Prism.languages.sas = {
      datalines: {
        pattern: /^\s*(?:(?:data)?lines|cards);[\s\S]+?(?:\r?\n|\r);/im,
        alias: 'string',
        inside: {
          keyword: {
            pattern: /^(\s*)(?:(?:data)?lines|cards)/i,
            lookbehind: true
          },
          punctuation: /;/
        }
      },
      comment: [{
        pattern: /(^\s*|;\s*)\*.*;/m,
        lookbehind: true
      }, /\/\*[\s\S]+?\*\//],
      datetime: {
        // '1jan2013'd, '9:25:19pm't, '18jan2003:9:27:05am'dt
        pattern: /'[^']+'(?:dt?|t)\b/i,
        alias: 'number'
      },
      string: {
        pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
        greedy: true
      },
      keyword: /\b(?:data|else|format|if|input|proc\s\w+|quit|run|then)\b/i,
      // Decimal (1.2e23), hexadecimal (0c1x)
      number: /\b(?:[\da-f]+x|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/i,
      operator: /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?|\b(?:eq|ne|gt|lt|ge|le|in|not)\b/i,
      punctuation: /[$%@.(){}\[\];,\\]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/sass.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/sass.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'sass',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.sass = Prism.languages.extend('css', {
        // Sass comments don't need to be closed, only indented
        comment: {
          pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
          lookbehind: true
        }
      });

      Prism.languages.insertBefore('sass', 'atrule', {
        // We want to consume the whole line
        'atrule-line': {
          // Includes support for = and + shortcuts
          pattern: /^(?:[ \t]*)[@+=].+/m,
          inside: {
            atrule: /(?:@[\w-]+|[+=])/m
          }
        }
      });
      delete Prism.languages.sass.atrule;

      var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
      var operator = [/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/, {
        pattern: /(\s+)-(?=\s)/,
        lookbehind: true
      }];

      Prism.languages.insertBefore('sass', 'property', {
        // We want to consume the whole line
        'variable-line': {
          pattern: /^[ \t]*\$.+/m,
          inside: {
            punctuation: /:/,
            variable: variable,
            operator: operator
          }
        },
        // We want to consume the whole line
        'property-line': {
          pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
          inside: {
            property: [/[^:\s]+(?=\s*:)/, {
              pattern: /(:)[^:\s]+/,
              lookbehind: true
            }],
            punctuation: /:/,
            variable: variable,
            operator: operator,
            important: Prism.languages.sass.important
          }
        }
      });
      delete Prism.languages.sass.property;
      delete Prism.languages.sass.important;

      // Now that whole lines for other patterns are consumed,
      // what's left should be selectors
      delete Prism.languages.sass.selector;
      Prism.languages.insertBefore('sass', 'punctuation', {
        selector: {
          pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
          lookbehind: true
        }
      });
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/scala.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/scala.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'scala',
  init: function init(Prism) {
    Prism.languages.scala = Prism.languages.extend('java', {
      keyword: /<-|=>|\b(?:abstract|case|catch|class|def|do|else|extends|final|finally|for|forSome|if|implicit|import|lazy|match|new|null|object|override|package|private|protected|return|sealed|self|super|this|throw|trait|try|type|val|var|while|with|yield)\b/,
      string: [{
        pattern: /"""[\s\S]*?"""/,
        greedy: true
      }, {
        pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      }],
      builtin: /\b(?:String|Int|Long|Short|Byte|Boolean|Double|Float|Char|Any|AnyRef|AnyVal|Unit|Nothing)\b/,
      number: /\b0x[\da-f]*\.?[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e\d+)?[dfl]?/i,
      symbol: /'[^\d\s\\]\w*/
    });
    delete Prism.languages.scala['class-name'];
    delete Prism.languages.scala.function;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/scheme.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/scheme.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'scheme',
  init: function init(Prism) {
    Prism.languages.scheme = {
      comment: /;.*/,
      string: {
        pattern: /"(?:[^"\\\r\n]|\\.)*"|'[^('\s]*/,
        greedy: true
      },
      keyword: {
        pattern: /(\()(?:define(?:-syntax|-library|-values)?|(?:case-)?lambda|let(?:\*|rec)?(?:-values)?|else|if|cond|begin|delay(?:-force)?|parameterize|guard|set!|(?:quasi-)?quote|syntax-rules)/,
        lookbehind: true
      },
      builtin: {
        pattern: /(\()(?:(?:cons|car|cdr|list|call-with-current-continuation|call\/cc|append|abs|apply|eval)\b|null\?|pair\?|boolean\?|eof-object\?|char\?|procedure\?|number\?|port\?|string\?|vector\?|symbol\?|bytevector\?)/,
        lookbehind: true
      },
      number: {
        pattern: /(\s|[()])[-+]?\d*\.?\d+(?:\s*[-+]\s*\d*\.?\d+i)?\b/,
        lookbehind: true
      },
      boolean: /#[tf]/,
      operator: {
        pattern: /(\()(?:[-+*%\/]|[<>]=?|=>?)/,
        lookbehind: true
      },
      function: {
        pattern: /(\()[^\s()]*(?=\s)/,
        lookbehind: true
      },
      punctuation: /[()]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/scss.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/scss.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'scss',
  init: function init(Prism) {
    Prism.languages.scss = Prism.languages.extend('css', {
      comment: {
        pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
        lookbehind: true
      },
      atrule: {
        pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
        inside: {
          rule: /@[\w-]+/
          // See rest below
        }
      },
      // url, compassified
      url: /(?:[-a-z]+-)*url(?=\()/i,
      // CSS selector regex is not appropriate for Sass
      // since there can be lot more things (var, @ directive, nesting..)
      // a selector must start at the end of a property or after a brace (end of other rules or nesting)
      // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
      // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
      // can "pass" as a selector- e.g: proper#{$erty})
      // this one was hard to do, so please be careful if you edit this one :)
      selector: {
        // Initial look-ahead is used to prevent matching of blank selectors
        pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()]|&|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,
        inside: {
          parent: {
            pattern: /&/,
            alias: 'important'
          },
          placeholder: /%[-\w]+/,
          variable: /\$[-\w]+|#\{\$[-\w]+\}/
        }
      }
    });

    Prism.languages.insertBefore('scss', 'atrule', {
      keyword: [/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i, {
        pattern: /( +)(?:from|through)(?= )/,
        lookbehind: true
      }]
    });

    Prism.languages.scss.property = {
      pattern: /(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/i,
      inside: {
        variable: /\$[-\w]+|#\{\$[-\w]+\}/
      }
    };

    Prism.languages.insertBefore('scss', 'important', {
      // var and interpolated vars
      variable: /\$[-\w]+|#\{\$[-\w]+\}/
    });

    Prism.languages.insertBefore('scss', 'function', {
      placeholder: {
        pattern: /%[-\w]+/,
        alias: 'selector'
      },
      statement: {
        pattern: /\B!(?:default|optional)\b/i,
        alias: 'keyword'
      },
      boolean: /\b(?:true|false)\b/,
      null: /\bnull\b/,
      operator: {
        pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
        lookbehind: true
      }
    });

    Prism.languages.scss.atrule.inside.rest = Prism.languages.scss;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/smalltalk.js":
/*!*****************************************************!*\
  !*** ./node_modules/reprism/languages/smalltalk.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'smalltalk',
  init: function init(Prism) {
    Prism.languages.smalltalk = {
      comment: /"(?:""|[^"])+"/,
      string: /'(?:''|[^'])+'/,
      symbol: /#[\da-z]+|#(?:-|([+\/\\*~<>=@%|&?!])\1?)|#(?=\()/i,
      'block-arguments': {
        pattern: /(\[\s*):[^\[|]*\|/,
        lookbehind: true,
        inside: {
          variable: /:[\da-z]+/i,
          punctuation: /\|/
        }
      },
      'temporary-variables': {
        pattern: /\|[^|]+\|/,
        inside: {
          variable: /[\da-z]+/i,
          punctuation: /\|/
        }
      },
      keyword: /\b(?:nil|true|false|self|super|new)\b/,
      character: {
        pattern: /\$./,
        alias: 'string'
      },
      number: [/\d+r-?[\dA-Z]+(?:\.[\dA-Z]+)?(?:e-?\d+)?/, /\b\d+(?:\.\d+)?(?:e-?\d+)?/],
      operator: /[<=]=?|:=|~[~=]|\/\/?|\\\\|>[>=]?|[!^+\-*&|,@]/,
      punctuation: /[.;:?\[\](){}]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/smarty.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/smarty.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'smarty',
  init: function init(Prism) {
    /* TODO
    Add support for variables inside double quoted strings
    Add support for {php}
    */

    (function (Prism) {
      Prism.languages.smarty = {
        comment: /\{\*[\s\S]*?\*\}/,
        delimiter: {
          pattern: /^\{|\}$/i,
          alias: 'punctuation'
        },
        string: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        number: /\b0x[\dA-Fa-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][-+]?\d+)?/,
        variable: [/\$(?!\d)\w+/, /#(?!\d)\w+#/, {
          pattern: /(\.|->)(?!\d)\w+/,
          lookbehind: true
        }, {
          pattern: /(\[)(?!\d)\w+(?=\])/,
          lookbehind: true
        }],
        function: [{
          pattern: /(\|\s*)@?(?!\d)\w+/,
          lookbehind: true
        }, /^\/?(?!\d)\w+/, /(?!\d)\w+(?=\()/],
        'attr-name': {
          // Value is made optional because it may have already been tokenized
          pattern: /\w+\s*=\s*(?:(?!\d)\w+)?/,
          inside: {
            variable: {
              pattern: /(=\s*)(?!\d)\w+/,
              lookbehind: true
            },
            operator: /=/
          }
        },
        punctuation: [/[\[\]().,:`]|->/],
        operator: [/[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/, /\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/, /\b(?:eq|neq?|gt|lt|gt?e|lt?e|not|mod|or|and)\b/],
        keyword: /\b(?:false|off|on|no|true|yes)\b/

        // Comments are inserted at top so that they can
        // surround markup
      };Prism.languages.insertBefore('smarty', 'tag', {
        'smarty-comment': {
          pattern: /\{\*[\s\S]*?\*\}/,
          alias: ['smarty', 'comment']
        }
      });

      // Tokenize all inline Smarty expressions
      Prism.hooks.add('before-tokenize', function (env) {
        var smartyPattern = /\{\*[\s\S]*?\*\}|\{[\s\S]+?\}/g;
        var smartyLitteralStart = '{literal}';
        var smartyLitteralEnd = '{/literal}';
        var smartyLitteralMode = false;

        Prism.languages['markup-templating'].buildPlaceholders(env, 'smarty', smartyPattern, function (match) {
          // Smarty tags inside {literal} block are ignored
          if (match === smartyLitteralEnd) {
            smartyLitteralMode = false;
          }

          if (!smartyLitteralMode) {
            if (match === smartyLitteralStart) {
              smartyLitteralMode = true;
            }

            return true;
          }
          return false;
        });
      });

      // Re-insert the tokens after tokenizing
      Prism.hooks.add('after-tokenize', function (env) {
        Prism.languages['markup-templating'].tokenizePlaceholders(env, 'smarty');
      });
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/soy.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/soy.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'soy',
  init: function init(Prism) {
    (function (Prism) {
      var stringPattern = /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
      var numberPattern = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[\dA-F]+\b/;

      Prism.languages.soy = {
        comment: [/\/\*[\s\S]*?\*\//, {
          pattern: /(\s)\/\/.*/,
          lookbehind: true,
          greedy: true
        }],
        'command-arg': {
          pattern: /({+\/?\s*(?:alias|call|delcall|delpackage|deltemplate|namespace|template)\s+)\.?[\w.]+/,
          lookbehind: true,
          alias: 'string',
          inside: {
            punctuation: /\./
          }
        },
        parameter: {
          pattern: /({+\/?\s*@?param\??\s+)\.?[\w.]+/,
          lookbehind: true,
          alias: 'variable'
        },
        keyword: [{
          pattern: /({+\/?[^\S\r\n]*)(?:\\[nrt]|alias|call|case|css|default|delcall|delpackage|deltemplate|else(?:if)?|fallbackmsg|for(?:each)?|if(?:empty)?|lb|let|literal|msg|namespace|nil|@?param\??|rb|sp|switch|template|xid)/,
          lookbehind: true
        }, /\b(?:any|as|attributes|bool|css|float|in|int|js|html|list|map|null|number|string|uri)\b/],
        delimiter: {
          pattern: /^{+\/?|\/?}+$/,
          alias: 'punctuation'
        },
        property: /\w+(?==)/,
        variable: {
          pattern: /\$[^\W\d]\w*(?:\??(?:\.\w+|\[[^\]]+]))*/,
          inside: {
            string: {
              pattern: stringPattern,
              greedy: true
            },
            number: numberPattern,
            punctuation: /[\[\].?]/
          }
        },
        string: {
          pattern: stringPattern,
          greedy: true
        },
        function: [/\w+(?=\()/, {
          pattern: /(\|[^\S\r\n]*)\w+/,
          lookbehind: true
        }],
        boolean: /\b(?:true|false)\b/,
        number: numberPattern,
        operator: /\?:?|<=?|>=?|==?|!=|[+*/%-]|\b(?:and|not|or)\b/,
        punctuation: /[{}()\[\]|.,:]/

        // Tokenize all inline Soy expressions
      };Prism.hooks.add('before-tokenize', function (env) {
        var soyPattern = /{{.+?}}|{.+?}|\s\/\/.*|\/\*[\s\S]*?\*\//g;
        var soyLitteralStart = '{literal}';
        var soyLitteralEnd = '{/literal}';
        var soyLitteralMode = false;

        Prism.languages['markup-templating'].buildPlaceholders(env, 'soy', soyPattern, function (match) {
          // Soy tags inside {literal} block are ignored
          if (match === soyLitteralEnd) {
            soyLitteralMode = false;
          }

          if (!soyLitteralMode) {
            if (match === soyLitteralStart) {
              soyLitteralMode = true;
            }

            return true;
          }
          return false;
        });
      });

      // Re-insert the tokens after tokenizing
      Prism.hooks.add('after-tokenize', function (env) {
        Prism.languages['markup-templating'].tokenizePlaceholders(env, 'soy');
      });
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/stylus.js":
/*!**************************************************!*\
  !*** ./node_modules/reprism/languages/stylus.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'stylus',
  init: function init(Prism) {
    (function (Prism) {
      var inside = {
        url: /url\((["']?).*?\1\)/i,
        string: {
          pattern: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*\1/,
          greedy: true
        },
        interpolation: null, // See below
        func: null, // See below
        important: /\B!(?:important|optional)\b/i,
        keyword: {
          pattern: /(^|\s+)(?:(?:if|else|for|return|unless)(?=\s+|$)|@[\w-]+)/,
          lookbehind: true
        },
        hexcode: /#[\da-f]{3,6}/i,
        number: /\b\d+(?:\.\d+)?%?/,
        boolean: /\b(?:true|false)\b/,
        operator: [
        // We want non-word chars around "-" because it is
        // accepted in property names.
        /~|[+!\/%<>?=]=?|[-:]=|\*[*=]?|\.+|&&|\|\||\B-\B|\b(?:and|in|is(?: a| defined| not|nt)?|not|or)\b/],
        punctuation: /[{}()\[\];:,]/
      };

      inside.interpolation = {
        pattern: /\{[^\r\n}:]+\}/,
        alias: 'variable',
        inside: {
          delimiter: {
            pattern: /^{|}$/,
            alias: 'punctuation'
          },
          rest: inside
        }
      };
      inside.func = {
        pattern: /[\w-]+\([^)]*\).*/,
        inside: {
          function: /^[^(]+/,
          rest: inside
        }
      };

      Prism.languages.stylus = {
        comment: {
          pattern: /(^|[^\\])(\/\*[\s\S]*?\*\/|\/\/.*)/,
          lookbehind: true
        },
        'atrule-declaration': {
          pattern: /(^\s*)@.+/m,
          lookbehind: true,
          inside: {
            atrule: /^@[\w-]+/,
            rest: inside
          }
        },
        'variable-declaration': {
          pattern: /(^[ \t]*)[\w$-]+\s*.?=[ \t]*(?:(?:\{[^}]*\}|.+)|$)/m,
          lookbehind: true,
          inside: {
            variable: /^\S+/,
            rest: inside
          }
        },

        statement: {
          pattern: /(^[ \t]*)(?:if|else|for|return|unless)[ \t]+.+/m,
          lookbehind: true,
          inside: {
            keyword: /^\S+/,
            rest: inside
          }
        },

        // A property/value pair cannot end with a comma or a brace
        // It cannot have indented content unless it ended with a semicolon
        'property-declaration': {
          pattern: /((?:^|\{)([ \t]*))(?:[\w-]|\{[^}\r\n]+\})+(?:\s*:\s*|[ \t]+)[^{\r\n]*(?:;|[^{\r\n,](?=$)(?!(\r?\n|\r)(?:\{|\2[ \t]+)))/m,
          lookbehind: true,
          inside: {
            property: {
              pattern: /^[^\s:]+/,
              inside: {
                interpolation: inside.interpolation
              }
            },
            rest: inside
          }
        },

        // A selector can contain parentheses only as part of a pseudo-element
        // It can span multiple lines.
        // It must end with a comma or an accolade or have indented content.
        selector: {
          pattern: /(^[ \t]*)(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\))?|\{[^}\r\n]+\})+)(?:(?:\r?\n|\r)(?:\1(?:(?=\S)(?:[^{}\r\n:()]|::?[\w-]+(?:\([^)\r\n]*\))?|\{[^}\r\n]+\})+)))*(?:,$|\{|(?=(?:\r?\n|\r)(?:\{|\1[ \t]+)))/m,
          lookbehind: true,
          inside: {
            interpolation: inside.interpolation,
            punctuation: /[{},]/
          }
        },

        func: inside.func,
        string: inside.string,
        interpolation: inside.interpolation,
        punctuation: /[{}()\[\];:.]/
      };
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/swift.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/swift.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'swift',
  init: function init(Prism) {
    // issues: nested multiline comments
    Prism.languages.swift = Prism.languages.extend('clike', {
      string: {
        pattern: /("|')(\\(?:\((?:[^()]|\([^)]+\))+\)|\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true,
        inside: {
          interpolation: {
            pattern: /\\\((?:[^()]|\([^)]+\))+\)/,
            inside: {
              delimiter: {
                pattern: /^\\\(|\)$/,
                alias: 'variable'
              }
              // See rest below
            }
          }
        }
      },
      keyword: /\b(?:as|associativity|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic(?:Type)?|else|enum|extension|fallthrough|final|for|func|get|guard|if|import|in|infix|init|inout|internal|is|lazy|left|let|mutating|new|none|nonmutating|operator|optional|override|postfix|precedence|prefix|private|Protocol|public|repeat|required|rethrows|return|right|safe|self|Self|set|static|struct|subscript|super|switch|throws?|try|Type|typealias|unowned|unsafe|var|weak|where|while|willSet|__(?:COLUMN__|FILE__|FUNCTION__|LINE__))\b/,
      number: /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
      constant: /\b(?:nil|[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
      atrule: /@\b(?:IB(?:Outlet|Designable|Action|Inspectable)|class_protocol|exported|noreturn|NS(?:Copying|Managed)|objc|UIApplicationMain|auto_closure)\b/,
      builtin: /\b(?:[A-Z]\S+|abs|advance|alignof(?:Value)?|assert|contains|count(?:Elements)?|debugPrint(?:ln)?|distance|drop(?:First|Last)|dump|enumerate|equal|filter|find|first|getVaList|indices|isEmpty|join|last|lexicographicalCompare|map|max(?:Element)?|min(?:Element)?|numericCast|overlaps|partition|print(?:ln)?|reduce|reflect|reverse|sizeof(?:Value)?|sort(?:ed)?|split|startsWith|stride(?:of(?:Value)?)?|suffix|swap|toDebugString|toString|transcode|underestimateCount|unsafeBitCast|with(?:ExtendedLifetime|Unsafe(?:MutablePointers?|Pointers?)|VaList))\b/
    });
    Prism.languages.swift.string.inside.interpolation.inside.rest = Prism.languages.swift;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/tcl.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/tcl.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'tcl',
  init: function init(Prism) {
    Prism.languages.tcl = {
      comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
      },
      string: {
        pattern: /"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*"/,
        greedy: true
      },
      variable: [{
        pattern: /(\$)(?:::)?(?:[a-zA-Z0-9]+::)*\w+/,
        lookbehind: true
      }, {
        pattern: /(\$){[^}]+}/,
        lookbehind: true
      }, {
        pattern: /(^\s*set[ \t]+)(?:::)?(?:[a-zA-Z0-9]+::)*\w+/m,
        lookbehind: true
      }],
      function: {
        pattern: /(^\s*proc[ \t]+)[^\s]+/m,
        lookbehind: true
      },
      builtin: [{
        pattern: /(^\s*)(?:proc|return|class|error|eval|exit|for|foreach|if|switch|while|break|continue)\b/m,
        lookbehind: true
      }, /\b(?:elseif|else)\b/],
      scope: {
        pattern: /(^\s*)(?:global|upvar|variable)\b/m,
        lookbehind: true,
        alias: 'constant'
      },
      keyword: {
        pattern: /(^\s*|\[)(?:after|append|apply|array|auto_(?:execok|import|load|mkindex|qualify|reset)|automkindex_old|bgerror|binary|catch|cd|chan|clock|close|concat|dde|dict|encoding|eof|exec|expr|fblocked|fconfigure|fcopy|file(?:event|name)?|flush|gets|glob|history|http|incr|info|interp|join|lappend|lassign|lindex|linsert|list|llength|load|lrange|lrepeat|lreplace|lreverse|lsearch|lset|lsort|math(?:func|op)|memory|msgcat|namespace|open|package|parray|pid|pkg_mkIndex|platform|puts|pwd|re_syntax|read|refchan|regexp|registry|regsub|rename|Safe_Base|scan|seek|set|socket|source|split|string|subst|Tcl|tcl(?:_endOfWord|_findLibrary|startOf(?:Next|Previous)Word|wordBreak(?:After|Before)|test|vars)|tell|time|tm|trace|unknown|unload|unset|update|uplevel|vwait)\b/m,
        lookbehind: true
      },
      operator: /!=?|\*\*?|==|&&?|\|\|?|<[=<]?|>[=>]?|[-+~\/%?^]|\b(?:eq|ne|in|ni)\b/,
      punctuation: /[{}()\[\]]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/textile.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/textile.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'textile',
  init: function init(Prism) {
    (function (Prism) {
      // We don't allow for pipes inside parentheses
      // to not break table pattern |(. foo |). bar |
      var modifierRegex = '(?:\\([^|)]+\\)|\\[[^\\]]+\\]|\\{[^}]+\\})+';
      var modifierTokens = {
        css: {
          pattern: /\{[^}]+\}/,
          inside: {
            rest: Prism.languages.css
          }
        },
        'class-id': {
          pattern: /(\()[^)]+(?=\))/,
          lookbehind: true,
          alias: 'attr-value'
        },
        lang: {
          pattern: /(\[)[^\]]+(?=\])/,
          lookbehind: true,
          alias: 'attr-value'
        },
        // Anything else is punctuation (the first pattern is for row/col spans inside tables)
        punctuation: /[\\\/]\d+|\S/
      };

      Prism.languages.textile = Prism.languages.extend('markup', {
        phrase: {
          pattern: /(^|\r|\n)\S[\s\S]*?(?=$|\r?\n\r?\n|\r\r)/,
          lookbehind: true,
          inside: {
            // h1. Header 1
            'block-tag': {
              pattern: RegExp('^[a-z]\\w*(?:' + modifierRegex + '|[<>=()])*\\.'),
              inside: {
                modifier: {
                  pattern: RegExp('(^[a-z]\\w*)(?:' + modifierRegex + '|[<>=()])+(?=\\.)'),
                  lookbehind: true,
                  inside: modifierTokens
                },
                tag: /^[a-z]\w*/,
                punctuation: /\.$/
              }
            },

            // # List item
            // * List item
            list: {
              pattern: RegExp('^[*#]+(?:' + modifierRegex + ')?\\s+.+', 'm'),
              inside: {
                modifier: {
                  pattern: RegExp('(^[*#]+)' + modifierRegex),
                  lookbehind: true,
                  inside: modifierTokens
                },
                punctuation: /^[*#]+/
              }
            },

            // | cell | cell | cell |
            table: {
              // Modifiers can be applied to the row: {color:red}.|1|2|3|
              // or the cell: |{color:red}.1|2|3|
              pattern: RegExp('^(?:(?:' + modifierRegex + '|[<>=()^~])+\\.\\s*)?(?:\\|(?:(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+\\.)?[^|]*)+\\|', 'm'),
              inside: {
                modifier: {
                  // Modifiers for rows after the first one are
                  // preceded by a pipe and a line feed
                  pattern: RegExp('(^|\\|(?:\\r?\\n|\\r)?)(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+(?=\\.)'),
                  lookbehind: true,
                  inside: modifierTokens
                },
                punctuation: /\||^\./
              }
            },

            inline: {
              pattern: RegExp('(\\*\\*|__|\\?\\?|[*_%@+\\-^~])(?:' + modifierRegex + ')?.+?\\1'),
              inside: {
                // Note: superscripts and subscripts are not handled specifically

                // *bold*, **bold**
                bold: {
                  pattern: RegExp('(^(\\*\\*?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
                  lookbehind: true
                },

                // _italic_, __italic__
                italic: {
                  pattern: RegExp('(^(__?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
                  lookbehind: true
                },

                // ??cite??
                cite: {
                  pattern: RegExp('(^\\?\\?(?:' + modifierRegex + ')?).+?(?=\\?\\?)'),
                  lookbehind: true,
                  alias: 'string'
                },

                // @code@
                code: {
                  pattern: RegExp('(^@(?:' + modifierRegex + ')?).+?(?=@)'),
                  lookbehind: true,
                  alias: 'keyword'
                },

                // +inserted+
                inserted: {
                  pattern: RegExp('(^\\+(?:' + modifierRegex + ')?).+?(?=\\+)'),
                  lookbehind: true
                },

                // -deleted-
                deleted: {
                  pattern: RegExp('(^-(?:' + modifierRegex + ')?).+?(?=-)'),
                  lookbehind: true
                },

                // %span%
                span: {
                  pattern: RegExp('(^%(?:' + modifierRegex + ')?).+?(?=%)'),
                  lookbehind: true
                },

                modifier: {
                  pattern: RegExp('(^\\*\\*|__|\\?\\?|[*_%@+\\-^~])' + modifierRegex),
                  lookbehind: true,
                  inside: modifierTokens
                },
                punctuation: /[*_%?@+\-^~]+/
              }
            },

            // [alias]http://example.com
            'link-ref': {
              pattern: /^\[[^\]]+\]\S+$/m,
              inside: {
                string: {
                  pattern: /(\[)[^\]]+(?=\])/,
                  lookbehind: true
                },
                url: {
                  pattern: /(\])\S+$/,
                  lookbehind: true
                },
                punctuation: /[\[\]]/
              }
            },

            // "text":http://example.com
            // "text":link-ref
            link: {
              pattern: RegExp('"(?:' + modifierRegex + ')?[^"]+":.+?(?=[^\\w/]?(?:\\s|$))'),
              inside: {
                text: {
                  pattern: RegExp('(^"(?:' + modifierRegex + ')?)[^"]+(?=")'),
                  lookbehind: true
                },
                modifier: {
                  pattern: RegExp('(^")' + modifierRegex),
                  lookbehind: true,
                  inside: modifierTokens
                },
                url: {
                  pattern: /(:).+/,
                  lookbehind: true
                },
                punctuation: /[":]/
              }
            },

            // !image.jpg!
            // !image.jpg(Title)!:http://example.com
            image: {
              pattern: RegExp('!(?:' + modifierRegex + '|[<>=()])*[^!\\s()]+(?:\\([^)]+\\))?!(?::.+?(?=[^\\w/]?(?:\\s|$)))?'),
              inside: {
                source: {
                  pattern: RegExp('(^!(?:' + modifierRegex + '|[<>=()])*)[^!\\s()]+(?:\\([^)]+\\))?(?=!)'),
                  lookbehind: true,
                  alias: 'url'
                },
                modifier: {
                  pattern: RegExp('(^!)(?:' + modifierRegex + '|[<>=()])+'),
                  lookbehind: true,
                  inside: modifierTokens
                },
                url: {
                  pattern: /(:).+/,
                  lookbehind: true
                },
                punctuation: /[!:]/
              }
            },

            // Footnote[1]
            footnote: {
              pattern: /\b\[\d+\]/,
              alias: 'comment',
              inside: {
                punctuation: /\[|\]/
              }
            },

            // CSS(Cascading Style Sheet)
            acronym: {
              pattern: /\b[A-Z\d]+\([^)]+\)/,
              inside: {
                comment: {
                  pattern: /(\()[^)]+(?=\))/,
                  lookbehind: true
                },
                punctuation: /[()]/
              }
            },

            // Prism(C)
            mark: {
              pattern: /\b\((?:TM|R|C)\)/,
              alias: 'comment',
              inside: {
                punctuation: /[()]/
              }
            }
          }
        }
      });

      var nestedPatterns = {
        inline: Prism.languages.textile.phrase.inside.inline,
        link: Prism.languages.textile.phrase.inside.link,
        image: Prism.languages.textile.phrase.inside.image,
        footnote: Prism.languages.textile.phrase.inside.footnote,
        acronym: Prism.languages.textile.phrase.inside.acronym,
        mark: Prism.languages.textile.phrase.inside.mark

        // Only allow alpha-numeric HTML tags, not XML tags
      };Prism.languages.textile.tag.pattern = /<\/?(?!\d)[a-z0-9]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i;

      // Allow some nesting
      Prism.languages.textile.phrase.inside.inline.inside.bold.inside = nestedPatterns;
      Prism.languages.textile.phrase.inside.inline.inside.italic.inside = nestedPatterns;
      Prism.languages.textile.phrase.inside.inline.inside.inserted.inside = nestedPatterns;
      Prism.languages.textile.phrase.inside.inline.inside.deleted.inside = nestedPatterns;
      Prism.languages.textile.phrase.inside.inline.inside.span.inside = nestedPatterns;

      // Allow some styles inside table cells
      Prism.languages.textile.phrase.inside.table.inside.inline = nestedPatterns.inline;
      Prism.languages.textile.phrase.inside.table.inside.link = nestedPatterns.link;
      Prism.languages.textile.phrase.inside.table.inside.image = nestedPatterns.image;
      Prism.languages.textile.phrase.inside.table.inside.footnote = nestedPatterns.footnote;
      Prism.languages.textile.phrase.inside.table.inside.acronym = nestedPatterns.acronym;
      Prism.languages.textile.phrase.inside.table.inside.mark = nestedPatterns.mark;
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/tsx.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/tsx.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'tsx',
  init: function init(Prism) {
    var typescript = Prism.util.clone(Prism.languages.typescript);
    Prism.languages.tsx = Prism.languages.extend('jsx', typescript);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/twig.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/twig.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'twig',
  init: function init(Prism) {
    Prism.languages.twig = {
      comment: /\{#[\s\S]*?#\}/,
      tag: {
        pattern: /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/,
        inside: {
          ld: {
            pattern: /^(?:\{\{-?|\{%-?\s*\w+)/,
            inside: {
              punctuation: /^(?:\{\{|\{%)-?/,
              keyword: /\w+/
            }
          },
          rd: {
            pattern: /-?(?:%\}|\}\})$/,
            inside: {
              punctuation: /.*/
            }
          },
          string: {
            pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
            inside: {
              punctuation: /^['"]|['"]$/
            }
          },
          keyword: /\b(?:even|if|odd)\b/,
          boolean: /\b(?:true|false|null)\b/,
          number: /\b0x[\dA-Fa-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][-+]?\d+)?/,
          operator: [{
            pattern: /(\s)(?:and|b-and|b-xor|b-or|ends with|in|is|matches|not|or|same as|starts with)(?=\s)/,
            lookbehind: true
          }, /[=<>]=?|!=|\*\*?|\/\/?|\?:?|[-+~%|]/],
          property: /\b[a-zA-Z_]\w*\b/,
          punctuation: /[()\[\]{}:.,]/
        }
      },

      // The rest can be parsed as HTML
      other: {
        // We want non-blank matches
        pattern: /\S(?:[\s\S]*\S)?/,
        inside: Prism.languages.markup
      }
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/typescript.js":
/*!******************************************************!*\
  !*** ./node_modules/reprism/languages/typescript.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'typescript',
  init: function init(Prism) {
    Prism.languages.typescript = Prism.languages.extend('javascript', {
      // From JavaScript Prism keyword list and TypeScript language spec: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#221-reserved-words
      keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|module|declare|constructor|namespace|abstract|require|type)\b/,
      builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console)\b/
    });

    Prism.languages.ts = Prism.languages.typescript;
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/vbnet.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/vbnet.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'vbnet',
  init: function init(Prism) {
    Prism.languages.vbnet = Prism.languages.extend('basic', {
      keyword: /(?:\b(?:ADDHANDLER|ADDRESSOF|ALIAS|AND|ANDALSO|AS|BEEP|BLOAD|BOOLEAN|BSAVE|BYREF|BYTE|BYVAL|CALL(?: ABSOLUTE)?|CASE|CATCH|CBOOL|CBYTE|CCHAR|CDATE|CDEC|CDBL|CHAIN|CHAR|CHDIR|CINT|CLASS|CLEAR|CLNG|CLOSE|CLS|COBJ|COM|COMMON|CONST|CONTINUE|CSBYTE|CSHORT|CSNG|CSTR|CTYPE|CUINT|CULNG|CUSHORT|DATA|DATE|DECIMAL|DECLARE|DEFAULT|DEF(?: FN| SEG|DBL|INT|LNG|SNG|STR)|DELEGATE|DIM|DIRECTCAST|DO|DOUBLE|ELSE|ELSEIF|END|ENUM|ENVIRON|ERASE|ERROR|EVENT|EXIT|FALSE|FIELD|FILES|FINALLY|FOR(?: EACH)?|FRIEND|FUNCTION|GET|GETTYPE|GETXMLNAMESPACE|GLOBAL|GOSUB|GOTO|HANDLES|IF|IMPLEMENTS|IMPORTS|IN|INHERITS|INPUT|INTEGER|INTERFACE|IOCTL|IS|ISNOT|KEY|KILL|LINE INPUT|LET|LIB|LIKE|LOCATE|LOCK|LONG|LOOP|LSET|ME|MKDIR|MOD|MODULE|MUSTINHERIT|MUSTOVERRIDE|MYBASE|MYCLASS|NAME|NAMESPACE|NARROWING|NEW|NEXT|NOT|NOTHING|NOTINHERITABLE|NOTOVERRIDABLE|OBJECT|OF|OFF|ON(?: COM| ERROR| KEY| TIMER)?|OPERATOR|OPEN|OPTION(?: BASE)?|OPTIONAL|OR|ORELSE|OUT|OVERLOADS|OVERRIDABLE|OVERRIDES|PARAMARRAY|PARTIAL|POKE|PRIVATE|PROPERTY|PROTECTED|PUBLIC|PUT|RAISEEVENT|READ|READONLY|REDIM|REM|REMOVEHANDLER|RESTORE|RESUME|RETURN|RMDIR|RSET|RUN|SBYTE|SELECT(?: CASE)?|SET|SHADOWS|SHARED|SHORT|SINGLE|SHELL|SLEEP|STATIC|STEP|STOP|STRING|STRUCTURE|SUB|SYNCLOCK|SWAP|SYSTEM|THEN|THROW|TIMER|TO|TROFF|TRON|TRUE|TRY|TRYCAST|TYPE|TYPEOF|UINTEGER|ULONG|UNLOCK|UNTIL|USHORT|USING|VIEW PRINT|WAIT|WEND|WHEN|WHILE|WIDENING|WITH|WITHEVENTS|WRITE|WRITEONLY|XOR)|\B(?:#CONST|#ELSE|#ELSEIF|#END|#IF))(?:\$|\b)/i,
      comment: [{
        pattern: /(?:!|REM\b).+/i,
        inside: {
          keyword: /^REM/i
        }
      }, {
        pattern: /(^|[^\\:])'.*/,
        lookbehind: true
      }]
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/velocity.js":
/*!****************************************************!*\
  !*** ./node_modules/reprism/languages/velocity.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'velocity',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.velocity = Prism.languages.extend('markup', {});

      var velocity = {
        variable: {
          pattern: /(^|[^\\](?:\\\\)*)\$!?(?:[a-z][\w-]*(?:\([^)]*\))?(?:\.[a-z][\w-]*(?:\([^)]*\))?|\[[^\]]+])*|{[^}]+})/i,
          lookbehind: true,
          inside: {} // See below
        },
        string: {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: true
        },
        number: /\b\d+\b/,
        boolean: /\b(?:true|false)\b/,
        operator: /[=!<>]=?|[+*/%-]|&&|\|\||\.\.|\b(?:eq|g[et]|l[et]|n(?:e|ot))\b/,
        punctuation: /[(){}[\]:,.]/
      };

      velocity.variable.inside = {
        string: velocity.string,
        function: {
          pattern: /([^\w-])[a-z][\w-]*(?=\()/,
          lookbehind: true
        },
        number: velocity.number,
        boolean: velocity.boolean,
        punctuation: velocity.punctuation
      };

      Prism.languages.insertBefore('velocity', 'comment', {
        unparsed: {
          pattern: /(^|[^\\])#\[\[[\s\S]*?]]#/,
          lookbehind: true,
          greedy: true,
          inside: {
            punctuation: /^#\[\[|]]#$/
          }
        },
        'velocity-comment': [{
          pattern: /(^|[^\\])#\*[\s\S]*?\*#/,
          lookbehind: true,
          greedy: true,
          alias: 'comment'
        }, {
          pattern: /(^|[^\\])##.*/,
          lookbehind: true,
          greedy: true,
          alias: 'comment'
        }],
        directive: {
          pattern: /(^|[^\\](?:\\\\)*)#@?(?:[a-z][\w-]*|{[a-z][\w-]*})(?:\s*\((?:[^()]|\([^()]*\))*\))?/i,
          lookbehind: true,
          inside: {
            keyword: {
              pattern: /^#@?(?:[a-z][\w-]*|{[a-z][\w-]*})|\bin\b/,
              inside: {
                punctuation: /[{}]/
              }
            },
            rest: velocity
          }
        },
        variable: velocity.variable
      });

      Prism.languages.velocity.tag.inside['attr-value'].inside.rest = Prism.languages.velocity;
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/verilog.js":
/*!***************************************************!*\
  !*** ./node_modules/reprism/languages/verilog.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'verilog',
  init: function init(Prism) {
    Prism.languages.verilog = {
      comment: /\/\/.*|\/\*[\s\S]*?\*\//,
      string: {
        pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
        greedy: true
      },
      // support for any kernel function (ex: $display())
      property: /\B\$\w+\b/,
      // support for user defined constants (ex: `define)
      constant: /\B`\w+\b/,
      function: /\w+(?=\()/,
      // support for verilog and system verilog keywords
      keyword: /\b(?:alias|and|assert|assign|assume|automatic|before|begin|bind|bins|binsof|bit|break|buf|bufif0|bufif1|byte|class|case|casex|casez|cell|chandle|clocking|cmos|config|const|constraint|context|continue|cover|covergroup|coverpoint|cross|deassign|default|defparam|design|disable|dist|do|edge|else|end|endcase|endclass|endclocking|endconfig|endfunction|endgenerate|endgroup|endinterface|endmodule|endpackage|endprimitive|endprogram|endproperty|endspecify|endsequence|endtable|endtask|enum|event|expect|export|extends|extern|final|first_match|for|force|foreach|forever|fork|forkjoin|function|generate|genvar|highz0|highz1|if|iff|ifnone|ignore_bins|illegal_bins|import|incdir|include|initial|inout|input|inside|instance|int|integer|interface|intersect|join|join_any|join_none|large|liblist|library|local|localparam|logic|longint|macromodule|matches|medium|modport|module|nand|negedge|new|nmos|nor|noshowcancelled|not|notif0|notif1|null|or|output|package|packed|parameter|pmos|posedge|primitive|priority|program|property|protected|pull0|pull1|pulldown|pullup|pulsestyle_onevent|pulsestyle_ondetect|pure|rand|randc|randcase|randsequence|rcmos|real|realtime|ref|reg|release|repeat|return|rnmos|rpmos|rtran|rtranif0|rtranif1|scalared|sequence|shortint|shortreal|showcancelled|signed|small|solve|specify|specparam|static|string|strong0|strong1|struct|super|supply0|supply1|table|tagged|task|this|throughout|time|timeprecision|timeunit|tran|tranif0|tranif1|tri|tri0|tri1|triand|trior|trireg|type|typedef|union|unique|unsigned|use|uwire|var|vectored|virtual|void|wait|wait_order|wand|weak0|weak1|while|wildcard|wire|with|within|wor|xnor|xor)\b/,
      // bold highlighting for all verilog and system verilog logic blocks
      important: /\b(?:always_latch|always_comb|always_ff|always)\b ?@?/,
      // support for time ticks, vectors, and real numbers
      number: /\B##?\d+|(?:\b\d+)?'[odbh] ?[\da-fzx_?]+|\b\d*[._]?\d+(?:e[-+]?\d+)?/i,
      operator: /[-+{}^~%*\/?=!<>&|]+/,
      punctuation: /[[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/vhdl.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/vhdl.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'vhdl',
  init: function init(Prism) {
    Prism.languages.vhdl = {
      comment: /--.+/,
      // support for all logic vectors
      'vhdl-vectors': {
        pattern: /\b[oxb]"[\da-f_]+"|"[01uxzwlh-]+"/i,
        alias: 'number'
      },
      // support for operator overloading included
      'quoted-function': {
        pattern: /"\S+?"(?=\()/,
        alias: 'function'
      },
      string: /"(?:[^\\"\r\n]|\\(?:\r\n|[\s\S]))*"/,
      constant: /\b(?:use|library)\b/i,
      // support for predefined attributes included
      keyword: /\b(?:'active|'ascending|'base|'delayed|'driving|'driving_value|'event|'high|'image|'instance_name|'last_active|'last_event|'last_value|'left|'leftof|'length|'low|'path_name|'pos|'pred|'quiet|'range|'reverse_range|'right|'rightof|'simple_name|'stable|'succ|'transaction|'val|'value|access|after|alias|all|architecture|array|assert|attribute|begin|block|body|buffer|bus|case|component|configuration|constant|disconnect|downto|else|elsif|end|entity|exit|file|for|function|generate|generic|group|guarded|if|impure|in|inertial|inout|is|label|library|linkage|literal|loop|map|new|next|null|of|on|open|others|out|package|port|postponed|procedure|process|pure|range|record|register|reject|report|return|select|severity|shared|signal|subtype|then|to|transport|type|unaffected|units|until|use|variable|wait|when|while|with)\b/i,
      boolean: /\b(?:true|false)\b/i,
      function: /\w+(?=\()/,
      // decimal, based, physical, and exponential numbers supported
      number: /'[01uxzwlh-]'|\b(?:\d+#[\da-f_.]+#|\d[\d_.]*)(?:e[-+]?\d+)?/i,
      operator: /[<>]=?|:=|[-+*/&=]|\b(?:abs|not|mod|rem|sll|srl|sla|sra|rol|ror|and|or|nand|xnor|xor|nor)\b/i,
      punctuation: /[{}[\];(),.:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/vim.js":
/*!***********************************************!*\
  !*** ./node_modules/reprism/languages/vim.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'vim',
  init: function init(Prism) {
    Prism.languages.vim = {
      string: /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\r\n]|'')*'/,
      comment: /".*/,
      function: /\w+(?=\()/,
      keyword: /\b(?:ab|abbreviate|abc|abclear|abo|aboveleft|al|all|arga|argadd|argd|argdelete|argdo|arge|argedit|argg|argglobal|argl|arglocal|ar|args|argu|argument|as|ascii|bad|badd|ba|ball|bd|bdelete|be|bel|belowright|bf|bfirst|bl|blast|bm|bmodified|bn|bnext|bN|bNext|bo|botright|bp|bprevious|brea|break|breaka|breakadd|breakd|breakdel|breakl|breaklist|br|brewind|bro|browse|bufdo|b|buffer|buffers|bun|bunload|bw|bwipeout|ca|cabbrev|cabc|cabclear|caddb|caddbuffer|cad|caddexpr|caddf|caddfile|cal|call|cat|catch|cb|cbuffer|cc|ccl|cclose|cd|ce|center|cex|cexpr|cf|cfile|cfir|cfirst|cgetb|cgetbuffer|cgete|cgetexpr|cg|cgetfile|c|change|changes|chd|chdir|che|checkpath|checkt|checktime|cla|clast|cl|clist|clo|close|cmapc|cmapclear|cnew|cnewer|cn|cnext|cN|cNext|cnf|cnfile|cNfcNfile|cnorea|cnoreabbrev|col|colder|colo|colorscheme|comc|comclear|comp|compiler|conf|confirm|con|continue|cope|copen|co|copy|cpf|cpfile|cp|cprevious|cq|cquit|cr|crewind|cuna|cunabbrev|cu|cunmap|cw|cwindow|debugg|debuggreedy|delc|delcommand|d|delete|delf|delfunction|delm|delmarks|diffg|diffget|diffoff|diffpatch|diffpu|diffput|diffsplit|diffthis|diffu|diffupdate|dig|digraphs|di|display|dj|djump|dl|dlist|dr|drop|ds|dsearch|dsp|dsplit|earlier|echoe|echoerr|echom|echomsg|echon|e|edit|el|else|elsei|elseif|em|emenu|endfo|endfor|endf|endfunction|endfun|en|endif|endt|endtry|endw|endwhile|ene|enew|ex|exi|exit|exu|exusage|f|file|files|filetype|fina|finally|fin|find|fini|finish|fir|first|fix|fixdel|fo|fold|foldc|foldclose|folddoc|folddoclosed|foldd|folddoopen|foldo|foldopen|for|fu|fun|function|go|goto|gr|grep|grepa|grepadd|ha|hardcopy|h|help|helpf|helpfind|helpg|helpgrep|helpt|helptags|hid|hide|his|history|ia|iabbrev|iabc|iabclear|if|ij|ijump|il|ilist|imapc|imapclear|in|inorea|inoreabbrev|isearch|isp|isplit|iuna|iunabbrev|iu|iunmap|j|join|ju|jumps|k|keepalt|keepj|keepjumps|kee|keepmarks|laddb|laddbuffer|lad|laddexpr|laddf|laddfile|lan|language|la|last|later|lb|lbuffer|lc|lcd|lch|lchdir|lcl|lclose|let|left|lefta|leftabove|lex|lexpr|lf|lfile|lfir|lfirst|lgetb|lgetbuffer|lgete|lgetexpr|lg|lgetfile|lgr|lgrep|lgrepa|lgrepadd|lh|lhelpgrep|l|list|ll|lla|llast|lli|llist|lmak|lmake|lm|lmap|lmapc|lmapclear|lnew|lnewer|lne|lnext|lN|lNext|lnf|lnfile|lNf|lNfile|ln|lnoremap|lo|loadview|loc|lockmarks|lockv|lockvar|lol|lolder|lop|lopen|lpf|lpfile|lp|lprevious|lr|lrewind|ls|lt|ltag|lu|lunmap|lv|lvimgrep|lvimgrepa|lvimgrepadd|lw|lwindow|mak|make|ma|mark|marks|mat|match|menut|menutranslate|mk|mkexrc|mks|mksession|mksp|mkspell|mkvie|mkview|mkv|mkvimrc|mod|mode|m|move|mzf|mzfile|mz|mzscheme|nbkey|new|n|next|N|Next|nmapc|nmapclear|noh|nohlsearch|norea|noreabbrev|nu|number|nun|nunmap|omapc|omapclear|on|only|o|open|opt|options|ou|ounmap|pc|pclose|ped|pedit|pe|perl|perld|perldo|po|pop|popu|popup|pp|ppop|pre|preserve|prev|previous|p|print|P|Print|profd|profdel|prof|profile|promptf|promptfind|promptr|promptrepl|ps|psearch|pta|ptag|ptf|ptfirst|ptj|ptjump|ptl|ptlast|ptn|ptnext|ptN|ptNext|ptp|ptprevious|ptr|ptrewind|pts|ptselect|pu|put|pw|pwd|pyf|pyfile|py|python|qa|qall|q|quit|quita|quitall|r|read|rec|recover|redi|redir|red|redo|redr|redraw|redraws|redrawstatus|reg|registers|res|resize|ret|retab|retu|return|rew|rewind|ri|right|rightb|rightbelow|rub|ruby|rubyd|rubydo|rubyf|rubyfile|ru|runtime|rv|rviminfo|sal|sall|san|sandbox|sa|sargument|sav|saveas|sba|sball|sbf|sbfirst|sbl|sblast|sbm|sbmodified|sbn|sbnext|sbN|sbNext|sbp|sbprevious|sbr|sbrewind|sb|sbuffer|scripte|scriptencoding|scrip|scriptnames|se|set|setf|setfiletype|setg|setglobal|setl|setlocal|sf|sfind|sfir|sfirst|sh|shell|sign|sil|silent|sim|simalt|sla|slast|sl|sleep|sm|smagic|sm|smap|smapc|smapclear|sme|smenu|sn|snext|sN|sNext|sni|sniff|sno|snomagic|snor|snoremap|snoreme|snoremenu|sor|sort|so|source|spelld|spelldump|spe|spellgood|spelli|spellinfo|spellr|spellrepall|spellu|spellundo|spellw|spellwrong|sp|split|spr|sprevious|sre|srewind|sta|stag|startg|startgreplace|star|startinsert|startr|startreplace|stj|stjump|st|stop|stopi|stopinsert|sts|stselect|sun|sunhide|sunm|sunmap|sus|suspend|sv|sview|syncbind|t|tab|tabc|tabclose|tabd|tabdo|tabe|tabedit|tabf|tabfind|tabfir|tabfirst|tabl|tablast|tabm|tabmove|tabnew|tabn|tabnext|tabN|tabNext|tabo|tabonly|tabp|tabprevious|tabr|tabrewind|tabs|ta|tag|tags|tc|tcl|tcld|tcldo|tclf|tclfile|te|tearoff|tf|tfirst|th|throw|tj|tjump|tl|tlast|tm|tm|tmenu|tn|tnext|tN|tNext|to|topleft|tp|tprevious|tr|trewind|try|ts|tselect|tu|tu|tunmenu|una|unabbreviate|u|undo|undoj|undojoin|undol|undolist|unh|unhide|unlet|unlo|unlockvar|unm|unmap|up|update|verb|verbose|ve|version|vert|vertical|vie|view|vim|vimgrep|vimgrepa|vimgrepadd|vi|visual|viu|viusage|vmapc|vmapclear|vne|vnew|vs|vsplit|vu|vunmap|wa|wall|wh|while|winc|wincmd|windo|winp|winpos|win|winsize|wn|wnext|wN|wNext|wp|wprevious|wq|wqa|wqall|w|write|ws|wsverb|wv|wviminfo|X|xa|xall|x|xit|xm|xmap|xmapc|xmapclear|xme|xmenu|XMLent|XMLns|xn|xnoremap|xnoreme|xnoremenu|xu|xunmap|y|yank)\b/,
      builtin: /\b(?:autocmd|acd|ai|akm|aleph|allowrevins|altkeymap|ambiwidth|ambw|anti|antialias|arab|arabic|arabicshape|ari|arshape|autochdir|autoindent|autoread|autowrite|autowriteall|aw|awa|background|backspace|backup|backupcopy|backupdir|backupext|backupskip|balloondelay|ballooneval|balloonexpr|bdir|bdlay|beval|bex|bexpr|bg|bh|bin|binary|biosk|bioskey|bk|bkc|bomb|breakat|brk|browsedir|bs|bsdir|bsk|bt|bufhidden|buflisted|buftype|casemap|ccv|cdpath|cedit|cfu|ch|charconvert|ci|cin|cindent|cink|cinkeys|cino|cinoptions|cinw|cinwords|clipboard|cmdheight|cmdwinheight|cmp|cms|columns|com|comments|commentstring|compatible|complete|completefunc|completeopt|consk|conskey|copyindent|cot|cpo|cpoptions|cpt|cscopepathcomp|cscopeprg|cscopequickfix|cscopetag|cscopetagorder|cscopeverbose|cspc|csprg|csqf|cst|csto|csverb|cuc|cul|cursorcolumn|cursorline|cwh|debug|deco|def|define|delcombine|dex|dg|dict|dictionary|diff|diffexpr|diffopt|digraph|dip|dir|directory|dy|ea|ead|eadirection|eb|ed|edcompatible|ef|efm|ei|ek|enc|encoding|endofline|eol|ep|equalalways|equalprg|errorbells|errorfile|errorformat|esckeys|et|eventignore|expandtab|exrc|fcl|fcs|fdc|fde|fdi|fdl|fdls|fdm|fdn|fdo|fdt|fen|fenc|fencs|fex|ff|ffs|fileencoding|fileencodings|fileformat|fileformats|fillchars|fk|fkmap|flp|fml|fmr|foldcolumn|foldenable|foldexpr|foldignore|foldlevel|foldlevelstart|foldmarker|foldmethod|foldminlines|foldnestmax|foldtext|formatexpr|formatlistpat|formatoptions|formatprg|fp|fs|fsync|ft|gcr|gd|gdefault|gfm|gfn|gfs|gfw|ghr|gp|grepformat|grepprg|gtl|gtt|guicursor|guifont|guifontset|guifontwide|guiheadroom|guioptions|guipty|guitablabel|guitabtooltip|helpfile|helpheight|helplang|hf|hh|hi|hidden|highlight|hk|hkmap|hkmapp|hkp|hl|hlg|hls|hlsearch|ic|icon|iconstring|ignorecase|im|imactivatekey|imak|imc|imcmdline|imd|imdisable|imi|iminsert|ims|imsearch|inc|include|includeexpr|incsearch|inde|indentexpr|indentkeys|indk|inex|inf|infercase|insertmode|isf|isfname|isi|isident|isk|iskeyword|isprint|joinspaces|js|key|keymap|keymodel|keywordprg|km|kmp|kp|langmap|langmenu|laststatus|lazyredraw|lbr|lcs|linebreak|lines|linespace|lisp|lispwords|listchars|loadplugins|lpl|lsp|lz|macatsui|magic|makeef|makeprg|matchpairs|matchtime|maxcombine|maxfuncdepth|maxmapdepth|maxmem|maxmempattern|maxmemtot|mco|mef|menuitems|mfd|mh|mis|mkspellmem|ml|mls|mm|mmd|mmp|mmt|modeline|modelines|modifiable|modified|more|mouse|mousef|mousefocus|mousehide|mousem|mousemodel|mouses|mouseshape|mouset|mousetime|mp|mps|msm|mzq|mzquantum|nf|nrformats|numberwidth|nuw|odev|oft|ofu|omnifunc|opendevice|operatorfunc|opfunc|osfiletype|pa|para|paragraphs|paste|pastetoggle|patchexpr|patchmode|path|pdev|penc|pex|pexpr|pfn|ph|pheader|pi|pm|pmbcs|pmbfn|popt|preserveindent|previewheight|previewwindow|printdevice|printencoding|printexpr|printfont|printheader|printmbcharset|printmbfont|printoptions|prompt|pt|pumheight|pvh|pvw|qe|quoteescape|readonly|remap|report|restorescreen|revins|rightleft|rightleftcmd|rl|rlc|ro|rs|rtp|ruf|ruler|rulerformat|runtimepath|sbo|sc|scb|scr|scroll|scrollbind|scrolljump|scrolloff|scrollopt|scs|sect|sections|secure|sel|selection|selectmode|sessionoptions|sft|shcf|shellcmdflag|shellpipe|shellquote|shellredir|shellslash|shelltemp|shelltype|shellxquote|shiftround|shiftwidth|shm|shortmess|shortname|showbreak|showcmd|showfulltag|showmatch|showmode|showtabline|shq|si|sidescroll|sidescrolloff|siso|sj|slm|smartcase|smartindent|smarttab|smc|smd|softtabstop|sol|spc|spell|spellcapcheck|spellfile|spelllang|spellsuggest|spf|spl|splitbelow|splitright|sps|sr|srr|ss|ssl|ssop|stal|startofline|statusline|stl|stmp|su|sua|suffixes|suffixesadd|sw|swapfile|swapsync|swb|swf|switchbuf|sws|sxq|syn|synmaxcol|syntax|tabline|tabpagemax|tabstop|tagbsearch|taglength|tagrelative|tagstack|tal|tb|tbi|tbidi|tbis|tbs|tenc|term|termbidi|termencoding|terse|textauto|textmode|textwidth|tgst|thesaurus|tildeop|timeout|timeoutlen|title|titlelen|titleold|titlestring|toolbar|toolbariconsize|top|tpm|tsl|tsr|ttimeout|ttimeoutlen|ttm|tty|ttybuiltin|ttyfast|ttym|ttymouse|ttyscroll|ttytype|tw|tx|uc|ul|undolevels|updatecount|updatetime|ut|vb|vbs|vdir|verbosefile|vfile|viewdir|viewoptions|viminfo|virtualedit|visualbell|vop|wak|warn|wb|wc|wcm|wd|weirdinvert|wfh|wfw|whichwrap|wi|wig|wildchar|wildcharm|wildignore|wildmenu|wildmode|wildoptions|wim|winaltkeys|window|winfixheight|winfixwidth|winheight|winminheight|winminwidth|winwidth|wiv|wiw|wm|wmh|wmnu|wmw|wop|wrap|wrapmargin|wrapscan|writeany|writebackup|writedelay|ww|noacd|noai|noakm|noallowrevins|noaltkeymap|noanti|noantialias|noar|noarab|noarabic|noarabicshape|noari|noarshape|noautochdir|noautoindent|noautoread|noautowrite|noautowriteall|noaw|noawa|nobackup|noballooneval|nobeval|nobin|nobinary|nobiosk|nobioskey|nobk|nobl|nobomb|nobuflisted|nocf|noci|nocin|nocindent|nocompatible|noconfirm|noconsk|noconskey|nocopyindent|nocp|nocscopetag|nocscopeverbose|nocst|nocsverb|nocuc|nocul|nocursorcolumn|nocursorline|nodeco|nodelcombine|nodg|nodiff|nodigraph|nodisable|noea|noeb|noed|noedcompatible|noek|noendofline|noeol|noequalalways|noerrorbells|noesckeys|noet|noex|noexpandtab|noexrc|nofen|nofk|nofkmap|nofoldenable|nogd|nogdefault|noguipty|nohid|nohidden|nohk|nohkmap|nohkmapp|nohkp|nohls|noic|noicon|noignorecase|noim|noimc|noimcmdline|noimd|noincsearch|noinf|noinfercase|noinsertmode|nois|nojoinspaces|nojs|nolazyredraw|nolbr|nolinebreak|nolisp|nolist|noloadplugins|nolpl|nolz|noma|nomacatsui|nomagic|nomh|noml|nomod|nomodeline|nomodifiable|nomodified|nomore|nomousef|nomousefocus|nomousehide|nonu|nonumber|noodev|noopendevice|nopaste|nopi|nopreserveindent|nopreviewwindow|noprompt|nopvw|noreadonly|noremap|norestorescreen|norevins|nori|norightleft|norightleftcmd|norl|norlc|noro|nors|noru|noruler|nosb|nosc|noscb|noscrollbind|noscs|nosecure|nosft|noshellslash|noshelltemp|noshiftround|noshortname|noshowcmd|noshowfulltag|noshowmatch|noshowmode|nosi|nosm|nosmartcase|nosmartindent|nosmarttab|nosmd|nosn|nosol|nospell|nosplitbelow|nosplitright|nospr|nosr|nossl|nosta|nostartofline|nostmp|noswapfile|noswf|nota|notagbsearch|notagrelative|notagstack|notbi|notbidi|notbs|notermbidi|noterse|notextauto|notextmode|notf|notgst|notildeop|notimeout|notitle|noto|notop|notr|nottimeout|nottybuiltin|nottyfast|notx|novb|novisualbell|nowa|nowarn|nowb|noweirdinvert|nowfh|nowfw|nowildmenu|nowinfixheight|nowinfixwidth|nowiv|nowmnu|nowrap|nowrapscan|nowrite|nowriteany|nowritebackup|nows|invacd|invai|invakm|invallowrevins|invaltkeymap|invanti|invantialias|invar|invarab|invarabic|invarabicshape|invari|invarshape|invautochdir|invautoindent|invautoread|invautowrite|invautowriteall|invaw|invawa|invbackup|invballooneval|invbeval|invbin|invbinary|invbiosk|invbioskey|invbk|invbl|invbomb|invbuflisted|invcf|invci|invcin|invcindent|invcompatible|invconfirm|invconsk|invconskey|invcopyindent|invcp|invcscopetag|invcscopeverbose|invcst|invcsverb|invcuc|invcul|invcursorcolumn|invcursorline|invdeco|invdelcombine|invdg|invdiff|invdigraph|invdisable|invea|inveb|inved|invedcompatible|invek|invendofline|inveol|invequalalways|inverrorbells|invesckeys|invet|invex|invexpandtab|invexrc|invfen|invfk|invfkmap|invfoldenable|invgd|invgdefault|invguipty|invhid|invhidden|invhk|invhkmap|invhkmapp|invhkp|invhls|invhlsearch|invic|invicon|invignorecase|invim|invimc|invimcmdline|invimd|invincsearch|invinf|invinfercase|invinsertmode|invis|invjoinspaces|invjs|invlazyredraw|invlbr|invlinebreak|invlisp|invlist|invloadplugins|invlpl|invlz|invma|invmacatsui|invmagic|invmh|invml|invmod|invmodeline|invmodifiable|invmodified|invmore|invmousef|invmousefocus|invmousehide|invnu|invnumber|invodev|invopendevice|invpaste|invpi|invpreserveindent|invpreviewwindow|invprompt|invpvw|invreadonly|invremap|invrestorescreen|invrevins|invri|invrightleft|invrightleftcmd|invrl|invrlc|invro|invrs|invru|invruler|invsb|invsc|invscb|invscrollbind|invscs|invsecure|invsft|invshellslash|invshelltemp|invshiftround|invshortname|invshowcmd|invshowfulltag|invshowmatch|invshowmode|invsi|invsm|invsmartcase|invsmartindent|invsmarttab|invsmd|invsn|invsol|invspell|invsplitbelow|invsplitright|invspr|invsr|invssl|invsta|invstartofline|invstmp|invswapfile|invswf|invta|invtagbsearch|invtagrelative|invtagstack|invtbi|invtbidi|invtbs|invtermbidi|invterse|invtextauto|invtextmode|invtf|invtgst|invtildeop|invtimeout|invtitle|invto|invtop|invtr|invttimeout|invttybuiltin|invttyfast|invtx|invvb|invvisualbell|invwa|invwarn|invwb|invweirdinvert|invwfh|invwfw|invwildmenu|invwinfixheight|invwinfixwidth|invwiv|invwmnu|invwrap|invwrapscan|invwrite|invwriteany|invwritebackup|invws|t_AB|t_AF|t_al|t_AL|t_bc|t_cd|t_ce|t_Ce|t_cl|t_cm|t_Co|t_cs|t_Cs|t_CS|t_CV|t_da|t_db|t_dl|t_DL|t_EI|t_F1|t_F2|t_F3|t_F4|t_F5|t_F6|t_F7|t_F8|t_F9|t_fs|t_IE|t_IS|t_k1|t_K1|t_k2|t_k3|t_K3|t_k4|t_K4|t_k5|t_K5|t_k6|t_K6|t_k7|t_K7|t_k8|t_K8|t_k9|t_K9|t_KA|t_kb|t_kB|t_KB|t_KC|t_kd|t_kD|t_KD|t_ke|t_KE|t_KF|t_KG|t_kh|t_KH|t_kI|t_KI|t_KJ|t_KK|t_kl|t_KL|t_kN|t_kP|t_kr|t_ks|t_ku|t_le|t_mb|t_md|t_me|t_mr|t_ms|t_nd|t_op|t_RI|t_RV|t_Sb|t_se|t_Sf|t_SI|t_so|t_sr|t_te|t_ti|t_ts|t_ue|t_us|t_ut|t_vb|t_ve|t_vi|t_vs|t_WP|t_WS|t_xs|t_ZH|t_ZR)\b/,
      number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/i,
      operator: /\|\||&&|[-+.]=?|[=!](?:[=~][#?]?)?|[<>]=?[#?]?|[*\/%?]|\b(?:is(?:not)?)\b/,
      punctuation: /[{}[\](),;:]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/visual-basic.js":
/*!********************************************************!*\
  !*** ./node_modules/reprism/languages/visual-basic.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'visual-basic',
  init: function init(Prism) {
    Prism.languages['visual-basic'] = {
      comment: {
        pattern: /(?:['‘’]|REM\b).*/i,
        inside: {
          keyword: /^REM/i
        }
      },
      directive: {
        pattern: /#(?:Const|Else|ElseIf|End|ExternalChecksum|ExternalSource|If|Region)(?:[^\S\r\n]_[^\S\r\n]*(?:\r\n?|\n)|.)+/i,
        alias: 'comment',
        greedy: true
      },
      string: {
        pattern: /["“”](?:["“”]{2}|[^"“”])*["“”]C?/i,
        greedy: true
      },
      date: {
        pattern: /#[^\S\r\n]*(?:\d+([/-])\d+\1\d+(?:[^\S\r\n]+(?:\d+[^\S\r\n]*(?:AM|PM)|\d+:\d+(?::\d+)?(?:[^\S\r\n]*(?:AM|PM))?))?|(?:\d+[^\S\r\n]*(?:AM|PM)|\d+:\d+(?::\d+)?(?:[^\S\r\n]*(?:AM|PM))?))[^\S\r\n]*#/i,
        alias: 'builtin'
      },
      number: /(?:(?:\b\d+(?:\.\d+)?|\.\d+)(?:E[+-]?\d+)?|&[HO][\dA-F]+)(?:U?[ILS]|[FRD])?/i,
      boolean: /\b(?:True|False|Nothing)\b/i,
      keyword: /\b(?:AddHandler|AddressOf|Alias|And(?:Also)?|As|Boolean|ByRef|Byte|ByVal|Call|Case|Catch|C(?:Bool|Byte|Char|Date|Dbl|Dec|Int|Lng|Obj|SByte|Short|Sng|Str|Type|UInt|ULng|UShort)|Char|Class|Const|Continue|Date|Decimal|Declare|Default|Delegate|Dim|DirectCast|Do|Double|Each|Else(?:If)?|End(?:If)?|Enum|Erase|Error|Event|Exit|Finally|For|Friend|Function|Get(?:Type|XMLNamespace)?|Global|GoSub|GoTo|Handles|If|Implements|Imports|In|Inherits|Integer|Interface|Is|IsNot|Let|Lib|Like|Long|Loop|Me|Mod|Module|Must(?:Inherit|Override)|My(?:Base|Class)|Namespace|Narrowing|New|Next|Not(?:Inheritable|Overridable)?|Object|Of|On|Operator|Option(?:al)?|Or(?:Else)?|Out|Overloads|Overridable|Overrides|ParamArray|Partial|Private|Property|Protected|Public|RaiseEvent|ReadOnly|ReDim|RemoveHandler|Resume|Return|SByte|Select|Set|Shadows|Shared|short|Single|Static|Step|Stop|String|Structure|Sub|SyncLock|Then|Throw|To|Try|TryCast|TypeOf|U(?:Integer|Long|Short)|Using|Variant|Wend|When|While|Widening|With(?:Events)?|WriteOnly|Xor)\b/i,
      operator: [/[+\-*/\\^<=>&#@$%!]/, {
        pattern: /([^\S\r\n])_(?=[^\S\r\n]*[\r\n])/,
        lookbehind: true
      }],
      punctuation: /[{}().,:?]/
    };

    Prism.languages.vb = Prism.languages['visual-basic'];
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/wasm.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/wasm.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'wasm',
  init: function init(Prism) {
    Prism.languages.wasm = {
      comment: [/\(;[\s\S]*?;\)/, {
        pattern: /;;.*/,
        greedy: true
      }],
      string: {
        pattern: /"(?:\\[\s\S]|[^"\\])*"/,
        greedy: true
      },
      keyword: [{
        pattern: /\b(?:align|offset)=/,
        inside: {
          operator: /=/
        }
      }, {
        pattern: /\b(?:(?:f32|f64|i32|i64)(?:\.(?:abs|add|and|ceil|clz|const|convert_[su]\/i(?:32|64)|copysign|ctz|demote\/f64|div(?:_[su])?|eqz?|extend_[su]\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\/f32|reinterpret\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\/f(?:32|64))?|wrap\/i64|xor))?|memory\.(?:grow|size))\b/,
        inside: {
          punctuation: /\./
        }
      }, /\b(?:anyfunc|block|br(?:_if|_table)?|call(?:_indirect)?|data|drop|elem|else|end|export|func|get_(?:global|local)|global|if|import|local|loop|memory|module|mut|nop|offset|param|result|return|select|set_(?:global|local)|start|table|tee_local|then|type|unreachable)\b/],
      variable: /\$[\w!#$%&'*+\-./:<=>?@\\^_`|~]+/i,
      number: /[+-]?\b(?:\d(?:_?\d)*(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?|0x[\da-fA-F](?:_?[\da-fA-F])*(?:\.[\da-fA-F](?:_?[\da-fA-D])*)?(?:[pP][+-]?\d(?:_?\d)*)?)\b|\binf\b|\bnan(?::0x[\da-fA-F](?:_?[\da-fA-D])*)?\b/,
      punctuation: /[()]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/wiki.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/wiki.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'wiki',
  init: function init(Prism) {
    Prism.languages.wiki = Prism.languages.extend('markup', {
      'block-comment': {
        pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
        lookbehind: true,
        alias: 'comment'
      },
      heading: {
        pattern: /^(=+).+?\1/m,
        inside: {
          punctuation: /^=+|=+$/,
          important: /.+/
        }
      },
      emphasis: {
        // TODO Multi-line
        pattern: /('{2,5}).+?\1/,
        inside: {
          'bold italic': {
            pattern: /(''''').+?(?=\1)/,
            lookbehind: true
          },
          bold: {
            pattern: /(''')[^'](?:.*?[^'])?(?=\1)/,
            lookbehind: true
          },
          italic: {
            pattern: /('')[^'](?:.*?[^'])?(?=\1)/,
            lookbehind: true
          },
          punctuation: /^''+|''+$/
        }
      },
      hr: {
        pattern: /^-{4,}/m,
        alias: 'punctuation'
      },
      url: [/ISBN +(?:97[89][ -]?)?(?:\d[ -]?){9}[\dx]\b|(?:RFC|PMID) +\d+/i, /\[\[.+?\]\]|\[.+?\]/],
      variable: [/__[A-Z]+__/,
      // FIXME Nested structures should be handled
      // {{formatnum:{{#expr:{{{3}}}}}}}
      /\{{3}.+?\}{3}/, /\{\{.+?\}\}/],
      symbol: [/^#redirect/im, /~{3,5}/],
      // Handle table attrs:
      // {|
      // ! style="text-align:left;"| Item
      // |}
      'table-tag': {
        pattern: /((?:^|[|!])[|!])[^|\r\n]+\|(?!\|)/m,
        lookbehind: true,
        inside: {
          'table-bar': {
            pattern: /\|$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.markup.tag.inside
        }
      },
      punctuation: /^(?:\{\||\|\}|\|-|[*#:;!|])|\|\||!!/m
    });

    Prism.languages.insertBefore('wiki', 'tag', {
      // Prevent highlighting inside <nowiki>, <source> and <pre> tags
      nowiki: {
        pattern: /<(nowiki|pre|source)\b[\s\S]*?>[\s\S]*?<\/\1>/i,
        inside: {
          tag: {
            pattern: /<(?:nowiki|pre|source)\b[\s\S]*?>|<\/(?:nowiki|pre|source)>/i,
            inside: Prism.languages.markup.tag.inside
          }
        }
      }
    });
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/xeora.js":
/*!*************************************************!*\
  !*** ./node_modules/reprism/languages/xeora.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'xeora',
  init: function init(Prism) {
    (function (Prism) {
      Prism.languages.xeora = Prism.languages.extend('markup', {
        constant: {
          pattern: /\$(?:DomainContents|PageRenderDuration)\$/,
          inside: {
            punctuation: {
              pattern: /\$/
            }
          }
        },
        variable: {
          pattern: /\$@?(?:#+|[-+*~=^])?[\w.]+\$/,
          inside: {
            punctuation: {
              pattern: /[$.]/
            },
            operator: {
              pattern: /#+|[-+*~=^@]/
            }
          }
        },
        'function-inline': {
          pattern: /\$F:[-\w.]+\?[-\w.]+(?:,(?:\|?(?:[-#.^+*~]*(?:[\w+][^$]*)|=(?:[\S+][^$]*)|@[-#]*(?:\w+.)[\w+.]+)?)*)?\$/,
          inside: {
            variable: {
              pattern: /(?:[,|])@?(?:#+|[-+*~=^])?[\w.]+/,
              inside: {
                punctuation: {
                  pattern: /[,.|]/
                },
                operator: {
                  pattern: /#+|[-+*~=^@]/
                }
              }
            },
            punctuation: {
              pattern: /\$\w:|[$:?.,|]/
            }
          },
          alias: 'function'
        },
        'function-block': {
          pattern: /\$XF:{[-\w.]+\?[-\w.]+(?:,(?:\|?(?:[-#.^+*~]*(?:[\w+][^$]*)|=(?:[\S+][^$]*)|@[-#]*(?:\w+.)[\w+.]+)?)*)?}:XF\$/,
          inside: {
            punctuation: {
              pattern: /[$:{}?.,|]/
            }
          },
          alias: 'function'
        },
        'directive-inline': {
          pattern: /\$\w(?:#\d+\+?)?(?:\[[-\w.]+])?:[-\/\w.]+\$/,
          inside: {
            punctuation: {
              pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
              inside: {
                tag: {
                  pattern: /#\d/
                }
              }
            }
          },
          alias: 'function'
        },
        'directive-block-open': {
          pattern: /\$\w+:{|\$\w(?:#\d+\+?)?(?:\[[-\w.]+])?:[-\w.]+:{(![A-Z]+)?/,
          inside: {
            punctuation: {
              pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
              inside: {
                tag: {
                  pattern: /#\d/
                }
              }
            },
            attribute: {
              pattern: /![A-Z]+$/,
              inside: {
                punctuation: {
                  pattern: /!/
                }
              },
              alias: 'keyword'
            }
          },
          alias: 'function'
        },
        'directive-block-separator': {
          pattern: /}:[-\w.]+:{/,
          inside: {
            punctuation: {
              pattern: /[:{}]/
            }
          },
          alias: 'function'
        },
        'directive-block-close': {
          pattern: /}:[-\w.]+\$/,
          inside: {
            punctuation: {
              pattern: /[:{}$]/
            }
          },
          alias: 'function'
        }
      });

      Prism.languages.insertBefore('inside', 'punctuation', {
        variable: Prism.languages.xeora['function-inline'].inside.variable
      }, Prism.languages.xeora['function-block']);

      Prism.languages.xeoracube = Prism.languages.xeora;
    })(Prism);
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/xojo.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/xojo.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'xojo',
  init: function init(Prism) {
    Prism.languages.xojo = {
      comment: {
        pattern: /(?:'|\/\/|Rem\b).+/i,
        inside: {
          keyword: /^Rem/i
        }
      },
      string: {
        pattern: /"(?:""|[^"])*"/,
        greedy: true
      },
      number: [/(?:\b\d+\.?\d*|\B\.\d+)(?:E[+-]?\d+)?/i, /&[bchou][a-z\d]+/i],
      symbol: /#(?:If|Else|ElseIf|Endif|Pragma)\b/i,
      keyword: /\b(?:AddHandler|App|Array|As(?:signs)?|By(?:Ref|Val)|Break|Call|Case|Catch|Const|Continue|CurrentMethodName|Declare|Dim|Do(?:wnTo)?|Each|Else(?:If)?|End|Exit|Extends|False|Finally|For|Global|If|In|Lib|Loop|Me|Next|Nil|Optional|ParamArray|Raise(?:Event)?|ReDim|Rem|RemoveHandler|Return|Select|Self|Soft|Static|Step|Super|Then|To|True|Try|Ubound|Until|Using|Wend|While)\b/i,
      operator: /<[=>]?|>=?|[+\-*\/\\^=]|\b(?:AddressOf|And|Ctype|IsA?|Mod|New|Not|Or|Xor|WeakAddressOf)\b/i,
      punctuation: /[.,;:()]/
    };
  }
};

/***/ }),

/***/ "./node_modules/reprism/languages/yaml.js":
/*!************************************************!*\
  !*** ./node_modules/reprism/languages/yaml.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  language: 'yaml',
  init: function init(Prism) {
    Prism.languages.yaml = {
      scalar: {
        pattern: /([\-:]\s*(?:![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\2[^\r\n]+)*)/,
        lookbehind: true,
        alias: 'string'
      },
      comment: /#.*/,
      key: {
        pattern: /(\s*(?:^|[:\-,[{\r\n?])[ \t]*(?:![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/,
        lookbehind: true,
        alias: 'atrule'
      },
      directive: {
        pattern: /(^[ \t]*)%.+/m,
        lookbehind: true,
        alias: 'important'
      },
      datetime: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?)(?=[ \t]*(?:$|,|]|}))/m,
        lookbehind: true,
        alias: 'number'
      },
      boolean: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:true|false)[ \t]*(?=$|,|]|})/im,
        lookbehind: true,
        alias: 'important'
      },
      null: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:null|~)[ \t]*(?=$|,|]|})/im,
        lookbehind: true,
        alias: 'important'
      },
      string: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)("|')(?:(?!\2)[^\\\r\n]|\\.)*\2(?=[ \t]*(?:$|,|]|}))/m,
        lookbehind: true,
        greedy: true
      },
      number: {
        pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+\.?\d*|\.?\d+)(?:e[+-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,
        lookbehind: true
      },
      tag: /![^\s]+/,
      important: /[&*][\w]+/,
      punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
    };
  }
};

/***/ }),

/***/ "./node_modules/reusify/reusify.js":
/*!*****************************************!*\
  !*** ./node_modules/reusify/reusify.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function reusify (Constructor) {
  var head = new Constructor()
  var tail = head

  function get () {
    var current = head

    if (current.next) {
      head = current.next
    } else {
      head = new Constructor()
      tail = head
    }

    current.next = null

    return current
  }

  function release (obj) {
    tail.next = obj
    tail = obj
  }

  return {
    get: get,
    release: release
  }
}

module.exports = reusify


/***/ }),

/***/ "./node_modules/run-parallel/index.js":
/*!********************************************!*\
  !*** ./node_modules/run-parallel/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = runParallel

function runParallel (tasks, cb) {
  var results, pending, keys
  var isSync = true

  if (Array.isArray(tasks)) {
    results = []
    pending = tasks.length
  } else {
    keys = Object.keys(tasks)
    results = {}
    pending = keys.length
  }

  function done (err) {
    function end () {
      if (cb) cb(err, results)
      cb = null
    }
    if (isSync) process.nextTick(end)
    else end()
  }

  function each (i, err, result) {
    results[i] = result
    if (--pending === 0 || err) {
      done(err)
    }
  }

  if (!pending) {
    // empty
    done(null)
  } else if (keys) {
    // object
    keys.forEach(function (key) {
      tasks[key](function (err, result) { each(key, err, result) })
    })
  } else {
    // array
    tasks.forEach(function (task, i) {
      task(function (err, result) { each(i, err, result) })
    })
  }

  isSync = false
}


/***/ }),

/***/ "./node_modules/slash/index.js":
/*!*************************************!*\
  !*** ./node_modules/slash/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = path => {
	const isExtendedLengthPath = /^\\\\\?\\/.test(path);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

	if (isExtendedLengthPath || hasNonAscii) {
		return path;
	}

	return path.replace(/\\/g, '/');
};


/***/ }),

/***/ "./node_modules/spark-md5/spark-md5.js":
/*!*********************************************!*\
  !*** ./node_modules/spark-md5/spark-md5.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (factory) {
    if (true) {
        // Node/CommonJS
        module.exports = factory();
    } else { var glob; }
}(function (undefined) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },
        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;

        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;

        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;

        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b  = (b << 21 | b >>> 11) + c | 0;

        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    }

    function md5blk(s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function md5blk_array(a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    }

    function md51_array(a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    }

    function rhex(n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    }

    function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    }

    // In some cases the fast add32 function cannot be used..
    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */

    if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
        (function () {
            function clamp(val, length) {
                val = (val | 0) || 0;

                if (val < 0) {
                    return Math.max(val + length, 0);
                }

                return Math.min(val, length);
            }

            ArrayBuffer.prototype.slice = function (from, to) {
                var length = this.byteLength,
                    begin = clamp(from, length),
                    end = length,
                    num,
                    target,
                    targetArray,
                    sourceArray;

                if (to !== undefined) {
                    end = clamp(to, length);
                }

                if (begin > end) {
                    return new ArrayBuffer(0);
                }

                num = end - begin;
                target = new ArrayBuffer(num);
                targetArray = new Uint8Array(target);

                sourceArray = new Uint8Array(this, begin, num);
                targetArray.set(sourceArray);

                return target;
            };
        })();
    }

    // ---------------------------------------------------

    /**
     * Helpers.
     */

    function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
           buff = new ArrayBuffer(length),
           arr = new Uint8Array(buff),
           i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */

    function SparkMD5() {
        // call reset to init the instance
        this.reset();
    }

    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.append = function (str) {
        // Converts the string to utf8 bytes if necessary
        // Then append as binary
        this.appendBinary(toUtf8(str));

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.appendBinary = function (contents) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substring(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.reset = function () {
        this._buff = '';
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.prototype.getState = function () {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash.slice()
        };
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.setState = function (state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */
    SparkMD5.prototype.destroy = function () {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    SparkMD5.prototype._finish = function (tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} [raw] True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hash = function (str, raw) {
        // Converts the string to utf8 bytes if necessary
        // Then compute it using the binary function
        return SparkMD5.hashBinary(toUtf8(str), raw);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} [raw]     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hashBinary = function (content, raw) {
        var hash = md51(content),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
    SparkMD5.ArrayBuffer = function () {
        // call reset to init the instance
        this.reset();
    };

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.append = function (arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.reset = function () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.ArrayBuffer.prototype.getState = function () {
        var state = SparkMD5.prototype.getState.call(this);

        // Convert buffer to a string
        state.buff = arrayBuffer2Utf8Str(state.buff);

        return state;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.setState = function (state) {
        // Convert string to buffer
        state.buff = utf8Str2ArrayBuffer(state.buff, true);

        return SparkMD5.prototype.setState.call(this, state);
    };

    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     [raw] True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.hash = function (arr, raw) {
        var hash = md51_array(new Uint8Array(arr)),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    return SparkMD5;
}));


/***/ }),

/***/ "./node_modules/to-regex-range/index.js":
/*!**********************************************!*\
  !*** ./node_modules/to-regex-range/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const isNumber = __webpack_require__(/*! is-number */ "./node_modules/is-number/index.js");

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives, opts);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
  let intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit, options);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

/**
 * Expose `toRegexRange`
 */

module.exports = toRegexRange;


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const files_1 = __webpack_require__(/*! ./utils/files */ "./src/utils/files.ts");
const config_1 = __webpack_require__(/*! ./utils/config */ "./src/utils/config.ts");
const index_1 = __webpack_require__(/*! ./provides/index */ "./src/provides/index.ts");
const quickpick_1 = __webpack_require__(/*! ./provides/quickpick */ "./src/provides/quickpick.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/index.ts");
process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection', error);
});
//设置 文件内容
function init_file(f, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!vscode_1.workspace.workspaceFolders) {
            return undefined;
        }
        let files = yield f.exec();
        return files;
    });
}
//根目录改变, 配置改变时重新执行
function onChange(f, provider, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield init_file(f, config);
        if (!files) {
            provider.stop();
            return;
        }
        ;
        provider.set_files(files);
        provider.onChanges();
    });
}
// 激活程序
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = new config_1.Config();
        let f = new files_1.Files(config);
        let files = yield init_file(f, config);
        if (!files) {
            return;
        }
        ;
        let provider = new index_1.Provider(context, files, config);
        provider.onChanges();
        context.subscriptions.push(vscode_1.workspace.onDidChangeWorkspaceFolders(utils_1.debounce(() => { onChange(f, provider, config); })));
        context.subscriptions.push(vscode_1.workspace.onDidChangeConfiguration(utils_1.debounce(() => { onChange(f, provider, config); })));
        context.subscriptions.push(vscode_1.workspace.onDidChangeTextDocument(utils_1.debounce((event) => {
            let fp = event.document.uri.path;
            let content = event.document.getText();
            f.put(fp, { content: content });
            provider.onChange(fp);
        })));
        context.subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor(utils_1.debounce((editor) => {
            if (!editor) {
                return;
            }
            let fp = editor.document.uri.path;
            let content = editor.document.getText();
            f.put(fp, { content: content });
            provider.onChange(fp);
        })));
        quickpick_1.QuickPick(context, f, config);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),

/***/ "./src/provides/index.ts":
/*!*******************************!*\
  !*** ./src/provides/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.CODE_ACTION = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const clones_1 = __webpack_require__(/*! ../utils/clones */ "./src/utils/clones.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
exports.CODE_ACTION = 'goto-duplication';
class Provider {
    constructor(context, files, config) {
        this.context = context;
        this.files = files;
        this.config = config;
        this.context = context;
        this.files = files;
        this.config = config;
        this.diagnosticCollection = vscode_1.languages.createDiagnosticCollection('duplication');
        context.subscriptions.push(this.diagnosticCollection);
        this.onChange = utils_1.debounce(this._onChange);
        this.onChanges = utils_1.debounce(this._onChanges);
    }
    _onChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            this.diagnosticCollection.clear();
            let clones = yield clones_1.detectClones(this.files, this.config);
            let sourceIds = [...new Set(clones.reduce((res, clone) => {
                    res.push(clone.duplicationA.sourceId);
                    res.push(clone.duplicationB.sourceId);
                    return res;
                }, []))];
            while (sourceIds) {
                let sourceId = sourceIds.shift();
                if (!sourceId) {
                    return;
                }
                this._onChange(sourceId, clones);
            }
        });
    }
    _onChange(sourceId, clones) {
        return __awaiter(this, void 0, void 0, function* () {
            let uri = vscode_1.Uri.parse(sourceId);
            this.diagnosticCollection.delete(uri);
            if (!clones) {
                clones = yield clones_1.detectClones(this.files, this.config);
            }
            let errs = clones_1.getDuplication(sourceId, clones);
            let diagnostics = [];
            errs.forEach((err) => {
                let source = err.source;
                let others = err.refs;
                others.forEach((other) => {
                    let range = new vscode_1.Range(source.start.line, source.range[0], source.end.line, source.range[1]);
                    let otherRange = new vscode_1.Range(other.start.line, other.range[0], other.end.line, other.range[1]);
                    let diagnostic = new vscode_1.Diagnostic(range, `duplication`, this.config.severity);
                    if (diagnostic) {
                        diagnostic.code = exports.CODE_ACTION;
                        let message = this.files[other.sourceId].content.slice(other.range[0], other.range[1]);
                        diagnostic.relatedInformation = [new vscode_1.DiagnosticRelatedInformation(new vscode_1.Location(vscode_1.Uri.parse(other.sourceId), otherRange), message)];
                        diagnostics.push(diagnostic);
                    }
                });
            });
            this.diagnosticCollection.set(uri, diagnostics);
        });
    }
    // 重设所有文件内容对象
    set_files(files) {
        this.files = files;
    }
    // 停止比对文件
    stop() {
        this.diagnosticCollection.clear();
    }
}
exports.Provider = Provider;


/***/ }),

/***/ "./src/provides/quickpick.ts":
/*!***********************************!*\
  !*** ./src/provides/quickpick.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickPick = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const clones_1 = __webpack_require__(/*! ../utils/clones */ "./src/utils/clones.ts");
// const decoration = window.createTextEditorDecorationType({
//   backgroundColor: "rgba(255,0.0.0.3)"
// });
// function setDecorationOptions (one: Duplications, two: Duplications): DecorationOptions[] {
//   let hoverMessage = `Matchs ${two.source.sourceId}:${two.source.start.line}`;
//   return [];
// }
// async function showDiff (a: Duplications[], b: string) {
// let asource = a[0].source;
// let auri = Uri.parse(asource.sourceId);
// let buri = Uri.parse(b);
// let [adocOpen, bdocOpen] = await Promise.all([workspace.openTextDocument(auri), workspace.openTextDocument(buri)]);
// let [adoc, bdoc] = await Promise.all([window.showTextDocument(adocOpen, ViewColumn.One), window.showTextDocument(bdocOpen, ViewColumn.Two)]);
// let arange = new Range(a.source.start.line, a.source.range[0], a.source.end.line, a.source.range[1]);
// let brange = new Range(b.source.start.line, b.source.range[0], b.source.end.line, b.source.range[1]);
// adoc.setDecorations(decoration, setDecorationOptions(a, b));
// bdoc.setDecorations(decoration, setDecorationOptions(b, a));
// adoc.revealRange(arange);
// bdoc.revealRange(brange);
// }
function QuickPick(context, f, config) {
    context.subscriptions.push(vscode_1.commands.registerCommand('extension.duplication', () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let clones = yield clones_1.detectClones(f.datas, config);
        let sets = new Set();
        clones.forEach((item) => {
            let keys = [
                item.duplicationA.sourceId,
                item.duplicationB.sourceId
            ];
            keys.sort();
            sets.add({
                label: keys.map(key => key.replace(`${config.root}/` || '', '')).join(` <=> `),
                description: keys.join(` <=> `)
            });
        });
        let find = yield vscode_1.window.showQuickPick([...sets]);
        if (!find) {
            return;
        }
        let keys = (_a = find.description) === null || _a === void 0 ? void 0 : _a.split(' <=> ');
        if (!keys) {
            return;
        }
        let ak = keys[0];
        let bk = keys[1];
        vscode_1.commands.executeCommand('vscode.diff', vscode_1.Uri.parse(ak), vscode_1.Uri.parse(bk), find.label);
        // let a = getDuplication(ak, clones);
        // showDiff(a, bk);
    })));
}
exports.QuickPick = QuickPick;


/***/ }),

/***/ "./src/utils/clones.ts":
/*!*****************************!*\
  !*** ./src/utils/clones.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectClones = exports.getDuplication = exports.filterDuplication = exports.getDuplicationItem = void 0;
const core_1 = __webpack_require__(/*! @jscpd/core */ "./node_modules/@jscpd/core/dist/index.js");
const tokenizer_1 = __webpack_require__(/*! @jscpd/tokenizer */ "./node_modules/@jscpd/tokenizer/dist/index.js");
function getItems(datas) {
    return Object.keys(datas).reduce((res, next) => {
        let item = datas[next];
        res.push(item);
        return res;
    }, []);
}
function detectOne(detector, item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!item) {
                return [];
            }
            return yield detector.detect(item.filepath, item.content, item.format);
        }
        catch (error) {
            return [];
        }
    });
}
function exec(files, detector) {
    return __awaiter(this, void 0, void 0, function* () {
        let clones = [];
        for (let index = 0; index < files.length; index++) {
            const item = files[index];
            let clone = yield detectOne(detector, item);
            clones.push(...clone);
        }
        return clones;
    });
}
function getDuplicationKeyKey(obj) {
    return `${obj.sourceId}-${obj.range[0]}-${obj.range[1]}`;
}
function duplicationKey(clone) {
    return {
        keyA: getDuplicationKeyKey(clone.duplicationA),
        keyB: getDuplicationKeyKey(clone.duplicationB)
    };
}
function getDuplicationItem(clone, clones) {
    let res = [];
    let keys = [duplicationKey(clone).keyA, duplicationKey(clone).keyB];
    for (let index = 0; index < clones.length; index++) {
        const element = clones[index];
        let key = duplicationKey(element);
        if (keys.includes(key.keyA)) {
            res.push(element.duplicationB);
        }
        if (keys.includes(key.keyB)) {
            res.push(element.duplicationA);
        }
    }
    return res;
}
exports.getDuplicationItem = getDuplicationItem;
function filterDuplication(dup, dups) {
    return dups.filter((item) => {
        let sKey = getDuplicationKeyKey(item);
        let key = getDuplicationKeyKey(dup);
        return sKey !== key;
    });
}
exports.filterDuplication = filterDuplication;
function getDuplication(f, clones) {
    let dups = [];
    for (let index = 0; index < clones.length; index++) {
        const clone = clones[index];
        let refs = getDuplicationItem(clone, clones);
        dups.push({
            source: clone.duplicationA,
            refs: filterDuplication(clone.duplicationA, refs),
            format: clone.format,
            foundDate: clone.foundDate
        });
        dups.push({
            source: clone.duplicationB,
            refs: filterDuplication(clone.duplicationB, refs),
            format: clone.format,
            foundDate: clone.foundDate
        });
    }
    return dups.filter((dup) => {
        return dup.source.sourceId === f;
    });
}
exports.getDuplication = getDuplication;
function detectClones(datas, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let stack = getItems(datas);
            const tokenizer = new tokenizer_1.Tokenizer();
            const validators = [];
            const store = new core_1.MemoryStore();
            const detector = new core_1.Detector(tokenizer, store, validators, {
                minLines: config.minLines,
                maxLines: config.maxLines,
                minTokens: config.minTokens
            });
            return yield exec(stack, detector);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.detectClones = detectClones;


/***/ }),

/***/ "./src/utils/config.ts":
/*!*****************************!*\
  !*** ./src/utils/config.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
class Config {
    get root() {
        var _a, _b;
        return (_b = (_a = (vscode_1.workspace.workspaceFolders || [])[0]) === null || _a === void 0 ? void 0 : _a.uri) === null || _b === void 0 ? void 0 : _b.path;
    }
    get ignore() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.ignore') || [
            'node_modules/**/*',
            'bower_components',
            'jspm_packages',
            'web_modules',
            '.cache',
            '.history',
            '.yarn/cache',
            '.vscode-test',
            'out',
            'dist',
            'build',
            'logs'
        ];
    }
    get minTokens() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.minTokens') || 50;
    }
    get maxLines() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.maxLines') || 10000;
    }
    get minLines() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.minLines') || 5;
    }
    get maxSize() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.maxSize') || '100kb';
    }
    get debug() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.debug') || false;
    }
    get severity() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.severity') || 1;
    }
    get formatsExts() {
        return vscode_1.workspace.getConfiguration()
            .get('duplication.formatsExts') || {};
    }
}
exports.Config = Config;


/***/ }),

/***/ "./src/utils/files.ts":
/*!****************************!*\
  !*** ./src/utils/files.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const _1 = __webpack_require__(/*! . */ "./src/utils/index.ts");
const globby = __webpack_require__(/*! globby */ "./node_modules/globby/index.js");
const bytes = __webpack_require__(/*! bytes */ "./node_modules/bytes/index.js");
const eventemitter3 = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils/index.ts");
class Files extends eventemitter3 {
    constructor(config) {
        super();
        this.config = config;
        this.datas = {};
        this.config = config;
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.root) {
                return {};
            }
            if (this.watch) {
                yield this.watch();
            }
            let paths = yield globby(`${this.config.root}/**/*`, {
                dot: true,
                cwd: this.config.root,
                ignore: this.config.ignore.map((i) => `${this.config.root}/${i}`),
                // ignore: this.ingore,
                absolute: true,
                onlyFiles: true,
                unique: true,
                braceExpansion: true,
                caseSensitiveMatch: false,
                gitignore: true,
                expandDirectories: true
            });
            this.watch = _1.watch(`${this.config.root}/**/*`, utils_1.debounce(this.update), this.config);
            return yield this.reads(paths);
        });
    }
    reads(filepaths) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(filepaths.map((filepath) => this.read(filepath)));
            return this.datas;
        });
    }
    removes(filepaths) {
        filepaths.map((filepath) => {
            return this.remove(filepath);
        });
    }
    has(filepath) {
        return _1.hasOwnProperty(this.datas, filepath);
    }
    get(filepath) {
        return this.datas[filepath];
    }
    put(filepath, obj) {
        let file = this.get(filepath);
        if (file) {
            this.save(filepath, Object.assign(Object.assign({}, file), obj));
        }
    }
    clear() {
        Object.keys(this.datas).map((key) => {
            return this.remove(key);
        });
    }
    save(filepath, item) {
        this.datas[filepath] = item;
        return item;
    }
    remove(filepath) {
        let item = this.datas[filepath];
        if (!item) {
            return;
        }
        delete this.datas[filepath];
    }
    update(rootpath, event, filepath, stats) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event === 'unlink' || event === 'error') {
                this.remove(filepath);
            }
            yield this._read(filepath);
            this.emit('update');
        });
    }
    read(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.datas[key]) {
                return this.datas[key];
            }
            return yield this._read(key);
        });
    }
    skipBigFiles(entry) {
        const { stats, filepath } = entry;
        const shouldSkip = bytes.parse(stats.size) > bytes.parse(this.config.maxSize);
        if (this.config.debug && shouldSkip) {
            console.log(`File ${filepath} skipped! Size more then limit (${bytes(stats.size)} > ${this.config.maxSize})`);
        }
        return shouldSkip;
    }
    skip(f) {
        if (f.content === '') {
            return true;
        }
        if (f.stats.isFile() !== true) {
            return true;
        }
        if (this.skipBigFiles(f) === true) {
            return true;
        }
        return false;
    }
    _read(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            let f = yield _1.read(filepath, this.config);
            if (f === undefined) {
                return;
            }
            if (this.skip(f) === true) {
                return;
            }
            let item = {
                filepath: filepath,
                content: f.content,
                format: f.format,
                stats: f.stats
            };
            return this.save(filepath, item);
        });
    }
}
exports.Files = Files;


/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = exports.hasOwnProperty = exports.watch = exports.read = void 0;
const fs = __webpack_require__(/*! fs */ "fs");
const pify = __webpack_require__(/*! pify */ "./node_modules/pify/index.js");
const chokidar = __webpack_require__(/*! chokidar */ "chokidar");
const tokenizer_1 = __webpack_require__(/*! @jscpd/tokenizer */ "./node_modules/@jscpd/tokenizer/dist/index.js");
function read(filepath, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let [stats, content] = yield Promise.all([
                pify(fs.stat)(filepath),
                pify(fs.readFile)(filepath, 'utf-8')
            ]);
            const format = tokenizer_1.getFormatByFile(filepath, config.formatsExts);
            if (format === undefined) {
                return undefined;
            }
            return {
                filepath,
                content,
                format,
                stats
            };
        }
        catch (error) {
            return undefined;
        }
    });
}
exports.read = read;
function watch(filepath, update, config) {
    let watched = chokidar.watch(filepath, {
        ignoreInitial: true,
        followSymlinks: true,
        ignored: config.ignore
    }).on('all', (eventName, path, stats) => {
        update(filepath, eventName, path, stats);
    });
    return () => {
        return watched.close();
    };
}
exports.watch = watch;
function hasOwnProperty(o, key) {
    return Object.prototype.hasOwnProperty.call(o, key);
}
exports.hasOwnProperty = hasOwnProperty;
function debounce(fn, n, immed) {
    let timer = undefined;
    return function (...args) {
        if (timer === undefined && immed === true) {
            fn.apply(this, args);
        }
        timer && clearTimeout(timer);
        n = n || 100;
        timer = setTimeout(() => fn.apply(this, args), n);
        return timer;
    };
}
exports.debounce = debounce;
;


/***/ }),

/***/ "chokidar":
/*!***************************!*\
  !*** external "chokidar" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chokidar");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map