(function () {
    var app = angular.module('Vnb');

    /* Helper functions to handle dates */
    function getDate(s) {
        var a = s.split(/[^0-9]/);
        var d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
        return d;
    }

    function getAgo(d) {
        //TODO: make this better to return 2d, 1m, 'Nov,28' etc
        var MS_PER_HOUR = 1000 * 60 * 60;
        var now = new Date();
        var diff_hrs = (now.getTime() - d.getTime()) / MS_PER_HOUR;
        var ago = '';
        if (diff_hrs > 24) {
            var diff_days = Math.floor(diff_hrs / 24);
            ago = diff_days + "d";
        } else if (diff_hrs < 1) {
            ago = getAgoLessThanHour(now.getTime() - d.getTime());
        } else {
            ago = Math.floor(diff_hrs) + "h";
        }
        return ago;
    }

    function getAgoLessThanHour(diff) {
        var diff_secs = diff / 1000;
        var diff_mins = diff_secs / 60;
        var ago = '';
        if (diff_secs >= 60) {
            ago = Math.floor(diff_mins) + "m";
        } else {
            ago = Math.floor(diff_secs) + "s";
        }
        return ago;
    }

    function getDuration(diff) {
        //TODO: make this better to return 2d, 1m etc
        var MS_PER_HOUR = 1000 * 60 * 60;
        return Math.floor(diff / MS_PER_HOUR) + "h";
    }

    /* End Helper Functions */

    app.controller('NoticeController', [
        '$scope',
        'VnbRestangular',
        'StateService',
        '$modal',
        function ($scope, VnbRestangular, StateService, $modal) {
            /* initialising the variables */
            function initialise() {
                $scope.canEdit = false;
                $scope.comment = '';
                updateCanEdit(null);

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
                if (!$scope.notice.data.img_url) {
                    $scope.notice.data.img_url = '';
                }
            }

            /* End initialisation */

            /* Functions to decide whether to show edit options */
            function updateCanEdit(data) {
                var userObj;
                console.log('updateCanEdit called');
                if (!data) {
                    userObj = $scope.user;
                } else {
                    userObj = data;
                }
                console.log('user obj is :');
                console.log(userObj);
                if (userObj.positions) {
                    var editPositions = userObj.positions.edit_positions;
                    console.log('positions: ');
                    console.log(editPositions);
                    console.log('notice position_id:');
                    console.log($scope.notice.position_id);
                    for (var editIndex in editPositions) {
                        if (editPositions[editIndex].id == $scope.notice.position_id) {
                            $scope.canEdit = true;
                            return;
                        }
                    }
                }
                $scope.canEdit = false;

            }

            $scope.$on('userDataEvent', function (event, data) {
                console.log('event listened in notice.js');
                updateCanEdit(data);
            });
            $scope.toggleDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };
            /* End Edit Functions */

            /* Functions to handle likes */
            $scope.postLike = function () {
                var sendlike = function () {
                    //TODO: change the like button to "Liked"
                    toggleLike();
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
                            toggleLike();
                            console.log(err.data);
                        }
                    );
                };

                var toggleLike = function () {
                    var noticeIndex = $scope.user.likes.indexOf($scope.notice.id);
                    if (noticeIndex > -1) {
                        $scope.user.likes.splice(noticeIndex, 1);
                    } else {
                        $scope.user.likes.push($scope.notice.id);
                    }
                };

                StateService.fbLogin().then(
                    sendlike,
                    console.log
                );
            };
            function showLikes(data) {
                var modalInstance = $modal.open({
                    templateUrl: 'components/notice/likes.html',
                    controller: 'LikesController as likesCtrl',
                    size: 'sm',
                    resolve: {
                        likeData: function () {
                            console.log("these are the likes");
                            console.log(data);
                            return data;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    console.log('something happened');
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
            $scope.getLikes = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('likes', {id: $scope.notice.id})
                    .then(
                    function (data) {
                        showLikes(data);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                VnbRestangular.setJsonp(false);
            };
            /* End Like Functions */

            /* Functions to handle comments */
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
            /* End comment Functions */

            /* Functions to handle edits and updates to notice */
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
            $scope.addUpdate = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'components/notice/create-event.html',
                    controller: 'UpdateEventController as createEventCtrl',
                    size: 'lg',
                    resolve: {
                        parentData: function () {
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

            /* End notice Edit functions */

            initialise();
        }
    ]);


})();
