/// <reference path="application.ts" />
/// <reference path="pages/IndexPageController.ts" />
/// <reference path="pages/DetailsPageController.ts" />
var ft;
(function (ft) {
    var Init = (function () {
        function Init() {
            this.configApp();
        }
        Init.prototype.configApp = function () {
            // Initialize app
            this.fw7App = new Framework7({
                animateNavBackIcon: true
            });
            this.fw7ViewOptions = {
                dynamicNavbar: true,
                domCache: true
            };
            // Add view
            this.mainView = this.fw7App.addView('.view-main', this.fw7ViewOptions);
            // Init Angular
            this.angApp = new ft.application('ft', []);
            // Init controllers
            this.angApp.addController('IndexPageController', ft.pages.IndexPageController);
            this.angApp.addController('DetailsPageController', ft.pages.DetailsPageController);
        };
        return Init;
    })();
    ft.Init = Init;
    // Everything starts here
    new Init();
})(ft || (ft = {}));
