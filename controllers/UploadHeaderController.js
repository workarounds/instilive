(function () {
    var app = angular.module('Vnb');
    app.controller('UploadHeaderController', [
        '$modalInstance',
        'corner',
        'imgur',
        'VnbRestangular',
        function ($modalInstance, corner, imgur, VnbRestangular) {
            var uploadHeaderCtrl = this;
            uploadHeaderCtrl.corner = corner.tag;
            uploadHeaderCtrl.is_board = corner.is_board;
            uploadHeaderCtrl.upload = function () {
                var file = false;
                if (uploadHeaderCtrl.image) {
                    file = uploadHeaderCtrl.image.file;
                }
                if (!file) {

                } else if (!file.type.match(/image.*/)) {

                }
                imgur.setAPIKey('Client-ID 86505db4630921a');
                uploadHeaderCtrl.uploading = true;
                imgur.upload(file).then(function (image) {
                        uploadHeaderCtrl.uploading = false;
                        uploadHeaderCtrl.updateCorner(image);
                    },
                    function (err) {
                        uploadHeaderCtrl.uploading = false;
                    });
            };

            uploadHeaderCtrl.updateCorner = function (image) {
                var request = VnbRestangular.all('corners');
                uploadHeaderCtrl.corner.header = {image: image};
                var data = {
                    corner: uploadHeaderCtrl.corner,
                    is_board: uploadHeaderCtrl.is_board
                };
                request.customPOST(data, 'edit').then(
                    function () {
                        console.log('Edit successful');
                        $modalInstance.close();
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            };

        }
    ]);
})();
