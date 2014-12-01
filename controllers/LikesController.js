(function () {
    var app = angular.module('Vnb');
    app.controller('LikesController', ['likeData',
        function (likeData) {
            var likeCtrl = this;
            likeCtrl.likes = likeData;
        }]);
})();
