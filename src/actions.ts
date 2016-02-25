import {AppStore} from "./app-store"

/**
 * abstract class to provide utility methods for action creators
 */
export class Actions {

    private m_appStore:AppStore;

    constructor(i_appStore?:AppStore) {
        if (i_appStore)
            this.m_appStore = i_appStore;
    }

    public createDispatcher(action:(...n:any[])=>any, appStore?:AppStore):(...args)=>void {
        if (!appStore && !this.m_appStore)
            throw new Error('cant find AppStore for Actions base class');
        appStore = appStore || this.m_appStore;
        return (...n)=>appStore.dispatch(action.call(this, ...n))
    }
}
