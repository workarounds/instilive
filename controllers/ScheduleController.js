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
            scheduleCtrl.dataLoaded = false;
            scheduleCtrl.loadingMore = false;
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
                    }
                    if(notices[i].next){
                        scheduleCtrl.displayNotices.push(notices[i]);
                    }
                }
            }

            scheduleCtrl.getPrevious = function(){
                if(scheduleCtrl.notices.length>0) {
                    var to = getDateObj(scheduleCtrl.notices[0].start_time);
                    var from = angular.copy(to);
                    from.setDate(from.getDate() -3);
                    var limit = 1000;
                    var options = {
                        from: from,
                        to: to,
                        limit: limit
                    };
                }
                else{
                    var from = '2014-12-11 23:59:59';
                    var limit = 1000;
                    var options = {
                        from: from,
                        limit: limit
                    };
                }

                scheduleCtrl.showPrevious = true;
                scheduleCtrl.dataLoaded = false;
                StateService.getSchedule(false, options, true).then(
                    function(data){
                        fillPrevious(data);
                    },
                    function(err){
                        console.log(err);
                        scheduleCtrl.dataLoaded = true;
                        scheduleCtrl.showPrevious = false;
                        StateService.showToast('Some error occurred. Please try again');
                    }
                )
            };

            scheduleCtrl.loadMore = function(){
                var last = scheduleCtrl.notices.length - 1;
                var from = getDateObj(scheduleCtrl.notices[last].start_time);
                from.setMinutes(from.getMinutes() + 1);
                var options = {
                    from: from
                };

                scheduleCtrl.loadingMore = true;
                StateService.getSchedule(false, options, true).then(
                    function(data){
                        fillMore(data);
                    },
                    function(err){
                        console.log(err);
                        scheduleCtrl.loadingMore = false;
                        StateService.showToast('Some error occurred. Please try again');
                    }
                )
            };

            function fillMore(data){
                var current = angular.copy(scheduleCtrl.notices);
                var more = data.Notice;
                if(more.length == 0){
                    scheduleCtrl.loadingMore = false;
                    StateService.showToast('Nothing more actually :P');
                    return;
                }
                scheduleCtrl.notices = [];
                scheduleCtrl.notices = current.concat(more);
                generateEvents();
                scheduleCtrl.loadingMore = false;
                setTimeout(increaseLimit, 200);
            }

            function fillPrevious(data){
                var previous = data.Notice;
                if(previous.length == 0){
                    scheduleCtrl.dataLoaded = true;
                    scheduleCtrl.showPrevious = true;
                    StateService.showToast('Nothing there as well :P');
                    return;
                }
                var current = angular.copy(scheduleCtrl.notices);
                scheduleCtrl.notices = [];
                scheduleCtrl.notices = previous.concat(current);
                generateEvents();
                scheduleCtrl.showPrevious = false;
                scheduleCtrl.scheduleLimit = 2;
                scheduleCtrl.dataLoaded = true;
                setTimeout(increaseLimit, 200);
            }

            function increaseLimit(){
                if($scope.scheduleLimit < scheduleCtrl.notices.length){
                    $scope.$apply(function(){
                        $scope.scheduleLimit = $scope.scheduleLimit + 2;
                    });
                    setTimeout(increaseLimit, 200);
                }
            }

            function fillData(data){
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
                        scheduleCtrl.showPrevious = false;
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
