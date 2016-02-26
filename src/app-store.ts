/**
 * Wrapper for app store
 */

declare function require(path:any):any;

var isEqual = require('is-equal');
var Immutable = require('immutable');
var getValue = require('object-path').get;

export class AppStore {

    private store:any;
    /**
     * Get current state
     */
    public getState:()=>any;
    /**
     * subscribe to a callback with the state
     */
    public subscribe:(subscribeFunction:(state, oldVal?:any, newVal?:any)=>void, filter?:string, useIsEqual?:boolean)=>()=>void;

    /**
     * A shorthand version to subscribe that only returns newVal which is usually all that we are interested in
     *
     */
    public sub:(subscribeFunction:(newVal:any)=>void, filter?:string, useIsEqual?:boolean)=>()=>void;

    /**
     * replaceReducer with a new one
     */
    public replaceReducer:(nextReducer)=>void;

    /**
     * Dispatch an action
     */
    public dispatch:(action)=>void;
    /**
     * Create a dispatcher as a curried function using the passed in action creator and an optional context
     */
    public createDispatcher:(actionCreator, context?)=>(...n:any[])=>void;

    constructor(store:any) {
        this.store = store;
        this.getState = () => {
            return store.getState();
        };

        this.sub = (subscriber:(newVal:any)=>any, filter?:string, useIsEqual?:boolean) => {

            var f = function (a, b, c) {
                return subscriber(c);
            };

            return this.subscribe(f, filter, useIsEqual)
        };

        this.subscribe = (subscriber:(state, oldVal?:any, newVal?:any)=>any, filter?:string, useIsEqual?:boolean) => {
            // decorate the subscriber with the state passed in as a parameter
            if (!filter)
                return store.subscribe(() => subscriber(store.getState()));
            function defaultCompare(a, b) {
                return a === b
            }

            function watch(getState:any, objectPath?:string, compare?:any) {

                compare = compare || defaultCompare;

                var reducerName = objectPath.split('.')[0]
                var mapPath = objectPath.split('.').splice(1);
                var baseVal = getValue(getState(), reducerName);
                // if we are using a nested Immutable map, drill down the path
                if (mapPath.length > 0)
                    baseVal = baseVal.getIn(mapPath);
                return function w(fn) {
                    return function () {
                        var newVal = getValue(getState(), reducerName);
                        // if we are using a nested Immutable map, drill down the path
                        if (mapPath.length > 0)
                            newVal = newVal.getIn(mapPath);
                        if (compare(baseVal, newVal)) return;
                        fn(newVal, baseVal, objectPath);
                        baseVal = newVal;
                    }
                }
            }


            let w = watch(store.getState, filter, useIsEqual ? isEqual : undefined);
            return store.subscribe(w((newVal, oldVal, objectPath) => {
                subscriber(objectPath, oldVal, newVal);
            }))
        };
        this.replaceReducer = (nextReducer) => {
            return store.replaceReducer(nextReducer);
        };
        this.dispatch = (action) => {
            return store.dispatch(action);
        };
        this.createDispatcher = (actionCreator, context?):(...n:any[])=>void => {
            context ? context : context = this;
            return (...args) => store.dispatch(actionCreator.call(context, ...args));
        };
    }
}
