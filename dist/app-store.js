/**
 * Wrapper for app store
 */
var isEqual = require('is-equal');
var Immutable = require('immutable');
var getValue = require('object-path').get;
var AppStore = (function () {
    function AppStore(store) {
        var _this = this;
        this.store = store;
        this.getState = function () {
            return store.getState();
        };
        this.sub = function (subscriber, filter, useIsEqual) {
            var f = function (a, b, c) {
                return subscriber(c);
            };
            return _this.subscribe(f, filter, useIsEqual);
        };
        this.subscribe = function (subscriber, filter, useIsEqual) {
            // decorate the subscriber with the state passed in as a parameter
            if (!filter)
                return store.subscribe(function () { return subscriber(store.getState()); });
            function defaultCompare(a, b) {
                return a === b;
            }
            function watch(getState, objectPath, compare) {
                compare = compare || defaultCompare;
                var reducerName = objectPath.split('.')[0];
                var mapPath = objectPath.split('.').splice(1).join('.');
                var baseVal = getValue(getState(), reducerName);
                if (mapPath != '')
                    baseVal = baseVal.getIn(mapPath);
                return function w(fn) {
                    return function () {
                        var newVal = getValue(getState(), reducerName);
                        if (mapPath != '')
                            newVal = newVal.get(mapPath);
                        if (compare(baseVal, newVal))
                            return;
                        fn(newVal, baseVal, objectPath);
                        baseVal = newVal;
                    };
                };
            }
            var w = watch(store.getState, filter, useIsEqual ? isEqual : undefined);
            return store.subscribe(w(function (newVal, oldVal, objectPath) {
                subscriber(objectPath, oldVal, newVal);
            }));
        };
        this.replaceReducer = function (nextReducer) {
            return store.replaceReducer(nextReducer);
        };
        this.dispatch = function (action) {
            return store.dispatch(action);
        };
        this.createDispatcher = function (actionCreator, context) {
            context ? context : context = _this;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return store.dispatch(actionCreator.call.apply(actionCreator, [context].concat(args)));
            };
        };
    }
    return AppStore;
})();
exports.AppStore = AppStore;
//# sourceMappingURL=app-store.js.map