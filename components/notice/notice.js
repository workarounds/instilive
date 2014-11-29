(function () {
    var app = angular.module('vnb.notice', []);

    function getDate(s) {
        var a = s.split(/[^0-9]/);
        var d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
        return d;
    }

    function getAgo(d) {
        //TODO: make this better to return 2d, 1m, 'Nov,28' etc
        var MS_PER_HOUR = 1000 * 60 * 60;
        var now = new Date();
        return Math.floor((now.getTime() - d.getTime()) / MS_PER_HOUR) + " h";
    }

    function getDuration(diff) {
        //TODO: make this better to return 2d, 1m etc
        var MS_PER_HOUR = 1000 * 60 * 60;
        return Math.floor(diff / MS_PER_HOUR) + "h";
    }

    var controller = ['$scope', 'VnbRestangular', 'StateService', '$modal',
        function ($scope, VnbRestangular, StateService, $modal) {
            //Initialise
            $scope.comment = '';
            var created = getDate($scope.notice.created);
            $scope.notice.ago = getAgo(created);
            if ($scope.notice.start_time) {
                var from = getDate($scope.notice.start_time);
                var to = getDate($scope.notice.end_time);

                $scope.notice.from = from;
                $scope.notice.to = to;
                $scope.notice.duration = getDuration(to.getTime() - from.getTime());
            }

            $scope.notice.corners = JSON.parse($scope.notice.corners);
            if(!$scope.notice.data.img_url){
                $scope.notice.data.img_url = '';
            }

            $scope.postLike = function () {
                var sendlike = function () {
                    //TODO: change the like button to "Liked"
                    VnbRestangular.all('notices')
                        .customPOST({id: $scope.notice.id}, 'like')
                        .then(
                        function (data) {
                            if (data.like) {
                                console.log('liked');
                                $scope.notice.like_count++;
                            }
                            else {
                                console.log('Unliked');
                                $scope.notice.like_count--;
                            }
                        },
                        function (err) {
                            //TODO: change the like button back to "Like"
                            console.log(err.data);
                        }
                    );
                };

                StateService.fbLogin().then(
                    sendlike,
                    console.log
                );
            };

            $scope.postComment = function () {
                if ($scope.comment !== '') {
                    VnbRestangular.all('notices')
                        .customPOST({
                            id: $scope.notice.id,
                            comment: $scope.comment
                        }, 'comment')
                        .then(
                        function (data) {
                            console.log(data);
                            $scope.comment = '';
                        },
                        function (err) {
                            console.log(err.data);
                        }
                    );

                }
            };

            $scope.getLikes = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('likes', {id: $scope.notice.id})
                    .then(
                    function (data) {
                        console.log(data);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                VnbRestangular.setJsonp(false);
            };

            $scope.toggleDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.editNotice = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'components/notice/create-event.html',
                    controller: 'CreateEventController as createEventCtrl',
                    size: 'lg',
                    resolve: {
                        noticeData: function () {
                            console.log("this is the notice");
                            console.log($scope.notice);
                            return $scope.notice;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    console.log('something happened');
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };
        }];

    app.directive('notice', [function () {
        return {
            restrict: 'E',
            templateUrl: '/components/notice/notice.html',
            scope: {
                notice: "=data"
            },
            controller: controller
        };
    }]);
})();
