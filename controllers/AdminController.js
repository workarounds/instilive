(function () {
    var app = angular.module('Vnb');
    app.controller('AdminController', ['VnbRestangular','StateService', '$scope', function(VnbRestangular, StateService, $scope){
        var adminCtrl = this;
        var notice = {
            type: "event",
            visible:true,
            corners:[],
            from: new Date(),
            to:new Date(),
            title:'',
            content:'',
            venue:'',
            data:{},
            start_time:'',
            end_time:''
        };

        var extractCorners = function(userData){
            var corners = [
                {name:'Swimming', tag:'swimming'},
                {name:'Cricket', tag:'cricket'},
                {name:'IIT Bombay', tag:'IITBombay'},
                {name:'IIT Kanpur', tag:'IITKanpur'},
                {name:'Football', tag:'football'}
            ];
            console.log('extracting corners from');
            console.log(userData);
            return corners;
        };

        var setUserData = function(data) {
            $scope.positions = data.positions.post_positions;
            $scope.position = $scope.positions[0];
            $scope.changePos();
            console.log('positions set');
            console.log(data);
        };

        $scope.changePos = function(){
            $scope.corners = $scope.position.corners;
            $scope.selected = [];
        };

        if(!$scope.notice) {
            $scope.notice = notice;
        }

        StateService.fbLogin().then(
            function() {
                StateService.getUserData().then(
                    setUserData,
                    console.log
                );
            },
            console.log
        );
        $scope.selected = [];
        $scope.currentTag = '';
        $scope.format = "dd/MM/yyyy";

        $scope.open = function($event,opened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[opened] = true;
        };
        adminCtrl.onTagSelect = function(item){
            $scope.selected.push(item);
            var index = $scope.corners.indexOf(item);
            $scope.corners.splice(index,1);
            $scope.currentTag = '';
        };
        adminCtrl.onTagRemove = function(index){
            var tag = $scope.selected[index];
            $scope.selected.splice(index, 1);
            $scope.corners.push(tag);
        };

        adminCtrl.adjustToDate = function(){
            var to = $scope.notice.to;
            var from = $scope.notice.from;
            if(to<from){
                $scope.notice.to = from;
            }
        };

        adminCtrl.adjustFromDate = function(){
            var to = $scope.notice.to;
            var from = $scope.notice.from;

            if(to<from){
                $scope.notice.from = to;
            }
        };

        adminCtrl.test = function(){
            VnbRestangular.setJsonp(false);
            VnbRestangular.all('users').get('index').then(
                function(data){
                    console.log(data);
                },
                function(err){
                    console.log(err.data);
                }
            );
        };

        adminCtrl.add = function(){
            var data = {
                notice: $scope.notice
            };
            data.notice.position_id = $scope.position.id;
            data.notice.data.title = data.notice.title;
            data.notice.data.venue = data.notice.venue;
            data.notice.data.content = data.notice.content;

            for(var i= 0; i < $scope.selected.length; i++){
                data.notice.corners.push($scope.selected[i]);
            }

            data.notice.start_time = parseInt(data.notice.from.getTime()/1000);
            data.notice.end_time = parseInt(data.notice.to.getTime()/1000);

            console.log(data);
            var request = VnbRestangular.all('notices');
            if(data.notice.id){
                request.customPOST(data, 'edit').then(
                    function(){
                        console.log('Edit successful');
                    },
                    function(err){
                        console.log(err);
                    }
                );
            }
            else{
                request.customPOST(data, 'add').then(
                    function(){
                        console.log('Post successful');
                    },
                    function(err){
                        console.log(err);
                    }
                );
            }
        };


    }]);
})();
