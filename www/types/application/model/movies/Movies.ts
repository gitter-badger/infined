module ft.model.movies{
  
  export interface MovieTypeState{
    active:string;
  }
  
  export interface MovieType{
    upcoming:MovieTypeState;
    theater:MovieTypeState;
  }
  
  export interface AjaxResultData{
    movies:Movie[];
  }
  
  export interface MoviePosters{
    detailed:string;
    original:string;
    profile:string;
    thumbnail:string;
  }
  
  export interface MovieRatings{
    audience_score:number;
    critics_rating:string;
    critics_critics_score:number;
  }
  
  export interface MovieReleaseDates{
    theater:String;
  }
  
  export interface Movie{
    id:string;
    synopsis:string;
    title:string;
    posters:MoviePosters;
    ratings:MovieRatings;
    release_dates:MovieReleaseDates;
    stars:string;
    date:string;
  }
  
}