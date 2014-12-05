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

    app.controller('ScheduleController', [
        'StateService',
        function(StateService){
            var scheduleCtrl = this;

            scheduleCtrl.notices = [];
            scheduleCtrl.eventDays = {};

            function generateEvents(){
                var notices = scheduleCtrl.notices;
                var eventDays = scheduleCtrl.eventDays;
                for(var i = 0; i< notices.length; i++){
                    var start = getDateObj(notices[i].start_time);
                    if(eventDays[start.toDateString()] === undefined){
                        eventDays[start.toDateString()] = {
                            date: start,
                            events: []
                        };
                    }
                    notices[i].start = start;
                    notices[i].data = JSON.parse(notices[i].data);
                    notices[i].corners = JSON.parse(notices[i].corners);
                    eventDays[start.toDateString()].events.push(notices[i]);
                }
                console.log(scheduleCtrl.eventDays);
            }

            StateService.getSchedule().then(
                function(data){
                    scheduleCtrl.notices = data.Notice;
                    generateEvents();
                },
                function(err){
                    console.log(err);
                }
            )
        }
    ]);
})();
