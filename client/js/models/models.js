/**
 * Models constructor. This is part of 'models.js' and SHOULD be put in a side
 * library as soon as possible. This will greatly enhance the experience with
 * planner.js because you can REALLY extends Card class with your own attributes.
 *
 * Follow updates at 'models.js' repository: https://github.com/evonove/models.js
 */

(function (window, undefined) {
  'use strict';

  /**
   * Returns a Model object that can be used to generate Model instances
   * @name ModelFactory
   * @param fields
   * @param [methods]
   * @returns {Model}
   * @constructor
   */
  function ModelFactory (fields, methods) {

    /**
     * It's the constructor for defined Models
     * @name Model
     * @param [attrs]
     * @constructor
     */
    function Model (attrs) {
      var instance = this;

      Object.defineProperty(instance, '__attributes__', { value: {} });
      Object.defineProperty(instance, '__inFlightAttributes__', { value: {} });

      // Deserialize given object
      attrs = instance.deserializer(attrs);

      instance.__fields__.forEach(function (field) {
        instance.__attributes__[field] = attrs[field];
        instance.__inFlightAttributes__[field] = undefined;
      });

      // Instance methods
      // ----------------

      /**
       * Rollbacks any changes made in the model before the latest 'persist' call
       * @name rollback
       */
      instance.rollback = function () {
        for (var key in instance.__inFlightAttributes__) {
          if (instance.__inFlightAttributes__.hasOwnProperty(key)) {
            instance.__inFlightAttributes__[key] = undefined;
          }
        }
      };

      /**
       * Persists the model instance so it will not change after a 'rollback' call
       * @name persist
       */
      instance.persist = function () {
        for (var key in instance.__inFlightAttributes__) {
          if (instance.__inFlightAttributes__.hasOwnProperty(key)) {
            if (typeof instance.__inFlightAttributes__[key] !== 'undefined') {
              instance.__attributes__[key] = instance.__inFlightAttributes__[key];
              instance.__inFlightAttributes__[key] = undefined;
            }
          }
        }
      };
    }

    // Accessors
    // ---------

    Object.defineProperty(Model.prototype, '__fields__', { value: fields, writable: true });
    _attributesAccessors(Model.prototype.__fields__, Model.prototype);
    _methodsAccessors(methods, Model.prototype);

    // Serializers
    // -----------

    Model.prototype.toJSON = _defaultSerializer;
    Model.prototype.deserializer = _defaultDeserializer;
    Model.setSerializer = _setSerializer;
    Model.setDeserializer = _setDeserializer;

    /**
     * Default implementation of a basic serializer
     * @name defaultSerializer
     * @returns {Object}
     * @private
     */
    function _defaultSerializer () {
      return _deepMerge({}, this.__attributes__, this.__inFlightAttributes__);
    }

    /**
     * Default implementation of a basic deserializer
     * @name defaultDeserializer
     * @private
     */
    function _defaultDeserializer (attrs) {
      return attrs || {};
    }

    /**
     * Decorate the default model serializer with given function
     * @name setSerializer
     * @param fn
     * @private
     */
    function _setSerializer (fn) {
      if (typeof fn === 'function') {
        Model.prototype.toJSON = function () {
          var one = _defaultSerializer.apply(this);
          return fn.apply(one);
        };
      } else {
        throw new Error('Model serializer should be a function');
      }
    }

    /**
     * Set the default model deserializer with given function
     * @name setSerializer
     * @param fn
     * @private
     */
    function _setDeserializer (fn) {
      if (typeof fn === 'function') {
        Model.prototype.deserializer = fn;
      } else {
        throw new Error('Model deserializer should be a function');
      }
    }

    return Model;
  }

  /**
   * Extends attributes list
   * @name extend
   * @param ParentModel
   * @param [attributes]
   * @param [methods]
   * @returns {ModelFactory}
   */
  ModelFactory.extend = function (ParentModel, attributes, methods) {
    // Inherit
    var child = new ModelFactory(attributes);
    child.prototype = new ParentModel();

    // Create attributes accessors
    child.prototype.__fields__ = attributes.concat(child.prototype.__fields__);
    _attributesAccessors(attributes, child.prototype);
    _methodsAccessors(methods, child.prototype);

    return child;
  };

  // Internal helpers
  // ----------------

  /**
   * Merges two or more objects where the next overrides the previous attributes
   * @name deepMerge
   * @param out
   * @returns {Object}
   * @private
   */
  function _deepMerge (out) {
    var toString = Object.prototype.toString;

    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];

      if (!obj) {
        continue;
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] !== 'undefined') {
          var deducibleType = toString.call(obj[key]);

          switch (deducibleType) {
            case "[object Object]":
              out[key] = _deepMerge(out[key], obj[key]);
              break;
            default:
              out[key] = obj[key];
          }
        }
      }
    }

    if (Object.getOwnPropertyNames(out).length > 0) {
      return out;
    } else {
      return undefined;
    }
  }

  /**
   * Generate accessors for __attributes__ and __inFlightAttributes__
   * @name attributesAccessors
   * @param attributes
   * @param modelPrototype
   * @private
   */
  function _attributesAccessors (attributes, modelPrototype){
    attributes.forEach(function (fieldName) {
      Object.defineProperty(modelPrototype, fieldName, {
        get: function () {
          if (this.__inFlightAttributes__[fieldName] !== undefined) {
            return this.__inFlightAttributes__[fieldName];
          }
          else {
            return this.__attributes__[fieldName];
          }
        },
        set: function (value) {
          this.__inFlightAttributes__[fieldName] = value;
        }
      });
    });
  }

  /**
   * Appends given methods to the 'class' prototype
   * @name methodsAccessors
   * @param methods
   * @param modelPrototype
   * @private
   */
  function _methodsAccessors (methods, modelPrototype) {
    for (var methodName in methods) {
      if (methods.hasOwnProperty(methodName)) {
        modelPrototype[methodName] = methods[methodName];
      }
    }
  }

  // Exports to global scope
  // -----------------------

  window.Model = ModelFactory;

  // Usage
  // -----

  /**
   * Usage
   * -----
   *
   * var animalFields = ['weight', 'height', 'family']
   *     , animalMethods = {
   *       say: function () { console.log('nothing') }
   *     };
   *
   * var dogFields = ['name', 'raceName']
   *     , dogMethods = {
   *       say: function () { console.log('bao') },
   *       play: function () { console.log('bao! bao! bao!') }
   *     };
   *
   * var Animal = new Model(animalFields, animalMethods)
   *     , Dog = Model.extend(Animal, dogFields, dogMethods);
   *
   * window.Models = {};
   * window.Models.Animal = Animal;
   * window.Models.Dog = Dog;
   *
   * window.dog = new Dog();
   * window.cat = new Animal({family: 'persian'});
   *
   */

})(window);
