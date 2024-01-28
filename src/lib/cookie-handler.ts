/**
 * Example file for implementing higher-order function
 */

// type CookieMethods = {
//   get?: (key: string) => void;
//   set?: (key: string, value: string, options: string) => Promise<void> | void;
//   remove?: (key: string, options: string) => Promise<void> | void;
// };

// class CookieStore {
//   private cookieMethods: CookieMethods | undefined;

//   constructor(cookieMethods: CookieMethods) {
//     this.cookieMethods = cookieMethods;
//   }

//   login() {
//     if (this.cookieMethods?.get) this.cookieMethods?.get("test");
//   }
// }

// const Test = new CookieStore({
//   get(key: string) {
//     return "hello";
//   },
// });
