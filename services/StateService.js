(function() {
    var app = angular.module('Vnb');

    app.factory('StateService', ['$q','VnbRestangular', function($q,VnbRestangular) {
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
            getData: function(state) {
                if (!state) {
                    state = currentState;
                }

                err = {data:"Network error"};
                var result = $q.reject(err);
                //based on state construct the URL for ajax call
                if(state.notice){
                    var notice = VnbRestangular.one('notices', state.notice);
                    result = notice.customGET();
                }
                else if(state.corner){
                    var corner = VnbRestangular.all('corners');
                    result = corner.customGET('', {tag:state.corner});
                }
                else if(state.board){
                    var board = VnbRestangular.all('boards');
                    result = board.customGET('', {tag:state.board});
                }

                //for now returning a dummy
                return result;
            }
        };
    }]);
})();
