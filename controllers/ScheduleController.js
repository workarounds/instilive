/**
 * Created by manidesto on 05/12/14.
 */
(function () {
    var app = angular.module('Vnb');

    function getDateObj(s) {
        var a = s.split(/[^0-9]/);
        var d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
        return d;
    }

    function isNextDay(d){
        var now = new Date();
        return (toDateId(now) <= toDateId(d));
    }

    function toDateId(d){
        var date = d.getDate();
        var month = d.getMonth();
        var year = d.getYear();
        return year*366 + month*31 + date;
    }

    app.controller('ScheduleController', [
        'StateService',
        'VnbModal',
        '$scope',
        '$rootScope',
        function (StateService, VnbModal, $scope, $rootScope) {
            var scheduleCtrl = this;

            scheduleCtrl.notices = [];
            scheduleCtrl.displayNotices = [];
            scheduleCtrl.eventDays = {};
            scheduleCtrl.nextDaySet = false;
            scheduleCtrl.showPrevious = false;
            scheduleCtrl.previousExists = false;
            scheduleCtrl.dataLoaded = false;
            $scope.scheduleLimit = 2;

            function generateEvents() {
                scheduleCtrl.eventDays = {};
                var notices = scheduleCtrl.notices;
                var eventDays = scheduleCtrl.eventDays;
                for (var i = 0; i < notices.length; i++) {
                    var start = getDateObj(notices[i].start_time);
                    if (eventDays[toDateId(start)] === undefined) {
                        eventDays[toDateId(start)] = {
                            date: start,
                            anchor:'',
                            next:false,
                            events: []
                        };
                    }
                    notices[i].start = start;
                    if(typeof notices[i].data === "string") {
                        notices[i].data = JSON.parse(notices[i].data);
                    }
                    if(typeof notices[i].data === "string") {
                        notices[i].corners = JSON.parse(notices[i].corners);
                    }
                    eventDays[toDateId(start)].events.push(notices[i]);
                    notices[i].next = isNextDay(start);
                    eventDays[toDateId(start)].next = notices[i].next;
                    if(!scheduleCtrl.nextDaySet){
                        if(isNextDay(start)){
                            eventDays[toDateId(start)].anchor = 'vnb-schedule-next-day';
                            scheduleCtrl.nextDaySet = true;
                        }
                        else{
                            scheduleCtrl.previousExists = true;
                        }
                    }
                    if(notices[i].next){
                        scheduleCtrl.displayNotices.push(notices[i]);
                    }
                }
            }

            function increaseLimit(){
                if($scope.scheduleLimit < scheduleCtrl.notices.length){
                    console.log(Date.now());
                    $scope.$apply(function(){
                        $scope.scheduleLimit = $scope.scheduleLimit + 2;
                    });
                    setTimeout(increaseLimit, 200);
                }
            }

            function fillData(data){
                console.log(data);
                scheduleCtrl.notices = data.Notice;
                generateEvents();
                scheduleCtrl.dataLoaded = true;
                setTimeout(increaseLimit, 250);
            }

            function loadingFailed(){
                console.log('error loading schedule');
                scheduleCtrl.dataLoaded = true;
                StateService.showToast('Could not load schedule');
            }

            StateService.getSchedule().then(
                function (data) {
                    fillData(data);
                },
                function () {
                    loadingFailed();
                }
            );

            $rootScope.$on('VnbReloadData', function(){
                scheduleCtrl.dataLoaded = false;
                StateService.getSchedule(false, false, true).then(
                    function(data){
                        fillData(data);
                    },
                    function(){
                        loadingFailed();
                    }
                );
            });

            scheduleCtrl.showEvent = function(event) {
                var modalParams = {
                    templateUrl: 'components/notice/updates.html',
                    controller: 'UpdatesController as updatesCtrl',
                    size: 'lg',
                    resolve: {
                        notice: function () {
                            return event;
                        }
                    },
                    state: '^.notice',
                    params: {notice: event.id}
                };
                VnbModal.openModal(modalParams);
            };
        }
    ]);
})();
