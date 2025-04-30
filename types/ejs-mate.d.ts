declare module "ejs-mate" {
    import { Options } from "ejs";
    import { RequestHandler } from "express";
  
    function ejsMate(options?: Options): RequestHandler;
  
    export = ejsMate;
  }