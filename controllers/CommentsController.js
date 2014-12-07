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
            commentsCtrl.loading = true;

            commentsCtrl.postComment = function () {
                if (/\S/.test(commentsCtrl.comment)) {
                    commentsCtrl.loading = true;
                    VnbRestangular.all('notices')
                        .customPOST({
                            id: commentsCtrl.notice.id,
                            comment: commentsCtrl.comment
                        }, 'comment')
                        .then(
                        function () {
                            commentsCtrl.comment = '';
                            commentsCtrl.loading = true;
                            getComments();
                        },
                        function (err) {
                            commentsCtrl.loading = false;
                            console.log(err.data);
                        }
                    );
                    commentsCtrl.comment = "";
                }
            };
            var getComments = function () {
                VnbRestangular.setJsonp(true);
                VnbRestangular.all('notices')
                    .get('comments', {id: commentsCtrl.notice.id})
                    .then(
                    function (data) {
                        commentsCtrl.comments = data;
                        commentsCtrl.loading = false;
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
