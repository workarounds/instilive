(function () {
    var app = angular.module('Vnb');
    app.controller('AdminController', ['VnbRestangular', '$scope', function(VnbRestangular, $scope){
        var adminCtrl = this;
        var notice = {
            id:19,
            type: "event",
            visible:true,
            corners:[],
            from: new Date(),
            to:new Date(),
            title:'',
            desc:'',
            venue:'',
            data:{},
            start_time:'',
            end_time:''
        };
        var corners = [
            {name:'Swimming', tag:'swimming'},
            {name:'Cricket', tag:'cricket'},
            {name:'IIT Bombay', tag:'IITBombay'},
            {name:'IIT Kanpur', tag:'IITKanpur'},
            {name:'Football', tag:'football'}
        ];
        var getSqlDateTime = function(date){
            var string = date.toJSON();
            string = string.replace('T', ' ');
            return string.substr(0,19);
        };

        $scope.notice = notice;
        $scope.corners = corners;
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

        adminCtrl.add = function(){
            var data = {
                notice: $scope.notice
            };
            data.notice.data.title = data.notice.title;
            data.notice.data.venue = data.notice.venue;
            data.notice.data.desc = data.notice.desc;

            for(var corner in $scope.selected){
                data.notice.corners.push($scope.selected[corner].tag);
            }

            data.notice.start_time = parseInt(data.notice.from.getTime()/1000);
            data.notice.end_time = parseInt(data.notice.to.getTime()/1000)

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
        }


    }]);
})();
