/**
 * abstract class to provide utility methods for action creators
 */
var Actions = (function () {
    function Actions(i_appStore) {
        if (i_appStore)
            this.m_appStore = i_appStore;
    }
    Actions.prototype.createDispatcher = function (action, appStore) {
        var _this = this;
        if (!appStore && !this.m_appStore)
            throw new Error('cant find AppStore for Actions base class');
        appStore = appStore || this.m_appStore;
        return function () {
            var n = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                n[_i - 0] = arguments[_i];
            }
            return appStore.dispatch(action.call.apply(action, [_this].concat(n)));
        };
    };
    return Actions;
})();
exports.Actions = Actions;
//# sourceMappingURL=actions.js.map