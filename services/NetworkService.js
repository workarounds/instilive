(function() {
    var app = angular.module('Vnb');
    app.factory('NetworkService', ['$q', '$http', 'StateService', function($q, $http, StateService) {
        var host = 'http://localhost/vnb';
        var handleAjaxRequest = function(request) {
            var q = $q.defer();
            var err = "Unknown Error";
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
        };
        return {
            getData: function(state) {
                var url = host + StateService.getAjaxUrl(state);
                var request = $http.get(url);

                return handleAjaxRequest(request);
            },
            addNotice: function(data) {
                var url = host + '/notices/add';
                var request = $http.post(url, data);

                return handleAjaxRequest(request);
            },
            getSidebar: function(){
                var url = host + '/boards/getSidebar';
                var request = $http.get(url);
                return request;                
            }
        };
    }]);
})();