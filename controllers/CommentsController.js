(function () {
    var app = angular.module('Vnb');

    app.controller('CommentsController', [
        '$scope',
        'StateService',
        'VnbRestangular',
        function ($scope, StateService, VnbRestangular) {
            var commentsCtrl = this;
            commentsCtrl.notice = $scope.notice;
            commentsCtrl.user = $scope.user;
            commentsCtrl.loading = false;

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

            $scope.$parent.getComments = getComments;
        }
    ]);
})();
