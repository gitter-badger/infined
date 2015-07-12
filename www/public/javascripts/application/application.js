/// <reference path="/infined/typings/angular/angular.d.ts"/>
var ft;
(function (ft) {
    var application = (function () {
        function application(name, modules) {
            this.application = angular.module(name, modules);
        }
        application.prototype.addController = function (name, controller) {
            this.application.controller(name, controller);
        };
        return application;
    })();
    ft.application = application;
})(ft || (ft = {}));
