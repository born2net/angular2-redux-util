import { AppStore } from "./app-store";
/**
 * abstract class to provide utility methods for action creators
 */
export declare class Actions {
    private m_appStore;
    constructor(i_appStore?: AppStore);
    createDispatcher(action: (...n: any[]) => any, appStore?: AppStore): (...args) => void;
}
