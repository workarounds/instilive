(function () {
    var app = angular.module('Vnb');

    app.controller('CommentsController', [
        '$scope',
        'StateService',
        'VnbRestangular',
        'notice',
        'user',
        function ($scope, StateService, VnbRestangular, notice, user) {
            var commentsCtrl = this;
            commentsCtrl.notice = notice;
            commentsCtrl.user = user;
            var getComments = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('comments', {id: commentsCtrl.notice.id})
                    .then(
                    function (data) {
                        commentsCtrl.comments = data;
                        console.log('comment data: ');
                        console.log(data);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                VnbRestangular.setJsonp(false);
            };
            getComments();
        }
    ]);
})();
