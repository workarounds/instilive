(function () {
    var app = angular.module('Vnb');
    app.controller('CreateEventController',
        [
            'VnbRestangular',
            'StateService',
            '$scope',
            'noticeData',
            'imgur',
            '$q',
            function (VnbRestangular, StateService, $scope, noticeData, imgur, $q) {
                var createEventCtrl = this;
                var initialise = function () {
                    // initialising the booleans
                    createEventCtrl.hasImage = false;
                    createEventCtrl.hasTable = false;

                    createEventCtrl.lastUploadImage = null;
                    createEventCtrl.uploading = false;

                    createEventCtrl.corners = [];
                    createEventCtrl.format = "dd/MM/yyyy";

                    if (!noticeData) {
                        var emptyNotice = {
                            is_event: false,
                            visible: true,
                            corners: [],
                            from: new Date(),
                            to: new Date(),
                            data: {
                                title: '',
                                venue: '',
                                blocks: []
                            },
                            start_time: '',
                            end_time: ''
                        };
                        $scope.notice = emptyNotice;

                    } else {
                        $scope.notice = noticeData;
                    }

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
                };

                createEventCtrl.printData = function () {
                    console.log($scope.notice.data.blocks);
                };

                createEventCtrl.addImage = function () {
                    var ImageObj = {
                        type: 'image',
                        content: {}
                    };
                    if (createEventCtrl.hasImage) {
                        var index = createEventCtrl.findIndexOf(ImageObj);
                        $scope.notice.data.blocks.splice(index, true);
                        createEventCtrl.hasImage = false;
                    } else {
                        $scope.notice.data.blocks.push(ImageObj);
                        createEventCtrl.hasImage = true;
                    }
                };
                createEventCtrl.addTable = function () {
                    var TableObj = {
                        type: 'table',
                        content: {}
                    };
                    if (createEventCtrl.hasTable) {
                        var index = createEventCtrl.findIndexOf(TableObj);
                        $scope.notice.data.blocks.splice(index, 1);
                        createEventCtrl.hasTable = false;

                    } else {
                        $scope.notice.data.blocks.push(TableObj);
                        createEventCtrl.hasTable = true;

                    }
                };
                createEventCtrl.addText = function () {
                    var TextObj = {
                        type: 'text',
                        content: {}
                    };
                    $scope.notice.data.blocks.push(TextObj);
                };

                createEventCtrl.deleteBlock = function (index) {
                    var block = $scope.notice.data.blocks[index];
                    if (block.type == 'image') {
                        createEventCtrl.hasImage = false;
                    }
                    if (block.type == 'table') {
                        createEventCtrl.hasTable = false;
                    }
                    $scope.notice.data.blocks.splice(index, 1);
                };

                createEventCtrl.findIndexOf = function (TypeObj) {
                    for (var i in $scope.notice.data.blocks) {
                        var dataType = $scope.notice.data.blocks[i];
                        if (dataType.type === TypeObj.type) {
                            return i;
                        }
                    }
                };
                createEventCtrl.range = function (min, max, step) {
                    step = step || 1;
                    var input = [];
                    for (var i = min; i <= max; i += step) input.push(i);
                    return input;
                };
                createEventCtrl.upload = function () {
                    var deferred = $q.defer();
                    var file = false;
                    if(createEventCtrl.image) {
                        file = createEventCtrl.image.file;
                    }
                    if (!file) {
                        deferred.reject('no file');
                        return deferred.promise;
                    } else if (!file.type.match(/image.*/)) {
                        deferred.reject('file not image');
                        return deferred.promise;
                    } else if (createEventCtrl.lastUploadImage == createEventCtrl.image) {
                        deferred.resolve();
                        console.log('uploaded');
                        return deferred.promise;
                    }
                    imgur.setAPIKey('Client-ID 86505db4630921a');
                    createEventCtrl.uploading = true;
                    imgur.upload(file).then(function (model) {
                            var ImageObj = {
                                type: 'image',
                                content: {}
                            };
                            var index = createEventCtrl.findIndexOf(ImageObj);
                            $scope.notice.data.blocks[index].content = model;
                            createEventCtrl.lastUploadImage = createEventCtrl.image;
                            createEventCtrl.uploading = false;
                            deferred.resolve();
                            console.log('uploading');
                        },
                        function (err) {
                            createEventCtrl.uploading = false;
                            deferred.reject(err);
                        });
                    return deferred.promise;
                };


                var setUserData = function (user) {
                    if (user) {
                        createEventCtrl.positions = user.positions.post_positions;
                        createEventCtrl.initPos();
                        $scope.notice.data.user_name = user.name;
                        $scope.notice.data.user_fb_id = user.facebook_id;
                    }
                };

                createEventCtrl.initPos = function () {
                    if ($scope.notice.position_id) {
                        for (var tempPositionId in createEventCtrl.positions) {
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
                    createEventCtrl.corners = createEventCtrl.position.corners;
                };

                $scope.changePos = function () {
                    createEventCtrl.corners = createEventCtrl.position.corners;
                    $scope.notice.corners = [];
                    $scope.notice.data.position_name = createEventCtrl.position.name;
                    $scope.notice.position_id = createEventCtrl.position.id;
                };

                $scope.open = function ($event, opened) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope[opened] = true;
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

                createEventCtrl.isDataValid = function () {
                    var hasCorners = $scope.notice.corners.length > 0;
                    var hasBlocks = $scope.notice.data.blocks.length > 0;
                    var isEvent = $scope.notice.is_event;
                    if (createEventCtrl.hasImage) {
                        if (!createEventCtrl.image) {
                            return false;
                        }
                    }
                    if(createEventCtrl.uploading){
                        return false;
                    }
                    return (hasCorners) && ((hasBlocks) || (isEvent));
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
                    if (createEventCtrl.hasImage) {
                        createEventCtrl.upload().then(createEventCtrl.post);
                    }
                };

                createEventCtrl.post = function () {
                    var data = {
                        notice: $scope.notice
                    };
                    data.notice.position_id = createEventCtrl.position.id;

                    if (createEventCtrl.hasEvent) {
                        data.notice.start_time = parseInt(data.notice.from.getTime() / 1000);
                        data.notice.end_time = parseInt(data.notice.to.getTime() / 1000);
                    }


                    console.log(data);
                    //var request = VnbRestangular.all('notices');
                    //if (data.notice.id) {
                    //    request.customPOST(data, 'edit').then(
                    //        function () {
                    //            console.log('Edit successful');
                    //            $scope.notice = emptyNotice;
                    //        },
                    //        function (err) {
                    //            console.log(err);
                    //        }
                    //    );
                    //}
                    //else {
                    //    request.customPOST(data, 'add').then(
                    //        function () {
                    //            console.log('Post successful');
                    //            $scope.notice = emptyNotice;
                    //        },
                    //        function (err) {
                    //            console.log(err);
                    //        }
                    //    );
                    //}
                };

                initialise();

            }]);
})();
