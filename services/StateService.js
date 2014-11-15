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
            },
            /*
            return : suffix of the ajax URL to get the notices for the current state or the state provided. 
             */
            getAjaxUrl: function(state) {
                if (!state) {
                    state = currentState;
                }

                //based on state construct the URL for ajax call

                //for now returning a dummy
                return '/corners/getCorner.json?id=2';
            }
        };
    }]);
})();