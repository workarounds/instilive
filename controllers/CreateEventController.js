(function () {
    var app = angular.module('Vnb');
    app.controller('CreateEventController',
        [
            'VnbRestangular',
            'StateService',
            '$scope',
            '$modalInstance',
            'noticeData',
            function (VnbRestangular, StateService, $scope, $modalInstance, noticeData) {
                var createEventCtrl = this;
                console.log(noticeData);
                if (!noticeData) {
                    var emptyNotice = {
                        type: "event",
                        visible: true,
                        corners: [],
                        from: new Date(),
                        to: new Date(),
                        data: {
                            title: 'Yo',
                            content: '',
                            venue: ''
                        },
                        start_time: '',
                        end_time: ''
                    };
                    $scope.notice = emptyNotice;

                } else {
                    $scope.notice = noticeData;
                }

                var setUserData = function (data) {
                    console.log(data);
                    $scope.positions = data.positions.post_positions;
                    $scope.initPos();
                };
                StateService.getUserData().then(
                    setUserData,
                    console.log
                );

                $scope.initPos = function () {
                    if ($scope.notice.position_id) {
                        for (var tempPositionId in $scope.positions) {
                            console.log(tempPositionId);
                            var tempPosition = $scope.positions[tempPositionId];
                            if (tempPosition['id'] == $scope.notice.position_id) {
                                $scope.position = tempPosition;
                                initSelection();
                                break;
                            }
                        }
                    } else {
                        $scope.position = $scope.positions[0];
                        $scope.changePos();
                    }
                }

                var initSelection = function () {
                    $scope.corners = $scope.position.corners;
                    $scope.selected = $scope.notice.corners;
                    for (var selectedCornerId in $scope.selected) {
                        var selectedCorner = $scope.selected[selectedCornerId];
                        for (var scopeCornerId in $scope.corners) {
                            var scopeCorner = $scope.corners[scopeCornerId];
                            if (scopeCorner.tag == selectedCorner.tag) {
                                $scope.corners.splice(scopeCornerId, 1);
                                break;
                            }
                        }
                    }
                }

                $scope.changePos = function () {
                    $scope.corners = $scope.position.corners;
                    $scope.selected = [];
                };


                $scope.selected = [];
                $scope.currentTag = '';
                $scope.format = "dd/MM/yyyy";

                $scope.open = function ($event, opened) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope[opened] = true;
                };
                createEventCtrl.onTagSelect = function (item) {
                    $scope.selected.push(item);
                    var index = $scope.corners.indexOf(item);
                    $scope.corners.splice(index, 1);
                    console.log("on tag select running");
                    $scope.currentTag = "Useless";
                    console.log($scope.currentTag);
                };
                createEventCtrl.onTagRemove = function (index) {
                    var tag = $scope.selected[index];
                    $scope.selected.splice(index, 1);
                    $scope.corners.push(tag);
                };

                createEventCtrl.adjustToDate = function () {
                    var to = $scope.notice.to;
                    var from = $scope.notice.from;
                    if (to < from) {
                        $scope.notice.to = from;
                    }
                };

                createEventCtrl.adjustFromDate = function () {
                    var to = $scope.notice.to;
                    var from = $scope.notice.from;

                    if (to < from) {
                        $scope.notice.from = to;
                    }
                };

                createEventCtrl.test = function () {
                    VnbRestangular.setJsonp(false);
                    VnbRestangular.all('users').get('index').then(
                        function (data) {
                            console.log(data);
                        },
                        function (err) {
                            console.log(err.data);
                        }
                    );
                };

                createEventCtrl.add = function () {
                    var data = {
                        notice: $scope.notice
                    };
                    data.notice.position_id = $scope.position.id;

                    for (var i = 0; i < $scope.selected.length; i++) {
                        data.notice.corners.push($scope.selected[i]);
                    }

                    data.notice.start_time = parseInt(data.notice.from.getTime() / 1000);
                    data.notice.end_time = parseInt(data.notice.to.getTime() / 1000);

                    console.log(data);
                    var request = VnbRestangular.all('notices');
                    if (data.notice.id) {
                        request.customPOST(data, 'edit').then(
                            function () {
                                console.log('Edit successful');
                            },
                            function (err) {
                                console.log(err);
                            }
                        );
                    }
                    else {
                        request.customPOST(data, 'add').then(
                            function () {
                                console.log('Post successful');
                            },
                            function (err) {
                                console.log(err);
                            }
                        );
                    }
                    $modalInstance.close();
                };

            }]);
})();
