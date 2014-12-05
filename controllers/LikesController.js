(function () {
    var app = angular.module('Vnb');
    app.controller('LikesController', [
        'notice',
        'VnbRestangular',
        function (notice, VnbRestangular) {
            var likesCtrl = this;
            likesCtrl.notice = notice;
            likesCtrl.loading = true;

            var getLikes = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('likes', {id: likesCtrl.notice.id})
                    .then(
                    function (data) {
                        likesCtrl.likes = data;
                        likesCtrl.loading = false;
                        console.log(data);
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
