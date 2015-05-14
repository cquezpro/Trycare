// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'monospaced.elastic', 'ionicLazyLoad', 'pascalprecht.translate', 'pasvaz.bindonce'])

    .run(function ($ionicPlatform, $translate) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            if (typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function (language) {
                    $translate.use((language.value).split("-")[0]).then(function (data) {
                        console.log("SUCCESS -> " + data);
                    }, function (error) {
                        console.log("ERROR -> " + error);
                    });
                }, null);
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

        openFB.init({appId: '125794564102717'});

        $translateProvider.translations('en', {
            ABOUT_DESCRIPTION: "Postdroid's vision is to create the world's largest gifting network. Postdroid app let's you send gifts to anyone, anywhere in the world. We want to be part of your special moments and want to help you share your memories",
            APP_VERSION: "Version : 1.0.0",
            CONTACT_US : "Contact us",
            RATE_US : "Rate us",
            APP_PRIVACY_POLICY: "Privacy Policy",
            SELECT_FROM_TEXT: "Select From",
            PREVIOUSLY_SENT_TEXT: "Previously sent",
            FIRST_NAME_TEXT: "First Name",
            LAST_NAME_TEXT: "Last Name",
            ADDRESS_ONE_TEXT: "Address1",
            ADDRESS_TWO_TEXT: "Address2",
            CITY_TEXT: "City",
            STATE_TEXT: "State",
            POSTAL_CODE_TEXT: "Postal code",
            ABOUT_TEXT: "About",
            DELIVERY_TAKE_TEXT: "Delivery will take around 5~6 days *",
            EXISTING_RECIPIENTS_TEXT: "Existing Recipients",
            COUNTRY_TEXT: "Country",
            CONTINUE_TEXT: "Continue",
            DATE_PURCHASE_TEXT: "Date of purchase",
            NUMBER_CREDITS_TEXT: "No. of Credits",
            TRANSACTION_ID_TEXT: "Transaction id",
            BILLING_HISTORY_TEXT: "Billing History",
            HI_TEXT: "Hi,",
            YOU_HAVE_TEXT: "You have",
            CREDIT_LEFT_TEXT: " credit left"


        });

        $translateProvider.preferredLanguage("en");
        $translateProvider.fallbackLanguage("en");

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html"
                //controller: 'AppCtrl'
            })

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'AppCtrl'
            })

            .state('forget', {
                url: "/forget",
                templateUrl: "templates/forget.html",
                controller: 'AuthCtrl'
            })

            .state('register', {
                url: "/register",
                templateUrl: "templates/register.html",
                controller: 'AuthCtrl'
            })

            .state('register1', {
                url: "/register1",
                templateUrl: "templates/register1.html",
                controller: 'AuthCtrl'
            })

            .state('main', {
                url: "/main",
                templateUrl: "templates/main.html",
                controller: 'MainCtrl'
            })

            .state('product', {
                url: "/product",
                templateUrl: "templates/product.html",
                controller: 'ProductCtrl'
            })

            .state('basket', {
                url: "/basket",
                templateUrl: "templates/basket.html",
                controller: 'BasketCtrl'
            })

            .state('search', {
                url: "/search",
                templateUrl: "templates/search.html",
                controller: 'SearchCtrl'
            })

            .state('app.register-edit', {
                url: "/register-edit",
                views: {
                    'menuContent': {
                        templateUrl: "templates/register-edit.html",
                        controller: 'RegisterEditCtrl'
                    }
                }
            })

            .state('address-add', {
                url: "/address-add",
                templateUrl: "templates/address-add.html",
                controller: 'AddressCtrl'
            })

            .state('address-list', {
                url: "/address-list",
                templateUrl: "templates/address-list.html",
                controller: 'AddressCtrl'
            })

            .state('app.home', {
                url: "/home",
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html"
                        //controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.home.products', {
                url: "/products",
                views: {
                    'home-products': {
                        templateUrl: "templates/home-products.html",
                        controller: 'ProductsCtrl'
                    }
                }
            })

            .state('app.home.photos', {
                url: "/photos",
                views: {
                    'home-photo': {
                        templateUrl: "templates/home-photos.html",
                        controller: 'PhotosCtrl'
                    }
                }
            })

            .state('app.home.text', {
                url: "/text",
                views: {
                    'home-text': {
                        templateUrl: "templates/home-text.html",
                        controller: 'TextCtrl'
                    }
                }
            })

            .state('app.home.address', {
                url: "/address",
                views: {
                    'home-address': {
                        templateUrl: "templates/home-address.html",
                        controller: 'AddressCtrl'
                    }
                }
            })

            .state('app.about', {
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about.html",
                        controller: 'AboutUsCtrl'
                    }
                }
            })


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    })
.filter('maxLength', function() {
  return function(input, maxLength) {
    if (! input) {
      return '';
    } else {
        var output;
        if (input.length <= maxLength) {
            return input;
        }
        else {
            return input.substring(0, maxLength).trim() + '...';    
        }
    }
  };
});
