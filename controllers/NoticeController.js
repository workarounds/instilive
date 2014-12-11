(function () {
    var app = angular.module('Vnb');

    /* Helper functions to handle dates */
    function getDate(s) {
        var a = s.split(/[^0-9]/);
        var d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
        return d;
    }

    function getAgo(d) {
        var now = new Date();
        var diff = now.getTime() - d.getTime();
        return getDuration(diff);
    }

    function getDurationLessThanHour(diff) {
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
        var diff_hrs = (diff) / MS_PER_HOUR;
        var result = '';
        if (diff_hrs > 24) {
            var diff_days = Math.floor(diff_hrs / 24);
            result = diff_days + "d";
        } else if (diff_hrs < 1) {
            result = getDurationLessThanHour(diff);
        } else {
            result = Math.floor(diff_hrs) + "h";
        }
        return result;
    }

    /* End Helper Functions */

    app.controller('NoticeController', [
        '$scope',
        'VnbRestangular',
        'StateService',
        '$modal',
        '$state',
        'VnbModal',
        '$rootScope',
        function ($scope, VnbRestangular, StateService, $modal, $state, VnbModal, $rootScope) {
            /* initialising the variables */
            function initialise() {
                var emptyUser = {
                    facebook_id: 0,
                    id: 0,
                    name: 'anon',
                    username: 'anon',
                    gender: 'unknown',
                    likes: []
                };
                $scope.canEdit = false;
                $scope.comment = '';
                $scope.commentsVisible = false;
                $scope.showCommentBox = false;
                $scope.showCopyBox = false;
                $scope.editing = false;

                $scope.currentStateTag = StateService.getState().tag;
                StateService.getUserData().then(
                    function (data) {
                        $scope.user = data;
                        updateCanEdit();
                    },
                    function (err) {
                        $scope.user= emptyUser;
                        console.log(err);
                    }
                );


                if(!$scope.hideUpdate){
                    $scope.hideUpdate = false;
                }

                if($scope.notice.created) {
                    var created = getDate($scope.notice.created);
                    $scope.notice.ago = getAgo(created);
                }
                else{
                    $scope.editing = true;
                    $scope.notice.ago = '0m';
                }

                if($state.current.name == 'create') {
                    $scope.editing = true;
                }

                if ($scope.notice.start_time) {
                    if($scope.notice.start_time != "") {
                        var from = getDate($scope.notice.start_time);
                        var to = getDate($scope.notice.end_time);

                        $scope.notice.from = from;
                        $scope.notice.to = to;
                        $scope.notice.duration = getDuration(to.getTime() - from.getTime());
                    }
                }

                if(typeof $scope.notice.corners === "string") {
                    $scope.notice.corners = JSON.parse($scope.notice.corners);
                }
                if(typeof $scope.notice.data === "string") {
                    $scope.notice.data = JSON.parse($scope.notice.data);
                }
            }
            /* End initialisation */

            $scope.goToNotice = function(){
                $state.go('home.direct', {notice: $scope.notice.id});
            };
            /* functions to get user data */
            $scope.$on('userDataEvent', function (event, data) {
                $scope.user = data;
                updateCanEdit();
            });
            /* end functions to get user data */

            /* Functions to decide whether to show edit options */
            function updateCanEdit() {
                var userObj = $scope.user;
                if (userObj.positions) {
                    var editPositions = userObj.positions.edit_positions;
                    for (var editIndex in editPositions) {
                        if (editPositions[editIndex].id === $scope.notice.position_id) {
                            $scope.canEdit = true;
                            return;
                        }
                    }
                }
                $scope.canEdit = false;

            }

            $scope.toggleDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };
            /* End Edit Functions */

            /* Functions to show pin options */
            $scope.pinCorners = [];
            $scope.updatePinCorners = function () {
                $scope.pinCorners = [];
                var corners = $scope.notice.corners;
                for(var i in corners) {
                    if($scope.existsInEditPositions(corners[i])) {
                        $scope.pinCorners.push(corners[i]);
                    }
                    if(corners[i].tag = $scope.currentStateTag){
                        $scope.currentStateCorner = corners[i];
                    }
                }
            };
            $scope.existsInEditPositions = function (corner) {
                var exists = false;
                var editPositions = $scope.user.positions.edit_positions;
                    for (var i in editPositions) {
                        var corners = editPositions[i].corners;
                        for (var j in corners) {
                            if(corners[j].tag === corner.tag) {
                                return true;
                            }
                        }
                    }
                return exists;
            };
            $scope.pinIn = function (pinCorner) {
                VnbRestangular.all('notices')
                    .customPOST({id: $scope.notice.id, corner: pinCorner, pin: true}, 'pin')
                    .then(
                    function (data) {
                        console.log('pinned');
                        $state.go($state.current, {}, {reload: true});
                    },
                    function (err) {
                        console.log(err.data);
                    }
                );
            };

            $scope.unPin = function (corner){
                VnbRestangular.all('notices')
                    .customPOST({id: $scope.notice.id, corner: corner, pin: false}, 'pin')
                    .then(
                    function (data) {
                        console.log('unpinned');
                        $state.go($state.current, {}, {reload: true});
                    },
                    function (err) {
                        console.log(err.data);
                    }
                );
            };
            /* End pin functions */

            /* Function to copy direct link of the notice to clipboard*/

            //Funtion to share the notice to facebook
            $scope.share = function(){
                if(FB_LOADED){
                    var winHeight = 360;
                    var winWidth = 560;
                    var winTop = (screen.height / 2) - (winHeight / 2);
                    var winLeft = (screen.width / 2) - (winWidth / 2);
                    var title = $scope.notice.data.title;
                    var url = $scope.getShareLink();
                    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[url]=' + url, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
                }
                else{
                    StateService.showToast('Could not connect facebook. Try relaoding the page');
                }
            };

            $scope.getShareLink = function(){
                return 'http://instilive.com/share.php?notice=' + $scope.notice.id;
            };

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
                                $scope.notice.like_count++;
                            }
                            else {
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

            $scope.range = function (min, max, step) {
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) {input.push(i);}
                return input;
            };

            $scope.showLikes = function () {
                if ($scope.notice.like_count > 0) {
                    var modalInstance = $modal.open({
                        templateUrl: 'components/notice/likes.html',
                        controller: 'LikesController as likesCtrl',
                        size: 'sm',
                        resolve: {
                            notice: function () {
                                return $scope.notice;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        console.log('modal closed with success');
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                }
            };
            /* End Like Functions */

            $scope.isTableHeavy = function(table){
                if(table.row_layout){
                    return table.rows >= 3;
                }
                else if(table.column_layout){
                    return table.columns >=3;
                }
                else{
                    return false;
                }
            };

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
                            $scope.comment = '';
                        },
                        function (err) {
                            console.log(err.data);
                        }
                    );
                    $scope.comment = "";

                }
            };
            $scope.showComments = function () {
                $scope.getComments();
            };
            /* End comment Functions */

            /* Functions to handle edits and updates to notice */
            $scope.editNotice = function () {
                $scope.editing = true;
                var modalInstance = $modal.open({
                    templateUrl: 'components/notice/create-event.html',
                    controller: 'CreateEventController as createEventCtrl',
                    size: 'lg',
                    resolve: {
                        noticeData: function () {
                            return $scope.notice;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $scope.editing = false;
                    console.log('Edited');
                }, function () {
                    $scope.editing = false;
                    console.log('Modal dismissed at: ' + new Date());
                });
            };
            $scope.addUpdate = function () {
                //var modalInstance = $modal.open({
                //    templateUrl: 'components/notice/create-event.html',
                //    controller: 'UpdateEventController as createEventCtrl',
                //    size: 'lg',
                //    resolve: {
                //        parentData: function () {
                //            return $scope.notice;
                //        }
                //    }
                //});
                //
                //modalInstance.result.then(function () {
                //    console.log('modal closed with success');
                //}, function () {
                //    console.log('Modal dismissed at: ' + new Date());
                //});
                $rootScope.parentNotice = $scope.notice;
                $state.go('create', {parentNotice: $scope.notice});
            };
            $scope.showUpdates = function() {
                var modalParams = {
                    templateUrl: 'components/notice/updates.html',
                    controller: 'UpdatesController as updatesCtrl',
                    size: 'lg',
                    resolve: {
                        notice: function () {
                            return $scope.notice;
                        }
                    },
                    state: '^.notice',
                    params: {notice: $scope.notice.id}
                };
                VnbModal.openModal(modalParams);
            };
            /* End notice Edit functions */

            initialise();
        }
    ]);


})();
