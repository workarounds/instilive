(function () {
    var app = angular.module('Vnb');
    app.controller('UpdateEventController',
        [
            'VnbRestangular',
            'StateService',
            '$scope',
            '$modalInstance',
            'parentData',
            function (VnbRestangular, StateService, $scope, $modalInstance, parentData) {
                var createEventCtrl = this;
                function initialise() {
                    createEventCtrl.selected = [];
                    createEventCtrl.currentTag = '';
                    $scope.format = "dd/MM/yyyy";
                    createEventCtrl.parentData = parentData;

                    StateService.getUserData().then(
                        setUserData,
                        console.log
                    );

                }

                var initNotice = function() {
                    if (!parentData) {
                        console.log('No, parent. Should not be here. Close Modal');
                    } else {
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

                        console.log('parent data');
                        console.log(parentData);
                        $scope.notice = emptyNotice;
                        if(parentData.parent) {
                            $scope.notice.parent = parentData.parent;
                        } else {
                            $scope.notice.parent = parentData.id;
                        }
                        $scope.notice.corners = parentData.corners;
                        $scope.notice.data.parent_title = parentData.data.title;
                    }
                }

                var setUserData = function (data) {
                    console.log('data :');
                    console.log(data);
                    createEventCtrl.positions = data.positions.post_positions;
                    initNotice();
                    $scope.initPos();
                };

                $scope.initPos = function () {
                    if ($scope.notice.position_id) {
                        for (var tempPositionId in createEventCtrl.positions) {
                            console.log(tempPositionId);
                            var tempPosition = createEventCtrl.positions[tempPositionId];
                            if (tempPosition['id'] == $scope.notice.position_id) {
                                createEventCtrl.position = tempPosition;
                                initSelection();
                                break;
                            }
                        }
                    } else {
                        console.log('positions *******************');
                        console.log(createEventCtrl.positions);
                        createEventCtrl.position = createEventCtrl.positions[0];
                        console.log(createEventCtrl.position);
                        initSelection();
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
                            if (scopeCorner.tag == selectedCorner.tag) {
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

                initialise();

            }]);
})();
