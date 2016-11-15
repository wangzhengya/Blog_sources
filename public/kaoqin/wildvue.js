(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WildVue"] = factory();
	else
		root["WildVue"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var Vue // late binding

	/**
	 * Check if a value is an object.
	 *
	 * @param {*} val
	 * @return {boolean}
	 */
	function isObject (val) {
	  return Object.prototype.toString.call(val) === '[object Object]'
	}

	/**
	 * Convert wilddog snapshot into a bindable data record.
	 *
	 * @param {WilddogSnapshot} snapshot
	 * @return {Object}
	 */
	function createRecord (snapshot) {
	  var value = snapshot.val()
	  var res = isObject(value)
	    ? value
	    : { '.value': value }
	  res['.key'] = snapshot.key()
	  return res
	}

	/**
	 * Find the index for an object with given key.
	 *
	 * @param {array} array
	 * @param {string} key
	 * @return {number}
	 */
	function indexForKey (array, key) {
	  for (var i = 0; i < array.length; i++) {
	    if (array[i]['.key'] === key) {
	      return i
	    }
	  }
	  /* istanbul ignore next */
	  return -1
	}

	/**
	 * Bind a wilddog data source to a key on a vm.
	 *
	 * @param {Vue} vm
	 * @param {string} key
	 * @param {object} source
	 */
	function bind (vm, key, source) {
	  var asObject = false
	  var cancelCallback = null
	  // check { source, asArray, cancelCallback } syntax
	  if (isObject(source) && source.hasOwnProperty('source')) {
	    asObject = source.asObject
	    cancelCallback = source.cancelCallback
	    source = source.source
	  }
	  if (!isObject(source)) {
	    throw new Error('WildVue: invalid Wilddog binding source.')
	  }
	  // get the original ref for possible queries
	  var ref = source
	  if (typeof source.ref === 'function') {
	    ref = source.ref()
	  }
	  vm.$wilddogRefs[key] = ref
	  vm._wilddogSources[key] = source
	  // bind based on initial value type
	  if (asObject) {
	    bindAsObject(vm, key, source, cancelCallback)
	  } else {
	    bindAsArray(vm, key, source, cancelCallback)
	  }
	}

	/**
	 * Bind a wilddog data source to a key on a vm as an Array.
	 *
	 * @param {Vue} vm
	 * @param {string} key
	 * @param {object} source
	 * @param {function|null} cancelCallback
	 */
	function bindAsArray (vm, key, source, cancelCallback) {
	  var array = []
	  Vue.util.defineReactive(vm, key, array)

	  var onAdd = source.on('child_added', function (snapshot, prevKey) {
	    var index = prevKey ? indexForKey(array, prevKey) + 1 : 0
	    array.splice(index, 0, createRecord(snapshot))
	  }, cancelCallback)

	  var onRemove = source.on('child_removed', function (snapshot) {
	    var index = indexForKey(array, snapshot.key())
	    array.splice(index, 1)
	  }, cancelCallback)

	  var onChange = source.on('child_changed', function (snapshot) {
	    var index = indexForKey(array, snapshot.key())
	    array.splice(index, 1, createRecord(snapshot))
	  }, cancelCallback)

	  var onMove = source.on('child_moved', function (snapshot, prevKey) {
	    var index = indexForKey(array, snapshot.key())
	    var record = array.splice(index, 1)[0]
	    var newIndex = prevKey ? indexForKey(array, prevKey) + 1 : 0
	    array.splice(newIndex, 0, record)
	  }, cancelCallback)

	  vm._wilddogListeners[key] = {
	    child_added: onAdd,
	    child_removed: onRemove,
	    child_changed: onChange,
	    child_moved: onMove
	  }
	}

	/**
	 * Bind a wilddog data source to a key on a vm as an Object.
	 *
	 * @param {Vue} vm
	 * @param {string} key
	 * @param {Object} source
	 * @param {function|null} cancelCallback
	 */
	function bindAsObject (vm, key, source, cancelCallback) {
	  Vue.util.defineReactive(vm, key, {})
	  var cb = source.on('value', function (snapshot) {
	    vm[key] = createRecord(snapshot)
	  }, cancelCallback)
	  vm._wilddogListeners[key] = { value: cb }
	}

	/**
	 * Unbind a wilddog-bound key from a vm.
	 *
	 * @param {Vue} vm
	 * @param {string} key
	 */
	function unbind (vm, key) {
	  var source = vm._wilddogSources && vm._wilddogSources[key]
	  if (!source) {
	    throw new Error(
	      'WildVue: unbind failed: "' + key + '" is not bound to ' +
	      'a Wilddog reference.'
	    )
	  }
	  var listeners = vm._wilddogListeners[key]
	  for (var event in listeners) {
	    source.off(event, listeners[event])
	  }
	  vm[key] = null
	  vm.$wilddogRefs[key] = null
	  vm._wilddogSources[key] = null
	  vm._wilddogListeners[key] = null
	}

	/**
	 * Ensure the related bookkeeping variables on an instance.
	 *
	 * @param {Vue} vm
	 */
	function ensureRefs (vm) {
	  if (!vm.$wilddogRefs) {
	    vm.$wilddogRefs = Object.create(null)
	    vm._wilddogSources = Object.create(null)
	    vm._wilddogListeners = Object.create(null)
	  }
	}

	var WildVueMixin = {
	  init: function () {
	    var bindings = this.$options.wilddog
	    if (!bindings) return
	    ensureRefs(this)
	    for (var key in bindings) {
	      bind(this, key, bindings[key])
	    }
	  },
	  beforeDestroy: function () {
	    if (!this.$wilddogRefs) return
	    for (var key in this.$wilddogRefs) {
	      if (this.$wilddogRefs[key]) {
	        this.$unbind(key)
	      }
	    }
	    this.$wilddogRefs = null
	    this._wilddogSources = null
	    this._wilddogListeners = null
	  }
	}

	/**
	 * Install function passed to Vue.use() in manual installation.
	 *
	 * @param {function} _Vue
	 */
	function install (_Vue) {
	  Vue = _Vue
	  Vue.mixin(WildVueMixin)

	  // use object-based merge strategy
	  var mergeStrats = Vue.config.optionMergeStrategies
	  mergeStrats.wilddog = mergeStrats.methods

	  // extend instance methods
	  Vue.prototype.$bindAsObject = function (key, source, cancelCallback) {
	    ensureRefs(this)
	    bind(this, key, {
	      source: source,
	      asObject: true,
	      cancelCallback: cancelCallback
	    })
	  }

	  Vue.prototype.$bindAsArray = function (key, source, cancelCallback) {
	    ensureRefs(this)
	    bind(this, key, {
	      source: source,
	      cancelCallback: cancelCallback
	    })
	  }

	  Vue.prototype.$unbind = function (key) {
	    unbind(this, key)
	  }
	}

	// auto install
	/* istanbul ignore if */
	if (typeof window !== 'undefined' && window.Vue) {
	  install(window.Vue)
	}

	module.exports = install


/***/ }
/******/ ])
});
;