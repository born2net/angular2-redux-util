export declare class AppStore {
    private store;
    /**
     * Get current state
     */
    getState: () => any;
    /**
     * subscribe to a callback with the state
     * oldVal deprecated
     */
    subscribe: (subscribeFunction: (state, oldVal?: any, newVal?: any) => void, filter?: string, useIsEqual?: boolean) => () => void;
    /**
     * A shorthand version to subscribe that only returns newVal which is usually all that we are interested in
     *
     */
    sub: (subscribeFunction: (newVal: any) => void, filter?: string, useIsEqual?: boolean) => () => void;
    /**
     * replaceReducer with a new one
     */
    replaceReducer: (nextReducer) => void;
    /**
     * Dispatch an action
     */
    dispatch: (action) => void;
    /**
     * get a value from store
     */
    getsKey: (i_reducer: string, i_path: string, key: string) => any;
    /**
     * Create a dispatcher as a curried function using the passed in action creator and an optional context
     */
    createDispatcher: (actionCreator, context?) => (...n: any[]) => void;
    constructor(store: any);
}
