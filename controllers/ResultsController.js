/**
 * Created by manidesto on 16/12/14.
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

    app.controller('ResultsController', [
        'StateService',
        'VnbModal',
        '$scope',
        '$rootScope',
        function (StateService, VnbModal, $scope, $rootScope) {
            var resultsCtrl = this;

            resultsCtrl.matches = [];
            resultsCtrl.eventDays = {};
            resultsCtrl.showPrevious = false;
            resultsCtrl.dataLoaded = false;
            resultsCtrl.loadingMore = false;

            function generateResults(){
                resultsCtrl.eventDays = {};
                var matches = resultsCtrl.matches;
                var eventDays = resultsCtrl.eventDays;
                for(var i = matches.length-1; i >=0 ; i--){
                    var start = getDateObj(matches[i].Notice.start_time);
                    if (eventDays[toDateId(start)] === undefined) {
                        eventDays[toDateId(start)] = {
                            date: start,
                            anchor:'',
                            next:false,
                            events: []
                        };
                    }
                    matches[i].start = start;
                    if(typeof matches[i].Notice.data === "string"){
                        matches[i].Notice.data = JSON.parse(matches[i].Notice.data);
                    }
                    if(typeof matches[i].Result.data === "string"){
                        matches[i].Result.data = JSON.parse(matches[i].Result.data);
                    }
                    if(typeof matches[i].Notice.corners === "string"){
                        matches[i].Notice.corners = JSON.parse(matches[i].Notice.corners);
                    }
                    if(typeof matches[i].Result.corners === "string"){
                        matches[i].Result.corners = JSON.parse(matches[i].Result.corners);
                    }
                    eventDays[toDateId(start)].events.push(matches[i]);
                }
            }

            function fillPrevious(data){
                var previous = data;
                if(previous.length == 0){
                    resultsCtrl.dataLoaded = true;
                    resultsCtrl.showPrevious = true;
                    StateService.showToast('No results before that');
                    return;
                }
                var current = angular.copy(resultsCtrl.matches);
                resultsCtrl.matches = [];
                resultsCtrl.matches = current.concat(previous);
                generateResults();
                resultsCtrl.showPrevious = false;
                resultsCtrl.dataLoaded = true;

                StateService.setResults(resultsCtrl.matches);
            }

            resultsCtrl.getPrevious = function(){
                if(resultsCtrl.matches.length>0){
                    var last = resultsCtrl.matches.length -1;
                    var to = getDateObj(resultsCtrl.matches[last].Notice.start_time);
                    var from = angular.copy(to);
                    to.setMinutes(to.getMinutes() - 1);
                    from.setDate(from.getDate() - 3);
                    var limit = 50;
                    var options = {
                        from: from.getTime()/1000,
                        to: to.getTime()/1000,
                        limit: limit
                    };
                }
                else{
                    var from = '2014-12-11 23:59:59';
                    var limit = 1000;
                    var options = {
                        from: from.getTime()/1000,
                        limit: limit
                    };
                }

                resultsCtrl.showPrevious = true;
                resultsCtrl.dataLoaded = false;
                StateService.getResults(false, options, true).then(
                    function(data){
                        fillPrevious(data);
                    },
                    function(err){
                        console.log(err);
                        resultsCtrl.dataLoaded = true;
                        resultsCtrl.showPrevious = false;
                        StateService.showToast('Some error occured. Please try again');
                    }
                )
            };

            resultsCtrl.loadMore = function(){
                var from;
                if(resultsCtrl.matches.length>0) {
                    from = getDateObj(resultsCtrl.matches[0].Notice.start_time);
                }
                else{
                    from = new Date();
                }
                from.setMinutes(from.getMinutes() + 1);
                var options = {
                    from: from.getTime()/1000
                };

                resultsCtrl.loadingMore = true;
                StateService.getResults(false, options, true).then(
                    function(data){
                        fillMore(data);
                    },
                    function(err){
                        console.log(err);
                        resultsCtrl.loadingMore = false;
                        StateService.showToast('Some error occurred. Please try again');
                    }
                )
            };

            function fillMore(data){
                var current = angular.copy(resultsCtrl.matches);
                var more = data;
                if(more.length == 0){
                    resultsCtrl.loadingMore = false;
                    StateService.showToast('Nothing more actually :P');
                    return;
                }

                resultsCtrl.matches = [];
                resultsCtrl.matches = more.concat(current);
                generateResults();
                resultsCtrl.loadingMore = false;

                StateService.setResults(resultsCtrl.matches);
            }



            function fillData(data){
                resultsCtrl.matches = data;
                generateResults();
                resultsCtrl.dataLoaded = true;
            }

            function loadingFailed(){
                console.log('error loading results');
                resultsCtrl.dataLoaded = true;
                StateService.showToast('Could not load results');
            }

            StateService.getResults().then(
                function(data){
                    fillData(data);
                },
                function(){
                    loadingFailed();
                }
            );

            $rootScope.$on('VnbReloadData', function(){
                resultsCtrl.dataLoaded = false;
                StateService.getSchedule(false, false, true).then(
                    function(data){
                        resultsCtrl.showPrevious = false;
                        fillData(data);
                    },
                    function(){
                        loadingFailed();
                    }
                );
            });

            resultsCtrl.showEvent = function(event){
                var modalParams = {
                    templateUrl: 'components/notice/updates.html',
                    controller: 'UpdatesController as updatesCtrl',
                    size:'lg',
                    resolve: {
                        notice: function(){
                            event.Notice;
                        }
                    },
                    state: '^.notice',
                    params: {notice: event.Result.id}
                };
                VnbModal.openModal(modalParams);
            }
        }
    ]);
})();
