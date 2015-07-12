/// <reference path="../../typings/angular/angular.d.ts"/>
module ft{
  export class application{
    application: ng.IModule;
 
    constructor( name: string, modules: Array< string > ){
      this.application = angular.module( name, modules );
    }
 
    addController( name: string, controller: Function ){
      this.application.controller( name, controller );
    }
  }
}