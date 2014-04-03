'use strict';

var HashMap = (function() {

    // Hash map implementation
    // TODO: this implementation is generic; create a new library for hash tables and remove this
    // -----------------------

    var HashMap = function() {
        this._hashCounter = 0;
        this.size = 0;
    };

    // Base behaviour
    // --------------

    HashMap.prototype.noop = function() {
        return this;
    };

    HashMap.prototype.illegal = function() {
        throw new Error('Illegal operation for Map');
    };

    // Hash policy
    // -----------

    HashMap.prototype.hash = function(value) {
        return (typeof value) + ' ' + (value instanceof Object ?
            (value._hash || (value._hash = ++this._hashCounter)) : value.toString());
    };

    // Hash map functions
    // ------------------

    HashMap.prototype.get = function(key) {
        var item = this[this.hash(key)];
        return item && item.value;
    };

    HashMap.prototype.put = function(key, value) {
        var hash = this.hash(key);

        if(typeof this[hash] === 'undefined') {
            this[hash] = { key : key, value : value };

            ++this.size;
        } else {
            this[hash].value = value;
        }

        return this;
    };

    HashMap.prototype.remove = function(key) {
        var hash = this.hash(key);
        var item = this[hash];

        if(typeof item !== 'undefined') {
            --this.size;

            // Note: this will not delete the object but only a 'undefined' assignment
            // Explanations: the number of hashmap elements are so low that further optimizations aren't required
            delete this[hash];
        }

        return this;
    };

    return HashMap;

})();
