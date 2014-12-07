(function () {
    var app = angular.module('Vnb');
    app.controller('CreateEventController',
        [
            'VnbRestangular',
            'StateService',
            '$scope',
            'noticeData',
            'imgur',
            function (VnbRestangular, StateService, $scope, noticeData, imgur) {
                var createEventCtrl = this;
                var initialise = function () {
                    // initialising the booleans
                    createEventCtrl.hasImage = false;
                    createEventCtrl.hasTable = false;
                    createEventCtrl.hasEvent = false;

                    createEventCtrl.datatypes = [];
                    createEventCtrl.textCount = 0;

                    createEventCtrl.corners = [];
                    createEventCtrl.selected = [];
                    createEventCtrl.currentTag = '';
                    createEventCtrl.format = "dd/MM/yyyy";

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
                        createEventCtrl.populateDataTypes()
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

                createEventCtrl.populateDataTypes = function(){
                    var blocks = $scope.notice.data.blocks;
                    for(var i = 0; i<blocks.length; i++){
                        createEventCtrl.datatypes.push(blocks[i]);
                    }
                };

                createEventCtrl.printData = function() {
                    console.log(createEventCtrl.datatypes);
                };

                createEventCtrl.addImage = function() {
                    var ImageObj = {
                        type: 'image',
                        id: '',
                        content: {}
                    };
                    if(createEventCtrl.hasImage) {
                        var index = createEventCtrl.findIndexOf(ImageObj);
                        createEventCtrl.datatypes.splice(index, true);
                        createEventCtrl.hasImage = false;
                    } else {
                        createEventCtrl.datatypes.push(ImageObj);
                        createEventCtrl.hasImage = true;
                    }
                };
                createEventCtrl.addTable = function() {
                    var TableObj = {
                        type: 'table',
                        id: '',
                        content: {}
                    };
                    if(createEventCtrl.hasTable) {
                        var index = createEventCtrl.findIndexOf(TableObj);
                        createEventCtrl.datatypes.splice(index, true);
                        createEventCtrl.hasTable = false;

                    } else {
                        createEventCtrl.datatypes.push(TableObj);
                        createEventCtrl.hasTable = true;

                    }
                };
                createEventCtrl.addText = function() {
                    var TextObj = {
                        type: 'text',
                        id: createEventCtrl.textCount,
                        content: {}
                    };
                    createEventCtrl.datatypes.push(TextObj);
                    createEventCtrl.textCount++;
                };
                createEventCtrl.deleteText = function (id) {
                    console.log(id);
                    var TextObj = {
                        type: 'text',
                        id: id
                    };
                    var index = createEventCtrl.findIndexOf(TextObj);
                    createEventCtrl.datatypes.splice(index, true);
                };
                createEventCtrl.findIndexOf = function(TypeObj) {
                    for (var i in createEventCtrl.datatypes) {
                        var dataType = createEventCtrl.datatypes[i];
                        if(dataType.type===TypeObj.type && dataType.id===TypeObj.id) {
                            return i;
                        }
                    }
                };
                createEventCtrl.range = function(min, max, step){
                    step = step || 1;
                    var input = [];
                    for (var i = min; i <= max; i += step) input.push(i);
                    return input;
                };
                createEventCtrl.upload = function () {
                    var file = createEventCtrl.image.file;
                    if (!file) {
                        console.log('no file');
                        return false;
                    } else if(!file.type.match(/image.*/)) {
                        console.log('file not image');
                        return false;
                    }
                    imgur.setAPIKey('Client-ID 86505db4630921a');
                    imgur.upload(file).then(function then(model) {
                        var ImageObj = {
                            type: 'image',
                            id: '',
                            content: {}
                        };
                        var index = createEventCtrl.findIndexOf(ImageObj);
                        createEventCtrl.datatypes[index].content = model;
                        console.log(model);
                        return true;
                    });
                };


                var setUserData = function (data) {
                    if(data) {
                        createEventCtrl.positions = data.positions.post_positions;
                        createEventCtrl.initPos();
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
                    createEventCtrl.selected = $scope.notice.corners;
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

                function getBlock(dataType){
                    var block = {
                        id: '',
                        type: '',
                        content: {}
                    };
                    if(dataType.type == 'image'){
                        block.id = dataType.id;
                        block.type = 'image';
                        block.content = dataType.content;
                    }
                    else if(dataType.type == 'table') {
                        block.id = dataType.id;
                        block.type = 'table';
                        block.content.rows = dataType.content.rows;
                        block.content.columns = dataType.content.columns;
                        block.content.table = {};
                        for(var j = 0; j < block.content.columns; j++){
                            block.content.table[j] = {};
                            for(var i = 0; i < block.content.rows; i++){
                                block.content.table[j][i] = dataType.content.table[j][i];
                            }
                        }
                    }
                    else if(dataType.type == 'text'){
                        block.id = dataType.id;
                        block.type = 'text';
                        block.content.text = dataType.content.text;
                    }
                    return block;
                }

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

                    if(createEventCtrl.hasEvent) {
                        data.notice.start_time = parseInt(data.notice.from.getTime() / 1000);
                        data.notice.end_time = parseInt(data.notice.to.getTime() / 1000);
                    }

                    data.notice.data.blocks = [];
                    for(var i = 0; i < createEventCtrl.datatypes.length; i++){
                        var dataType = createEventCtrl.datatypes[i];
                        data.notice.data.blocks.push(getBlock(dataType));
                    }

                    data.notice.data.positionName = createEventCtrl.position.name;
                    data.notice.data.userName = $scope.user.name;

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
