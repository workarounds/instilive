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
            '$modalInstance',
            '$state',
            '$rootScope',
            function (VnbRestangular, StateService, $scope, noticeData, imgur, $q, $modalInstance, $state, $rootScope) {
                var createEventCtrl = this;
                var initialise = function () {
                    // initialising the booleans
                    createEventCtrl.block_types = {
                        image : {
                            type: 'image',
                            limit: true,
                            present: false
                        },
                        table : {
                            type: 'table',
                            limit : true,
                            present : false
                        },
                        video : {
                            type: 'video',
                            limit: true,
                            present: false
                        },
                        text : {
                            type: 'text',
                            limit : false
                        }
                    };

                    createEventCtrl.lastUploadImage = null;
                    createEventCtrl.uploading = false;

                    createEventCtrl.corners = [];
                    createEventCtrl.format = "dd.MM.yyyy";

                    if (!noticeData) {
                        var emptyNotice = {
                            is_event: false,
                            visible: true,
                            corners: [],
                            from: new Date(),
                            to: new Date(),
                            data: {
                                title: 'Sample title',
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


                    createEventCtrl.parent = $rootScope.parentNotice;
                    console.log(createEventCtrl.parent);
                    $rootScope.parentNotice = null;
                    if (createEventCtrl.parent) {
                        if (createEventCtrl.parent.parent) {
                            $scope.notice.parent = createEventCtrl.parent.parent;
                            $scope.notice.data.parent_title = createEventCtrl.parent.data.parent_title;
                        } else {
                            $scope.notice.parent = createEventCtrl.parent.id;
                            $scope.notice.data.parent_title = createEventCtrl.parent.data.title;
                        }
                        $scope.notice.corners = createEventCtrl.parent.corners;
                    }
                    console.log(createEventCtrl.parent);

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

                createEventCtrl.addBlock = function (type) {
                    var blockObj = {
                        type: type,
                        content: {}
                    };
                    $scope.notice.data.blocks.push(blockObj);
                    if(createEventCtrl.block_types[type].limit) {
                        createEventCtrl.block_types[type].present = true;
                    }
                };

                createEventCtrl.deleteBlock = function (index) {
                    var block = $scope.notice.data.blocks[index];
                    $scope.notice.data.blocks.splice(index, 1);
                    if(createEventCtrl.block_types[block.type].limit) {
                        createEventCtrl.block_types[block.type].present = false;
                    }
                };

                createEventCtrl.isButtonDisabled = function(type) {
                    if(createEventCtrl.block_types[type].limit) {
                        return createEventCtrl.block_types[type].present;
                    } else {
                        return false;
                    }
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
                    for (var i = min; i <= max; i += step) {
                        input.push(i);
                    }
                    return input;
                };
                createEventCtrl.upload = function () {
                    var deferred = $q.defer();
                    var file = false;
                    if (createEventCtrl.image) {
                        file = createEventCtrl.image.file;
                    }
                    if (!file) {
                        deferred.reject('no file');
                        return deferred.promise;
                    } else if (!file.type.match(/image.*/)) {
                        deferred.reject('file not image');
                        return deferred.promise;
                    } else if (createEventCtrl.lastUploadImage === createEventCtrl.image) {
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

                createEventCtrl.login = function () {
                    StateService.fbLogin();
                };

                createEventCtrl.initPos = function () {
                    if ($scope.notice.position_id) {
                        for (var tempPositionId in createEventCtrl.positions) {
                            var tempPosition = createEventCtrl.positions[tempPositionId];
                            if (tempPosition['id'] === $scope.notice.position_id) {
                                createEventCtrl.position = tempPosition;
                                break;
                            }
                        }
                    } else {
                        createEventCtrl.position = createEventCtrl.positions[0];
                    }
                    $scope.changePos();
                };

                var initSelection = function () {
                    createEventCtrl.corners = createEventCtrl.position.corners;
                };

                $scope.changePos = function () {
                    createEventCtrl.corners = createEventCtrl.position.corners;
                    var currentCorners = angular.copy($scope.notice.corners);
                    $scope.notice.corners = [];
                    for(var i = 0; i < currentCorners.length; i++){
                        for(var j = 0; j < createEventCtrl.corners.length; j++) {
                            if (createEventCtrl.corners[j].tag == currentCorners[i].tag) {
                                $scope.notice.corners.push(currentCorners[i]);
                            }
                        }
                    }
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
                    if (createEventCtrl.block_types['image'].present) {
                        if (!createEventCtrl.image) {
                            return false;
                        }
                    }
                    if (createEventCtrl.uploading) {
                        return false;
                    }
                    if(createEventCtrl.block_types['video'].present) {
                        for (var i in $scope.notice.data.blocks) {
                            var block = $scope.notice.data.blocks[i];
                            if(block.type == 'video') {
                                if(block.content.video_url) {
                                    //console.log(block.type.content.video_url);
                                    return block.content.video_url.match(/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/);
                                }
                            }
                        }
                    }
                    return (hasCorners) && ((hasBlocks) || (isEvent));
                };

                createEventCtrl.test = function () {
                    var result = StateService.getLoginStatus();
                    result.then(function (data) {
                        console.log(data);
                    }, function (err) {
                        console.log(err);
                    });
                };

                createEventCtrl.add = function () {
                    if (createEventCtrl.block_types['image'].present) {
                        createEventCtrl.upload().then(createEventCtrl.post);
                    }
                    else {
                        createEventCtrl.post();
                    }
                };

                createEventCtrl.post = function () {
                    var data = {
                        notice: $scope.notice
                    };
                    data.notice.position_id = createEventCtrl.position.id;

                    if ($scope.notice.is_event) {
                        data.notice.start_time = parseInt(data.notice.from.getTime() / 1000);
                        data.notice.end_time = parseInt(data.notice.to.getTime() / 1000);
                    }

                    console.log(data);
                    StateService.startLoading();
                    var request = VnbRestangular.all('notices');
                    request.customPOST(data, 'add').then(
                        function (result) {
                            StateService.showToast('Post added');
                            StateService.stopLoading();
                            if ($modalInstance) {
                                $modalInstance.close();
                            } else {
                                $state.go($state.current, {}, {reload: true});
                            }
                            console.log(result);
                        },
                        function (err) {
                            StateService.stopLoading();
                            StateService.showToast('Sorry some error occurred. Please try again');
                            console.log(err);
                        }
                    );
                };

                initialise();

            }]);
})();
