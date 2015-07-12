var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Application;
        (function (Application) {
            var ngModule;
            var isShowingPinPrompt;
            function main() {
                var versionInfo;
                window.onerror = window_onerror;
                versionInfo = {
                    applicationName: "Sample App",
                    copyrightInfoUrl: "https://github.com/Justin-Credible/Ionic-TypeScript-Starter/blob/master/LICENSE",
                    websiteUrl: "http://www.justin-credible.net",
                    githubUrl: "https://github.com/Justin-Credible",
                    email: "justin.unterreiner@gmail.com",
                    majorVersion: window.declare.majorVersion,
                    minorVersion: window.declare.minorVersion,
                    buildVersion: window.declare.buildVersion,
                    versionString: window.declare.majorVersion + "." + window.declare.minorVersion + "." + window.declare.buildVersion,
                    buildTimestamp: window.declare.buildTimestamp
                };
                ngModule = angular.module("JustinCredible.SampleApp.Application", ["ui.router", "ionic", "ngMockE2E"]);
                ngModule.constant("isRipple", !!(window.parent && window.parent.ripple));
                ngModule.constant("isCordova", typeof (cordova) !== "undefined");
                ngModule.constant("isDebug", window.declare.debug);
                ngModule.constant("isChromeExtension", typeof (chrome) !== "undefined" && typeof (chrome.runtime) !== "undefined" && typeof (chrome.runtime.id) !== "undefined");
                ngModule.constant("versionInfo", versionInfo);
                ngModule.constant("apiVersion", "1.0");
                registerServices(ngModule);
                registerDirectives(ngModule);
                registerFilters(ngModule);
                registerControllers(ngModule);
                ngModule.run(angular_initialize);
                ngModule.config(angular_configure);
            }
            Application.main = main;
            function construct(constructor, args) {
                function F() {
                    return constructor.apply(this, args);
                }
                ;
                F.prototype = constructor.prototype;
                return new F();
            }
            function registerServices(ngModule) {
                _.each(SampleApp.Services, function (Service) {
                    if (Service.ID) {
                        if (typeof (Service.getFactory) === "function") {
                            console.log("Registering factory " + Service.ID + "...");
                            ngModule.factory(Service.ID, Service.getFactory());
                        }
                        else {
                            console.log("Registering service " + Service.ID + "...");
                            ngModule.service(Service.ID, Service);
                        }
                    }
                });
            }
            function registerDirectives(ngModule) {
                _.each(SampleApp.Directives, function (Directive) {
                    if (Directive.ID) {
                        if (Directive.__BaseElementDirective) {
                            console.log("Registering element directive " + Directive.ID + "...");
                            ngModule.directive(Directive.ID, getElementDirectiveFactoryFunction(Directive));
                        }
                        else {
                            ngModule.directive(Directive.ID, getDirectiveFactoryParameters(Directive));
                        }
                    }
                });
            }
            function registerFilters(ngModule) {
                _.each(SampleApp.Filters, function (Filter) {
                    if (Filter.ID && typeof (Filter.filter) === "function") {
                        console.log("Registering filter " + Filter.ID + "...");
                        ngModule.filter(Filter.ID, getFilterFactoryFunction(Filter.filter));
                    }
                });
            }
            function registerControllers(ngModule) {
                _.each(SampleApp.Controllers, function (Controller) {
                    if (Controller.ID) {
                        console.log("Registering controller " + Controller.ID + "...");
                        ngModule.controller(Controller.ID, Controller);
                    }
                });
            }
            function registerDialogs(Utilities, UiHelper) {
                _.each(SampleApp.Controllers, function (Controller) {
                    if (Controller === SampleApp.Controllers.BaseDialogController) {
                        return;
                    }
                    if (Utilities.derivesFrom(Controller, SampleApp.Controllers.BaseDialogController)) {
                        UiHelper.registerDialog(Controller.ID, Controller.TemplatePath);
                    }
                });
            }
            function getElementDirectiveFactoryFunction(Directive) {
                var descriptor = {};
                descriptor.restrict = Directive["restrict"];
                descriptor.template = Directive["template"];
                descriptor.replace = Directive["replace"];
                descriptor.transclude = Directive["transclude"];
                descriptor.scope = Directive["scope"];
                if (descriptor.restrict !== "E") {
                    console.warn("BaseElementDirectives are meant to restrict only to element types.");
                }
                descriptor.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
                    var instance = new Directive(scope, instanceElement, instanceAttributes, controller, transclude);
                    instance.render();
                };
                return function () { return descriptor; };
            }
            function getDirectiveFactoryParameters(Directive) {
                var params = [];
                if (Directive["$inject"]) {
                    params = params.concat(Directive["$inject"]);
                }
                params.push(function () {
                    return construct(Directive, arguments);
                });
                return params;
            }
            function getFilterFactoryFunction(fn) {
                return function () { return fn; };
            }
            function angular_initialize($rootScope, $location, $ionicHistory, $ionicPlatform, Utilities, UiHelper, Preferences, MockHttpApis) {
                $ionicPlatform.ready(function () {
                    ionicPlatform_ready($rootScope, $location, $ionicHistory, $ionicPlatform, UiHelper, Utilities, Preferences);
                });
                MockHttpApis.mockHttpCalls(Preferences.enableMockHttpCalls);
            }
            ;
            function ionicPlatform_ready($rootScope, $location, $ionicHistory, $ionicPlatform, UiHelper, Utilities, Preferences) {
                document.addEventListener("pause", _.bind(device_pause, null, Preferences));
                document.addEventListener("resume", _.bind(device_resume, null, $location, $ionicHistory, Utilities, UiHelper, Preferences));
                document.addEventListener("menubutton", _.bind(device_menuButton, null, $rootScope));
                $rootScope.$on("$locationChangeStart", angular_locationChangeStart);
                registerDialogs(Utilities, UiHelper);
                device_resume($location, $ionicHistory, Utilities, UiHelper, Preferences);
            }
            function angular_configure($stateProvider, $urlRouterProvider, $provide, $httpProvider, $compileProvider) {
                $provide.decorator("$exceptionHandler", function ($delegate) {
                    return function (exception, cause) {
                        angular_exceptionHandler(exception, cause);
                        $delegate(exception, cause);
                    };
                });
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0|chrome-extension):/);
                $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\//);
                $httpProvider.interceptors.push(SampleApp.Services.HttpInterceptor.ID);
                SampleApp.RouteConfig.setupRoutes($stateProvider, $urlRouterProvider);
                if (localStorage.getItem("ENABLE_MOCK_HTTP_CALLS") === "true") {
                    SampleApp.Services.MockHttpApis.setupMockHttpDelay($provide);
                }
            }
            ;
            function device_pause(Preferences) {
                if (!isShowingPinPrompt) {
                    Preferences.lastPausedAt = moment();
                }
            }
            function device_resume($location, $ionicHistory, Utilities, UiHelper, Preferences) {
                isShowingPinPrompt = true;
                UiHelper.showPinEntryAfterResume().then(function () {
                    isShowingPinPrompt = false;
                    if (!Preferences.hasCompletedOnboarding) {
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        $location.path("/app/onboarding/splash");
                        $location.replace();
                        return;
                    }
                    if ($location.url() === "/app/blank") {
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        $location.path(Utilities.defaultCategory.href.substring(1));
                        $location.replace();
                    }
                });
            }
            function device_menuButton($rootScope) {
                $rootScope.$broadcast("menubutton");
            }
            function angular_locationChangeStart(event, newRoute, oldRoute) {
                console.log("Location change, old Route: " + oldRoute);
                console.log("Location change, new Route: " + newRoute);
            }
            ;
            function window_onerror(message, uri, lineNumber, columnNumber) {
                var Logger, UiHelper;
                console.error("Unhandled JS Exception", message, uri, lineNumber, columnNumber);
                try {
                    UiHelper = angular.element(document.body).injector().get(SampleApp.Services.UiHelper.ID);
                    UiHelper.toast.showLongBottom("An error has occurred; please try again.");
                    UiHelper.progressIndicator.hide();
                }
                catch (ex) {
                    console.warn("There was a problem alerting the user to an Angular error; falling back to a standard alert().", ex);
                    alert("An error has occurred; please try again.");
                }
                try {
                    Logger = angular.element(document.body).injector().get(SampleApp.Services.Logger.ID);
                    Logger.logWindowError(message, uri, lineNumber, columnNumber);
                }
                catch (ex) {
                    console.error("An error occurred while attempting to log an exception.", ex);
                }
            }
            function angular_exceptionHandler(exception, cause) {
                var message = exception.message, Logger, UiHelper;
                if (!cause) {
                    cause = "[Unknown]";
                }
                console.error("AngularJS Exception", exception, cause);
                try {
                    UiHelper = angular.element(document.body).injector().get(SampleApp.Services.UiHelper.ID);
                    UiHelper.toast.showLongBottom("An error has occurred; please try again.");
                    UiHelper.progressIndicator.hide();
                }
                catch (ex) {
                    console.warn("There was a problem alerting the user to an Angular error; falling back to a standard alert().", ex);
                    alert("An error has occurred; please try again.");
                }
                try {
                    Logger = angular.element(document.body).injector().get(SampleApp.Services.Logger.ID);
                    Logger.logError("Angular exception caused by " + cause, exception);
                }
                catch (ex) {
                    console.error("An error occurred while attempting to log an Angular exception.", ex);
                }
            }
        })(Application = SampleApp.Application || (SampleApp.Application = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var RouteConfig = (function () {
            function RouteConfig() {
            }
            RouteConfig.setupRoutes = function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state("app", {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/Menu.html",
                    controller: SampleApp.Controllers.MenuController.ID
                });
                $stateProvider.state("app.blank", {
                    url: "/blank",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Blank.html"
                        }
                    }
                });
                $stateProvider.state("app.category", {
                    url: "/category/:categoryNumber",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Category.html",
                            controller: SampleApp.Controllers.CategoryController.ID
                        }
                    }
                });
                $stateProvider.state("app.onboarding-splash", {
                    url: "/onboarding/splash",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Onboarding/Onboarding-Splash.html",
                            controller: SampleApp.Controllers.OnboardingSplashController.ID
                        }
                    }
                });
                $stateProvider.state("app.onboarding-register", {
                    url: "/onboarding/register",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Onboarding/Onboarding-Register.html",
                            controller: SampleApp.Controllers.OnboardingRegisterController.ID
                        }
                    }
                });
                $stateProvider.state("app.onboarding-share", {
                    url: "/onboarding/share",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Onboarding/Onboarding-Share.html",
                            controller: SampleApp.Controllers.OnboardingShareController.ID
                        }
                    }
                });
                $stateProvider.state("app.settings-list", {
                    url: "/settings/list",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Settings/Settings-List.html",
                            controller: SampleApp.Controllers.SettingsListController.ID
                        }
                    }
                });
                $stateProvider.state("app.cloud-sync", {
                    url: "/settings/cloud-sync",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Settings/Cloud-Sync.html",
                            controller: SampleApp.Controllers.CloudSyncController.ID
                        }
                    }
                });
                $stateProvider.state("app.configure-pin", {
                    url: "/settings/configure-pin",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Settings/Configure-Pin.html",
                            controller: SampleApp.Controllers.ConfigurePinController.ID
                        }
                    }
                });
                $stateProvider.state("app.developer", {
                    url: "/settings/developer",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Settings/Developer.html",
                            controller: SampleApp.Controllers.DeveloperController.ID
                        }
                    }
                });
                $stateProvider.state("app.logs", {
                    url: "/settings/logs",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Settings/Logs.html",
                            controller: SampleApp.Controllers.LogsController.ID
                        }
                    }
                });
                $stateProvider.state("app.log-entry", {
                    url: "/settings/log-entry/:id",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Settings/Log-Entry.html",
                            controller: SampleApp.Controllers.LogEntryController.ID
                        }
                    }
                });
                $stateProvider.state("app.about", {
                    url: "/settings/about",
                    views: {
                        "menuContent": {
                            templateUrl: "templates/Settings/About.html",
                            controller: SampleApp.Controllers.AboutController.ID
                        }
                    }
                });
                $urlRouterProvider.otherwise("/app/blank");
            };
            return RouteConfig;
        })();
        SampleApp.RouteConfig = RouteConfig;
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var BaseController = (function () {
                function BaseController(scope, ModelType) {
                    var _this = this;
                    this.scope = scope;
                    this.viewModel = new ModelType();
                    this.scope["viewModel"] = this.viewModel;
                    this.scope["controller"] = this;
                    this.scope.$on("$ionicView.loaded", _.bind(this.view_loaded, this));
                    this.scope.$on("$ionicView.enter", _.bind(this.view_enter, this));
                    this.scope.$on("$ionicView.leave", _.bind(this.view_leave, this));
                    this.scope.$on("$ionicView.beforeEnter", _.bind(this.view_beforeEnter, this));
                    this.scope.$on("$ionicView.beforeLeave", _.bind(this.view_beforeLeave, this));
                    this.scope.$on("$ionicView.afterEnter", _.bind(this.view_afterEnter, this));
                    this.scope.$on("$ionicView.afterLeave", _.bind(this.view_afterLeave, this));
                    this.scope.$on("$ionicView.unloaded", _.bind(this.view_unloaded, this));
                    this.scope.$on("$destroy", _.bind(this.destroy, this));
                    _.defer(function () {
                        _this.initialize();
                        _this.scope.$apply();
                    });
                }
                BaseController.prototype.initialize = function () {
                };
                BaseController.prototype.view_loaded = function () {
                };
                BaseController.prototype.view_enter = function () {
                };
                BaseController.prototype.view_leave = function () {
                };
                BaseController.prototype.view_beforeEnter = function () {
                };
                BaseController.prototype.view_beforeLeave = function () {
                };
                BaseController.prototype.view_afterEnter = function () {
                };
                BaseController.prototype.view_afterLeave = function () {
                };
                BaseController.prototype.view_unloaded = function () {
                };
                BaseController.prototype.destroy = function () {
                };
                return BaseController;
            })();
            Controllers.BaseController = BaseController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var BaseDialogController = (function (_super) {
                __extends(BaseDialogController, _super);
                function BaseDialogController(scope, ViewModelType, dialogId) {
                    _super.call(this, scope, ViewModelType);
                    this.dialogId = dialogId;
                    this.scope.$on("modal.shown", _.bind(this.modal_shown, this));
                    this.scope.$on("modal.hidden", _.bind(this.modal_hidden, this));
                }
                BaseDialogController.prototype.modal_shown = function (ngEvent, instance) {
                    if (this.dialogId !== instance.dialogId) {
                        return;
                    }
                    this.modalInstance = instance;
                    this.data = instance.dialogData;
                    this.dialog_shown();
                };
                BaseDialogController.prototype.modal_hidden = function (eventArgs, instance) {
                    if (this.dialogId !== instance.dialogId) {
                        return;
                    }
                    this.dialog_hidden();
                };
                BaseDialogController.prototype.getData = function () {
                    return this.data;
                };
                BaseDialogController.prototype.close = function (result) {
                    this.modalInstance.result = result;
                    this.modalInstance.hide();
                    this.modalInstance.remove();
                };
                BaseDialogController.prototype.dialog_shown = function () {
                };
                BaseDialogController.prototype.dialog_hidden = function () {
                };
                return BaseDialogController;
            })(Controllers.BaseController);
            Controllers.BaseDialogController = BaseDialogController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Directives;
        (function (Directives) {
            var BaseElementDirective = (function () {
                function BaseElementDirective(scope, element, attributes, controller, transclude) {
                    this.scope = scope;
                    this.element = element;
                    this.attributes = attributes;
                    this.controller = controller;
                    this.transclude = transclude;
                    this.initialize();
                }
                BaseElementDirective.prototype.initialize = function () {
                    throw new Error("Directives that extend BaseElementDirective should implement their own initialize method.");
                };
                BaseElementDirective.prototype.render = function () {
                    throw new Error("Directives that extend BaseElementDirective should implement their own render method.");
                };
                BaseElementDirective.__BaseElementDirective = true;
                return BaseElementDirective;
            })();
            Directives.BaseElementDirective = BaseElementDirective;
        })(Directives = SampleApp.Directives || (SampleApp.Directives = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
/**
 * This file exists to control the order in which compiled TypeScript files are concatenated
 * into the resulting appBundle.js file. While all *.ts files could be listed here, we don't
 * need to list them all since the tsc compiler will automatically traverse the directory tree.
 * Here we can list base components that are needed by other components (eg base classes) that
 * must be parsed before the dependent class.
 */
/// <reference path="Controllers/BaseController.ts" />
/// <reference path="Controllers/Dialogs/BaseDialogController.ts" />
/// <reference path="Directives/BaseElementDirective.ts" />
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var CategoryController = (function (_super) {
                __extends(CategoryController, _super);
                function CategoryController($scope, $stateParams) {
                    _super.call(this, $scope, SampleApp.ViewModels.CategoryViewModel);
                    this.$stateParams = $stateParams;
                }
                Object.defineProperty(CategoryController, "$inject", {
                    get: function () {
                        return ["$scope", "$stateParams"];
                    },
                    enumerable: true,
                    configurable: true
                });
                CategoryController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.viewModel.categoryNumber = this.$stateParams.categoryNumber;
                };
                CategoryController.ID = "CategoryController";
                return CategoryController;
            })(Controllers.BaseController);
            Controllers.CategoryController = CategoryController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var MenuController = (function (_super) {
                __extends(MenuController, _super);
                function MenuController($scope, $location, $http, Utilities, UiHelper, Preferences) {
                    _super.call(this, $scope, SampleApp.ViewModels.MenuViewModel);
                    this.$location = $location;
                    this.$http = $http;
                    this.Utilities = Utilities;
                    this.UiHelper = UiHelper;
                    this.Preferences = Preferences;
                    this.viewModel.categories = this.Utilities.categories;
                    $scope.$on("http.unauthorized", _.bind(this.http_unauthorized, this));
                    $scope.$on("http.forbidden", _.bind(this.http_forbidden, this));
                    $scope.$on("http.notFound", _.bind(this.http_notFound, this));
                    $scope.$on("http.unknownError", _.bind(this.http_unknownError, this));
                }
                Object.defineProperty(MenuController, "$inject", {
                    get: function () {
                        return ["$scope", "$location", "$http", SampleApp.Services.Utilities.ID, SampleApp.Services.UiHelper.ID, SampleApp.Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                MenuController.prototype.http_unauthorized = function () {
                    this.Preferences.userId = null;
                    this.Preferences.token = null;
                    this.UiHelper.toast.showLongBottom("You do not have a token (401); please login.");
                };
                MenuController.prototype.http_forbidden = function () {
                    this.Preferences.userId = null;
                    this.Preferences.token = null;
                    this.UiHelper.toast.showLongBottom("Your token has expired (403); please login again.");
                };
                MenuController.prototype.http_notFound = function () {
                    this.UiHelper.toast.showLongBottom("Server not available (404); please contact your administrator.");
                };
                MenuController.prototype.http_unknownError = function () {
                    this.UiHelper.toast.showLongBottom("Network error; please try again later.");
                };
                MenuController.prototype.reorder_click = function () {
                    var _this = this;
                    this.UiHelper.showDialog(Controllers.ReorderCategoriesController.ID).then(function () {
                        _this.viewModel.categories = _this.Utilities.categories;
                    });
                };
                MenuController.ID = "MenuController";
                return MenuController;
            })(Controllers.BaseController);
            Controllers.MenuController = MenuController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var PinEntryController = (function (_super) {
                __extends(PinEntryController, _super);
                function PinEntryController($scope, Utilities, Preferences, UiHelper) {
                    _super.call(this, $scope, SampleApp.ViewModels.PinEntryViewModel, PinEntryController.ID);
                    this.Utilities = Utilities;
                    this.Preferences = Preferences;
                    this.UiHelper = UiHelper;
                }
                Object.defineProperty(PinEntryController, "$inject", {
                    get: function () {
                        return ["$scope", SampleApp.Services.Utilities.ID, SampleApp.Services.Preferences.ID, SampleApp.Services.UiHelper.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                PinEntryController.prototype.dialog_shown = function () {
                    _super.prototype.dialog_shown.call(this);
                    this.viewModel.pin = "";
                    this.viewModel.showBackButton = !!this.getData().showBackButton;
                    this.viewModel.promptText = this.getData().promptText;
                    this.viewModel.pinToMatch = this.getData().pinToMatch;
                };
                PinEntryController.prototype.validatePin = function () {
                    if (this.viewModel.pinToMatch) {
                        if (this.viewModel.pin === this.viewModel.pinToMatch) {
                            this.close(new SampleApp.Models.PinEntryDialogResultModel(true, false, this.viewModel.pin));
                        }
                        else {
                            this.viewModel.pin = "";
                            this.UiHelper.toast.showShortTop("Invalid pin; please try again.");
                            this.scope.$apply();
                        }
                    }
                    else {
                        this.close(new SampleApp.Models.PinEntryDialogResultModel(null, false, this.viewModel.pin));
                    }
                };
                PinEntryController.prototype.number_click = function (value) {
                    if (this.viewModel.pin.length < 4) {
                        this.viewModel.pin += value;
                        if (this.viewModel.pin.length === 4) {
                            _.delay(_.bind(this.validatePin, this), 700);
                        }
                    }
                };
                PinEntryController.prototype.clear_click = function () {
                    this.viewModel.pin = "";
                };
                PinEntryController.prototype.back_click = function () {
                    this.close(new SampleApp.Models.PinEntryDialogResultModel(null, true, null));
                };
                PinEntryController.ID = "PinEntryController";
                PinEntryController.TemplatePath = "templates/Dialogs/Pin-Entry.html";
                return PinEntryController;
            })(Controllers.BaseDialogController);
            Controllers.PinEntryController = PinEntryController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var ReorderCategoriesController = (function (_super) {
                __extends(ReorderCategoriesController, _super);
                function ReorderCategoriesController($scope, Utilities, Preferences, UiHelper) {
                    _super.call(this, $scope, SampleApp.ViewModels.ReorderCategoriesViewModel, ReorderCategoriesController.ID);
                    this.Utilities = Utilities;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(ReorderCategoriesController, "$inject", {
                    get: function () {
                        return ["$scope", SampleApp.Services.Utilities.ID, SampleApp.Services.Preferences.ID, SampleApp.Services.UiHelper.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                ReorderCategoriesController.prototype.dialog_shown = function () {
                    _super.prototype.dialog_shown.call(this);
                    this.viewModel.categories = this.Utilities.categories;
                };
                ReorderCategoriesController.prototype.item_reorder = function (item, fromIndex, toIndex) {
                    this.viewModel.categories.splice(fromIndex, 1);
                    this.viewModel.categories.splice(toIndex, 0, item);
                };
                ReorderCategoriesController.prototype.done_click = function () {
                    var categoryOrder = [];
                    this.viewModel.categories.forEach(function (categoryItem) {
                        categoryOrder.push(categoryItem.name);
                    });
                    this.Preferences.categoryOrder = categoryOrder;
                    this.close();
                };
                ReorderCategoriesController.ID = "ReorderCategoriesController";
                ReorderCategoriesController.TemplatePath = "templates/Dialogs/Reorder-Categories.html";
                return ReorderCategoriesController;
            })(Controllers.BaseDialogController);
            Controllers.ReorderCategoriesController = ReorderCategoriesController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var OnboardingRegisterController = (function (_super) {
                __extends(OnboardingRegisterController, _super);
                function OnboardingRegisterController($scope, $location, $ionicHistory, Utilities, UiHelper, Preferences) {
                    _super.call(this, $scope, SampleApp.ViewModels.OnboardingRegisterViewModel);
                    this.$location = $location;
                    this.$ionicHistory = $ionicHistory;
                    this.Utilities = Utilities;
                    this.UiHelper = UiHelper;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(OnboardingRegisterController, "$inject", {
                    get: function () {
                        return ["$scope", "$location", "$ionicHistory", SampleApp.Services.Utilities.ID, SampleApp.Services.UiHelper.ID, SampleApp.Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                OnboardingRegisterController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.viewModel.showSignIn = false;
                };
                OnboardingRegisterController.prototype.createAccount_click = function () {
                    var _this = this;
                    if (!this.viewModel.email) {
                        this.UiHelper.alert("Please enter an e-mail address.");
                        return;
                    }
                    if (!this.viewModel.password || !this.viewModel.confirmPassword) {
                        this.UiHelper.alert("Please fill in both password fields.");
                        return;
                    }
                    if (this.viewModel.password !== this.viewModel.confirmPassword) {
                        this.UiHelper.alert("The passwords do not match; please try again.");
                        this.viewModel.password = "";
                        this.viewModel.confirmPassword = "";
                        return;
                    }
                    this.UiHelper.progressIndicator.showSimpleWithLabel(true, "Creating Account...");
                    setTimeout(function () {
                        _this.UiHelper.progressIndicator.hide();
                        _this.$ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        _this.$location.path("/app/onboarding/share");
                        _this.$location.replace();
                    }, 3000);
                };
                OnboardingRegisterController.prototype.signIn_click = function () {
                    var _this = this;
                    if (!this.viewModel.email) {
                        this.UiHelper.alert("Please enter an e-mail address.");
                        return;
                    }
                    if (!this.viewModel.password) {
                        this.UiHelper.alert("Please enter a password.");
                        return;
                    }
                    this.UiHelper.progressIndicator.showSimpleWithLabel(true, "Signing in...");
                    setTimeout(function () {
                        _this.UiHelper.progressIndicator.hide();
                        _this.$ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        _this.$location.path("/app/onboarding/share");
                        _this.$location.replace();
                    }, 3000);
                };
                OnboardingRegisterController.prototype.needToCreateAccount_click = function () {
                    this.viewModel.password = "";
                    this.viewModel.confirmPassword = "";
                    this.viewModel.showSignIn = false;
                };
                OnboardingRegisterController.prototype.alreadyHaveAccount_click = function () {
                    this.viewModel.confirmPassword = "";
                    this.viewModel.showSignIn = true;
                };
                OnboardingRegisterController.prototype.skip_click = function () {
                    this.Preferences.hasCompletedOnboarding = true;
                    this.$ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    this.$location.path(this.Utilities.defaultCategory.href.substring(1));
                    this.$location.replace();
                };
                OnboardingRegisterController.ID = "OnboardingRegisterController";
                return OnboardingRegisterController;
            })(Controllers.BaseController);
            Controllers.OnboardingRegisterController = OnboardingRegisterController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var OnboardingShareController = (function (_super) {
                __extends(OnboardingShareController, _super);
                function OnboardingShareController($scope, $location, $ionicHistory, Utilities, UiHelper, Preferences) {
                    _super.call(this, $scope, SampleApp.ViewModels.EmptyViewModel);
                    this.$location = $location;
                    this.$ionicHistory = $ionicHistory;
                    this.Utilities = Utilities;
                    this.UiHelper = UiHelper;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(OnboardingShareController, "$inject", {
                    get: function () {
                        return ["$scope", "$location", "$ionicHistory", SampleApp.Services.Utilities.ID, SampleApp.Services.UiHelper.ID, SampleApp.Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                OnboardingShareController.prototype.share_click = function (platformName) {
                    this.UiHelper.toast.showShortCenter("Share for " + platformName);
                };
                OnboardingShareController.prototype.done_click = function () {
                    this.Preferences.hasCompletedOnboarding = true;
                    this.$ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    this.$location.path(this.Utilities.defaultCategory.href.substring(1));
                    this.$location.replace();
                };
                OnboardingShareController.ID = "OnboardingShareController";
                return OnboardingShareController;
            })(Controllers.BaseController);
            Controllers.OnboardingShareController = OnboardingShareController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var OnboardingSplashController = (function (_super) {
                __extends(OnboardingSplashController, _super);
                function OnboardingSplashController($scope, $location, $ionicHistory, Utilities, Preferences) {
                    _super.call(this, $scope, SampleApp.ViewModels.EmptyViewModel);
                    this.$location = $location;
                    this.$ionicHistory = $ionicHistory;
                    this.Utilities = Utilities;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(OnboardingSplashController, "$inject", {
                    get: function () {
                        return ["$scope", "$location", "$ionicHistory", SampleApp.Services.Utilities.ID, SampleApp.Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                OnboardingSplashController.prototype.skip_click = function () {
                    this.Preferences.hasCompletedOnboarding = true;
                    this.$ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    this.$location.path(this.Utilities.defaultCategory.href.substring(1));
                    this.$location.replace();
                };
                OnboardingSplashController.ID = "OnboardingSplashController";
                return OnboardingSplashController;
            })(Controllers.BaseController);
            Controllers.OnboardingSplashController = OnboardingSplashController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var AboutController = (function (_super) {
                __extends(AboutController, _super);
                function AboutController($scope, $ionicHistory, Utilities, Preferences, UiHelper, versionInfo) {
                    _super.call(this, $scope, SampleApp.ViewModels.AboutViewModel);
                    this.$ionicHistory = $ionicHistory;
                    this.Utilities = Utilities;
                    this.Preferences = Preferences;
                    this.UiHelper = UiHelper;
                    this.versionInfo = versionInfo;
                }
                Object.defineProperty(AboutController, "$inject", {
                    get: function () {
                        return ["$scope", "$ionicHistory", SampleApp.Services.Utilities.ID, SampleApp.Services.Preferences.ID, SampleApp.Services.UiHelper.ID, "versionInfo"];
                    },
                    enumerable: true,
                    configurable: true
                });
                AboutController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.viewModel.logoClickCount = 0;
                    this.viewModel.applicationName = this.versionInfo.applicationName;
                    this.viewModel.versionString = this.Utilities.format("{0}.{1}.{2}", this.versionInfo.majorVersion, this.versionInfo.minorVersion, this.versionInfo.buildVersion);
                    this.viewModel.timestamp = this.versionInfo.buildTimestamp;
                };
                AboutController.prototype.logo_click = function () {
                    if (this.Preferences.enableDeveloperTools) {
                        return;
                    }
                    this.viewModel.logoClickCount += 1;
                    if (this.viewModel.logoClickCount > 9) {
                        this.Preferences.enableDeveloperTools = true;
                        this.UiHelper.toast.showShortBottom("Development Tools Enabled!");
                        this.$ionicHistory.goBack();
                    }
                };
                AboutController.prototype.copyrightInfo_click = function () {
                    window.open(this.versionInfo.copyrightInfoUrl, "_system");
                };
                AboutController.prototype.website_click = function () {
                    window.open(this.versionInfo.websiteUrl, "_system");
                };
                AboutController.prototype.gitHubRepo_click = function () {
                    window.open(this.versionInfo.githubUrl, "_system");
                };
                AboutController.ID = "AboutController";
                return AboutController;
            })(Controllers.BaseController);
            Controllers.AboutController = AboutController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var CloudSyncController = (function (_super) {
                __extends(CloudSyncController, _super);
                function CloudSyncController($scope, $ionicHistory) {
                    _super.call(this, $scope, SampleApp.ViewModels.CloudSyncViewModel);
                    this.$ionicHistory = $ionicHistory;
                    this.scope.$on("icon-panel.cloud-icon-panel.created", _.bind(this.iconPanel_created, this));
                }
                Object.defineProperty(CloudSyncController, "$inject", {
                    get: function () {
                        return ["$scope", "$ionicHistory"];
                    },
                    enumerable: true,
                    configurable: true
                });
                CloudSyncController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.viewModel.showButton = true;
                    this.viewModel.showUserCount = true;
                    this.viewModel.icon = "ion-ios-cloud-upload-outline";
                    this.viewModel.userCount = 2344;
                };
                CloudSyncController.prototype.view_leave = function () {
                    _super.prototype.view_leave.call(this);
                    clearInterval(this.updateInterval);
                };
                CloudSyncController.prototype.iconPanel_created = function (event, instance) {
                    this.cloudIconPanel = instance;
                    this.updateInterval = setInterval(_.bind(this.toggleIcon, this), 1000);
                };
                CloudSyncController.prototype.toggleIcon = function () {
                    if (this.cloudIconPanel.getIcon() === "ion-ios-cloud-upload-outline") {
                        this.cloudIconPanel.setIcon("ion-ios-cloud-download-outline");
                    }
                    else {
                        this.cloudIconPanel.setIcon("ion-ios-cloud-upload-outline");
                    }
                    this.scope.$apply();
                };
                CloudSyncController.prototype.setup_click = function () {
                    clearInterval(this.updateInterval);
                    this.cloudIconPanel.setText("Unable to contact the cloud!");
                    this.viewModel.icon = "ion-ios-rainy";
                    this.viewModel.showButton = false;
                    this.viewModel.showUserCount = false;
                };
                CloudSyncController.ID = "CloudSyncController";
                return CloudSyncController;
            })(Controllers.BaseController);
            Controllers.CloudSyncController = CloudSyncController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var ConfigurePinController = (function (_super) {
                __extends(ConfigurePinController, _super);
                function ConfigurePinController($scope, UiHelper, Preferences) {
                    _super.call(this, $scope, SampleApp.ViewModels.ConfigurePinViewModel);
                    this.UiHelper = UiHelper;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(ConfigurePinController, "$inject", {
                    get: function () {
                        return ["$scope", SampleApp.Services.UiHelper.ID, SampleApp.Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                ConfigurePinController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.viewModel.isPinSet = this.Preferences.pin !== null;
                };
                ConfigurePinController.prototype.setPin_click = function () {
                    var _this = this;
                    var options, model;
                    model = new SampleApp.Models.PinEntryDialogModel("Enter a value for your new PIN", null, true);
                    options = new SampleApp.Models.DialogOptions(model);
                    this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result1) {
                        if (result1.pin) {
                            model.promptText = "Confirm your new PIN";
                            model.pinToMatch = result1.pin;
                            options.dialogData = model;
                            _this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result2) {
                                if (result2.matches) {
                                    _this.Preferences.pin = result2.pin;
                                    _this.viewModel.isPinSet = true;
                                    _this.UiHelper.toast.showShortBottom("Your PIN has been configured.");
                                }
                            });
                        }
                    });
                };
                ConfigurePinController.prototype.changePin_click = function () {
                    var _this = this;
                    var options, model;
                    model = new SampleApp.Models.PinEntryDialogModel("Enter your current PIN", this.Preferences.pin, true);
                    options = new SampleApp.Models.DialogOptions(model);
                    this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result1) {
                        if (result1.matches) {
                            model.promptText = "Enter your new PIN";
                            model.pinToMatch = null;
                            options.dialogData = model;
                            _this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result2) {
                                // Show a second prompt to make sure they enter the same PIN twice.
                                // We pass in the first PIN value because we want them to be able to match it.
                                model.promptText = "Confirm your new PIN";
                                model.pinToMatch = result2.pin;
                                options.dialogData = model;
                                _this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result3) {
                                    if (result3.matches) {
                                        _this.Preferences.pin = result3.pin;
                                        _this.viewModel.isPinSet = true;
                                        _this.UiHelper.toast.showShortBottom("Your PIN has been configured.");
                                    }
                                });
                            });
                        }
                    });
                };
                ConfigurePinController.prototype.removePin_click = function () {
                    var _this = this;
                    var options, model;
                    model = new SampleApp.Models.PinEntryDialogModel("Enter your current PIN", this.Preferences.pin, true);
                    options = new SampleApp.Models.DialogOptions(model);
                    this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result) {
                        if (result.matches) {
                            _this.Preferences.pin = null;
                            _this.viewModel.isPinSet = false;
                            _this.UiHelper.toast.showShortBottom("The PIN has been removed.");
                        }
                    });
                };
                ConfigurePinController.ID = "ConfigurePinController";
                return ConfigurePinController;
            })(Controllers.BaseController);
            Controllers.ConfigurePinController = ConfigurePinController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var DeveloperController = (function (_super) {
                __extends(DeveloperController, _super);
                function DeveloperController($scope, $http, Utilities, UiHelper, FileUtilities, Logger, Preferences) {
                    _super.call(this, $scope, SampleApp.ViewModels.DeveloperViewModel);
                    this.$http = $http;
                    this.Utilities = Utilities;
                    this.UiHelper = UiHelper;
                    this.FileUtilities = FileUtilities;
                    this.Logger = Logger;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(DeveloperController, "$inject", {
                    get: function () {
                        return ["$scope", "$http", SampleApp.Services.Utilities.ID, SampleApp.Services.UiHelper.ID, SampleApp.Services.FileUtilities.ID, SampleApp.Services.Logger.ID, SampleApp.Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                DeveloperController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.viewModel.mockApiRequests = this.Preferences.enableMockHttpCalls;
                    this.viewModel.devicePlatform = this.Utilities.platform();
                    this.viewModel.loggingToLocalStorage = this.Logger.getLogToLocalStorage() + "";
                    this.viewModel.defaultStoragePathId = this.FileUtilities.getDefaultRootPathId();
                    this.viewModel.defaultStoragePath = this.FileUtilities.getDefaultRootPath();
                };
                DeveloperController.prototype.alertFileIoError = function (error) {
                    if (error) {
                        if (error.code) {
                            this.UiHelper.alert(error.code);
                        }
                        else if (error.message) {
                            this.UiHelper.alert(error.message);
                        }
                        else {
                            this.UiHelper.alert(error);
                        }
                    }
                };
                DeveloperController.prototype.mockApiRequests_change = function () {
                    var message;
                    this.Preferences.enableMockHttpCalls = this.viewModel.mockApiRequests;
                    message = "The application needs to be reloaded for changes to take effect.\n\nReload now?";
                    this.UiHelper.confirm(message, "Confirm Reload").then(function (result) {
                        if (result === "Yes") {
                            document.location.href = "index.html";
                        }
                    });
                };
                DeveloperController.prototype.setLoggingMode_click = function () {
                    var _this = this;
                    var message;
                    message = "Enable exception logging to local storage? Current setting is " + this.Logger.getLogToLocalStorage();
                    this.UiHelper.confirm(message).then(function (result) {
                        var enable = result === "Yes";
                        _this.viewModel.loggingToLocalStorage = enable + "";
                        _this.Logger.setLogToLocalStorage(enable);
                        if (enable) {
                            _this.UiHelper.alert("Logs will be written to local storage.");
                        }
                        else {
                            _this.UiHelper.alert("Logs will not be written to local storage; they will be stored in-memory only.");
                        }
                    });
                };
                DeveloperController.prototype.setHttpLoggingMode_click = function () {
                    var _this = this;
                    var message;
                    message = "Enable logging of all HTTP requests (even non-errors)? Current setting is " + this.Preferences.enableFullHttpLogging;
                    this.UiHelper.confirm(message).then(function (result) {
                        var enable = result === "Yes";
                        _this.Preferences.enableFullHttpLogging = enable;
                        if (enable) {
                            _this.UiHelper.alert("ALL HTTP requests and responses will be logged.");
                        }
                        else {
                            _this.UiHelper.alert("Only HTTP errors will be logged.");
                        }
                    });
                };
                DeveloperController.prototype.addModulesToGlobalScope_click = function () {
                    window["__FileUtilities"] = this.FileUtilities;
                    window["__Logger"] = this.Logger;
                    window["__Utilities"] = this.Utilities;
                    window["__UiHelper"] = this.UiHelper;
                    window["__Preferences"] = this.Preferences;
                    this.UiHelper.alert("Added the following services to the global window scope: __FileUtilities, __Logger, __Utilities, __UiHelper, __Preferences");
                };
                DeveloperController.prototype.setRequirePinThreshold_click = function () {
                    var _this = this;
                    var message;
                    message = this.Utilities.format("Enter the value (in minutes) for PIN prompt threshold? Current setting is {0} minutes.", this.Preferences.requirePinThreshold);
                    this.UiHelper.prompt(message, "Require PIN Threshold", null, this.Preferences.requirePinThreshold.toString()).then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        if (isNaN(parseInt(result.value, 10))) {
                            _this.UiHelper.alert("Invalid value; a number is required.");
                            return;
                        }
                        _this.Preferences.requirePinThreshold = parseInt(result.value, 10);
                        _this.UiHelper.alert(_this.Utilities.format("PIN prompt threshold is now set to {0} minutes.", result.value));
                    });
                };
                DeveloperController.prototype.resetPinTimeout_click = function () {
                    var message;
                    this.Preferences.lastPausedAt = moment("01-01-2000", "MM-DD-yyyy");
                    message = "The PIN timeout has been set to more than 10 minutes ago. To see the PIN screen, terminate the application via the OS task manager (don't just background it), and then re-launch.";
                    this.UiHelper.alert(message, "Reset PIN Timeout");
                };
                DeveloperController.prototype.reEnableOnboarding_click = function () {
                    this.Preferences.hasCompletedOnboarding = false;
                    this.UiHelper.alert("Onboarding has been enabled and will occur upon next app boot.");
                };
                DeveloperController.prototype.testJsException_click = function () {
                    /* tslint:disable:no-string-literal */
                    _.defer(function () {
                        var x = window["____asdf"].blah();
                    });
                };
                DeveloperController.prototype.testAngularException_click = function () {
                    /* tslint:disable:no-string-literal */
                    var x = window["____asdf"].blah();
                };
                DeveloperController.prototype.apiGetToken_click = function () {
                    var _this = this;
                    var httpConfig;
                    httpConfig = {
                        method: "GET",
                        url: "~/tokens/" + this.Preferences.token,
                        data: null,
                        blocking: true,
                        blockingText: "Retrieving Token Info..."
                    };
                    this.$http(httpConfig).then(function (response) {
                        var message = _this.Utilities.format("Token: {0}\nExpires: {1}", response.data.token, response.data.expires);
                        _this.UiHelper.alert(message);
                    });
                };
                DeveloperController.prototype.showFullScreenBlock_click = function () {
                    var _this = this;
                    this.UiHelper.progressIndicator.showSimpleWithLabel(true, "Authenticating...");
                    setTimeout(function () {
                        _this.UiHelper.progressIndicator.hide();
                    }, 4000);
                };
                DeveloperController.prototype.showToast_top = function () {
                    this.UiHelper.toast.showShortTop("This is a test toast notification.");
                };
                DeveloperController.prototype.showToast_center = function () {
                    this.UiHelper.toast.showShortCenter("This is a test toast notification.");
                };
                DeveloperController.prototype.showToast_bottom = function () {
                    this.UiHelper.toast.showShortBottom("This is a test toast notification.");
                };
                DeveloperController.prototype.clipboard_copy = function () {
                    var _this = this;
                    this.UiHelper.prompt("Enter a value to copy to the clipboard.").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        _this.UiHelper.clipboard.copy(result.value, function () {
                            _this.UiHelper.alert("Copy OK!");
                        }, function (err) {
                            _this.UiHelper.alert("Copy Failed!\n\n" + (err ? err.message : "Unknown Error"));
                        });
                    });
                };
                DeveloperController.prototype.clipboard_paste = function () {
                    var _this = this;
                    this.UiHelper.clipboard.paste(function (result) {
                        _this.UiHelper.alert("Paste OK! Value retrieved is:\n\n" + result);
                    }, function (err) {
                        _this.UiHelper.alert("Paste Failed!\n\n" + (err ? err.message : "Unknown Error"));
                    });
                };
                DeveloperController.prototype.startProgress_click = function () {
                    NProgress.start();
                };
                DeveloperController.prototype.incrementProgress_click = function () {
                    NProgress.inc();
                };
                DeveloperController.prototype.doneProgress_click = function () {
                    NProgress.done();
                };
                DeveloperController.prototype.showPinEntry_click = function () {
                    var _this = this;
                    var options, model;
                    model = new SampleApp.Models.PinEntryDialogModel("Testing new PIN entry", null, true);
                    options = new SampleApp.Models.DialogOptions(model);
                    this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result) {
                        _this.UiHelper.alert("Cancelled: " + result.cancelled + " PIN matches: " + result.matches + " PIN entered: " + result.pin);
                    });
                };
                DeveloperController.prototype.showPinEntry1234_click = function () {
                    var _this = this;
                    var options, model;
                    model = new SampleApp.Models.PinEntryDialogModel("Testing PIN matching (1234)", "1234", true);
                    options = new SampleApp.Models.DialogOptions(model);
                    this.UiHelper.showDialog(Controllers.PinEntryController.ID, options).then(function (result) {
                        _this.UiHelper.alert("Cancelled: " + result.cancelled + " PIN matches: " + result.matches + " PIN entered: " + result.pin);
                    });
                };
                DeveloperController.prototype.readFile_click = function () {
                    var _this = this;
                    this.UiHelper.prompt("Enter file name to read from", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        _this.FileUtilities.readTextFile(result.value)
                            .then(function (text) { console.log(text); _this.UiHelper.alert(text); }, function (err) { console.error(err); _this.alertFileIoError(err); });
                    });
                };
                DeveloperController.prototype.writeFile_click = function () {
                    var _this = this;
                    var path, contents;
                    this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        path = result.value;
                        _this.UiHelper.prompt("Enter file contents").then(function (result) {
                            if (result.key !== "OK") {
                                return;
                            }
                            contents = result.value;
                            _this.FileUtilities.writeTextFile(path, contents, false)
                                .then(function () { console.log("WRITE OK"); _this.UiHelper.alert("WRITE OK"); }, function (err) { console.error(err); _this.alertFileIoError(err); });
                        });
                    });
                };
                DeveloperController.prototype.appendFile_click = function () {
                    var _this = this;
                    var path, contents;
                    this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        _this.UiHelper.prompt("Enter file contents", "File I/O Test", null, " / ").then(function (result) {
                            if (result.key !== "OK") {
                                return;
                            }
                            contents = result.value;
                            _this.FileUtilities.writeTextFile(path, contents, true)
                                .then(function () { console.log("APPEND OK"); _this.UiHelper.alert("APPEND OK"); }, function (err) { console.error(err); _this.alertFileIoError(err); });
                        });
                    });
                };
                DeveloperController.prototype.createDir_click = function () {
                    var _this = this;
                    var path;
                    this.UiHelper.prompt("Enter dir name to create", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        path = result.value;
                        _this.FileUtilities.createDirectory(path)
                            .then(function () { console.log("CREATE DIR OK"); _this.UiHelper.alert("CREATE DIR OK"); }, function (err) { console.error(err); _this.alertFileIoError(err); });
                    });
                };
                DeveloperController.prototype.listFiles_click = function () {
                    var _this = this;
                    var path, list = "";
                    this.UiHelper.prompt("Enter path to list files", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        path = result.value;
                        _this.FileUtilities.getFilePaths(path)
                            .then(function (files) {
                            console.log(files);
                            files.forEach(function (value) {
                                list += "\n" + value;
                            });
                            _this.UiHelper.alert(list);
                        }, function (err) {
                            console.error(err);
                            _this.alertFileIoError(err);
                        });
                    });
                };
                DeveloperController.prototype.listDirs_click = function () {
                    var _this = this;
                    var path, list = "";
                    this.UiHelper.prompt("Enter path to list dirs", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        path = result.value;
                        _this.FileUtilities.getDirectoryPaths(path)
                            .then(function (dirs) {
                            console.log(dirs);
                            dirs.forEach(function (value) {
                                list += "\n" + value;
                            });
                            _this.UiHelper.alert(list);
                        }, function (err) {
                            console.error(err);
                            _this.alertFileIoError(err);
                        });
                    });
                };
                DeveloperController.prototype.deleteFile_click = function () {
                    var _this = this;
                    var path;
                    this.UiHelper.prompt("Enter path to delete file", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        path = result.value;
                        _this.FileUtilities.deleteFile(path)
                            .then(function () { console.log("DELETE FILE OK"); _this.UiHelper.alert("DELETE FILE OK"); }, function (err) { console.error(err); _this.alertFileIoError(err); });
                    });
                };
                DeveloperController.prototype.deleteDir_click = function () {
                    var _this = this;
                    var path;
                    this.UiHelper.prompt("Enter path to delete dir", "File I/O Test", null, "/").then(function (result) {
                        if (result.key !== "OK") {
                            return;
                        }
                        path = result.value;
                        _this.FileUtilities.deleteDirectory(path)
                            .then(function () { console.log("DELETE DIR OK"); _this.UiHelper.alert("DELETE FILE OK"); }, function (err) { console.error(err); _this.alertFileIoError(err); });
                    });
                };
                DeveloperController.ID = "DeveloperController";
                return DeveloperController;
            })(Controllers.BaseController);
            Controllers.DeveloperController = DeveloperController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var LogEntryController = (function (_super) {
                __extends(LogEntryController, _super);
                function LogEntryController($scope, $stateParams, Logger, UiHelper, Utilities, versionInfo) {
                    _super.call(this, $scope, SampleApp.ViewModels.LogEntryViewModel);
                    this.$stateParams = $stateParams;
                    this.Logger = Logger;
                    this.UiHelper = UiHelper;
                    this.Utilities = Utilities;
                    this.versionInfo = versionInfo;
                }
                Object.defineProperty(LogEntryController, "$inject", {
                    get: function () {
                        return ["$scope", "$stateParams", SampleApp.Services.Logger.ID, SampleApp.Services.UiHelper.ID, SampleApp.Services.Utilities.ID, "versionInfo"];
                    },
                    enumerable: true,
                    configurable: true
                });
                LogEntryController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.Logger.getLog(this.$stateParams.id).then(_.bind(this.getLogEntry_success, this));
                };
                LogEntryController.prototype.getLogEntry_success = function (logEntry) {
                    var formattedDate;
                    this._fullLogEntry = logEntry;
                    this.viewModel.id = logEntry.id;
                    this.viewModel.message = logEntry.message;
                    this.viewModel.lineNumber = logEntry.lineNumber;
                    this.viewModel.colNumber = logEntry.colNumber;
                    this.viewModel.uri = logEntry.uri;
                    this.viewModel.error = logEntry.error;
                    this.viewModel.httpBody = logEntry.httpBody;
                    this.viewModel.httpHeaders = logEntry.httpHeaders;
                    this.viewModel.httpStatus = logEntry.httpStatus;
                    this.viewModel.httpStatusText = logEntry.httpStatusText;
                    this.viewModel.httpUrl = logEntry.httpUrl;
                    this.viewModel.httpMethod = logEntry.httpMethod;
                    this.viewModel.time = moment(logEntry.timestamp).format("h:mm:ss a");
                    this.viewModel.date = formattedDate = moment(logEntry.timestamp).format("l");
                    if (logEntry.error == null) {
                        this.viewModel.iconType = "alert";
                    }
                    else {
                        this.viewModel.iconType = "alert-circled";
                    }
                    if (logEntry.httpUrl) {
                        this.viewModel.iconType = "android-wifi";
                    }
                };
                LogEntryController.prototype.copy_click = function () {
                    var _this = this;
                    this.UiHelper.clipboard.copy(JSON.stringify(this._fullLogEntry), function () {
                        _this.UiHelper.toast.showShortBottom("Log copied to clipboard!");
                    }, null);
                };
                LogEntryController.prototype.email_click = function () {
                    var _this = this;
                    this.Logger.getLog(this.$stateParams.id).then(function (logEntry) {
                        var uri = _this.Utilities.format("mailto:{0}?subject={1} Error Log&body={2}", _this.versionInfo.email, _this.versionInfo.applicationName, JSON.stringify(logEntry));
                        uri = encodeURI(uri);
                        window.open(uri, "_system");
                    });
                };
                LogEntryController.ID = "LogEntryController";
                return LogEntryController;
            })(Controllers.BaseController);
            Controllers.LogEntryController = LogEntryController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var LogsController = (function (_super) {
                __extends(LogsController, _super);
                function LogsController($scope, Logger, Utilities, UiHelper) {
                    _super.call(this, $scope, SampleApp.ViewModels.LogsViewModel);
                    this.Logger = Logger;
                    this.Utilities = Utilities;
                    this.UiHelper = UiHelper;
                }
                Object.defineProperty(LogsController, "$inject", {
                    get: function () {
                        return ["$scope", SampleApp.Services.Logger.ID, SampleApp.Services.Utilities.ID, SampleApp.Services.UiHelper.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                LogsController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.Logger.getLogs().then(_.bind(this.getLogs_success, this), _.bind(this.getLogs_failure, this));
                };
                LogsController.prototype.getLogs_success = function (logEntries) {
                    var _this = this;
                    if (logEntries == null) {
                        logEntries = [];
                    }
                    this.viewModel.logs = {};
                    logEntries = _.sortBy(logEntries, "timestamp").reverse();
                    logEntries.forEach(function (logEntry) {
                        var formattedDate, viewModel;
                        viewModel = new SampleApp.ViewModels.LogEntryViewModel();
                        viewModel.id = logEntry.id;
                        viewModel.message = logEntry.message;
                        viewModel.lineNumber = logEntry.lineNumber;
                        viewModel.colNumber = logEntry.colNumber;
                        viewModel.uri = logEntry.uri;
                        viewModel.error = logEntry.error;
                        viewModel.time = moment(logEntry.timestamp).format("h:mm:ss a");
                        formattedDate = moment(logEntry.timestamp).format("l");
                        viewModel.date = formattedDate;
                        if (logEntry.error == null) {
                            viewModel.iconType = "alert";
                        }
                        else {
                            viewModel.iconType = "alert-circled";
                        }
                        if (logEntry.httpUrl) {
                            viewModel.iconType = "android-wifi";
                        }
                        if (!_this.viewModel.logs[formattedDate]) {
                            _this.viewModel.logs[formattedDate] = [];
                        }
                        _this.viewModel.logs[formattedDate].push(viewModel);
                    });
                };
                LogsController.prototype.getLogs_failure = function (error) {
                    this.UiHelper.toast.showShortBottom("An error occurred while retrieving the logs.");
                };
                LogsController.prototype.clearLogs = function () {
                    var _this = this;
                    this.UiHelper.confirm("Are you sure you want to delete the logs?", "Delete Logs").then(function (result) {
                        if (result === "Yes") {
                            _this.Logger.clearLogs();
                            _this.viewModel.logs = {};
                        }
                    });
                };
                LogsController.ID = "LogsController";
                return LogsController;
            })(Controllers.BaseController);
            Controllers.LogsController = LogsController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Controllers;
        (function (Controllers) {
            var SettingsListController = (function (_super) {
                __extends(SettingsListController, _super);
                function SettingsListController($scope, Utilities, Preferences) {
                    _super.call(this, $scope, SampleApp.ViewModels.SettingsListViewModel);
                    this.Utilities = Utilities;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(SettingsListController, "$inject", {
                    get: function () {
                        return ["$scope", SampleApp.Services.Utilities.ID, SampleApp.Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                SettingsListController.prototype.view_beforeEnter = function () {
                    _super.prototype.view_beforeEnter.call(this);
                    this.viewModel.isDebugMode = this.Utilities.isDebugMode;
                    this.viewModel.isDeveloperMode = this.Preferences.enableDeveloperTools;
                };
                SettingsListController.ID = "SettingsListController";
                return SettingsListController;
            })(Controllers.BaseController);
            Controllers.SettingsListController = SettingsListController;
        })(Controllers = SampleApp.Controllers || (SampleApp.Controllers = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Directives;
        (function (Directives) {
            var IconPanelDirective = (function (_super) {
                __extends(IconPanelDirective, _super);
                function IconPanelDirective() {
                    _super.apply(this, arguments);
                }
                IconPanelDirective.prototype.initialize = function () {
                    var _this = this;
                    this._rootElement = this.element[0];
                    this.scope.$watch(function () { return _this.scope.icon; }, _.bind(this.icon_listener, this));
                    this.scope.$watch(function () { return _this.scope.iconSize; }, _.bind(this.iconSize_listener, this));
                    this.scope.$watch(function () { return _this.scope.text; }, _.bind(this.text_listener, this));
                    if (this.scope.name) {
                        this.scope.$emit("icon-panel." + this.scope.name + ".created", this);
                    }
                    else {
                        this.scope.$emit("icon-panel.created", this);
                    }
                };
                IconPanelDirective.prototype.render = function () {
                    this._root = angular.element(this._rootElement);
                    this._root.addClass("icon-panel");
                    this._iconContainer = angular.element("<p></p>");
                    this._iconContainer.addClass("icon-container");
                    this._root.append(this._iconContainer);
                    this._iconElement = angular.element("<i></i>");
                    this._iconElement.addClass("icon");
                    this._iconContainer.append(this._iconElement);
                    this._textContainer = angular.element("<p></p>");
                    this._root.append(this._textContainer);
                };
                IconPanelDirective.prototype.getName = function () {
                    return this.scope.name;
                };
                IconPanelDirective.prototype.getIcon = function () {
                    return this._currentIcon;
                };
                IconPanelDirective.prototype.setIcon = function (icon) {
                    if (this._currentIcon) {
                        this._iconElement.removeClass(this._currentIcon);
                    }
                    this._currentIcon = icon;
                    this._iconElement.addClass(icon);
                };
                IconPanelDirective.prototype.getIconSize = function () {
                    return parseInt(this.scope.iconSize, 10);
                };
                IconPanelDirective.prototype.setIconSize = function (size) {
                    this.scope.iconSize = (size ? size + "" : "0");
                    this._iconElement.css("font-size", this.scope.iconSize + "pt");
                };
                IconPanelDirective.prototype.getText = function () {
                    return this.scope.text;
                };
                IconPanelDirective.prototype.setText = function (text) {
                    this._textContainer.text(text);
                };
                IconPanelDirective.prototype.icon_listener = function (newValue, oldValue, scope) {
                    this._currentIcon = newValue;
                    if (this._iconElement != null) {
                        this._iconElement.removeClass(oldValue);
                        this._iconElement.addClass(newValue);
                    }
                };
                IconPanelDirective.prototype.iconSize_listener = function (newValue, oldValue, scope) {
                    if (this._iconElement != null) {
                        this._iconElement.css("font-size", newValue + "pt");
                    }
                };
                IconPanelDirective.prototype.text_listener = function (newValue, oldValue, scope) {
                    if (this._textContainer != null) {
                        this._textContainer.text(newValue);
                    }
                };
                IconPanelDirective.ID = "iconPanel";
                IconPanelDirective.restrict = "E";
                IconPanelDirective.template = "<div></div>";
                IconPanelDirective.replace = true;
                IconPanelDirective.scope = {
                    name: "@",
                    icon: "@",
                    iconSize: "@",
                    text: "@"
                };
                return IconPanelDirective;
            })(Directives.BaseElementDirective);
            Directives.IconPanelDirective = IconPanelDirective;
        })(Directives = SampleApp.Directives || (SampleApp.Directives = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Directives;
        (function (Directives) {
            var OnLoadDirective = (function () {
                function OnLoadDirective($parse) {
                    this.restrict = "A";
                    this.$parse = $parse;
                    this.link = _.bind(this.link, this);
                }
                Object.defineProperty(OnLoadDirective, "$inject", {
                    get: function () {
                        return ["$parse"];
                    },
                    enumerable: true,
                    configurable: true
                });
                OnLoadDirective.prototype.link = function (scope, element, attributes, controller, transclude) {
                    var fn = this.$parse(attributes["onLoad"]);
                    element.on("load", function (event) {
                        scope.$apply(function () {
                            fn(scope, { $event: event });
                        });
                    });
                };
                OnLoadDirective.ID = "onLoad";
                return OnLoadDirective;
            })();
            Directives.OnLoadDirective = OnLoadDirective;
        })(Directives = SampleApp.Directives || (SampleApp.Directives = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Filters;
        (function (Filters) {
            var ThousandsFilter = (function () {
                function ThousandsFilter() {
                }
                ThousandsFilter.filter = function (input) {
                    if (input == null) {
                        return "";
                    }
                    if (input > 9999) {
                        if (input % 10 === 0) {
                            return (input / 1000) + "K";
                        }
                        else {
                            return (input / 1000).toFixed(0) + "K";
                        }
                    }
                    else if (input > 999) {
                        if (input % 10 === 0) {
                            return (input / 1000) + "K";
                        }
                        else {
                            return (input / 1000).toFixed(1) + "K";
                        }
                    }
                    else {
                        return input + "";
                    }
                };
                ThousandsFilter.ID = "Thousands";
                return ThousandsFilter;
            })();
            Filters.ThousandsFilter = ThousandsFilter;
        })(Filters = SampleApp.Filters || (SampleApp.Filters = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Models;
        (function (Models) {
            var KeyValuePair = (function () {
                function KeyValuePair(key, value) {
                    this.key = key;
                    this.value = value;
                }
                return KeyValuePair;
            })();
            Models.KeyValuePair = KeyValuePair;
        })(Models = SampleApp.Models || (SampleApp.Models = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Models;
        (function (Models) {
            var DialogOptions = (function () {
                function DialogOptions(dialogData) {
                    this.dialogData = dialogData;
                    this.backdropClickToClose = true;
                    this.hardwareBackButtonClose = true;
                    this.showBackground = true;
                }
                return DialogOptions;
            })();
            Models.DialogOptions = DialogOptions;
        })(Models = SampleApp.Models || (SampleApp.Models = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Models;
        (function (Models) {
            var PinEntryDialogModel = (function () {
                function PinEntryDialogModel(promptText, pinToMatch, showBackButton) {
                    this.promptText = promptText;
                    this.pinToMatch = pinToMatch;
                    this.showBackButton = showBackButton;
                }
                return PinEntryDialogModel;
            })();
            Models.PinEntryDialogModel = PinEntryDialogModel;
        })(Models = SampleApp.Models || (SampleApp.Models = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Models;
        (function (Models) {
            var PinEntryDialogResultModel = (function () {
                function PinEntryDialogResultModel(matches, cancelled, pin) {
                    this.matches = matches;
                    this.cancelled = cancelled;
                    this.pin = pin;
                }
                return PinEntryDialogResultModel;
            })();
            Models.PinEntryDialogResultModel = PinEntryDialogResultModel;
        })(Models = SampleApp.Models || (SampleApp.Models = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Models;
        (function (Models) {
            var LogEntry = (function () {
                function LogEntry() {
                }
                return LogEntry;
            })();
            Models.LogEntry = LogEntry;
        })(Models = SampleApp.Models || (SampleApp.Models = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var FileUtilities = (function () {
                function FileUtilities($q, Utilities) {
                    this.$q = $q;
                    this.Utilities = Utilities;
                }
                Object.defineProperty(FileUtilities, "$inject", {
                    get: function () {
                        return ["$q", Services.Utilities.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                FileUtilities.prototype.preparePath = function (path) {
                    if (!path) {
                        return null;
                    }
                    if (this.Utilities.isAndroid && this.Utilities.startsWith(path, "/")) {
                        path = path.substr(1);
                    }
                    return path;
                };
                FileUtilities.prototype.getDefaultRootPath = function () {
                    if (typeof (cordova) === "undefined" || typeof (cordova.file) === "undefined") {
                        return "";
                    }
                    else {
                        return cordova.file.externalDataDirectory ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
                    }
                };
                FileUtilities.prototype.getDefaultRootPathId = function () {
                    if (typeof (cordova) === "undefined" || typeof (cordova.file) === "undefined") {
                        return "";
                    }
                    else {
                        return cordova.file.externalDataDirectory ? "cordova.file.externalDataDirectory" : "cordova.file.dataDirectory";
                    }
                };
                FileUtilities.prototype.readTextFile = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getFile(path, flags, function (fileEntry) {
                            fileEntry.file(function (file) {
                                var reader = new FileReader();
                                reader.onload = function (evt) {
                                    q.resolve(reader.result);
                                };
                                reader.onerror = q.reject;
                                reader.readAsText(file);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.writeTextFile = function (path, text, append, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (append == null) {
                        append = false;
                    }
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: true,
                            exclusive: false
                        };
                        rootEntry.getFile(path, flags, function (fileEntry) {
                            fileEntry.createWriter(function (writer) {
                                var blobOptions;
                                if (append) {
                                    writer.seek(writer.length);
                                }
                                else {
                                    writer.truncate(0);
                                }
                                blobOptions = {
                                    type: "text/plain"
                                };
                                writer.onwrite = function () {
                                    q.resolve();
                                };
                                writer.onerror = q.reject;
                                writer.write(new Blob([text], blobOptions));
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getDirectories = function (path, rootPath) {
                    var q = this.$q.defer();
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (directoryEntry) {
                            var reader;
                            reader = directoryEntry.createReader();
                            reader.readEntries(function (entries) {
                                var directories = [];
                                entries.forEach(function (entry) {
                                    if (entry.isDirectory) {
                                        directories.push(entry);
                                    }
                                });
                                q.resolve(directories);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getDirectoriesUsingEntry = function (directory) {
                    var q = this.$q.defer();
                    var reader;
                    reader = directory.createReader();
                    reader.readEntries(function (entries) {
                        var directories = [];
                        entries.forEach(function (entry) {
                            if (entry.isDirectory) {
                                directories.push(entry);
                            }
                        });
                        q.resolve(directories);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getDirectoryNames = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (directoryEntry) {
                            var reader;
                            reader = directoryEntry.createReader();
                            reader.readEntries(function (entries) {
                                var directoryNames = [];
                                entries.forEach(function (entry) {
                                    if (entry.isDirectory) {
                                        directoryNames.push(entry.name);
                                    }
                                });
                                q.resolve(directoryNames);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getDirectoryPaths = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (directoryEntry) {
                            var reader;
                            reader = directoryEntry.createReader();
                            reader.readEntries(function (entries) {
                                var directoryPaths = [];
                                entries.forEach(function (entry) {
                                    if (entry.isDirectory) {
                                        directoryPaths.push(entry.fullPath);
                                    }
                                });
                                q.resolve(directoryPaths);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getFiles = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (directoryEntry) {
                            var reader;
                            reader = directoryEntry.createReader();
                            reader.readEntries(function (entries) {
                                var files = [];
                                entries.forEach(function (entry) {
                                    if (entry.isFile) {
                                        files.push(entry);
                                    }
                                });
                                q.resolve(files);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getFilesUsingEntry = function (directory) {
                    var q = this.$q.defer();
                    var reader;
                    reader = directory.createReader();
                    reader.readEntries(function (entries) {
                        var files = [];
                        entries.forEach(function (entry) {
                            if (entry.isFile) {
                                files.push(entry);
                            }
                        });
                        q.resolve(files);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getFileNames = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (directoryEntry) {
                            var reader;
                            reader = directoryEntry.createReader();
                            reader.readEntries(function (entries) {
                                var fileNames = [];
                                entries.forEach(function (entry) {
                                    if (entry.isFile) {
                                        fileNames.push(entry.name);
                                    }
                                });
                                q.resolve(fileNames);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getFilePaths = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (directoryEntry) {
                            var reader;
                            reader = directoryEntry.createReader();
                            reader.readEntries(function (entries) {
                                var filePaths = [];
                                entries.forEach(function (entry) {
                                    if (entry.isFile) {
                                        filePaths.push(entry.fullPath);
                                    }
                                });
                                q.resolve(filePaths);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getAllFiles = function (path, rootPath) {
                    var _this = this;
                    var q = this.$q.defer(), allFiles = [], promises = [];
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    this.directoryExists(path, rootPath).then(function (exists) {
                        if (!exists) {
                            q.resolve([]);
                        }
                        _this.getAllDirectories(path, rootPath).then(function (directories) {
                            var promise;
                            directories.forEach(function (directory) {
                                promise = _this.getFilesUsingEntry(directory);
                                promise.then(function (files) {
                                    allFiles = allFiles.concat(files);
                                }, q.reject);
                                promises.push(promise);
                            });
                            promise = _this.getFiles(path, rootPath);
                            promise.then(function (files) {
                                allFiles = allFiles.concat(files);
                            }, q.reject);
                            promises.push(promise);
                            _this.$q.all(promises).then(function () { q.resolve(allFiles); }, function () { q.reject(); });
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.getAllDirectories = function (path, rootPath) {
                    var _this = this;
                    var q = this.$q.defer(), allDirectories = [];
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    this.directoryExists(path, rootPath).then(function (exists) {
                        if (!exists) {
                            q.resolve([]);
                        }
                        _this.getDirectories(path, rootPath).then(function (directories) {
                            allDirectories = allDirectories.concat(directories);
                            _this.getAllDirectories_recursive(directories, allDirectories, q);
                        }, q.reject);
                    }, q.resolve);
                    return q.promise;
                };
                FileUtilities.prototype.getAllDirectories_recursive = function (dirsToCheck, allDirs, q) {
                    var _this = this;
                    var newDirs = [], promises = [];
                    dirsToCheck.forEach(function (directoryToCheck) {
                        var promise;
                        promise = _this.getDirectoriesUsingEntry(directoryToCheck);
                        promise.then(function (directories) {
                            newDirs = newDirs.concat(directories);
                            allDirs = allDirs.concat(directories);
                        }, q.reject);
                        promises.push(promise);
                    });
                    this.$q.all(promises).then(function () {
                        if (newDirs.length === 0) {
                            q.resolve(allDirs);
                        }
                        else {
                            _this.getAllDirectories_recursive(newDirs, allDirs, q);
                        }
                    });
                };
                FileUtilities.prototype.createDirectory = function (path, createParents, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    if (createParents == null) {
                        createParents = false;
                    }
                    path = this.preparePath(path);
                    if (createParents) {
                        throw new Error("FileUtilities.createDirectory() createParents=true not implemented.");
                    }
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags;
                        flags = {
                            create: true,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (entry) {
                            q.resolve();
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.emptyDirectory = function (path, rootPath) {
                    var _this = this;
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    this.directoryExists(path, rootPath).then(function (exists) {
                        if (!exists) {
                            q.resolve();
                        }
                        _this.getAllFiles(path, rootPath).then(function (fileEntries) {
                            _this.deleteFilesUsingEntries(fileEntries).then(function () {
                                _this.getAllDirectories(path, rootPath).then(function (directoryEntries) {
                                    _this.deleteDirectoriesUsingEntries(directoryEntries).then(q.resolve, q.reject);
                                }, q.reject);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.deleteDirectory = function (path, recursive, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    if (recursive == null) {
                        recursive = false;
                    }
                    path = this.preparePath(path);
                    this.directoryExists(path, rootPath).then(function (exists) {
                        if (!exists) {
                            q.resolve();
                        }
                        if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                            q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                            return q.promise;
                        }
                        window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                            var flags = {
                                create: false,
                                exclusive: false
                            };
                            rootEntry.getDirectory(path, flags, function (entry) {
                                if (recursive) {
                                    entry.removeRecursively(q.resolve, q.reject);
                                }
                                else {
                                    entry.remove(q.resolve, q.reject);
                                }
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.deleteDirectoryUsingEntry = function (directory) {
                    var q = this.$q.defer();
                    directory.remove(q.resolve, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.deleteDirectoriesUsingEntries = function (directories) {
                    var _this = this;
                    var q = this.$q.defer(), promises = [];
                    directories.forEach(function (directory) {
                        var promise;
                        promise = _this.deleteDirectoryUsingEntry(directory);
                        promises.push(promise);
                    });
                    this.$q.all(promises).then(function () { q.resolve(); }, function () { q.reject(); });
                    return q.promise;
                };
                FileUtilities.prototype.deleteFile = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    this.fileExists(path, rootPath).then(function (exists) {
                        if (!exists) {
                            q.resolve();
                        }
                        if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                            q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                            return q.promise;
                        }
                        window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                            var flags = {
                                create: false,
                                exclusive: false
                            };
                            rootEntry.getFile(path, flags, function (entry) {
                                entry.remove(q.resolve, q.reject);
                            }, q.reject);
                        }, q.reject);
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.deleteFileUsingEntry = function (file) {
                    var q = this.$q.defer();
                    file.remove(q.resolve, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.deleteFilesUsingEntries = function (files) {
                    var _this = this;
                    var q = this.$q.defer(), promises = [];
                    var promise;
                    files.forEach(function (file) {
                        promise = _this.deleteFileUsingEntry(file);
                        promises.push(promise);
                    });
                    this.$q.all(promises).then(function () { q.resolve(); }, function () { q.reject(); });
                    return q.promise;
                };
                FileUtilities.prototype.fileExists = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags;
                        flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getFile(path, flags, function (entry) {
                            q.resolve(true);
                        }, function () {
                            q.resolve(false);
                        });
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.prototype.directoryExists = function (path, rootPath) {
                    var q = this.$q.defer();
                    if (!rootPath) {
                        rootPath = this.getDefaultRootPath();
                    }
                    path = this.preparePath(path);
                    if (typeof (window.resolveLocalFileSystemURL) === "undefined") {
                        q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                        return q.promise;
                    }
                    window.resolveLocalFileSystemURL(rootPath, function (rootEntry) {
                        var flags;
                        flags = {
                            create: false,
                            exclusive: false
                        };
                        rootEntry.getDirectory(path, flags, function (entry) {
                            q.resolve(true);
                        }, function () {
                            q.resolve(false);
                        });
                    }, q.reject);
                    return q.promise;
                };
                FileUtilities.ID = "FileUtilities";
                return FileUtilities;
            })();
            Services.FileUtilities = FileUtilities;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var HttpInterceptor = (function () {
                function HttpInterceptor($rootScope, $injector, $q, apiVersion) {
                    this.$rootScope = $rootScope;
                    this.$injector = $injector;
                    this.$q = $q;
                    this.apiVersion = apiVersion;
                    this.requestsInProgress = 0;
                    this.blockingRequestsInProgress = 0;
                    this.spinnerRequestsInProgress = 0;
                }
                Object.defineProperty(HttpInterceptor.prototype, "Utilities", {
                    get: function () {
                        return this.$injector.get(Services.Utilities.ID);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HttpInterceptor.prototype, "UiHelper", {
                    get: function () {
                        return this.$injector.get(Services.UiHelper.ID);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HttpInterceptor.prototype, "Preferences", {
                    get: function () {
                        return this.$injector.get(Services.Preferences.ID);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HttpInterceptor.prototype, "Logger", {
                    get: function () {
                        return this.$injector.get(Services.Logger.ID);
                    },
                    enumerable: true,
                    configurable: true
                });
                HttpInterceptor.getFactory = function () {
                    var factory;
                    factory = function ($rootScope, $injector, $q, Preferences, Utilities, UiHelper, Logger, apiVersion) {
                        var instance = new HttpInterceptor($rootScope, $injector, $q, apiVersion);
                        return {
                            request: _.bind(instance.request, instance),
                            response: _.bind(instance.response, instance),
                            requestError: _.bind(instance.requestError, instance),
                            responseError: _.bind(instance.responseError, instance)
                        };
                    };
                    factory.$inject = ["$rootScope", "$injector", "$q", "apiVersion"];
                    return factory;
                };
                HttpInterceptor.prototype.request = function (config) {
                    var baseUrl;
                    if (this.Utilities.endsWith(config.url, ".html")) {
                        return config;
                    }
                    console.log("HttpInterceptor.request: " + config.url, [config]);
                    if (this.Preferences.enableFullHttpLogging) {
                        this.Logger.logHttpRequestConfig(config);
                    }
                    this.handleRequestStart(config);
                    if (this.Utilities.startsWith(config.url, "~")) {
                        config.headers["X-API-Version"] = this.apiVersion;
                        config.headers["Content-Type"] = "application/json";
                        config.headers["Accept"] = "application/json";
                        if (this.Preferences.userId && this.Preferences.token) {
                            config.headers["Authorization"] = this.getAuthorizationHeader(this.Preferences.userId, this.Preferences.token);
                        }
                        if (this.Preferences.apiUrl && this.Preferences.apiUrl) {
                            baseUrl = this.Preferences.apiUrl;
                            config.url = config.url.substring(1);
                            if (this.Utilities.endsWith(baseUrl, "/") && this.Utilities.startsWith(config.url, "/")) {
                                config.url = config.url.substr(1, config.url.length - 1);
                            }
                            if (!this.Utilities.endsWith(baseUrl, "/") && !this.Utilities.startsWith(config.url, "/")) {
                                config.url = "/" + config.url;
                            }
                            config.url = baseUrl + config.url;
                        }
                        else {
                            throw new Error("An HTTP call cannot be made because a data source was not selected.");
                        }
                    }
                    return config;
                };
                HttpInterceptor.prototype.response = function (httpResponse) {
                    var config;
                    config = httpResponse.config;
                    if (this.Utilities.endsWith(config.url, ".html")) {
                        return httpResponse;
                    }
                    console.log("HttpInterceptor.response: " + httpResponse.config.url, [httpResponse]);
                    if (this.Preferences.enableFullHttpLogging) {
                        this.Logger.logHttpResponse(httpResponse);
                    }
                    this.handleResponseEnd(config);
                    return httpResponse;
                };
                HttpInterceptor.prototype.requestError = function (rejection) {
                    var httpResponse, exception, config;
                    console.error("HttpInterceptor.requestError", [rejection]);
                    if (rejection instanceof Error) {
                        exception = rejection;
                        this.Logger.logError("An request exception was encountered in the HttpInterceptor.requestError().", exception);
                        this.handleFatalError();
                    }
                    else {
                        this.Logger.logError("An request rejection was encountered in the HttpInterceptor.requestError().", null);
                        httpResponse = rejection;
                        config = httpResponse.config;
                        if (config) {
                            this.handleResponseEnd(config);
                        }
                    }
                    return this.$q.reject(rejection);
                };
                HttpInterceptor.prototype.responseError = function (responseOrError) {
                    var httpResponse, exception, config;
                    console.log("HttpInterceptor.responseError", [httpResponse]);
                    if (responseOrError instanceof Error) {
                        exception = responseOrError;
                        this.Logger.logError("An response error was encountered in the HttpInterceptor.responseError().", exception);
                        this.handleFatalError();
                    }
                    else {
                        httpResponse = responseOrError;
                        config = httpResponse.config;
                        if (this.Utilities.endsWith(config.url, ".html")) {
                            return this.$q.reject(responseOrError);
                        }
                        this.Logger.logHttpResponse(httpResponse);
                        this.handleResponseEnd(config);
                        if (httpResponse.status === 401) {
                            this.$rootScope.$broadcast("http.unauthorized");
                        }
                        else if (httpResponse.status === 403) {
                            this.$rootScope.$broadcast("http.forbidden");
                        }
                        else if (httpResponse.status === 404) {
                            this.$rootScope.$broadcast("http.notFound");
                        }
                        else if (httpResponse.status === 0) {
                            this.$rootScope.$broadcast("http.unknownError");
                        }
                    }
                    return this.$q.reject(responseOrError);
                };
                HttpInterceptor.prototype.handleRequestStart = function (config) {
                    if (typeof (config.blocking) === "undefined") {
                        config.blocking = true;
                    }
                    if (typeof (config.showSpinner) === "undefined") {
                        config.showSpinner = true;
                    }
                    this.requestsInProgress += 1;
                    if (config.blocking) {
                        this.blockingRequestsInProgress += 1;
                        if (this.blockingRequestsInProgress > 1) {
                            this.UiHelper.progressIndicator.hide();
                        }
                        if (config.blockingText) {
                            this.UiHelper.progressIndicator.showSimpleWithLabel(true, config.blockingText);
                        }
                        else {
                            this.UiHelper.progressIndicator.showSimple(true);
                        }
                    }
                    if (config.showSpinner) {
                        this.spinnerRequestsInProgress += 1;
                        if (!NProgress.isStarted()) {
                            NProgress.start();
                        }
                    }
                };
                HttpInterceptor.prototype.handleFatalError = function () {
                    this.requestsInProgress = 0;
                    this.blockingRequestsInProgress = 0;
                    this.spinnerRequestsInProgress = 0;
                    NProgress.done();
                    this.UiHelper.progressIndicator.hide();
                };
                HttpInterceptor.prototype.handleResponseEnd = function (config) {
                    this.requestsInProgress -= 1;
                    if (config.blocking) {
                        this.blockingRequestsInProgress -= 1;
                    }
                    if (config.showSpinner) {
                        this.spinnerRequestsInProgress -= 1;
                    }
                    if (config.blocking && this.blockingRequestsInProgress === 0) {
                        this.UiHelper.progressIndicator.hide();
                    }
                    if (config.showSpinner && this.spinnerRequestsInProgress === 0) {
                        NProgress.done();
                    }
                    else {
                        NProgress.inc();
                    }
                };
                HttpInterceptor.prototype.getAuthorizationHeader = function (userName, password) {
                    var headerValue;
                    headerValue = this.Utilities.format("{0}:{1}", userName, password);
                    return "Basic " + btoa(headerValue);
                };
                HttpInterceptor.ID = "HttpInterceptor";
                return HttpInterceptor;
            })();
            Services.HttpInterceptor = HttpInterceptor;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var Logger = (function () {
                function Logger($q, Utilities, FileUtilities) {
                    this.$q = $q;
                    this.Utilities = Utilities;
                    this.FileUtilities = FileUtilities;
                    this.logToLocalStorage = Utilities.isCordova;
                    this.logs = [];
                }
                Object.defineProperty(Logger, "$inject", {
                    get: function () {
                        return ["$q", Services.Utilities.ID, Services.FileUtilities.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                Logger.prototype.addLogEntry = function (logEntry) {
                    var _this = this;
                    var q = this.$q.defer(), errorCallback;
                    if (!this.logToLocalStorage) {
                        this.logs.push(logEntry);
                        q.resolve();
                        return q.promise;
                    }
                    errorCallback = function (error) {
                        _this.logToLocalStorage = false;
                        console.warn("Reverting to in-memory logging because an error occurred during file I/O in addLogEntry().", error);
                        _this.logs.push(logEntry);
                        q.resolve();
                    };
                    this.FileUtilities.createDirectory("/logs").then(function () {
                        var logFileName, json;
                        logFileName = _this.Utilities.format("/logs/{0}.log", moment(logEntry.timestamp).format("YYYY-MM-DD_hh-mm-ss-SSS-a"));
                        try {
                            json = JSON.stringify(logEntry);
                        }
                        catch (exception) {
                            console.error("Unable to stringify the log entry.", logEntry, exception);
                            q.resolve();
                            return;
                        }
                        _this.FileUtilities.writeTextFile(logFileName, json).then(function () {
                            q.resolve();
                        }, errorCallback);
                    }, errorCallback);
                };
                Logger.prototype.getLog = function (id) {
                    var _this = this;
                    var q = this.$q.defer(), logEntry, errorCallback;
                    logEntry = _.find(this.logs, function (logEntry) {
                        return logEntry.id === id;
                    });
                    if (logEntry != null) {
                        q.resolve(logEntry);
                        return q.promise;
                    }
                    if (!this.logToLocalStorage) {
                        q.resolve(null);
                        return q.promise;
                    }
                    errorCallback = function (error) {
                        _this.logToLocalStorage = false;
                        console.warn("Reverting to in-memory logging because an error occurred during file I/O in getLog().", error);
                        q.resolve(null);
                    };
                    this.getLogs().then(function (logEntries) {
                        logEntry = _.find(logEntries, function (logEntry) {
                            return logEntry.id === id;
                        });
                        q.resolve(logEntry);
                    }, errorCallback);
                    return q.promise;
                };
                Logger.prototype.getLogs = function () {
                    var _this = this;
                    var q = this.$q.defer(), promises = [], errorCallback;
                    if (!this.logToLocalStorage) {
                        q.resolve(this.logs);
                        return q.promise;
                    }
                    errorCallback = function (error) {
                        _this.logToLocalStorage = false;
                        console.warn("Reverting to in-memory logging because an error occurred during file I/O in getLogs().", error);
                        q.resolve(_this.logs);
                    };
                    this.logs = [];
                    this.FileUtilities.createDirectory("/logs").then(function () {
                        _this.FileUtilities.getFiles("/logs").then(function (entries) {
                            entries = _.filter(entries, function (entry) {
                                return _this.Utilities.endsWith(entry.name, ".log");
                            });
                            entries.forEach(function (entry) {
                                var promise;
                                promise = _this.FileUtilities.readTextFile(entry.fullPath);
                                promise.then(function (text) {
                                    var logEntry;
                                    logEntry = JSON.parse(text);
                                    _this.logs.push(logEntry);
                                }, errorCallback);
                                promises.push(promise);
                            });
                            _this.$q.all(promises).then(function () {
                                q.resolve(_this.logs);
                            }, q.reject);
                        }, errorCallback);
                    }, errorCallback);
                    return q.promise;
                };
                Logger.prototype.clearLogs = function () {
                    var _this = this;
                    var q = this.$q.defer(), errorCallback;
                    if (!this.logToLocalStorage) {
                        this.logs = [];
                        q.resolve();
                        return q.promise;
                    }
                    errorCallback = function (error) {
                        _this.logToLocalStorage = false;
                        console.warn("Reverting to in-memory logging because an error occurred during file I/O in clearLogs().", error);
                        _this.logs = [];
                        q.resolve();
                    };
                    this.FileUtilities.createDirectory("/logs").then(function () {
                        _this.FileUtilities.emptyDirectory("/logs").then(function () {
                            _this.logs = [];
                            q.resolve();
                        }, errorCallback);
                    }, errorCallback);
                    return q.promise;
                };
                Logger.prototype.logWindowError = function (message, uri, lineNumber, colNumber) {
                    var logEntry;
                    logEntry = new SampleApp.Models.LogEntry();
                    logEntry.id = this.Utilities.generateGuid();
                    logEntry.timestamp = new Date();
                    logEntry.message = "Unhandled JS Exception: " + message;
                    logEntry.uri = uri;
                    logEntry.lineNumber = lineNumber;
                    logEntry.colNumber = colNumber;
                    this.addLogEntry(logEntry);
                };
                Logger.prototype.logError = function (message, error) {
                    var logEntry;
                    logEntry = new SampleApp.Models.LogEntry();
                    logEntry.id = this.Utilities.generateGuid();
                    logEntry.timestamp = new Date();
                    logEntry.message = message;
                    logEntry.error = error;
                    logEntry.uri = window.location.toString();
                    this.addLogEntry(logEntry);
                };
                Logger.prototype.logHttpRequestConfig = function (config) {
                    var logEntry;
                    logEntry = new SampleApp.Models.LogEntry();
                    logEntry.id = this.Utilities.generateGuid();
                    logEntry.timestamp = new Date();
                    logEntry.uri = window.location.href;
                    logEntry.message = "HTTP Request";
                    logEntry.httpMethod = config.method;
                    logEntry.httpUrl = config.url;
                    logEntry.httpBody = typeof (config.data) === "string" ? config.data : JSON.stringify(config.data);
                    logEntry.httpHeaders = JSON.stringify(config.headers);
                    this.addLogEntry(logEntry);
                };
                Logger.prototype.logHttpResponse = function (httpResponse) {
                    var logEntry;
                    logEntry = new SampleApp.Models.LogEntry();
                    logEntry.id = this.Utilities.generateGuid();
                    logEntry.timestamp = new Date();
                    logEntry.uri = window.location.href;
                    logEntry.message = "HTTP Response";
                    logEntry.httpUrl = httpResponse.config.url;
                    logEntry.httpStatus = httpResponse.status;
                    logEntry.httpStatusText = httpResponse.statusText;
                    logEntry.httpBody = typeof (httpResponse.data) === "string" ? httpResponse.data : JSON.stringify(httpResponse.data);
                    logEntry.httpHeaders = JSON.stringify(httpResponse.headers);
                    this.addLogEntry(logEntry);
                };
                Logger.prototype.setLogToLocalStorage = function (logToLocalStorage) {
                    this.logToLocalStorage = logToLocalStorage;
                };
                Logger.prototype.getLogToLocalStorage = function () {
                    return this.logToLocalStorage;
                };
                Logger.ID = "Logger";
                return Logger;
            })();
            Services.Logger = Logger;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var MockHttpApis = (function () {
                function MockHttpApis($httpBackend) {
                    this.$httpBackend = $httpBackend;
                }
                Object.defineProperty(MockHttpApis, "$inject", {
                    get: function () {
                        return ["$httpBackend"];
                    },
                    enumerable: true,
                    configurable: true
                });
                MockHttpApis.setupMockHttpDelay = function ($provide) {
                    var maxDelay = 3000, minDelay = 1000;
                    $provide.decorator("$httpBackend", function ($delegate) {
                        var proxy = function (method, url, data, callback, headers) {
                            var interceptor = function () {
                                var _this = this, _arguments = arguments, delay;
                                if (url.indexOf(".html") > -1) {
                                    callback.apply(_this, _arguments);
                                }
                                else {
                                    delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
                                    setTimeout(function () {
                                        callback.apply(_this, _arguments);
                                    }, delay);
                                }
                            };
                            return $delegate.call(this, method, url, data, interceptor, headers);
                        };
                        for (var key in $delegate) {
                            proxy[key] = $delegate[key];
                        }
                        return proxy;
                    });
                };
                MockHttpApis.prototype.mockHttpCalls = function (mock) {
                    this.$httpBackend.whenGET(/.*\.html/).passThrough();
                    if (mock) {
                    }
                    else {
                        this.$httpBackend.whenDELETE(/.*/).passThrough();
                        this.$httpBackend.whenGET(/.*/).passThrough();
                        this.$httpBackend.whenJSONP(/.*/).passThrough();
                        this.$httpBackend.whenPATCH(/.*/).passThrough();
                        this.$httpBackend.whenPOST(/.*/).passThrough();
                        this.$httpBackend.whenPUT(/.*/).passThrough();
                    }
                };
                MockHttpApis.ID = "MockHttpApis";
                return MockHttpApis;
            })();
            Services.MockHttpApis = MockHttpApis;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var MockPlatformApis = (function () {
                function MockPlatformApis($q, $ionicPopup, $ionicLoading, Utilities) {
                    this.$q = $q;
                    this.Utilities = Utilities;
                    this.$ionicPopup = $ionicPopup;
                    this.$ionicLoading = $ionicLoading;
                    this.isProgressIndicatorShown = false;
                }
                Object.defineProperty(MockPlatformApis, "$inject", {
                    get: function () {
                        return ["$q", "$ionicPopup", "$ionicLoading", Services.Utilities.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                MockPlatformApis.prototype.getToastPlugin = function () {
                    return {
                        show: _.bind(this.toast, this),
                        showLongBottom: _.bind(this.toast, this),
                        showLongCenter: _.bind(this.toast, this),
                        showLongTop: _.bind(this.toast, this),
                        showShortBottom: _.bind(this.toast, this),
                        showShortCenter: _.bind(this.toast, this),
                        showShortTop: _.bind(this.toast, this)
                    };
                };
                MockPlatformApis.prototype.getPushNotificationPlugin = function () {
                    return {
                        register: _.bind(this.pushNotification_register, this),
                        unregister: _.bind(this.pushNotification_unregister, this),
                        setApplicationIconBadgeNumber: _.bind(this.pushNotification_setApplicationIconBadgeNumber, this)
                    };
                };
                MockPlatformApis.prototype.getClipboardPlugin = function () {
                    return {
                        copy: _.bind(this.clipboard_copy, this),
                        paste: _.bind(this.clipboard_paste, this)
                    };
                };
                MockPlatformApis.prototype.getClipboardPluginForChromeExtension = function () {
                    return {
                        copy: _.bind(this.clipboard_chromeExtension_copy, this),
                        paste: _.bind(this.clipboard_chromeExtension_paste, this)
                    };
                };
                MockPlatformApis.prototype.getNotificationPlugin = function () {
                    return {
                        alert: _.bind(this.notification_alert, this),
                        confirm: _.bind(this.notification_confirm, this),
                        prompt: _.bind(this.notification_prompt, this),
                        beep: _.bind(this.notification_beep, this),
                        vibrate: _.bind(this.notification_vibrate, this),
                        vibrateWithPattern: _.bind(this.notification_vibrateWithPattern, this),
                        cancelVibration: _.bind(this.notification_cancelVibration, this)
                    };
                };
                MockPlatformApis.prototype.getProgressIndicatorPlugin = function () {
                    return {
                        hide: _.bind(this.progressIndicator_hide, this),
                        showSimple: _.bind(this.progressIndicator_show, this),
                        showSimpleWithLabel: _.bind(this.progressIndicator_show, this),
                        showSimpleWithLabelDetail: _.bind(this.progressIndicator_show, this),
                        showDeterminate: _.bind(this.progressIndicator_show, this),
                        showDeterminateWithLabel: _.bind(this.progressIndicator_show, this),
                        showAnnular: _.bind(this.progressIndicator_show, this),
                        showAnnularWithLabel: _.bind(this.progressIndicator_show, this),
                        showBar: _.bind(this.progressIndicator_show, this),
                        showBarWithLabel: _.bind(this.progressIndicator_show, this),
                        showSuccess: _.bind(this.progressIndicator_show, this),
                        showText: _.bind(this.progressIndicator_show, this)
                    };
                };
                MockPlatformApis.prototype.toast = function (message) {
                    var div, existingToasts;
                    existingToasts = document.querySelectorAll(".mockToast").length;
                    div = document.createElement("div");
                    div.className = "mockToast";
                    div.style.position = "absolute";
                    div.style.bottom = (existingToasts === 0 ? 0 : (35 * existingToasts)) + "px";
                    div.style.width = "100%";
                    div.style.backgroundColor = "#444444";
                    div.style.opacity = "0.8";
                    div.style.textAlign = "center";
                    div.style.color = "#fff";
                    div.style.padding = "10px";
                    div.style.zIndex = "9000";
                    div.innerText = message;
                    document.body.appendChild(div);
                    setTimeout(function () {
                        document.body.removeChild(div);
                    }, 3000);
                };
                MockPlatformApis.prototype.pushNotification_register = function (successCallback, errorCallback, registrationOptions) {
                    console.warn("window.pushNotification.register()", registrationOptions);
                    setTimeout(function () {
                        errorCallback(new Error("Not implemented in MockPlatformApis.ts"));
                    }, 0);
                };
                MockPlatformApis.prototype.pushNotification_unregister = function (successCallback, errorCallback) {
                    console.warn("window.pushNotification.unregister()");
                    setTimeout(function () {
                        errorCallback(new Error("Not implemented in MockPlatformApis.ts"));
                    }, 0);
                };
                MockPlatformApis.prototype.pushNotification_setApplicationIconBadgeNumber = function (successCallback, errorCallback, badgeCount) {
                    console.warn("window.pushNotification.setApplicationIconBadgeNumber()", badgeCount);
                    setTimeout(function () {
                        errorCallback(new Error("Not implemented in MockPlatformApis.ts"));
                    }, 0);
                };
                MockPlatformApis.prototype.clipboard_copy = function (text, onSuccess, onFail) {
                    var confirmed = confirm("The following text was requested for copy to the clipboard:\n\n" + text);
                    if (confirmed) {
                        _.defer(function () {
                            if (onSuccess) {
                                onSuccess();
                            }
                        });
                    }
                    else {
                        _.defer(function () {
                            if (onFail) {
                                onFail(new Error("The operation was cancelled."));
                            }
                        });
                    }
                };
                MockPlatformApis.prototype.clipboard_chromeExtension_copy = function (text, onSuccess, onFail) {
                    // The following is based on http://stackoverflow.com/a/12693636
                    try {
                        document["oncopy"] = function (event) {
                            event.clipboardData.setData("Text", text);
                            event.preventDefault();
                        };
                        document.execCommand("Copy");
                        document["oncopy"] = undefined;
                        _.defer(function () {
                            onSuccess();
                        });
                    }
                    catch (error) {
                        _.defer(function () {
                            onFail(error);
                        });
                    }
                };
                MockPlatformApis.prototype.clipboard_paste = function (onSuccess, onFail) {
                    var result = prompt("A paste from clipboard was requested; enter text for the paste operation:");
                    if (result === null) {
                        _.defer(function () {
                            if (onFail) {
                                onFail(new Error("The operation was cancelled."));
                            }
                        });
                    }
                    else {
                        _.defer(function () {
                            if (onSuccess) {
                                onSuccess(result);
                            }
                        });
                    }
                };
                MockPlatformApis.prototype.clipboard_chromeExtension_paste = function (onSuccess, onFail) {
                    _.defer(function () {
                        onFail(new Error("The paste operation is not currently implemented for Chrome extensions."));
                    });
                };
                MockPlatformApis.prototype.notification_alert = function (message, alertCallback, title, buttonName) {
                    var buttons = [];
                    title = title || "Alert";
                    buttonName = buttonName || "OK";
                    buttons.push({ text: buttonName });
                    message = message.replace(/\n/g, "<br/>");
                    this.$ionicPopup.show({ title: title, template: message, buttons: buttons }).then(function () {
                        if (alertCallback) {
                            alertCallback();
                        }
                    });
                };
                MockPlatformApis.prototype.notification_confirm = function (message, confirmCallback, title, buttonLabels) {
                    var buttons = [];
                    title = title || "Confirm";
                    buttonLabels = buttonLabels || ["Yes", "No"];
                    buttonLabels.forEach(function (value, index) {
                        buttons.push({
                            text: value,
                            onTap: function (e) {
                                return index + 1;
                            }
                        });
                    });
                    message = message.replace(/\n/g, "<br/>");
                    this.$ionicPopup.show({ title: title, template: message, buttons: buttons }).then(function (result) {
                        if (confirmCallback) {
                            confirmCallback(result);
                        }
                    });
                };
                MockPlatformApis.prototype.notification_prompt = function (message, promptCallback, title, buttonLabels, defaultText) {
                    var buttons = [], template;
                    message = message.replace(/\n/g, "<br/>");
                    template = this.Utilities.format("<p>{0}</p><input type='text' id='notification_prompt_input' style='border: solid 1px #3e3e3e;'/>", message);
                    title = title || "Prompt";
                    buttonLabels = buttonLabels || ["OK", "Cancel"];
                    buttonLabels.forEach(function (value, index) {
                        buttons.push({
                            text: value,
                            onTap: function (e) {
                                var result, input;
                                input = document.getElementById("notification_prompt_input");
                                result = {
                                    buttonIndex: index + 1,
                                    input1: input.value
                                };
                                return result;
                            }
                        });
                    });
                    if (defaultText) {
                        _.defer(function () {
                            var input;
                            input = document.getElementById("notification_prompt_input");
                            input.value = defaultText;
                        });
                    }
                    this.$ionicPopup.show({ title: title, template: template, buttons: buttons }).then(function (result) {
                        if (promptCallback) {
                            promptCallback(result);
                        }
                    });
                };
                MockPlatformApis.prototype.notification_beep = function (times) {
                    this.$ionicPopup.alert({ title: "Beep", template: "Beep count: " + times });
                };
                MockPlatformApis.prototype.notification_vibrate = function (time) {
                    this.$ionicPopup.alert({ title: "Vibrate", template: "Vibrate time: " + time });
                };
                MockPlatformApis.prototype.notification_vibrateWithPattern = function (pattern, repeat) {
                    this.$ionicPopup.alert({ title: "Vibrate with Pattern", template: "Pattern: " + pattern + "\nRepeat: " + repeat });
                };
                MockPlatformApis.prototype.notification_cancelVibration = function () {
                    this.$ionicPopup.alert({ title: "Cancel Vibration", template: "cancel" });
                };
                MockPlatformApis.prototype.progressIndicator_hide = function () {
                    var _this = this;
                    setTimeout(function () {
                        _this.$ionicLoading.hide();
                        _this.isProgressIndicatorShown = false;
                    }, 1000);
                };
                MockPlatformApis.prototype.progressIndicator_show = function (dimBackground, labelOrTimeout, labelOrPosition) {
                    var _this = this;
                    var label, timeout;
                    if (this.isProgressIndicatorShown) {
                        return;
                    }
                    this.isProgressIndicatorShown = true;
                    if (typeof (labelOrTimeout) === "string") {
                        label = labelOrTimeout;
                    }
                    if (typeof (labelOrTimeout) === "number") {
                        timeout = labelOrTimeout;
                    }
                    if (!label) {
                        label = "Please Wait...";
                    }
                    this.$ionicLoading.show({
                        template: label
                    });
                    if (timeout) {
                        setTimeout(function () {
                            _this.isProgressIndicatorShown = false;
                            _this.$ionicLoading.hide();
                        }, timeout);
                    }
                };
                MockPlatformApis.ID = "MockPlatformApis";
                return MockPlatformApis;
            })();
            Services.MockPlatformApis = MockPlatformApis;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var Preferences = (function () {
                function Preferences() {
                }
                Object.defineProperty(Preferences, "$inject", {
                    get: function () {
                        return [];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "apiUrl", {
                    get: function () {
                        return "sample-app.justin-credible.net/api";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "userId", {
                    get: function () {
                        return localStorage.getItem(Preferences.USER_ID);
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.USER_ID);
                        }
                        else {
                            localStorage.setItem(Preferences.USER_ID, value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "token", {
                    get: function () {
                        return localStorage.getItem(Preferences.TOKEN);
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.TOKEN);
                        }
                        else {
                            localStorage.setItem(Preferences.TOKEN, value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "enableDeveloperTools", {
                    get: function () {
                        return sessionStorage.getItem(Preferences.ENABLE_DEVELOPER_TOOLS) === "true";
                    },
                    set: function (value) {
                        if (value == null) {
                            sessionStorage.removeItem(Preferences.ENABLE_DEVELOPER_TOOLS);
                        }
                        else {
                            sessionStorage.setItem(Preferences.ENABLE_DEVELOPER_TOOLS, value.toString());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "enableFullHttpLogging", {
                    get: function () {
                        return localStorage.getItem(Preferences.ENABLE_FULL_HTTP_LOGGING) === "true";
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.ENABLE_FULL_HTTP_LOGGING);
                        }
                        else {
                            localStorage.setItem(Preferences.ENABLE_FULL_HTTP_LOGGING, value.toString());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "enableMockHttpCalls", {
                    get: function () {
                        return localStorage.getItem(Preferences.ENABLE_MOCK_HTTP_CALLS) === "true";
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.ENABLE_MOCK_HTTP_CALLS);
                        }
                        else {
                            localStorage.setItem(Preferences.ENABLE_MOCK_HTTP_CALLS, value.toString());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "requirePinThreshold", {
                    get: function () {
                        var value = localStorage.getItem(Preferences.REQUIRE_PIN_THRESHOLD);
                        return value == null ? Preferences.REQUIRE_PIN_THRESHOLD_DEFAULT : parseInt(value, 10);
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.REQUIRE_PIN_THRESHOLD);
                        }
                        else {
                            localStorage.setItem(Preferences.REQUIRE_PIN_THRESHOLD, value.toString());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "lastPausedAt", {
                    get: function () {
                        var lastPausedAt;
                        lastPausedAt = localStorage.getItem(Preferences.LAST_PAUSED_AT);
                        return moment(lastPausedAt).isValid() ? moment(lastPausedAt) : null;
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.LAST_PAUSED_AT);
                        }
                        else {
                            localStorage.setItem(Preferences.LAST_PAUSED_AT, moment(value).format());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "pin", {
                    get: function () {
                        return localStorage.getItem(Preferences.PIN);
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.PIN);
                        }
                        else {
                            localStorage.setItem(Preferences.PIN, value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "categoryOrder", {
                    get: function () {
                        var categoryOrder = localStorage.getItem(Preferences.CATEGORY_ORDER);
                        if (categoryOrder == null) {
                            return null;
                        }
                        else {
                            return JSON.parse(categoryOrder);
                        }
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.CATEGORY_ORDER);
                        }
                        else {
                            localStorage.setItem(Preferences.CATEGORY_ORDER, JSON.stringify(value));
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Preferences.prototype, "hasCompletedOnboarding", {
                    get: function () {
                        return localStorage.getItem(Preferences.HAS_COMPLETED_ONBOARDING) === "true";
                    },
                    set: function (value) {
                        if (value == null) {
                            localStorage.removeItem(Preferences.HAS_COMPLETED_ONBOARDING);
                        }
                        else {
                            localStorage.setItem(Preferences.HAS_COMPLETED_ONBOARDING, value.toString());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Preferences.ID = "Preferences";
                Preferences.USER_ID = "USER_ID";
                Preferences.TOKEN = "TOKEN";
                Preferences.ENABLE_DEVELOPER_TOOLS = "ENABLE_DEVELOPER_TOOLS";
                Preferences.ENABLE_FULL_HTTP_LOGGING = "ENABLE_FULL_HTTP_LOGGING";
                Preferences.ENABLE_MOCK_HTTP_CALLS = "ENABLE_MOCK_HTTP_CALLS";
                Preferences.REQUIRE_PIN_THRESHOLD = "REQUIRE_PIN_THRESHOLD";
                Preferences.LAST_PAUSED_AT = "LAST_PAUSED_AT";
                Preferences.PIN = "PIN";
                Preferences.CATEGORY_ORDER = "CATEGORY_ORDER";
                Preferences.HAS_COMPLETED_ONBOARDING = "HAS_COMPLETED_ONBOARDING";
                Preferences.REQUIRE_PIN_THRESHOLD_DEFAULT = 10;
                return Preferences;
            })();
            Services.Preferences = Preferences;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var UiHelper = (function () {
                function UiHelper($rootScope, $q, $http, $ionicModal, MockPlatformApis, Utilities, Preferences) {
                    this.dialogTemplateMap = {};
                    this.isPinEntryOpen = false;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.$http = $http;
                    this.$ionicModal = $ionicModal;
                    this.MockPlatformApis = MockPlatformApis;
                    this.Utilities = Utilities;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(UiHelper, "$inject", {
                    get: function () {
                        return ["$rootScope", "$q", "$http", "$ionicModal", Services.MockPlatformApis.ID, Services.Utilities.ID, Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UiHelper.prototype, "toast", {
                    get: function () {
                        if (window.plugins && window.plugins.toast) {
                            return window.plugins.toast;
                        }
                        else {
                            return this.MockPlatformApis.getToastPlugin();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UiHelper.prototype, "progressIndicator", {
                    get: function () {
                        if (window.ProgressIndicator && !this.Utilities.isAndroid) {
                            return window.ProgressIndicator;
                        }
                        else {
                            return this.MockPlatformApis.getProgressIndicatorPlugin();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UiHelper.prototype, "clipboard", {
                    get: function () {
                        if (typeof (cordova) !== "undefined" && cordova.plugins && cordova.plugins.clipboard) {
                            return cordova.plugins.clipboard;
                        }
                        else if (this.Utilities.isChromeExtension) {
                            return this.MockPlatformApis.getClipboardPluginForChromeExtension();
                        }
                        else {
                            return this.MockPlatformApis.getClipboardPlugin();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                UiHelper.prototype.alert = function (message, title, buttonName) {
                    var q = this.$q.defer(), callback, notificationPlugin;
                    title = title || "Alert";
                    buttonName = buttonName || "OK";
                    callback = function () {
                        q.resolve();
                    };
                    if (navigator.notification) {
                        notificationPlugin = navigator.notification;
                    }
                    else {
                        notificationPlugin = this.MockPlatformApis.getNotificationPlugin();
                    }
                    notificationPlugin.alert(message, callback, title, buttonName);
                    return q.promise;
                };
                UiHelper.prototype.confirm = function (message, title, buttonLabels) {
                    var q = this.$q.defer(), callback, notificationPlugin;
                    title = title || "Confirm";
                    buttonLabels = buttonLabels || ["Yes", "No"];
                    callback = function (choice) {
                        var buttonText;
                        buttonText = buttonLabels[choice - 1];
                        q.resolve(buttonText);
                    };
                    if (navigator.notification) {
                        notificationPlugin = navigator.notification;
                    }
                    else {
                        notificationPlugin = this.MockPlatformApis.getNotificationPlugin();
                    }
                    notificationPlugin.confirm(message, callback, title, buttonLabels);
                    return q.promise;
                };
                UiHelper.prototype.prompt = function (message, title, buttonLabels, defaultText) {
                    var q = this.$q.defer(), callback, notificationPlugin;
                    title = title || "Prompt";
                    buttonLabels = buttonLabels || ["OK", "Cancel"];
                    callback = function (promptResult) {
                        var promiseResult, buttonText;
                        buttonText = buttonLabels[promptResult.buttonIndex - 1];
                        promiseResult = new SampleApp.Models.KeyValuePair(buttonText, promptResult.input1);
                        q.resolve(promiseResult);
                    };
                    if (navigator.notification) {
                        notificationPlugin = navigator.notification;
                    }
                    else {
                        notificationPlugin = this.MockPlatformApis.getNotificationPlugin();
                    }
                    notificationPlugin.prompt(message, callback, title, buttonLabels, defaultText);
                    return q.promise;
                };
                UiHelper.prototype.registerDialog = function (dialogId, templatePath) {
                    if (!dialogId) {
                        throw new Error("A dialogId is required when registering a dialog.");
                    }
                    if (!templatePath) {
                        throw new Error("A templatePath is required when registering a dialog.");
                    }
                    if (this.dialogTemplateMap[dialogId]) {
                        console.warn(this.Utilities.format("A dialog with ID {0} has already been registered; it will be overwritten.", dialogId));
                    }
                    this.dialogTemplateMap[dialogId] = templatePath;
                };
                UiHelper.prototype.showDialog = function (dialogId, options) {
                    var q = this.$q.defer(), template, creationArgs, creationPromise;
                    if (!options) {
                        options = new SampleApp.Models.DialogOptions();
                    }
                    if (UiHelper.openDialogIds == null) {
                        UiHelper.openDialogIds = [];
                    }
                    if (_.contains(UiHelper.openDialogIds, dialogId)) {
                        this.$q.reject(UiHelper.DIALOG_ALREADY_OPEN);
                        return q.promise;
                    }
                    template = this.dialogTemplateMap[dialogId];
                    if (!template) {
                        this.$q.reject(UiHelper.DIALOG_ID_NOT_REGISTERED);
                        console.warn(this.Utilities.format("A call was made to openDialog with dialogId '{0}', but a template is not registered with that ID in the dialogTemplateMap.", dialogId));
                        return q.promise;
                    }
                    UiHelper.openDialogIds.push(dialogId);
                    creationArgs = {
                        dialogId: dialogId,
                        dialogData: options.dialogData,
                        backdropClickToClose: options.backdropClickToClose,
                        hardwareBackButtonClose: options.hardwareBackButtonClose
                    };
                    creationPromise = this.$ionicModal.fromTemplateUrl(template, creationArgs);
                    creationPromise.then(function (modal) {
                        var backdrop;
                        modal.show();
                        if (!options.showBackground) {
                            backdrop = document.querySelector("div.modal-backdrop");
                            backdrop.style.backgroundColor = "rgba(0, 0, 0, 1)";
                        }
                        modal.scope.$on("modal.hidden", function (eventArgs, instance) {
                            if (dialogId !== instance.dialogId) {
                                return;
                            }
                            if (!options.showBackground) {
                                backdrop.style.backgroundColor = "";
                            }
                            UiHelper.openDialogIds = _.without(UiHelper.openDialogIds, dialogId);
                            q.resolve(modal.result);
                        });
                    });
                    return q.promise;
                };
                UiHelper.prototype.showPinEntryAfterResume = function () {
                    var q = this.$q.defer(), resumedAt, options, model;
                    if (this.isPinEntryOpen) {
                        q.reject(UiHelper.DIALOG_ALREADY_OPEN);
                        return q.promise;
                    }
                    if (this.Preferences.pin && this.Preferences.lastPausedAt != null && this.Preferences.lastPausedAt.isValid()) {
                        resumedAt = moment();
                        if (resumedAt.diff(this.Preferences.lastPausedAt, "minutes") > this.Preferences.requirePinThreshold) {
                            model = new SampleApp.Models.PinEntryDialogModel("PIN Required", this.Preferences.pin, false);
                            options = new SampleApp.Models.DialogOptions(model);
                            options.backdropClickToClose = false;
                            options.hardwareBackButtonClose = false;
                            options.showBackground = false;
                            this.showDialog(SampleApp.Controllers.PinEntryController.ID, options).then(function (result) {
                                q.resolve();
                            });
                        }
                        else {
                            q.resolve();
                        }
                    }
                    else {
                        q.resolve();
                    }
                    return q.promise;
                };
                UiHelper.ID = "UiHelper";
                UiHelper.DIALOG_ALREADY_OPEN = "DIALOG_ALREADY_OPEN";
                UiHelper.DIALOG_ID_NOT_REGISTERED = "DIALOG_ID_NOT_REGISTERED";
                return UiHelper;
            })();
            Services.UiHelper = UiHelper;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var Services;
        (function (Services) {
            var Utilities = (function () {
                function Utilities(isRipple, isCordova, isDebug, isChromeExtension, Preferences) {
                    this._isRipple = isRipple;
                    this._isCordova = isCordova;
                    this._isDebug = isDebug;
                    this._isChromeExtension = isChromeExtension;
                    this.Preferences = Preferences;
                }
                Object.defineProperty(Utilities, "$inject", {
                    get: function () {
                        return ["isRipple", "isCordova", "isDebug", "isChromeExtension", Services.Preferences.ID];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Utilities.prototype, "isRipple", {
                    get: function () {
                        return this._isRipple;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Utilities.prototype, "isCordova", {
                    get: function () {
                        return this._isCordova;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Utilities.prototype, "isDebugMode", {
                    get: function () {
                        return this._isDebug;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Utilities.prototype, "isChromeExtension", {
                    get: function () {
                        return this._isChromeExtension;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Utilities.prototype, "isAndroid", {
                    get: function () {
                        return typeof (device) !== "undefined" && device.platform === "Android";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Utilities.prototype, "isIos", {
                    get: function () {
                        return typeof (device) !== "undefined" && device.platform === "iOS";
                    },
                    enumerable: true,
                    configurable: true
                });
                Utilities.prototype.isWindowsPhone8 = function () {
                    return typeof (device) !== "undefined" && device.platform === "WP8";
                };
                Utilities.prototype.isWindows8 = function () {
                    return typeof (device) !== "undefined" && device.platform === "Windows8";
                };
                Utilities.prototype.platform = function () {
                    if (typeof (device) === "undefined") {
                        return typeof (window.ripple) !== "undefined" ? "Ripple" : "Unknown";
                    }
                    else {
                        return device.platform;
                    }
                };
                Utilities.prototype.endsWith = function (str, suffix) {
                    if (str == null || str === "") {
                        return false;
                    }
                    if (suffix == null || suffix === "") {
                        return true;
                    }
                    return (str.substr(str.length - suffix.length) === suffix);
                };
                Utilities.prototype.startsWith = function (str, prefix) {
                    if (str == null || str === "") {
                        return false;
                    }
                    if (prefix == null || prefix === "") {
                        return true;
                    }
                    return (str.substr(0, prefix.length) === prefix);
                };
                Utilities.prototype.toTitleCase = function (str) {
                    if (!str) {
                        return "";
                    }
                    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                };
                Utilities.prototype.format = function (formatString) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var i, reg;
                    i = 0;
                    for (i = 0; i < arguments.length - 1; i += 1) {
                        reg = new RegExp("\\{" + i + "\\}", "gm");
                        formatString = formatString.replace(reg, arguments[i + 1]);
                    }
                    return formatString;
                };
                Utilities.prototype.getValue = function (object, propertyString) {
                    var properties, property, i;
                    if (!object) {
                        return null;
                    }
                    if (!propertyString) {
                        return null;
                    }
                    if (object[propertyString]) {
                        return object[propertyString];
                    }
                    properties = propertyString.split(".");
                    for (i = 0; i < properties.length; i += 1) {
                        property = properties[i];
                        object = object[property];
                        if (object == null) {
                            return null;
                        }
                    }
                    return object;
                };
                Utilities.prototype.setValue = function (object, propertyString, value, instantiateObjects) {
                    var properties, property, i;
                    if (!object) {
                        return;
                    }
                    if (!propertyString) {
                        return;
                    }
                    if (typeof (instantiateObjects) === "undefined") {
                        instantiateObjects = true;
                    }
                    properties = propertyString.split(".");
                    for (i = 0; i < properties.length; i += 1) {
                        property = properties[i];
                        if (properties.length - 1 === i) {
                            object[property] = value;
                        }
                        else {
                            if (object[property]) {
                                object = object[property];
                            }
                            else if (instantiateObjects) {
                                object[property] = {};
                                object = object[property];
                            }
                            else {
                                return;
                            }
                        }
                    }
                };
                Utilities.prototype.derivesFrom = function (TargetClass, BaseClass) {
                    if (TargetClass.prototype === BaseClass.prototype) {
                        return true;
                    }
                    var prototypes = [];
                    var CurrentClass = TargetClass;
                    prototypes.push(TargetClass.prototype);
                    while (true) {
                        CurrentClass = CurrentClass.prototype.__proto__.constructor;
                        if (CurrentClass.prototype === Object.prototype) {
                            break;
                        }
                        prototypes.push(CurrentClass.prototype);
                        if (CurrentClass.prototype.__proto__ === Object.prototype) {
                            break;
                        }
                    }
                    var foundMatch = false;
                    prototypes.forEach(function (prototype) {
                        if (prototype === BaseClass.prototype) {
                            foundMatch = true;
                        }
                    });
                    return foundMatch;
                };
                Utilities.prototype.getFunction = function (scopeOrPropertyString, propertyString, inferContext) {
                    var scope, fn, contextPropertyString, context;
                    if (inferContext == null) {
                        inferContext = true;
                    }
                    if (typeof (scopeOrPropertyString) === "string") {
                        scope = window;
                        propertyString = scopeOrPropertyString;
                    }
                    else {
                        scope = scopeOrPropertyString;
                    }
                    fn = this.getValue(scope, propertyString);
                    if (!fn) {
                        return null;
                    }
                    if (inferContext) {
                        if (propertyString.indexOf(".") > -1) {
                            contextPropertyString = propertyString.substr(0, propertyString.lastIndexOf("."));
                            context = this.getValue(scope, contextPropertyString);
                        }
                        else {
                            context = scope;
                        }
                        fn = _.bind(fn, context);
                    }
                    return fn;
                };
                Utilities.prototype.getRandomNumber = function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1) + min);
                };
                Utilities.prototype.generateGuid = function () {
                    var guid, hexDigit, j;
                    guid = "";
                    for (j = 0; j < 32; j++) {
                        if (j === 8 || j === 12 || j === 16 || j === 20) {
                            guid = guid + "-";
                        }
                        hexDigit = Math.floor(Math.random() * 16).toString(16).toUpperCase();
                        guid = guid + hexDigit;
                    }
                    return guid;
                };
                Object.defineProperty(Utilities.prototype, "categories", {
                    get: function () {
                        var categories = [
                            new SampleApp.ViewModels.CategoryItemViewModel("Category 1", "#/app/category/1", "ios-pricetags-outline", 0),
                            new SampleApp.ViewModels.CategoryItemViewModel("Category 2", "#/app/category/2", "ios-pricetags-outline", 1),
                            new SampleApp.ViewModels.CategoryItemViewModel("Category 3", "#/app/category/3", "ios-pricetags-outline", 2),
                            new SampleApp.ViewModels.CategoryItemViewModel("Category 4", "#/app/category/4", "ios-pricetags-outline", 3)
                        ];
                        if (this.Preferences.categoryOrder) {
                            this.Preferences.categoryOrder.forEach(function (categoryName, index) {
                                var categoryItem = _.where(categories, { name: categoryName })[0];
                                if (categoryItem) {
                                    categoryItem.order = index;
                                }
                            });
                        }
                        categories = _.sortBy(categories, "order");
                        return categories;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Utilities.prototype, "defaultCategory", {
                    get: function () {
                        return this.categories[0];
                    },
                    enumerable: true,
                    configurable: true
                });
                Utilities.ID = "Utilities";
                return Utilities;
            })();
            Services.Utilities = Utilities;
        })(Services = SampleApp.Services || (SampleApp.Services = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var CategoryItemViewModel = (function () {
                function CategoryItemViewModel(name, href, icon, order) {
                    this.name = name;
                    this.href = href;
                    this.icon = icon;
                    this.order = order;
                }
                return CategoryItemViewModel;
            })();
            ViewModels.CategoryItemViewModel = CategoryItemViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var CategoryViewModel = (function () {
                function CategoryViewModel() {
                }
                return CategoryViewModel;
            })();
            ViewModels.CategoryViewModel = CategoryViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var EmptyViewModel = (function () {
                function EmptyViewModel() {
                }
                return EmptyViewModel;
            })();
            ViewModels.EmptyViewModel = EmptyViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var MenuViewModel = (function () {
                function MenuViewModel() {
                }
                return MenuViewModel;
            })();
            ViewModels.MenuViewModel = MenuViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var PinEntryViewModel = (function () {
                function PinEntryViewModel() {
                }
                return PinEntryViewModel;
            })();
            ViewModels.PinEntryViewModel = PinEntryViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var ReorderCategoriesViewModel = (function () {
                function ReorderCategoriesViewModel() {
                }
                return ReorderCategoriesViewModel;
            })();
            ViewModels.ReorderCategoriesViewModel = ReorderCategoriesViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var OnboardingRegisterViewModel = (function () {
                function OnboardingRegisterViewModel() {
                }
                return OnboardingRegisterViewModel;
            })();
            ViewModels.OnboardingRegisterViewModel = OnboardingRegisterViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var AboutViewModel = (function () {
                function AboutViewModel() {
                }
                return AboutViewModel;
            })();
            ViewModels.AboutViewModel = AboutViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var CloudSyncViewModel = (function () {
                function CloudSyncViewModel() {
                }
                return CloudSyncViewModel;
            })();
            ViewModels.CloudSyncViewModel = CloudSyncViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var ConfigurePinViewModel = (function () {
                function ConfigurePinViewModel() {
                }
                return ConfigurePinViewModel;
            })();
            ViewModels.ConfigurePinViewModel = ConfigurePinViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var DeveloperViewModel = (function () {
                function DeveloperViewModel() {
                }
                return DeveloperViewModel;
            })();
            ViewModels.DeveloperViewModel = DeveloperViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var LogsViewModel = (function () {
                function LogsViewModel() {
                    this.logs = {};
                }
                return LogsViewModel;
            })();
            ViewModels.LogsViewModel = LogsViewModel;
            var LogEntryViewModel = (function (_super) {
                __extends(LogEntryViewModel, _super);
                function LogEntryViewModel() {
                    _super.apply(this, arguments);
                }
                return LogEntryViewModel;
            })(SampleApp.Models.LogEntry);
            ViewModels.LogEntryViewModel = LogEntryViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
var JustinCredible;
(function (JustinCredible) {
    var SampleApp;
    (function (SampleApp) {
        var ViewModels;
        (function (ViewModels) {
            var SettingsListViewModel = (function () {
                function SettingsListViewModel() {
                }
                return SettingsListViewModel;
            })();
            ViewModels.SettingsListViewModel = SettingsListViewModel;
        })(ViewModels = SampleApp.ViewModels || (SampleApp.ViewModels = {}));
    })(SampleApp = JustinCredible.SampleApp || (JustinCredible.SampleApp = {}));
})(JustinCredible || (JustinCredible = {}));
//# sourceMappingURL=bundle.js.map