(function () {
    var app = angular.module('Vnb');

    app.controller('TagsController', [
        'StateService',
        '$rootScope',
        '$scope',
        '$modal',
        '$state',
        function (StateService, $rootScope, $scope, $modal, $state) {
            var tagsCtrl = this;

            var initialise = function () {
                tagsCtrl.canEdit = false;
                tagsCtrl.scheduleLoaded = false;
                tagsCtrl.noticesLoaded = false;
                tagsCtrl.selectedIndex = 1;
                tagsCtrl.schedule = [];
                tagsCtrl.notices = [];
                tagsCtrl.showTabs = false;
                tagsCtrl.hashData = StateService.getHashData();
                if(tagsCtrl.hashData) {
                    tagsCtrl.getTagData();
                }
                tagsCtrl.getUserData();
                if(($state.current.name == 'home.all') || ($state.current.name == 'home.all')) {
                    tagsCtrl.header = {
                        image: {
                            link: 'http://i.imgur.com/0fPX4xi.png'
                        }
                    };
                    tagsCtrl.home = true;
                }

                loadNotices();
                loadSchedule();
            };

            function loadNotices(force) {
                StateService.getData(false, false, force).then(
                    function(data){
                        tagsCtrl.noticesLoaded = true;
                        tagsCtrl.notices = data.Notice;
                        setTabs();
                    },
                    function(){
                        tagsCtrl.noticesLoaded = false;
                    }
                );
            }

            function loadSchedule(force){
                StateService.getSchedule(false, false, force).then(
                    function(data){
                        tagsCtrl.scheduleLoaded = true;
                        tagsCtrl.schedule = data.Notice;
                        setTabs();
                    },
                    function(){
                        tagsCtrl.scheduleLoaded = true;
                    }
                );
            }

            function setTabs(){
                var noticesEmpty = tagsCtrl.noticesLoaded && (tagsCtrl.notices.length == 0);
                var scheduleEmpty = tagsCtrl.scheduleLoaded && (tagsCtrl.schedule.length == 0);

                tagsCtrl.showTabs = !noticesEmpty && !scheduleEmpty;

                if(noticesEmpty){
                    tagsCtrl.selectedIndex = 1;
                }
                else if(scheduleEmpty){
                    tagsCtrl.selectedIndex = 2;
                }
            }

            tagsCtrl.changeTab = function(index){
                tagsCtrl.selectedIndex = index;
            };

            tagsCtrl.reloadData = function(){
                loadNotices(true);
                loadNotices(true);
                $rootScope.$emit('VnbReloadData');
            };

            tagsCtrl.getBoardFromCtag= function(cTag) {
                var bTag = tagsCtrl.hashData[cTag].board_tag;
                var board = tagsCtrl.hashData[bTag].name;
                return board;
            };

            tagsCtrl.getUserData = function () {
                StateService.getUserData().then(
                    function (data) {
                        tagsCtrl.user = data;
                        tagsCtrl.updateCanEdit();
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            };

            $scope.$on('userDataEvent', function (event, data) {
                tagsCtrl.user = data;
                tagsCtrl.updateCanEdit();
            });

            tagsCtrl.updateCanEdit = function () {
                if(tagsCtrl.user && tagsCtrl.tag) {
                    var positions = tagsCtrl.user.positions.edit_positions;
                    for (var index in positions) {
                        var editPosition = positions[index];
                        for (var i in editPosition.corners) {
                            var corner = editPosition.corners[i];
                            if(corner.tag == tagsCtrl.tag.tag) {
                                tagsCtrl.canEdit = true;
                                return;
                            }
                        }
                    }
                }
                tagsCtrl.canEdit = false;
            };

            tagsCtrl.initTagMeta = function () {
                if(tagsCtrl.hashData && tagsCtrl.tag) {
                    tagsCtrl.is_board = tagsCtrl.hashData[tagsCtrl.tag.tag].is_board;
                    if (tagsCtrl.is_board) {
                        tagsCtrl.board = tagsCtrl.tag.title;
                    } else {
                        tagsCtrl.corner = tagsCtrl.tag.name;
                        tagsCtrl.board = tagsCtrl.getBoardFromCtag(tagsCtrl.tag.tag);
                    }
                    console.log(tagsCtrl.tag);
                    tagsCtrl.header = JSON.parse(tagsCtrl.tag.header);
                    tagsCtrl.updateCanEdit();
                }
            };

            tagsCtrl.getTagData = function () {
                StateService.getTagData().then(
                    function(data) {
                        tagsCtrl.tag = data;
                        tagsCtrl.initTagMeta();
                        $rootScope.$emit('GOT_TAG_DATA', data);
                    }, function (err) {
                        console.log(err);
                    }
                );
            };

            $rootScope.$on('VNB_HASH_DATA', function () {
                tagsCtrl.hashData = StateService.getHashData();
                tagsCtrl.getTagData();
            });

            tagsCtrl.updateHeaderImage = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'components/tag/upload-header.html',
                    controller: 'UploadHeaderController as uploadHeaderCtrl',
                    size: 'sm',
                    resolve: {
                        corner: function () {
                            var tagMeta = {
                                tag: tagsCtrl.tag,
                                is_board: tagsCtrl.is_board
                            };
                            return tagMeta;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $state.go($state.current, {}, {reload: true});
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            initialise();

        }
    ]);
})();
