(function () {
    var app = angular.module('Vnb');

    app.controller('TagsController', [
        'StateService',
        '$rootScope',
        '$scope',
        '$modal',
        function (StateService, $rootScope, $scope, $modal) {
            var tagsCtrl = this;

            var initialise = function () {
                tagsCtrl.canEdit = false;
                tagsCtrl.hashData = StateService.getHashData();
                if(tagsCtrl.hashData) {
                    tagsCtrl.getTagData();
                }
                tagsCtrl.getUserData();
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
                    console.log('something happened');
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            initialise();

        }
    ]);
})();
