(function() {
    var app = angular.module('Vnb');
    app.factory('NetworkService', ['$q', '$http', 'StateService', function($q, $http, StateService) {
        return {
            getData: function(state) {
                var q = $q.defer();

                var url = StateService.getAjaxUrl(state);
                var request = $http.jsonp(url);
                var data;
                var err = "Unkown Error";

                request.success(function(response) {
                    if (response.success) {
                        q.resolve(response.data);
                    } else {
                        if (response.msg) {
                            err = response.msg;
                        }
                        q.reject(err);
                    }
                });

                request.error(function() {
                    q.reject(err);
                });

                return q.promise;
            }
        };
    }]);
})();