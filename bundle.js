/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _descriptor = __webpack_require__(2);
	
	var _descriptor2 = _interopRequireDefault(_descriptor);
	
	var _LiteLoader = __webpack_require__(3);
	
	var _LiteLoader2 = _interopRequireDefault(_LiteLoader);
	
	var _Creature = __webpack_require__(4);
	
	var _Creature2 = _interopRequireDefault(_Creature);
	
	var _Gene = __webpack_require__(7);
	
	var _Gene2 = _interopRequireDefault(_Gene);
	
	var _GeneBank = __webpack_require__(8);
	
	var _GeneBank2 = _interopRequireDefault(_GeneBank);
	
	var _TagsBank = __webpack_require__(10);
	
	var _TagsBank2 = _interopRequireDefault(_TagsBank);
	
	var _GeneInterpolationBank = __webpack_require__(11);
	
	var _GeneInterpolationBank2 = _interopRequireDefault(_GeneInterpolationBank);
	
	var _Mutator = __webpack_require__(13);
	
	var _Mutator2 = _interopRequireDefault(_Mutator);
	
	var _GeneSet = __webpack_require__(6);
	
	var _GeneSet2 = _interopRequireDefault(_GeneSet);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	let output = window.document.querySelector('.output');
	let editor = window.document.querySelector('.editor');
	
	let data = undefined;
	
	editor.addEventListener('input', event => {
	  console.log(editor.textContent);
	  output.textContent = _descriptor2.default.parseDescriptionsFile(editor.textContent, data);
	});
	
	var loaderCompleteHandler = function () {
	  //MUTANT
	  var tagsBank = new _TagsBank2.default(loader.content.tags);
	  var geneBank = new _GeneBank2.default(tagsBank, loader.content.genes);
	  var geneInterpolationBank = new _GeneInterpolationBank2.default(geneBank, loader.content.interpolations);
	  var mirmignon = new _Creature2.default(new _GeneSet2.default(tagsBank, geneBank));
	  mirmignon.createFromObject(loader.content.creatures.totor, geneBank);
	
	  var mutator = Object.create(_Mutator2.default);
	  mutator.init(geneBank, geneInterpolationBank, tagsBank);
	  mutator.setPower(99999);
	  mutator.mutateRandom(mirmignon.geneSet);
	  data = mirmignon.geneSet.getModifiers();
	  console.log(JSON.stringify(mirmignon.geneSet.getModifiers()));
	
	  let desc = loader.content.descriptions;
	  editor.textContent = desc;
	
	  output.textContent = _descriptor2.default.parseDescriptionsFile(desc, data);
	
	  // $('#js-mutation').on('click', function ()
	  // {
	  //   mutator.mutateRandom(mirmignon.geneSet);
	  //   console.log(mirmignon.geneSet.getModifiers());
	  // });
	};
	
	var loaderErrorHandler = function () {
	  console.log('error');
	};
	
	var loader = _LiteLoader2.default.create();
	loader.getJSON('tags', 'src/data/tags.json');
	loader.getJSON('genes', 'src/data/genes.json');
	loader.getJSON('interpolations', 'src/data/interpolations.json');
	loader.getJSON('creatures', 'src/data/creatures.json');
	loader.get('descriptions', 'src/data/main.desc');
	
	loader.allComplete().then(loaderCompleteHandler);
	
	// var loader = new LiteLoader(loaderCompleteHandler, loaderErrorHandler);
	// loader.appendJSONLoader({ name: 'tags', URL: 'src/data/tags.json' });
	// loader.appendJSONLoader({ name: 'genes', URL: 'src/data/genes.json' });
	// loader.appendJSONLoader({ name: 'interpolations', URL: 'src/data/interpolations.json' });
	// loader.appendJSONLoader({ name: 'creatures', URL: 'src/data/creatures.json' });
	// loader.appendStringLoader({ name: 'descriptions', URL: 'src/data/main.desc' });
	// loader.load();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	let descriptor = {
	
	  parseDescriptionsFile: function (file, data) {
	    let parsedContent = descriptor.parseContent(file);
	    for (let name in parsedContent) {
	      parsedContent[name] = descriptor.parseContent(parsedContent[name]);
	    }
	
	    //var condition = "(toto = 'blue' & 'green' = 'green') & 'red' = 'redd' | 'tutu' = 'tutu'";
	    //var condition = 'toto';
	
	    return descriptor.getDescription('body', parsedContent, data);
	    //console.log('result', descriptor.getDescription('body', parsedContent, data));
	  },
	
	  parseContent: function (value) {
	    // let regex = /( *)(.+):\n((?:\1  .*[\s]?)*)/gm;
	    //let regex = /( *)(.+):\n((?:\1\s.*[\s]?)*)/gm;
	
	    // celle la fonctionne dans regexr : /^( *)(.+):$\n((?:(?:^\1 .*\n?)|^$\n?)*)/gm
	    let regex = /(^ *)(.*):$\s((?:(?:^\1 .*$\s?)|(?:^$\s))*)/gm;
	    let result;
	    let parsed = {};
	
	    do {
	      result = regex.exec(value);
	      if (!result) {
	        break;
	      }
	      let content = result[3];
	      content = content.replace(/^  /gm, '');
	      content = content.replace(/\n$/, '');
	      parsed[result[2]] = content;
	    } while (result);
	    // for(let name in parsed) {
	    //   console.log(name);
	    // }
	
	    return parsed;
	  },
	
	  parseExpression: function (expression, data) {
	    //console.log('parsing expression', expression);
	    if (expression.startsWith('\'')) {
	      return expression.replace(/'/g, '');
	    } else {
	      return data[expression];
	    }
	  },
	
	  evaluate: function (condition, data) {
	    //console.log('evaluate', condition);
	
	    let comparison = /(\S*)?([=<>])(\S*)?/;
	    let comparisonResult = comparison.exec(condition);
	    //console.log(comparisonResult);
	
	    if (comparisonResult) {
	      let expressionA = descriptor.parseExpression(comparisonResult[1], data);
	      let operand = comparisonResult[2];
	      let expressionB = descriptor.parseExpression(comparisonResult[3], data);
	
	      //console.log(condition, expressionA, operand, expressionB);
	
	      switch (operand) {
	        case '>':
	          return expressionA > expressionB;
	
	        case '<':
	          return expressionA < expressionB;
	
	        case '=':
	          return expressionA === expressionB;
	
	        default:
	          throw new Error('invalid evaluation');
	      }
	    } else {
	      if (condition === '*') {
	        return true;
	      } else {
	        return descriptor.parseExpression(condition, data) !== undefined && descriptor.parseExpression(condition, data) !== false;
	      }
	    }
	  },
	
	  stripFirstLevelParentheses: function (condition, data) {
	    let depth = 0;
	    let openedOnce = false;
	    let stripped = '';
	
	    var stringArray = Array.from(condition);
	    for (var i = 0, length = stringArray.length; i < length; i += 1) {
	      var item = stringArray[i];
	
	      if (depth === 0 && (item !== '(' && item !== ')' || openedOnce)) {
	        return condition;
	      } else {
	        if (item === '(') {
	          openedOnce = true;
	          depth += 1;
	        } else if (item === ')') {
	          depth -= 1;
	        } else {
	          stripped += item;
	        }
	      }
	    }
	
	    return stripped;
	  },
	
	  parseCondition: function (condition, data) {
	    //console.log('parsing condition', condition);
	    let noSpace = condition.replace(/\s/g, '');
	    return descriptor.performComparisons(noSpace, data);
	  },
	
	  performComparisons: function (condition, data) {
	    //console.log('performComparisons', condition);
	
	    condition = descriptor.stripFirstLevelParentheses(condition);
	
	    let testCondition = /[\(\)&\|]/gm;
	    if (!testCondition.test(condition)) {
	      return descriptor.evaluate(condition, data);
	    }
	
	    let depth = 0;
	    let operand;
	    let index = 0;
	    let result;
	
	    let opened = false;
	    let beforeOperand = '';
	    let afterOperand = '';
	    let hasParenthesis = false;
	    let group = '';
	
	    let groups = [''];
	    let operands = [];
	
	    Array.from(condition).forEach(item => {
	      if (item === ')') {
	        depth -= 1;
	        if (depth === 0) {
	          opened = false;
	        }
	      }
	      if (item === '(') {
	        if (depth === 0) {
	          opened = true;
	        }
	        depth += 1;
	      }
	
	      if (depth === 0 && (item === '&' || item === '|')) {
	        groups.push('');
	        operands.push(item);
	      } else {
	        groups[groups.length - 1] += item;
	      }
	    });
	
	    var results = groups.map(item => descriptor.parseCondition(item, data));
	
	    while (results.length > 1) {
	      if (operands[0] === '&') {
	        results[1] = results[0] && results[1];
	      }
	      if (operands[0] === '|') {
	        results[1] = results[0] || results[1];
	      }
	      results.shift();
	      operands.shift();
	    }
	
	    return results[0];
	  },
	
	  getDescriptions: function (content, data) {
	    let toReturn = [];
	    for (var condition in content) {
	      if (descriptor.evaluate(condition, data)) {
	        toReturn.push(content[condition]);
	      }
	    }
	
	    return toReturn;
	  },
	
	  getAvailableDescs: function (descriptionList, data) {
	    let toReturn = [];
	    for (let conditionName in descriptionList) {
	      if (descriptor.parseCondition(conditionName, data)) {
	        toReturn.push(descriptionList[conditionName]);
	      }
	    }
	    return toReturn;
	  },
	
	  getDescription: function (contentName, contentList, data) {
	    let reference = /@(\w*)(?=\W)?/gm;
	    let result;
	
	    var availableDescs = descriptor.getAvailableDescs(contentList[contentName], data);
	    // [0] is temporary
	    if (availableDescs.length > 0) {
	      return availableDescs[0].replace(reference, (match, p1) => descriptor.getDescription(p1, contentList, data));
	    } else {
	      return `(no description for ${ contentName })`;
	    }
	  }
	};
	
	exports.default = descriptor;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var LiteLoader = {
	  create: function () {
	    var loaderObject = Object.create(LiteLoader);
	    loaderObject.contentPromises = [];
	    loaderObject.content = {};
	    return loaderObject;
	  },
	  allComplete: function () {
	    return Promise.all(this.contentPromises);
	  },
	  getJSON: function (name, url) {
	    return this.get(name, url, data => JSON.parse(data));
	  },
	  get: function (name, url, dataTreatment = data => data) {
	    // Return a new promise.
	    var contentPromise = new Promise((resolve, reject) => {
	      // Do the usual XHR stuff
	      var req = new XMLHttpRequest();
	      req.open('GET', url);
	
	      req.addEventListener('load', () => {
	        // This is called even on 404 etc
	        // so check the status
	        if (req.status == 200) {
	          // Resolve the promise with the response text
	          var content = dataTreatment(req.responseText);
	          this.content[name] = content;
	          resolve(content);
	        } else {
	          // Otherwise reject with the status text
	          // which will hopefully be a meaningful error
	          reject(Error(req.statusText));
	        }
	      });
	
	      // Handle network errors
	      req.addEventListener('error', () => {
	        reject(Error('Network Error'));
	      });
	
	      // Make the request
	      req.send();
	    });
	
	    this.contentPromises.push(contentPromise);
	    return contentPromise;
	  }
	};
	
	exports.default = LiteLoader;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Utils = __webpack_require__(5);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	var _GeneSet = __webpack_require__(6);
	
	var _GeneSet2 = _interopRequireDefault(_GeneSet);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Creature = function ($geneSet) {
	  this.geneSet = $geneSet;
	};
	
	Creature.prototype.createFromTags = function ($tags, $geneBank) {
	  var startArray = $geneBank.getRandomGenesFromTags($tags);
	  for (var i = 0, startArrayLength = startArray.length; i < startArrayLength; i += 1) {
	    var currGene = startArray[i];
	    var type = currGene.type;
	
	    while (this.geneSet.addGene(currGene) === false) {
	      currGene = _Utils2.default.getRandom($geneBank.getGenesFromTagsAndType($tags, currGene.type));
	    }
	  }
	};
	
	Creature.prototype.createFromObject = function ($confObject, $geneBank) {
	  this.createFromTags($confObject.base.split(' '), $geneBank);
	
	  if ($confObject.additional) {
	    for (var i = 0, additionalGenesLength = $confObject.additional.length; i < additionalGenesLength; i += 1) {
	      var currAddition = $confObject.additional[i];
	
	      if (currAddition[0] === '!') {
	        var rest = currAddition.slice(1);
	        var geneToExclude = $geneBank.getGeneByName(rest);
	        while (this.geneSet.getGenes().indexOf(geneToExclude) !== -1) {
	          this.geneSet.addGene(_Utils2.default.getRandom($geneBank.getGenesFromTagsAndType($confObject.base.split(' '), geneToExclude.type)));
	        }
	      } else {
	        this.geneSet.addGene($geneBank.getGeneByName(currAddition));
	      }
	    }
	  }
	
	  //this.debug();
	};
	
	Creature.prototype.debug = function () {
	  for (var i = 0, setLength = this.geneSet.getGenes().length; i < setLength; i += 1) {
	    var currGene = this.geneSet.getGenes()[i];
	    console.log(currGene.type, currGene.name);
	  }
	};
	
	exports.default = Creature;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		shuffle: function ($array) {
			var currentIndex = $array.length;
			var temporaryValue;
			var randomIndex;
	
			// While there remain elements to shuffle...
			while (0 !== currentIndex) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
	
				// And swap it with the current element.
				temporaryValue = $array[currentIndex];
				$array[currentIndex] = $array[randomIndex];
				$array[randomIndex] = temporaryValue;
			}
	
			return $array;
		},
	
		getRandom: function ($array) {
			return $array[Math.floor(Math.random() * $array.length)];
		},
	
		startsWith: function ($excerpt, $string) {
			if ($excerpt.length === 0) {
				return false;
			}
	
			var exLength = $excerpt.length;
	
			if ($string.slice(0, exLength) === $excerpt) {
				return true;
			}
	
			return false;
		}
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Utils = __webpack_require__(5);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var GeneSet = function ($tagsBank, $geneBank) {
	  this.tagsBank = $tagsBank;
	  this.geneBank = $geneBank;
	  this.genesArray = [];
	};
	
	GeneSet.prototype.getGeneByName = function ($name) {
	  for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1) {
	    var currGene = this.genesArray[i];
	    if (currGene.name === $name) {
	      return currGene;
	    }
	  }
	};
	
	GeneSet.prototype.getGenes = function () {
	  return this.genesArray;
	};
	
	GeneSet.prototype.getGeneByType = function ($type) {
	  for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1) {
	    var currGene = this.genesArray[i];
	    if (currGene.type === $type) {
	      return currGene;
	    }
	  }
	};
	
	GeneSet.prototype.cleanUp = function () {
	  for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1) {
	    var currGene = this.genesArray[i];
	
	    /*
	     TO REDO
	     for (var k = 0, geneDependencyLength = currGene.geneDependency.length; k < geneDependencyLength; k += 1)
	    {
	      var currDependency = currGene.geneDependency[k];
	      if (this.getGeneByName(currDependency) === undefined)
	      {
	        //console.log('cleaning', currGene.name);
	        this.genesArray.splice(i, 1);
	         i -= 1;
	        genesArrayLength = this.genesArray.length;
	      }
	    }*/
	  }
	};
	
	GeneSet.prototype.addGenes = function ($genes) {
	  for (var i = 0, genesLength = $genes.length; i < genesLength; i += 1) {
	    this.addGene($genes[i]);
	  }
	};
	
	GeneSet.prototype.addGene = function ($gene) {
	  if (this.genesArray.indexOf($gene) !== -1) {
	    return true;
	  }
	
	  for (var i = 0, genesArrayLength = this.genesArray.length; i < genesArrayLength; i += 1) {
	    var currGene = this.genesArray[i];
	    if (currGene.type === $gene.type) {
	      this.genesArray.splice(i, 1);
	      break;
	    }
	  }
	
	  var geneDepLength = $gene.geneDependency.length;
	  if (geneDepLength > 0) {
	    for (i = 0; i < geneDepLength; i += 1) {
	      var depGeneName = $gene.geneDependency[i];
	      var depGene = this.geneBank.getGeneByName(depGeneName);
	
	      if (this.getGeneByType(depGene.type) === undefined) {
	        this.addGene(depGene);
	      }
	    }
	  }
	
	  //console.log('adding', $gene.name);
	  this.genesArray.push($gene);
	
	  var reqLength = $gene.requirements.length;
	  for (i = 0; i < reqLength; i += 1) {
	    var currReq = this.geneBank.getGeneByName($gene.requirements[i]);
	    this.addGene(currReq);
	  }
	
	  this.cleanUp();
	
	  return this.genesArray.indexOf($gene) !== -1;
	};
	
	GeneSet.prototype.getModifiers = function () {
	  var modifiers = {};
	  var recur = function ($currObj, $currModifierObj) {
	    for (var name in $currObj) {
	      if (typeof $currObj[name] !== 'string') {
	        if (!$currModifierObj[name]) {
	          $currModifierObj[name] = {};
	        }
	        recur($currObj[name], $currModifierObj[name]);
	      } else {
	        //if it is an arithmetic modification
	        if (/[+-]?\d*\.*\d*/.test($currObj[name])) {
	          //if the modifier doesn't exist or is something else
	          if (window.isNaN($currModifierObj[name])) {
	            //initialize it
	            $currModifierObj[name] = 0;
	          }
	          //and alter it
	          $currModifierObj[name] += Number($currObj[name]);
	        } else {
	          $currModifierObj[name] = $currObj[name];
	        }
	      }
	    }
	  };
	
	  for (var i = 0, genesLength = this.genesArray.length; i < genesLength; i += 1) {
	    var currGene = this.genesArray[i];
	    //adding gene to modifiers
	    modifiers[currGene.name] = currGene;
	    //adding extra modifiers
	    recur(currGene.mods, modifiers);
	  }
	
	  return modifiers;
	};
	
	GeneSet.prototype.copy = function () {
	  var geneSet = new GeneSet(this.tagsBank, this.geneBank);
	  geneSet.addGenes(this.genesArray);
	  return geneSet;
	};
	
	exports.default = GeneSet;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Gene = function ($params) {
	  this.type = $params.type;
	  this.name = $params.name;
	  var modsArray = $params.mods ? $params.mods.split(' ') : [];
	  this.mods = {};
	  for (var i = 0, modsArrayLength = modsArray.length; i < modsArrayLength; i += 1) {
	    var currMod = modsArray[i];
	    var regExp = /([\.\w]*)([+-=]*.*)/;
	    var match = regExp.exec(currMod);
	
	    var modNamesArray = match[1].split('.');
	    var currObj = this.mods;
	    for (var k = 0, modNamesLength = modNamesArray.length; k < modNamesLength; k += 1) {
	      //getting example in example.other
	      var currModName = modNamesArray[k];
	      if (currObj[currModName] === undefined) {
	        currObj[currModName] = k === modNamesLength - 1 ? match[2] : {};
	      }
	      currObj = currObj[currModName];
	    }
	  }
	
	  this.requirements = $params.req ? $params.req.split(',') : [];
	  this.typeRequirements = $params.typeReq ? $params.typeReq.split(',') : [];
	  this.groups = $params.grp.split(' ');
	  //this.typeDependency = $params.typeDep !== undefined ? $params.typeDep.split(',') : [];
	  this.geneDependency = $params.geneDep !== undefined ? $params.geneDep.split(',') : [];
	  this.description = '';
	};
	
	Gene.prototype.toJSON = function () {
	  return 'Gene';
	};
	
	exports.default = Gene;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Gene = __webpack_require__(7);
	
	var _Gene2 = _interopRequireDefault(_Gene);
	
	var _GeneType = __webpack_require__(9);
	
	var _GeneType2 = _interopRequireDefault(_GeneType);
	
	var _Utils = __webpack_require__(5);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var GeneBank = function ($tagsBank, $confObject) {
	  this.genes = {};
	  this.types = {};
	  this.tagsBank = $tagsBank;
	
	  for (var typeName in $confObject) {
	    this.types[typeName] = new _GeneType2.default($confObject[typeName]);
	
	    for (var geneName in $confObject[typeName]) {
	      var params = $confObject[typeName][geneName];
	      params.type = typeName;
	      params.name = geneName;
	      var gene = new _Gene2.default(params);
	      this.genes[geneName] = gene;
	      this.types[typeName].genes.push(gene);
	    }
	  }
	};
	
	GeneBank.prototype.getGeneByName = function ($name) {
	  return this.genes[$name];
	};
	
	GeneBank.prototype.getGenesByType = function ($typeName) {
	  return this.types[$typeName].genes;
	};
	
	GeneBank.prototype.getGenesFromTags = function ($tags) {
	  var returnArray = [];
	  for (var name in this.genes) {
	    var currGene = this.genes[name];
	
	    //console.log(currGene.name, currGene.groups, $tags, this.tagsBank.listContainsSome(currGene.groups, $tags));
	    // console.log($tags);
	    if (this.tagsBank.listContainsSome(currGene.groups, $tags) === true) {
	      returnArray.push(currGene);
	    }
	  }
	  return returnArray;
	};
	
	GeneBank.prototype.getGenesFromTagsAndType = function ($tags, $type) {
	  var array = this.getGenesFromTags($tags);
	
	  var toReturn = [];
	
	  for (var i = 0, arrayLength = array.length; i < arrayLength; i += 1) {
	    var currGene = array[i];
	    if (currGene.type === $type) {
	      toReturn.push(currGene);
	    }
	  }
	
	  return toReturn;
	};
	
	GeneBank.prototype.getRandomGenesFromTags = function ($tags) {
	  var array = _Utils2.default.shuffle(this.getGenesFromTags($tags));
	
	  var toReturn = [];
	
	  for (var i = 0, arrayLength = array.length; i < arrayLength; i += 1) {
	    var currGene = array[i];
	
	    for (var k = 0, toReturnLength = toReturn.length; k < toReturnLength; k += 1) {
	      var currReturnGene = toReturn[k];
	      if (currReturnGene.type === currGene.type) {
	        toReturn.splice(toReturn.indexOf(currReturnGene), 1);
	        break;
	      }
	    }
	
	    toReturn.push(currGene);
	  }
	
	  return toReturn;
	};
	
	exports.default = GeneBank;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var GeneType = function ($params) {
	  this.genes = [];
	  this.geneDependency = $params.geneDep !== 'none' ? $params.geneDep : undefined;
	};
	
	exports.default = GeneType;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var TagsBank = function ($confObject) {
	  this.tags = $confObject;
	};
	
	TagsBank.prototype.tagContainsTag = function ($containing, $contained) {
	  var found = false;
	  var contained = $contained;
	  var containing = $containing;
	  var isNegative = $containing[0] === '!';
	  if ($contained[0] === '!') {
	    isNegative = true;
	    contained = $contained.slice(1);
	  }
	  if ($containing[0] === '!') {
	    isNegative = true;
	    containing = $containing.slice(1);
	  }
	
	  if (containing === contained) {
	    found = true;
	  } else {
	    var tags = this.tags;
	
	    var recur = function ($currContained) {
	      var inArray = tags[$currContained].in ? tags[$currContained].in.split(' ') : [];
	      for (var i = 0, inLength = inArray.length; i < inLength; i += 1) {
	        var currIn = inArray[i];
	        if (currIn === containing) {
	          found = true;
	        } else {
	          recur(currIn);
	        }
	      }
	    };
	    recur(contained);
	  }
	
	  var isOK = found === true && isNegative === false || found === false && isNegative === true;
	  //console.log($containing, $contained, found, isNegative, 'isOK', isOK);
	
	  return isOK;
	};
	
	TagsBank.prototype.listContainsTag = function ($listToSearch, $tag) {
	  var toSearch = $listToSearch;
	  for (var i = 0, toSearchLength = toSearch.length; i < toSearchLength; i += 1) {
	    var currSearch = toSearch[i];
	    var contains = this.tagContainsTag(currSearch, $tag);
	    //console.log('currSearch', currSearch, 'tag', $tag, contains);
	    if (contains === true) {
	      return true;
	    }
	  }
	  return false;
	};
	
	TagsBank.prototype.listContainsSome = function ($listToSearch, $listToFind) {
	  for (var i = 0, toFindLength = $listToFind.length; i < toFindLength; i += 1) {
	    var currTag = $listToFind[i];
	    //console.log('currTagToLookFor', currTag, toFindLength);
	    if (this.listContainsTag($listToSearch, currTag) === true) {
	      return true;
	    }
	  }
	  return false;
	};
	
	exports.default = TagsBank;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _GeneInterpolation = __webpack_require__(12);
	
	var _GeneInterpolation2 = _interopRequireDefault(_GeneInterpolation);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var GeneInterpolationBank = function ($geneBank, $interpolationsObject) {
	  this.interpolationsArray = [];
	  this.geneBank = $geneBank;
	
	  for (var i = 0, objectLength = $interpolationsObject.length; i < objectLength; i += 1) {
	    var currObject = $interpolationsObject[i];
	    var currInter = new _GeneInterpolation2.default($geneBank, currObject);
	    this.interpolationsArray.push(currInter);
	  }
	};
	
	GeneInterpolationBank.prototype.getAvailableInterpolations = function ($power, $genesArray, $mutatable) {
	  var toReturn = [];
	  for (var i = 0, interpolationsLength = this.interpolationsArray.length; i < interpolationsLength; i += 1) {
	    var currInter = this.interpolationsArray[i];
	    if ($mutatable === true && currInter.mutatable === false) {
	      continue;
	    }
	    if (currInter.power <= $power) {
	      for (var k = 0, genesLength = $genesArray.length; k < genesLength; k += 1) {
	        var currGene = $genesArray[k];
	        if (currInter.getGenes().indexOf(currGene) !== -1) {
	          toReturn.push(currInter);
	        }
	      }
	    }
	  }
	
	  return toReturn;
	};
	
	GeneInterpolationBank.prototype.getInterpolationsForSets = function ($power, $genesArray, $targetGeneSet) {
	  //console.log($targetGeneSet);
	  var toReturn = [];
	  var toAdd;
	  for (var i = 0, firstSetLength = $genesArray.length; i < firstSetLength; i += 1) {
	    var currGene = $genesArray[i];
	    var otherGene = $targetGeneSet.getGeneByType(currGene.type);
	
	    if (otherGene === undefined || otherGene === currGene) {
	      continue;
	    }
	
	    var inters = this.getInterpolationsByGene(currGene);
	    toAdd = undefined;
	    for (var k = 0, interpolationsLength = inters.length; k < interpolationsLength; k += 1) {
	      var currInter = inters[k];
	      if (currInter.getGenes().indexOf(otherGene) !== -1) {
	        toAdd = currInter;
	      }
	    }
	
	    if (toAdd === undefined) {
	      toAdd = _GeneInterpolation2.default.createNew(currGene, otherGene);
	    }
	
	    toReturn.push(toAdd);
	  }
	
	  /*var set1Interpolations = this.getAvailableInterpolations($power, $geneSet1);
	   for (var i = 0, interpolationsLength = set1Interpolations.length; i < interpolationsLength; i += 1)
	  {
	    var currInter = set1Interpolations[i];
	    for (var k = 0, genesLength = $geneSet2.length; k < genesLength; k += 1)
	    {
	      var currGene = $geneSet2[k];
	      if (currInter.getGenes().indexOf(currGene) !== -1)
	      {
	        toReturn.push(currInter);
	      }
	    }
	  }*/
	
	  return toReturn;
	};
	
	GeneInterpolationBank.prototype.getInterpolationsByGene = function ($gene) {
	  var toReturn = [];
	
	  for (var i = 0, interpolationsLength = this.interpolationsArray.length; i < interpolationsLength; i += 1) {
	    var currInter = this.interpolationsArray[i];
	    if (currInter.getGenes().indexOf($gene) !== -1) {
	      toReturn.push(currInter);
	    }
	  }
	
	  return toReturn;
	};
	
	exports.default = GeneInterpolationBank;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var GeneInterpolation = function ($geneBank, $confObject) {
	  this.genes = [];
	  if ($confObject !== undefined) {
	    this.power = $confObject.power;
	    this.mutatable = $confObject.mutatable === 'true';
	    for (var k = 0, genesLength = $confObject.genes.length; k < genesLength; k += 1) {
	      this.genes.push($geneBank.getGeneByName($confObject.genes[k]));
	    }
	  }
	};
	
	GeneInterpolation.prototype.getGenes = function () {
	  return this.genes;
	};
	
	//static
	
	GeneInterpolation.createNew = function ($gene1, $gene2) {
	  var interpolation = new GeneInterpolation();
	  interpolation.genes.push($gene1);
	  interpolation.genes.push($gene2);
	  interpolation.power = 50;
	  return interpolation;
	};
	
	exports.default = GeneInterpolation;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Utils = __webpack_require__(5);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	
	  init: function ($geneBank, $geneInterpolationBank, $tagsBank) {
	    this.geneBank = $geneBank;
	    this.geneInterpolationBank = $geneInterpolationBank;
	    this.tagsBank = $tagsBank;
	    this.power = 0;
	    this.interpolationFunction = undefined;
	    this.usedGenes = undefined;
	  },
	
	  getPower: function () {
	    return this.power;
	  },
	
	  setPower: function ($power) {
	    this.power = $power;
	  },
	
	  mutateRandom: function ($geneSet) {
	    this.interpolationFunction = function ($genesArray) {
	      return this.geneInterpolationBank.getAvailableInterpolations(this.power, $genesArray, true);
	    };
	    this.usedGenes = [];
	    this.mutate($geneSet);
	  },
	
	  mutateWithGeneSet: function ($geneSet, $toMutateWith) {
	    this.interpolationFunction = function ($genesArray) {
	      return this.geneInterpolationBank.getInterpolationsForSets(this.power, $genesArray, $toMutateWith);
	    };
	    this.usedGenes = [];
	    this.mutate($geneSet, $toMutateWith);
	  },
	
	  mutate: function ($geneSet, $targetSet) {
	    var genes = $geneSet.getGenes();
	    var targetGenes = $targetSet !== undefined ? $targetSet.getGenes() : undefined;
	
	    var currGene;
	    var remainingGenes = [];
	    for (var i = 0, genesLength = genes.length; i < genesLength; i += 1) {
	      currGene = genes[i];
	      if (this.usedGenes.indexOf(currGene) === -1) {
	        remainingGenes.push(currGene);
	      }
	    }
	
	    var interpolationsArray = this.interpolationFunction.apply(this, [remainingGenes]);
	
	    if (interpolationsArray === undefined) {
	      return undefined;
	    }
	
	    var inter = _Utils2.default.getRandom(interpolationsArray);
	    interpolationsArray.splice(interpolationsArray.indexOf(inter), 1);
	
	    var refIndex;
	    var targetIndex = -1;
	
	    if (inter === undefined) {
	      return undefined;
	    }
	
	    var interGenes = inter.getGenes();
	
	    var interGenesLength = interGenes.length;
	    for (i = 0; i < interGenesLength; i += 1) {
	      currGene = interGenes[i];
	      if (remainingGenes.indexOf(currGene) !== -1) {
	        refIndex = i;
	      }
	      if (targetGenes !== undefined && targetGenes.indexOf(currGene) !== -1) {
	        targetIndex = i;
	      }
	    }
	
	    if (targetIndex === -1) {
	      if (refIndex === 0) {
	        targetIndex = refIndex + 1;
	      } else {
	        if (refIndex === interGenes.length - 1) {
	          targetIndex = refIndex - 1;
	        } else {
	          targetIndex = Math.random() > 0.5 ? refIndex + 1 : refIndex - 1;
	        }
	      }
	    }
	
	    var newGene = interGenes[targetIndex];
	    this.usedGenes.push(newGene);
	    //console.log('adding', newGene.name);
	    $geneSet.addGene(newGene);
	
	    this.power -= inter.power;
	
	    this.mutate($geneSet, $targetSet);
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map