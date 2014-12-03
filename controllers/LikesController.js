(function () {
    var app = angular.module('Vnb');
    app.controller('LikesController', [
        'notice',
        'VnbRestangular',
        function (notice, VnbRestangular) {
            var likeCtrl = this;
            likeCtrl.notice = notice;

            var getLikes = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('likes', {id: likeCtrl.notice.id})
                    .then(
                    function (data) {
                        likeCtrl.likes = data;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                VnbRestangular.setJsonp(false);
            };

            getLikes();
        }]);
})();
