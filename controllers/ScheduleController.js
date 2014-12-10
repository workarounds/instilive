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
        return (now.toDateString() <= d.toDateString());
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
        function (StateService, VnbModal) {
            var scheduleCtrl = this;

            scheduleCtrl.notices = [];
            scheduleCtrl.eventDays = {};
            scheduleCtrl.nextDaySet = false;
            scheduleCtrl.showPrevious = false;

            function generateEvents() {
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
                    notices[i].data = JSON.parse(notices[i].data);
                    notices[i].corners = JSON.parse(notices[i].corners);
                    eventDays[toDateId(start)].events.push(notices[i]);
                    eventDays[toDateId(start)].next = isNextDay(start);
                    if(!scheduleCtrl.nextDaySet){
                        if(isNextDay(start)){
                            eventDays[toDateId(start)].anchor = 'vnb-schedule-next-day';
                            scheduleCtrl.nextDaySet = true;
                        }
                    }
                }
            }

            StateService.getSchedule().then(
                function (data) {
                    scheduleCtrl.notices = data.Notice;
                    generateEvents();
                    console.log(scheduleCtrl.eventDays);
                },
                function (err) {
                    console.log(err);
                }
            );

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
