/**
 * Created by manidesto on 13/12/14.
 */
(function () {
    var app = angular.module('Vnb');

    app.controller('BulkEventController', [
        '$scope',
        'VnbRestangular',
        'StateService',
        function ($scope, VnbRestangular, StateService) {
            var bulkCtrl = this;

            function initialise() {
                bulkCtrl.number = 0;
                bulkCtrl.limitTo = 0;
                bulkCtrl.notices = [];
                bulkCtrl.corners = [];
                bulkCtrl.commonCorners = [];
                bulkCtrl.from = new Date();
                bulkCtrl.duration = 60;

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
            }

            var setUserData = function (user) {
                if (user) {
                    bulkCtrl.positions = user.positions.post_positions;
                    bulkCtrl.initPos();
                    $scope.changeInCommon();
                }
            };

            bulkCtrl.initPos = function () {
                bulkCtrl.position = bulkCtrl.positions[0];
                $scope.changePos();
            };

            $scope.changePos = function () {
                bulkCtrl.corners = bulkCtrl.position.corners;
                bulkCtrl.commonCorners = [];
                $scope.changeInCommon();
            };

            $scope.initNotices = function () {
                for (var i = bulkCtrl.notices.length; i < bulkCtrl.number; i++) {
                    var emptyNotice = {
                        is_event: true,
                        visible: true,
                        corners: getCommonCorners(),
                        from: bulkCtrl.from,
                        to: getToDate(bulkCtrl.from),
                        data: {
                            title: '',
                            venue: '',
                            blocks: [{
                                type:'text',
                                content:{text: ''}
                            }]
                        },
                        start_time: '',
                        end_time: ''
                    };
                    if(bulkCtrl.position != null){
                        emptyNotice.position_id = bulkCtrl.position.id;
                        emptyNotice.data.position_name = bulkCtrl.position.name;
                    }
                    bulkCtrl.notices.push(emptyNotice);
                }
                bulkCtrl.limitTo = bulkCtrl.number;
            };

            $scope.changeInCommon = function () {
                for (var i = 0; i < bulkCtrl.notices.length; i++) {
                    bulkCtrl.notices[i].from = bulkCtrl.from;
                    bulkCtrl.notices[i].to = getToDate(bulkCtrl.from);
                    bulkCtrl.notices[i].data.position_name = bulkCtrl.position.name;
                    bulkCtrl.notices[i].position_id = bulkCtrl.position.id;
                    if($scope.user) {
                        bulkCtrl.notices[i].data.user_name = $scope.user.name;
                        bulkCtrl.notices[i].data.user_fb_id = $scope.user.facebook_id;
                    }
                }
            };

            function getCommonCorners(){
                return angular.copy(bulkCtrl.commonCorners);
            }

            function getToDate(from) {
                var to = from;
                to.setMinutes(from.getMinutes() + bulkCtrl.duration);
                return to;
            }

            bulkCtrl.postAll = function(){
                for(var i = 0; i < bulkCtrl.number; i++){
                    post(bulkCtrl.notices[i]);
                }
            };

            function post(notice){
                var data = {
                    notice: notice
                };

                data.notice.position_id = bulkCtrl.position.id;

                data.notice.start_time = parseInt(data.notice.from.getTime()/1000);
                data.notice.end_time = parseInt(getToDate(data.notice.from)/1000);

                StateService.startLoading();
                var request = VnbRestangular.all('notices');
                request.customPOST(data, 'add').then(
                    function(result){
                        StateService.stopLoading();
                        console.log(result);
                    },
                    function(err){
                        StateService.stopLoading();
                        StateService.showToast('sorry some err');
                        console.log(err);
                    }
                )
            }

            initialise();
        }
    ]);
})();
