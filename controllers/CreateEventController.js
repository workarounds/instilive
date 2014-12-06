(function () {
    var app = angular.module('Vnb');
    app.controller('CreateEventController',
        [
            'VnbRestangular',
            'StateService',
            '$scope',
            'noticeData',
            function (VnbRestangular, StateService, $scope, noticeData) {
                var createEventCtrl = this;
                if (!noticeData) {
                    var emptyNotice = {
                        type: "event",
                        visible: true,
                        corners: [],
                        from: new Date(),
                        to: new Date(),
                        data: {
                            title: '',
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
                    if(data) {
                        createEventCtrl.positions = data.positions.post_positions;
                        $scope.initPos();
                    }
                };
                StateService.getUserData().then(
                    function (data) {
                        $scope.user = data;
                        setUserData(data);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                $scope.$on('userDataEvent', function (event, data) {
                    $scope.user = data;
                    setUserData(data);
                });

                $scope.initPos = function () {
                    if ($scope.notice.position_id) {
                        for (var tempPositionId in createEventCtrl.positions) {
                            console.log(tempPositionId);
                            var tempPosition = createEventCtrl.positions[tempPositionId];
                            if (tempPosition['id'] === $scope.notice.position_id) {
                                createEventCtrl.position = tempPosition;
                                initSelection();
                                break;
                            }
                        }
                    } else {
                        createEventCtrl.position = createEventCtrl.positions[0];
                        $scope.changePos();
                    }
                };

                var initSelection = function () {
                    console.log('selection inited');
                    $scope.corners = createEventCtrl.position.corners;
                    createEventCtrl.selected = $scope.notice.corners;
                    for (var selectedCornerId in createEventCtrl.selected) {
                        var selectedCorner = createEventCtrl.selected[selectedCornerId];
                        for (var scopeCornerId in $scope.corners) {
                            var scopeCorner = $scope.corners[scopeCornerId];
                            if (scopeCorner.tag === selectedCorner.tag) {
                                $scope.corners.splice(scopeCornerId, 1);
                                break;
                            }
                        }
                    }
                };

                $scope.changePos = function () {
                    createEventCtrl.corners = createEventCtrl.position.corners;
                    createEventCtrl.selected = [];
                };


                createEventCtrl.selected = [];
                createEventCtrl.currentTag = '';
                $scope.format = "dd/MM/yyyy";

                $scope.open = function ($event, opened) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope[opened] = true;
                };
                createEventCtrl.onTagSelect = function (item) {
                    createEventCtrl.selected.push(item);
                    var index = createEventCtrl.corners.indexOf(item);
                    createEventCtrl.corners.splice(index,1);
                    createEventCtrl.currentTag = '';
                };
                createEventCtrl.onTagRemove = function (index) {
                    var tag = createEventCtrl.selected[index];
                    createEventCtrl.selected.splice(index, 1);
                    createEventCtrl.corners.push(tag);
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
                    data.notice.position_id = createEventCtrl.position.id;

                    if(data.notice.corners) {
                        data.notice.corners = [];
                    }
                    for (var i = 0; i < createEventCtrl.selected.length; i++) {
                        data.notice.corners.push(createEventCtrl.selected[i]);
                    }

                    data.notice.start_time = parseInt(data.notice.from.getTime() / 1000);
                    data.notice.end_time = parseInt(data.notice.to.getTime() / 1000);

                    console.log(data);
                    var request = VnbRestangular.all('notices');
                    if (data.notice.id) {
                        request.customPOST(data, 'edit').then(
                            function () {
                                console.log('Edit successful');
                                $scope.notice = emptyNotice;
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
                                $scope.notice = emptyNotice;
                            },
                            function (err) {
                                console.log(err);
                            }
                        );
                    }
                };

            }]);
})();
