(function() {
    var app = angular.module('Vnb');

    app.factory('StateService', [function() {
        var currentState = {};
        return {
            setState: function($stateParams) {
                currentState.board = $stateParams.board;
                currentState.corner = $stateParams.corner;
                currentState.notice = $stateParams.notice;
            },
            getState: function() {
                return currentState;
            }
        };
    }]);
})();