(function() {
	var app = angular.module('Vnb');
	app.factory('NetworkService', ['$state', '$q', '$http', function($state, $q, $http){
		var currentState = {};
		return {
			getData : function () {
				var state = this.getState();
				var q = $q.defer();

				var request = $http.jsonp('http://localhost/vnb/corners/getCorner.json?id=2&callback=JSON_CALLBACK');
				var data;
				var err = "Unkown Error";

				request.success(function(response){
					if(response.success){
						q.resolve(response.data);
					}
					else{
						if(response.msg){
							err = response.msg;
						} 
						q.reject(err);
					}
				});

				request.error(function(){
					q.reject(err);
				});

				return q.promise;
			}, 
			getState : function () {			
				return currentState;
			},
			setState : function (stateParams) {
				currentState.board = stateParams.board;
				currentState.corner = stateParams.corner;
				currentState.notice = stateParams.notice;
			}
		};
	}]);
})() ;