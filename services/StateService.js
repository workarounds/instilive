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
            getAjaxUrl: function(state){
                if(!state) {state = currentState;}

                //based on state construct the URL for ajax call
                
                //for now returning a dummy
                return 'http://localhost/vnb/corners/getCorner.json?id=2&callback=JSON_CALLBACK';
            }
        };
    }]);
})();