import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = window.localStorage.getItem("jwt");
  appLoaded: boolean = false;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => {
        console.log('token yoxlanılır')  
        return this.token},
      (token) => {
        if (token) {
          //user login olanda token save olunur, və burda biz login olandaki tokeni
          // götürüb, localstorage-ə set eliyiriy. Əks halda localstorage -də login olanda
          // token olmayacaq, çünki userStore-da eləbir metod təyin eləməmişik ki
          // tokeni götürüb localda saxlasın. Token i app memory ə də net core yox,
          // biz set eliyiriy.
          window.localStorage.setItem("jwt", token);
          console.log('[tokendə dəyişiklik getdi], token var',token);
        } else {
          window.localStorage.removeItem("jwt");
          console.log('[tokendə dəyişiklik getdi], token yoxdu',token);

        }
      }
    );
  }

  setServerError = (error: ServerError) => (this.error = error);

  setToken = (token: string) => {
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
