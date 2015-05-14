angular.module('starter.services', [])

    .factory('authHttp', function ($http, $ionicLoading, settings) {

        return function (config, _callback_win, _callback_err) {

            config.url = config.url;
            config.method = config.method || 'POST';
            config.headers = config.headers || {};
            //config.headers['Content-Type'] = 'application/json';
            //config.headers['P-Token'] = auth.getToken();
            $ionicLoading.show();

            $http(config)
                .success(function (data) {
                    $ionicLoading.hide();
                    _callback_win(data);
                })
                .error(function (data, status) {
                    $ionicLoading.hide();
                    console.log("http error : ", data);
                    if (_callback_err)
                        _callback_err(data);
                });

        };
    })

    .factory('Auth', function ($ionicLoading, authHttp, settings, gvars, utils) {

        //var selProduct = '';
        //var selPhotoUrl = '';

        var login_data = {
            username: window.localStorage.getItem('postdroidUserName'),
            password: window.localStorage.getItem('postdroidPassword'),
            remember: true
        };
        var reg_data = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            password1: '',
            address: '',
            address1: '',
            city: '',
            state: '',
            postalcode: '',
            country: 'USA',
            agreed: false
        };
        var creditBundles = [];
        var creditBundlesGlobal = [];

        function initializeAppUserData(data) {

            if (login_data.remember) {
                window.localStorage.setItem('postdroidUserName', data.AppUserData.loginEmail);
                window.localStorage.setItem('postdroidPassword', data.AppUserData.loginPassword);
            } else {
                window.localStorage.removeItem('postdroidUserName');
                window.localStorage.removeItem('postdroidPassword');
                login_data.username = '';
                login_data.password = '';
            }
        };

        var Auth = {
            getLoginData: function () {
                return login_data;
            },
            getRegData: function () {
                return reg_data;
            },
            fillRegData: function () {
                utils.setObjVal(reg_data, {
                    firstName: gvars.appUser.firstName,
                    lastName: gvars.appUser.lastName,
                    email: gvars.appUser.loginEmail,
                    password: gvars.appUser.loginPassword,
                    password1: gvars.appUser.confirmLoginPassword,
                    address: gvars.appUser.address1,
                    address1: gvars.appUser.address2,
                    city: gvars.appUser.city,
                    state: gvars.appUser.state,
                    postalcode: gvars.appUser.postalCode,
                    country: gvars.appUser.country,
                    agreed: false
                });
                return reg_data;
            },
            getUserData: function () {
                return gvars.appUser;
            },
            getCountryList: function () {
                return gvars.country_list;
            },
            getCountryList1: function () {
                return gvars.country_list_1;
            },
            selectProduct: function (key) {
                //selProduct = key;
                gvars.postdroid.productTypeSelected.title = gvars.productTypes[key].title;
                gvars.postdroid.productTypeSelected.creditsReqd = gvars.productTypes[key].creditsReqd;
                for (var productKey in gvars.productTypes) {
                    if (gvars.productTypes[key] == gvars.productTypes[productKey]) {
                        gvars.productTypes[productKey].selected = true;
                    } else {
                        gvars.productTypes[productKey].selected = false;
                    }
                }
            },
            selectPhotoUrl: function (img_url, _callback) {
                $ionicLoading.show();
                utils.getBase64FromImageUrl(img_url, function (base64url, data) {
                    gvars.postdroid.imageData = data;
                    gvars.postdroid.imageSource = base64url;
                    $ionicLoading.hide();
                    if (_callback)
                        _callback();
                });
            },
            getProductTypes: function () {

                var arr = [];
                for (var key in gvars.productTypes) {
                    var val = gvars.productTypes[key];
                    if (key.indexOf('tshirt') == 0) {
                        val.photo = 'img/photo/tshirt.jpg';
                    } else if (key.indexOf('sweatshirt') == 0) {
                        val.photo = 'img/photo/sweatshirt.jpg';
                    } else if (key.indexOf('postcard') >= 0) {
                        val.photo = 'img/photo/postcard.jpg';
                    } else if (key.indexOf('coffeeMug') >= 0) {
                        val.photo = 'img/photo/mug.jpg';
                    } else if (key.indexOf('commuterMug') >= 0) {
                        val.photo = 'img/photo/mug.jpg';
                    } else if (key.indexOf('mousepad') >= 0) {
                        val.photo = 'img/photo/mousepad.jpg';
                    } else if (key.indexOf('photoMagnet') >= 0) {
                        val.photo = 'img/photo/magnet.jpg';
                    } else if (key.indexOf('calendar') >= 0) {
                        val.photo = 'img/photo/calendar.jpg';
                    } else {
                        val.photo = 'img/photo/product-0.jpg';
                    }
                    val.key = key;

                    arr.push(val);
                }
                return arr;

            },
            getCreditBundles: function () {
                return creditBundles;
            },
            getCreditBundlesGlobal: function () {
                return creditBundlesGlobal;
            },
            Login: function (_callback_win, _callback_err) {

                authHttp({
                    url: 'http://tryc.clients.braincube.uk.com/Services/Portal.svc/Login',
                    //data: logindata,
                    params: {
                        Username: login_data.username,
                        Password: login_data.password
                    }
                }, function (data) {
                    if (data.SUCCESS) {
                        initializeAppUserData(data);
                    } else {

                    }
                    _callback_win(data);
                }, _callback_err);

            },

            ForgotPassword: function (_callback_win, _callback_err) {

                authHttp({
                    url: 'forgotPassword.do',
                    params: {
                        email: login_data.username
                    }
                }, function (data) {
                    if (data.SUCCESS) {

                    } else {

                    }
                    _callback_win(data);
                }, _callback_err);

            },

            Register: function (_callback_win, _callback_err) {
                authHttp({
                    url: 'createUser.do',
                    //data: logindata,
                    params: {
                        appUserId: gvars.appUser.id,
                        firstName: reg_data.firstName,
                        lastName: reg_data.lastName,
                        email: reg_data.email,
                        password: reg_data.password,
                        address: reg_data.address,
                        address1: reg_data.address1,
                        city: reg_data.city,
                        state: reg_data.state,
                        postalcode: reg_data.postalcode,
                        country: reg_data.country,
                        mobileType: ionic.Platform.platform(),
                        mobileVersionId: ionic.Platform.version() //settings.versionId,

                    }
                }, function (data) {
                    if (data.SUCCESS) {
                        initializeAppUserData(data);
                    } else {

                    }
                    _callback_win(data);
                }, _callback_err);
            },
            validatePostdroid: function () {
                var errors = '';
                if (gvars.postdroid.imageUrl == '' && gvars.postdroid.imageSource == '' && gvars.postdroid.imageData == '')
                    errors += 'Please select an image.\n';
                if (gvars.postdroid.recipients.length == 0)
                    errors += 'Please add recipients.\n';
                if (gvars.postdroid.productTypeSelected.title == gvars.productTypes.postcardProductType.title) {
                    if (gvars.postdroid.message.trim() > 0 &&
                        gvars.postdroid.message.trim() > 350) {
                        errors += 'Message has to be more than 0 and less than 350 characters.Message has to be less than 12 lines.\n';
                    }
                }
                return errors;
            },
            savePostdroid: function (_callback_win, _callback_err) {
                // minimum validation for saving a draft
                if (gvars.postdroid.imageSource == '' && gvars.postdroid.recipients.length == 0 && gvars.postdroid.message.length == 0) {
                    _callback_err('There is nothing to save.');
                    return;
                }
                if (gvars.postdroid.productTypeSelected.title == gvars.productTypes.postcardProductType.title) {
                    if (gvars.postdroid.message.trim() > 0 &&
                        gvars.postdroid.message.trim() > 350) {
                        _callback_err('Message has to be more than 0 and less than 350 characters.Message has to be less than 12 lines.');
                        return;
                    }
                }
                _callback_win();
            },
            saveDraft: function (draftName, _callback_win, _callback_err) {

                var recipients = [];
                for (var i in gvars.postdroid.recipients) {
                    var r = gvars.postdroid.recipients[i];
                    if (r.id) {
                        recipients.push({
                            'recipientUserId': r.id
                        });
                    } else {
                        recipients.push({
                            //'id': r.id,
                            'firstName': r.firstName,
                            'lastName': r.lastName,
                            'address': r.address1,
                            'address1': r.address2,
                            'city': r.city,
                            'state': r.state,
                            'zipCode': r.postalcode,
                            'country': r.country
                        });
                    }

                }

                authHttp({
                    url: 'createMultiplePostdroid.do',
                    method: 'POST',
                    params: {
                        userId: gvars.appUser.id,
                        createdBy: ionic.Platform.platform(),
                        isDraft: true
                    },
                    data: {
                        productType: gvars.postdroid.productTypeSelected.title,
                        message: gvars.postdroid.message,
                        imageName: Date.now() + '.jpg',
                        description: draftName,
                        futureSendDate: gvars.postdroid.mailDate,
                        recipients: recipients
                    }
                }, function (data) {
                    if (data.SUCCESS) {

                        var draft_id = data.postdroidDraftId;

                        // upload image if exists
                        if ((data.s3url && data.s3url.length > 10) &&
                            ( gvars.postdroid.imageSource != '' || gvars.postdroid.imageUrl != '' )) {

                            utils.awsImgUpload(data.s3url, utils.base64toBlob(gvars.postdroid.imageData),
                                function (stat) { //win
                                    if (stat == 'ok') {

                                        console.log("# AWS ok");

                                        authHttp({
                                            url: "draftUploadImage/" + draft_id,
                                            params: {
                                                draftImageName: draft_id + '_draft.jpg'
                                            }
                                        }, function (data) {
                                            //confirmation navigator.notification.alert
                                            if (!data.SUCCESS) {
                                                _callback_err('Unable to save draft. Please try again later.');
                                                return;
                                            }
                                            Auth.draftSuccessCallback(
                                                draft_id,
                                                draftName,
                                                _callback_win,
                                                _callback_err
                                            );

                                        }, function () { //error
                                            _callback_err('Unable to save draft. Please try again later.');
                                        });

                                    }
                                },
                                function () { //err
                                    console.log("# AWS err");
                                },
                                function (v) { //progress
                                }
                            );

                        } else {
                            Auth.draftSuccessCallback(
                                draft_id,
                                draftName,
                                _callback_win,
                                _callback_err
                            );
                        }

                    }
                });
            },
            draftSuccessCallback: function (draft_id, draftName, _callback_win, _callback_err) {
                // draft create success url
                authHttp({
                    url: "draftSaveSuccess/" + draft_id
                }, function (data) {
                    if (data.SUCCESS) {
                        var draft = new Object();
                        draft.postdroidId = draft_id;
                        draft.productType = gvars.postdroid.productTypeSelected.title;
                        draft.description = draftName;
                        draft.time = moment(gvars.postdroid.mailDate).format('MM/DD/YYYY');
                        gvars.appUser.drafts.push(draft);

                        if (_callback_win) {
                            Auth.resetHomeValues();
                            _callback_win();
                        }

                    } else {

                        if (_callback_err)
                            _callback_err('Unable to save draft. Please try again later.');
                    }
                });
            },
            sendPostDroid: function (_callback_win, _callback_err) {

                // check to see if enough credits
                var creditsReqdPerRecipient = gvars.postdroid.productTypeSelected.creditsReqd;
                var creditsReqdForPostdroid = creditsReqdPerRecipient * gvars.postdroid.recipients.length;
                if (creditsReqdForPostdroid > gvars.appUser.unusedCredits) {
                    var notEnoughCreditsErrorMsgHolder = 'You are sending to %NO_OF_RECIPIENTS% recipients. You need %CREDITS_REQD% credits for this order.You only have %CREDIT_BALANCE% credits.Please remove recipients or buy more credits.';
                    notEnoughCreditsErrorMsgHolder = notEnoughCreditsErrorMsgHolder.replace("%NO_OF_RECIPIENTS%", gvars.postdroid.recipients.length);
                    notEnoughCreditsErrorMsgHolder = notEnoughCreditsErrorMsgHolder.replace("%CREDITS_REQD%", creditsReqdForPostdroid);
                    notEnoughCreditsErrorMsgHolder = notEnoughCreditsErrorMsgHolder.replace("%CREDIT_BALANCE%", gvars.appUser.unusedCredits);
                    if (_callback_err) _callback_err(notEnoughCreditsErrorMsgHolder);
                    return;
                }
                if (gvars.postdroid.productTypeSelected.title == gvars.productTypes.calendar4x6ProductType.title ||
                    gvars.postdroid.productTypeSelected.title == gvars.productTypes.calendar5x7ProductType.title ||
                    gvars.postdroid.productTypeSelected.title == gvars.productTypes.calendar8x10ProductType.title) {
                    /*
                     var startMonthYear = $('#postdroidCalendarStartingMonth').val() + ', ' +
                     $('#postdroidCalendarStartingYear').val();
                     $("#postdroidMessageTextArea").val(startMonthYear);
                     */
                }

                var recipients = [];
                for (var i in gvars.postdroid.recipients) {
                    var r = gvars.postdroid.recipients[i];
                    if (r.id) {
                        recipients.push({
                            'recipientUserId': r.id
                        });
                    } else {
                        recipients.push({
                            //'id': r.id,
                            'firstName': r.firstName,
                            'lastName': r.lastName,
                            'address': r.address1,
                            'address1': r.address2,
                            'city': r.city,
                            'state': r.state,
                            'zipCode': r.postalcode,
                            'country': r.country
                        });
                    }
                }

                authHttp({
                    url: 'createMultiplePostdroid.do',
                    method: 'POST',
                    params: {
                        userId: gvars.appUser.id,
                        createdBy: ionic.Platform.platform()
                    },
                    data: {
                        productType: gvars.postdroid.productTypeSelected.title,
                        message: gvars.postdroid.message,
                        imageName: Date.now() + '.jpg',
                        futureSendDate: gvars.postdroid.mailDate,
                        recipients: recipients
                    }
                }, function (data) {
                    if (data.SUCCESS) {
                        if (gvars.postdroid.recipients[0].id == -1 && gvars.appUser.recipients.length > 0) {
                            gvars.postdroid.recipients[0].id = data.postdroidRecipientId;
                            gvars.appUser.recipients.push(postdroid.recipients[0]);
                        }

                        utils.awsImgUpload(data.s3url, utils.base64toBlob(gvars.postdroid.imageData),
                            function (stat) { //win
                                if (stat == 'ok') {
                                    console.log("# AWS ok");

                                    // success confirmation
                                    authHttp({
                                        url: "postdroidImageUploadStatus/" + data.postdroidId + "/true",
                                        method: 'GET'
                                        //dataType: 'json',
                                        //async: false,
                                    }, function (data) {
                                        if (data.SUCCESS) {
                                            // update appuser info - such as credits left, postdroid sent data
                                            gvars.appUser.creditsLeft = gvars.appUser.unusedCredits - creditsReqdForPostdroid;
                                            gvars.appUser.unusedCredits = gvars.appUser.unusedCredits - creditsReqdForPostdroid;
                                            if (gvars.postdroid.productTypeSelected.title == gvars.productTypes.postcardProductType.title) {
                                                gvars.appUser.postcardsSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.photoMagnet3x4ProductType.title) {
                                                gvars.appUser.photoMagnet3x4Sent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.photoMagnet4x6ProductType.title) {
                                                gvars.appUser.photoMagnet4x6Sent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.mousepadProductType.title) {
                                                gvars.appUser.mousepadsSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.calendar4x6ProductType.title) {
                                                gvars.appUser.calendar4x6Sent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.calendar5x7ProductType.title) {
                                                gvars.appUser.calendar5x7Sent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.calendar8x10ProductType.title) {
                                                gvars.appUser.calendar8x10Sent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.coffeeMugProductType.title) {
                                                gvars.appUser.coffeeMugsSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.commuterMugProductType.title) {
                                                gvars.appUser.commuterMugsSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtYouthSmallProductType.title) {
                                                gvars.appUser.tShirtYouthSmallSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtYouthMediumProductType.title) {
                                                gvars.appUser.tShirtYouthMediumSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtYouthLargeProductType.title) {
                                                gvars.appUser.tShirtYouthLargeSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtAdultSmallProductType.title) {
                                                gvars.appUser.tShirtAdultSmallSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtAdultMediumProductType.title) {
                                                gvars.appUser.tShirtAdultMediumSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtAdultLargeProductType.title) {
                                                gvars.appUser.tShirtAdultLargeSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtAdultExtraLargeProductType.title) {
                                                gvars.appUser.tShirtAdultExtraLargeSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.tshirtAdultExtraExtraLargeProductType.title) {
                                                gvars.appUser.tShirtAdultExtraExtraLargeSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtYouthSmallProductType.title) {
                                                gvars.appUser.sweatshirtYouthSmallSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtYouthMediumProductType.title) {
                                                gvars.appUser.sweatshirtYouthMediumSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtYouthLargeProductType.title) {
                                                gvars.appUser.sweatshirtYouthLargeSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtAdultSmallProductType.title) {
                                                gvars.appUser.sweatshirtAdultSmallSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtAdultMediumProductType.title) {
                                                gvars.appUser.sweatshirtAdultMediumSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtAdultLargeProductType.title) {
                                                gvars.appUser.sweatshirtAdultLargeSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtAdultExtraLargeProductType.title) {
                                                gvars.appUser.sweatshirtAdultExtraLargeSent += gvars.postdroid.recipients.length;
                                            } else if (postdroid.productTypeSelected.title == productTypes.sweatshirtAdultExtraExtraLargeProductType.title) {
                                                gvars.appUser.sweatshirtAdultExtraExtraLargeSent += gvars.postdroid.recipients.length;
                                            }
                                            gvars.appUser.postdroidsSent = true;
                                            Auth.resetHomeValues();
                                            _callback_win(data);
                                        } else {
                                            _callback_err('Unable to send your order. Please try again later.');
                                        }
                                    });
                                }

                            },
                            function () { //err
                                console.log("# AWS err");
                            },
                            function (v) { //progress
                            }
                        );
                    }
                }, _callback_err);

            },
            getDrafts: function () {
                // check if drafts exists
                authHttp({
                    url: "postdroidDrafts/" + gvars.appUser.id
                }, function (data) {
                    if (data.SUCCESS) {
                        for (i in data.PostdroidDrafts) {
                            var draft = new Object();
                            draft.postdroidId = data.PostdroidDrafts[i].postdroidId;
                            draft.productType = data.PostdroidDrafts[i].productType;
                            draft.description = data.PostdroidDrafts[i].description;
                            draft.time = moment(data.PostdroidDrafts[i].futureSendDate).format("MMMM Do YYYY");
                            gvars.appUser.drafts.push(draft);
                        }
                        ;
                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                    }
                });
            },

            deleteDraft: function (draftIndex, _callback) {
                authHttp({
                    url: "draftDelete/" + gvars.appUser.id + "/" + gvars.appUser.drafts[draftIndex].postdroidId
                }, function (data) {
                    if (data.SUCCESS) {
                        gvars.appUser.drafts.splice(draftIndex, 1);
                        ;
                        _callback();
                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                    }
                });
            },

            selectDraft: function (draftIndex, _callback) {
                authHttp({
                    url: "postdroidDraft/" + gvars.appUser.id + "/" + gvars.appUser.drafts[draftIndex].postdroidId
                }, function (data) {
                    if (data.SUCCESS) {

                        for (k in gvars.productTypes) {
                            var title = gvars.productTypes[k].title;
                            var creditsReqd = gvars.productTypes[k].creditsReqd;
                            if (data.PostdroidDraft.productType == title) {
                                gvars.postdroid.productTypeSelected.title = title;
                                gvars.postdroid.productTypeSelected.creditsReqd = creditsReqd;
                                break;
                            }
                        }

                        // set image url
                        if (data.PostdroidDraft.draftImageUrl != null && data.PostdroidDraft.draftImageUrl.trim() != '') {
                            gvars.postdroid.imageUrl = data.PostdroidDraft.draftImageUrl;
                            $ionicLoading.show();
                            utils.getBase64FromImageUrl(gvars.postdroid.imageUrl, function (base64url, data) {
                                gvars.postdroid.imageData = data;
                                gvars.postdroid.imageSource = base64url;
                                $ionicLoading.hide();
                                if (_callback)
                                    _callback();
                            });
                        }

                        // set message
                        gvars.postdroid.message = data.PostdroidDraft.message;

                        //set recipients
                        gvars.postdroid.recipients.splice(0, gvars.postdroid.recipients.length);
                        for (i in data.PostdroidDraft.recipients) {
                            // add to postdroid.recipients
                            var recipient = new Object();
                            recipient.id = data.PostdroidDraft.recipients[i].recipientUserId;
                            recipient.firstName = data.PostdroidDraft.recipients[i].firstName;
                            recipient.lastName = data.PostdroidDraft.recipients[i].lastName;
                            recipient.address1 = data.PostdroidDraft.recipients[i].address;
                            recipient.address2 = data.PostdroidDraft.recipients[i].address1;
                            recipient.city = data.PostdroidDraft.recipients[i].city;
                            recipient.state = data.PostdroidDraft.recipients[i].state;
                            recipient.postalCode = data.PostdroidDraft.recipients[i].zipCode;
                            recipient.country = data.PostdroidDraft.recipients[i].country;
                            gvars.postdroid.recipients.push(recipient);
                        }
                        ;
                        _callback();
                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                    }
                });
            },

            buyPaypal: function (id, _callback_win, _callback_err) {
                authHttp({
                    url: 'getExpressCheckoutURL/' + gvars.appUser.id + '/' + id,
                    params: {
                        callerType: ionic.Platform.platform()
                    }
                }, function (data) {
                    if (data.SUCCESS) {
                        console.log("# response : ", data);
                        _callback_win(data);
                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                    }
                }, _callback_err);
            },
            buyCredit: function (id, cc, _callback_win, _callback_err) {
                authHttp({
                    url: 'buyCredits.do',
                    params: {
                        userId: gvars.appUser.id,
                        creditBundleId: id,
                        street1: cc.address1,
                        street2: cc.address2,
                        city: cc.city,
                        country: cc.country,
                        stateOrProvince: cc.state,
                        postalCode: cc.postalCode,
                        cardType: cc.cardType,
                        ccNumber: cc.number,
                        cvv2: cc.cvvCode,
                        expMonth: cc.expMonth,
                        expYear: cc.expYear,
                        cardFirstName: cc.firstName,
                        cardLastName: cc.lastName
                        //callerType: ionic.Platform.platform(),
                    }
                }, function (data) {
                    if (data.SUCCESS) {
                        console.log("# response : ", data);
                        var paypalTransactionId = data.transactionId;
                        var amountCharged = data.grossAmountCharged;
                        var totalCreditsBought = data.newCreditsBought;
                        var totalUnusedCredits = data.totalUnusedCredits;
                        gvars.appUser.totalCreditsBought = appUser.totalCreditsBought + data.newCreditsBought;
                        gvars.appUser.creditsLeft = appUser.unusedCredits + data.newCreditsBought;
                        gvars.appUser.unusedCredits = appUser.unusedCredits + data.newCreditsBought;
                        //resetHomeValues();
                        var successStr = 'Paypal transaction id' + ' - ' + paypalTransactionId + '\r\n' +
                            'Amount charged' + ' - ' + amountCharged + '\r\n' +
                            'Credits bought' + ' - ' + totalCreditsBought + '\r\n' +
                            'Total unused credits' + ' - ' + totalUnusedCredits + '\r\n';
                        utils.alert('Success', successStr);

                        _callback_win(data);
                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                    }
                }, _callback_err);
            },

            // Reset Home Values
            resetHomeValues: function () {
                gvars.postdroid.imageSource = '';
                gvars.postdroid.imageData = '';
                gvars.postdroid.imageUrl = '';
                gvars.postdroid.recipients = new Array();
                gvars.postdroid.message = '';
                gvars.postdroid.mailDate = moment().toDate();
            },

            getReceiversFromHttp: function (_callback_win, _callback_err) {
                authHttp({
                    url: gvars.appUser.id + '/myRecipients'
                }, function (data) {
                    if (data.SUCCESS) {
                        console.log('myRecipients:', data);

                        gvars.appUser.recipients.splice(0, gvars.appUser.recipients.length);

                        for (i in data.APPUSER_RECIPIENTS) {
                            var item = data.APPUSER_RECIPIENTS[i];
                            var appUserRecipient = new Object();
                            appUserRecipient.id = item.recipientUserId;
                            appUserRecipient.firstName = item.recipientFirstName;
                            appUserRecipient.lastName = item.recipientLastName;
                            appUserRecipient.address1 = item.recipientAddress1;
                            appUserRecipient.address2 = item.recipientAddress2;
                            appUserRecipient.city = item.recipientCity;
                            appUserRecipient.state = item.recipientState;
                            appUserRecipient.postalCode = item.recipientZipCode;
                            appUserRecipient.country = item.recipientCountry.substr(0, 2);
                            gvars.appUser.recipients.push(appUserRecipient);
                        }

                        if (_callback_win)
                            _callback_win();

                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                        if (_callback_err)
                            _callback_err();
                    }
                });
            }
        }
        return Auth;

    })

    .factory('Order', function (authHttp, gvars, utils) {
        var _order = {
            getHistory: function (_callback_win, _callback_err) {
                authHttp({
                    url: 'orderHistory/' + gvars.appUser.id
                }, function (data) {
                    if (data.SUCCESS) {
                        console.log("# response : ", data);
                        _callback_win(data);
                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                        _callback_err(data);
                    }
                }, _callback_err);
            }
        };
        return _order;
    })

    .factory('Billing', function (authHttp, gvars, utils) {
        var _billing = {
            getHistory: function (_callback_win, _callback_err) {
                authHttp({
                    url: 'billingHistory/' + gvars.appUser.id
                }, function (data) {
                    if (data.SUCCESS) {
                        console.log("# response : ", data);
                        _callback_win(data);
                    } else {
                        utils.alert('Error', data.ERROR_MSG);
                        _callback_err(data);
                    }
                }, _callback_err);
            }
        };
        return _billing;
    })

    .factory('Photos', function (Facebook, gvars, $ionicLoading) {
        var album = [];
        var plist = [];
        var album_sel_idx = -1;
        var photo_sel_idx = -1;
        var album_next_pg = null;
        var photo_next_pg = null;
        var photos = {
            getAlbum: function () {
                console.log("album: ", album);
                return album;
            },
            getPhotos: function () {
                return plist;
            },
            getAlbumNextUrl: function () {
                return album_next_pg;
            },
            getPhotoNextUrl: function () {
                return photo_next_pg;
            },
            getSelectedAlbum: function () {
                if (album && album_sel_idx >= 0)
                    return album[album_sel_idx];
                return null;
            },
            getFacebookAlbum: function (_callback) {
                $ionicLoading.show();
                if (Facebook.isLogined()) {
                    Facebook.getAlbum(function (data) {
                        $ionicLoading.hide();
                        album = data.data;
                        album_next_pg = data.paging.next ? data.paging.next : null;
                        _callback();
                    });
                } else {
                    Facebook.login(function () {
                        Facebook.getAlbum(function (data) {
                            $ionicLoading.hide();
                            album = data.data;
                            album_next_pg = data.paging.next ? data.paging.next : null;
                            _callback();
                        });
                    });
                }
            },
            getFacbookPhotos: function (album_idx, _callback) {
                album_sel_idx = album_idx;
                //console.log("sel album : ", album[album_idx]);
                var album_id = album[album_idx]['id'];
                $ionicLoading.show();
                if (Facebook.isLogined()) {
                    Facebook.getPhotos(album_id, function (data) {
                        $ionicLoading.hide();
                        plist = data.data;
                        photo_next_pg = data.paging.next ? data.paging.next : null;
                        //console.log('# photo_next_pg = ' + photo_next_pg, data.paging);

                        _callback();
                    });
                } else {
                    Facebook.login(function () {
                        Facebook.getPhotos(album_id, function (data) {
                            $ionicLoading.hide();
                            plist = data.data;
                            photo_next_pg = data.paging.next ? data.paging.next : null;
                            _callback();
                        });
                    });
                }
            },
            getAlbumMore: function (_callback) {
                //Facebook.getDataFromURL();
            },
            getPhotoMore: function (_callback) {
                if (!photo_next_pg) {
                    console.log('no more : ' + photo_next_pg);
                    _callback(0);
                    return;
                }
                Facebook.getDataFromURL(photo_next_pg, function (data) {
                    //plist = plist.concat(data.data);
                    data.data.forEach(function (item) {
                        plist.push(item);
                    })
                    photo_next_pg = data.paging.next ? data.paging.next : null;
                    _callback(1);
                });
            },

            takeCameraPhoto: function (_callback_win, _callback_err) {

                var opts = {
                    quality: 50,
                    //destinationType: Camera.DestinationType.FILE_URI
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    saveToPhotoAlbum: true
                };

                navigator.camera.getPicture(function (imageData) {
                    gvars.postdroid.imageData = imageData;
                    gvars.postdroid.imageSource = "data:image/jpeg;base64," + imageData;
                    if (_callback_win) {
                        _callback_win();
                    }
                }, _callback_err, opts);
            },

            takeDeviceGallery: function (_callback_win, _callback_err) {

                var opts = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                };

                navigator.camera.getPicture(function (imageData) {
                    gvars.postdroid.imageData = imageData;
                    gvars.postdroid.imageSource = "data:image/jpeg;base64," + imageData;
                    ;
                    if (_callback_win) {
                        _callback_win();
                    }
                }, _callback_err, opts);
            }


        };
        return photos;
    })

    .factory('Facebook', function () {

        var try_login = 0;
        var fbToken = sessionStorage.getItem('fbtoken');

        var fb = {
            isLogined: function () {
                return (fbToken && fbToken != 'undefined');
            },
            login: function (_callback) {
                openFB.login(
                    function (response) {
                        if (response.status === 'connected') {
                            console.log('Facebook login succeeded');
                            _callback();
                        } else {
                            console.log('Facebook login failed: ', response);
                        }
                    },
                    {scope: 'email,publish_stream,offline_access,friends_photos,user_photos,user_photo_video_tags,friends_photo_video_tags'}
                );
            },
            getAlbum: function (_callback) {
                // if(try_login>2) {
                // 	try_login = 0;
                // 	return;
                // }
                openFB.api({
                    path: '/me/albums',
                    //params: {fields: 'id,name'},
                    success: function (data) {
                        //console.log('data : ', data);
                        _callback(data);
                    },
                    error: function (error) {
                        console.log('Facebook error: ' + error.message);
                        fb.login(function () {
                            try_login++;
                            fb.getAlbum(_callback);
                        });
                    }
                });
            },

            getPhotos: function (album_id, _callback) {
                openFB.api({
                    path: '/' + album_id + '/photos',
                    //params: {fields: 'id,name'},
                    success: function (data) {
                        console.log('photos : ', data);
                        _callback(data);
                    },
                    error: function (error) {
                        console.log('Facebook error: ' + error.message);
                        fb.login(function () {
                            try_login++;
                            fb.getAlbum(_callback);
                        });
                    }
                });
            },
            getDataFromURL: function (next_url, _callback) {
                var url = next_url.replace('https://graph.facebook.com', '');
                openFB.api({
                    path: url,
                    success: function (data) {
                        _callback(data);
                    },
                    error: function (error) {
                        console.log('Facebook error: ' + error.message);
                        fb.login(function () {
                            try_login++;
                            fb.getAlbum(_callback);
                        });
                    }
                });
            }
        };
        return fb;
    })