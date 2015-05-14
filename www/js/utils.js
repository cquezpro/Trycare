angular.module('starter')

    .factory('utils', function ($ionicPopup, $ionicLoading, settings) {

        var Utils = {
            alert: function (_sTitle, _sMsg, _callback) {
                _sMsg = Utils.nl2br(_sMsg);
                var alertPopup = $ionicPopup.alert({
                    title: _sTitle,
                    template: _sMsg
                });
                alertPopup.then(_callback);
            },
            confirm: function (_sTitle, _sMsg, _callback) {
                _sMsg = _sMsg.replace('\n', '<br>');
                var confirmPopup = $ionicPopup.confirm({
                    title: _sTitle,
                    template: _sMsg,
                    cancelType: 'button-assertive',
                    okType: 'button-balanced'
                });
                confirmPopup.then(_callback);
            },
            showpop: function ($scope, _sTitle, _sMsg, _callback) {
                $scope.data = {};
                var myPopup = $ionicPopup.show({
                    template: _sMsg,
                    title: _sTitle,
                    //subTitle: _sTitle,
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.txMsg) {
                                    //don't allow the user to close unless he enters txMsg
                                    e.preventDefault();
                                } else {
                                    return $scope.data.txMsg;
                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (res) {
                    //console.log('Tapped!', res);
                    _callback(res);
                });
            },
            clone: function (oldObject) {
                return newObject = JSON.parse(JSON.stringify(oldObject));
            },
            setObjVal: function (dstObj, srcObj) {
                for (var key in srcObj) {
                    var val = srcObj[key];
                    dstObj[key] = val;
                }
            },
            getOneItemByAttr: function (arr, attr, val) {
                for (var i in arr) {
                    var v = arr[i];
                    if (v[attr] == val) {
                        return v;
                    }
                }
                return null;
            },
            isValidEmailAddress: function (emailAddress) {
                var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
                return pattern.test(emailAddress);
            },
            nl2br: function (str, is_xhtml) {
                var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
                return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            },
            getBase64FromImageUrl: function (URL, _callback) {
                var img = new Image();
                img.src = URL;
                img.onload = function () {

                    var canvas = document.createElement("canvas");
                    canvas.width = this.width;
                    canvas.height = this.height;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0);

                    var dataURL = canvas.toDataURL();
                    var data = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                    _callback(dataURL, data);
                }
            },
            base64toBlob: function (base64Data, contentType) {
                contentType = contentType || 'image/jpeg';
                var sliceSize = 1024;
                var byteCharacters = atob(base64Data);
                var bytesLength = byteCharacters.length;
                var slicesCount = Math.ceil(bytesLength / sliceSize);
                var byteArrays = new Array(slicesCount);

                for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                    var begin = sliceIndex * sliceSize;
                    var end = Math.min(begin + sliceSize, bytesLength);

                    var bytes = new Array(end - begin);
                    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                        bytes[i] = byteCharacters[offset].charCodeAt(0);
                    }
                    byteArrays[sliceIndex] = new Uint8Array(bytes);
                }
                return new Blob(byteArrays, { type: contentType });
            },
            openBrowser: function (url) {
                console.log("# open browser : " + url);
                window.new_window = window.open(url, '_blank', 'location=no,EnableViewPortScale=yes');
            },
            awsImgUpload: function (s3url, filedata, _callback_win, _callback_err, _callback_progress) {

                //Sample code below to upload image to S3
                $ionicLoading.show();
                console.log("file data : ", filedata);

                var xhr = new XMLHttpRequest();
                xhr.open('PUT', s3url /* S3-URL generated from server */);
                xhr.setRequestHeader('Content-Type', 'application/zip');
                //xhr.setRequestHeader('x-amz-acl', 'public-read');

                /* upload completion check */
                xhr.onreadystatechange = function (e) {
                    if (this.readyState !== 4)
                        return;

                    $ionicLoading.hide();

                    if (this.status === 200) {
                        console.log('upload complete');
                        if (_callback_win)
                            _callback_win('ok');
                    } else {
                        if (_callback_win)
                            _callback_win('err');
                    }
                };

                /* Amazon gives you progress information on AJAX Uploads */
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var v = (evt.loaded / evt.total) * 100;
                        var val = Math.round(v) + '%';
                        console.log('Completed: ' + val);
                        if (_callback_progress)
                            _callback_progress(v);
                    }
                }, false);

                /* error handling */
                xhr.upload.addEventListener("error", function (evt) {
                    console.log("There has been an error :(");
                    if (_callback_err)
                        _callback_err(evt);
                }, false);

                /* Commence upload */
                xhr.send(filedata); // file here is a blob from the file reader API
            }
        };
        return Utils;
    })
