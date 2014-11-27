(function() {
    var app = angular.module('vnb.notice', []);

    var controller = ['$scope','VnbRestangular','StateService',function($scope, VnbRestangular, StateService){
        //Initialise
        $scope.comment = '';

        $scope.postLike = function(){
            var sendlike = function(){
                //TODO: change the like button to "Liked"
                VnbRestangular.all('notices')
                    .customPOST({id:$scope.notice.id}, 'like')
                    .then(
                    function(data){
                        if(data.like) {
                            console.log('liked');
                            //TODO: offer some feedback maybe
                        }
                        else{
                            console.log('Unliked');
                            //TODO: change the like button to "Like"
                        }
                    },
                    function(err){
                        //TODO: change the like button back to "Like"
                        console.log(err.data);
                    }
                );
            };

            StateService.fbLogin().then(
                sendlike,
                function(){
                    console.log('not logged in');
                }
            );
        };

        $scope.postComment = function(){
            if($scope.comment != ''){
                VnbRestangular.all('notices')
                    .customPOST({
                        id:$scope.notice.id,
                        comment:$scope.comment},'comment')
                    .then(
                    function(data){
                        console.log(data);
                        $scope.comment = '';
                    },
                    function(err){
                        console.log(err.data);
                    }
                );

            }
        };

        $scope.getLikes = function(){
            VnbRestangular.setJsonp(true);
            VnbRestangular.all('notices')
                .get('likes', {id:$scope.notice.id})
                .then(
                function(data){
                    console.log(data);
                },
                function(err){
                    console.log(err);
                }
            );
        };
    }];

    app.directive('notice', [function() {
        return {
            restrict: 'E',
            templateUrl: '/components/notice/notice.html',
            scope:{
                notice: "=data"
            },
            controller: controller
        };
    }]);
})();
