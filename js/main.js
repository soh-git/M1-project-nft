import { router } from "./routing.js";

let dataNft ;


window.addEventListener("load", (e) => {

    window.addEventListener("hashchange", router);
    router(e);
  });