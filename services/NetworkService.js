(function() {
    var app = angular.module('Vnb');
    app.factory('NetworkService', ['$q', '$http', 'StateService', function($q, $http, StateService) {
        var host = 'http://localhost/vnb';
        //var handleAjaxRequest = function(request) {
        //    var q = $q.defer();
        //    var errMsg = "Unknown Error";
        //    request.success(function(response) {
        //        if (response.success) {
        //            q.resolve(response.data);
        //        } else {
        //            if (response.msg) {
        //                errMsg = response.msg;
        //            }
        //            q.reject(errMsg);
        //        }
        //    });
        //
        //    request.error(function() {
        //        q.reject(errMsg);
        //    });
        //
        //    return q.promise;
        //};
        return {
            getData: function(state) {
                var url = host + StateService.getAjaxUrl(state);
                var request = $http.get(url);

                return request;
            },
            addNotice: function(data) {
                var url = host + '/api/admins/create';
                var request = $http.post(url, data);

                return request;
            },
            getSidebar: function(){
                var url = host + '/boards/getSidebar';
                var request = $http.get(url);
                return request;
            }
        };
    }]);
})();
