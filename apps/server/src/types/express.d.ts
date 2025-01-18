// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//     }
//   }
// }

// import "express";

// declare module "express" {
//   interface Request {
//     user?: any;
//   }
// }

// declare global {
//   namespace Express {
//     export interface Request {
//       // language?: Language;
//       user?: any;
//     }
//   }
// }

declare namespace Express {
  export interface Request {
    user?: any;
  }
}
