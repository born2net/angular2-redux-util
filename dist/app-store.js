/**
 * Wrapper for app store
 */
var isEqual = require('is-equal');
var getValue = require('object-path').get;
var AppStore = (function () {
    function AppStore(store) {
        this.store = store;
        this.getState = function () {
            return store.getState();
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
                var baseVal = getValue(getState(), objectPath);
                return function w(fn) {
                    return function () {
                        var newVal = getValue(getState(), objectPath);
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