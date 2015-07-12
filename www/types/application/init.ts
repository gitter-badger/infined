/// <reference path="application.ts" />
/// <reference path="pages/IndexPageController.ts" />
/// <reference path="pages/DetailsPageController.ts" />

module ft{
  
  declare var Framework7: any;
  
  interface Framework7View{
  }
  
  interface Framework7App{
    addView(view:String, callback:Framework7ViewOptions):Framework7View
  }
  
  interface Framework7ViewOptions{
    dynamicNavbar:boolean;
    domCache:boolean;
  }
  
  export class Init{    
    
    private fw7App:Framework7App;
    private mainView:Framework7View;
    private fw7ViewOptions:Framework7ViewOptions;
    private angApp:application;
    
    constructor(){
      this.configApp();
    }
    
    private configApp():void {
      // Initialize app
      this.fw7App = new Framework7({
        animateNavBackIcon: true
      });

      this.fw7ViewOptions = {
          dynamicNavbar: true,
          domCache: true
      }
      
      // Add view
      this.mainView = this.fw7App.addView('.view-main', this.fw7ViewOptions);
      
      // Init Angular
      this.angApp = new application( 'ft', [] );
      
      // Init controllers
      this.angApp.addController( 'IndexPageController', ft.pages.IndexPageController);
      this.angApp.addController( 'DetailsPageController', ft.pages.DetailsPageController);
      
    }
    
  }
  
  // Everything starts here
  new Init();
  
}