
module org.identy.infined {

    /**
     * Used to define all of the client-side routes for the application.
     * This maps routes to the controller/view that should be used.
     */
    export class Routes {

        public static setupRoutes($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider): void {

            // Setup an abstract state for the tabs directive.
            $stateProvider.state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "templates/Menu.html",
                controller: Controllers.MenuController.ID
            });

            // An blank view useful as a place holder etc.
            $stateProvider.state("app.blank", {
                url: "/blank",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Blank.html"
                    }
                }
            });

            // A shared view used between categories, assigned a number via the route URL (categoryNumber).
            $stateProvider.state("app.category", {
                url: "/category/:categoryNumber",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Category.html",
                        controller: Controllers.CategoryController.ID
                    }
                }
            });

            //#region Onboarding

            $stateProvider.state("app.onboarding-splash", {
                url: "/onboarding/splash",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Onboarding/Onboarding-Splash.html",
                        controller: Controllers.OnboardingSplashController.ID
                    }
                }
            });

            $stateProvider.state("app.onboarding-register", {
                url: "/onboarding/register",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Onboarding/Onboarding-Register.html",
                        controller: Controllers.OnboardingRegisterController.ID
                    }
                }
            });

            $stateProvider.state("app.onboarding-share", {
                url: "/onboarding/share",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Onboarding/Onboarding-Share.html",
                        controller: Controllers.OnboardingShareController.ID
                    }
                }
            });

            //#endregion

            //#region Settings

            $stateProvider.state("app.settings-list", {
                url: "/settings/list",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Settings-List.html",
                        controller: Controllers.SettingsListController.ID
                    }
                }
            });

            $stateProvider.state("app.cloud-sync", {
                url: "/settings/cloud-sync",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Cloud-Sync.html",
                        controller: Controllers.CloudSyncController.ID
                    }
                }
            });

            $stateProvider.state("app.configure-pin", {
                url: "/settings/configure-pin",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Configure-Pin.html",
                        controller: Controllers.ConfigurePinController.ID
                    }
                }
            });

            $stateProvider.state("app.developer", {
                url: "/settings/developer",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Developer.html",
                        controller: Controllers.DeveloperController.ID
                    }
                }
            });

            $stateProvider.state("app.logs", {
                url: "/settings/logs",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Logs.html",
                        controller: Controllers.LogsController.ID
                    }
                }
            });

            $stateProvider.state("app.log-entry", {
                url: "/settings/log-entry/:id",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/Log-Entry.html",
                        controller: Controllers.LogEntryController.ID
                    }
                }
            });

            $stateProvider.state("app.about", {
                url: "/settings/about",
                views: {
                    "menuContent": {
                        templateUrl: "templates/Settings/About.html",
                        controller: Controllers.AboutController.ID
                    }
                }
            });

            //#endregion

            // If none of the above states are matched, use the blank route.
            $urlRouterProvider.otherwise("/app/blank");
        }
    }
}
