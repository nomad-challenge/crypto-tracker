import { atom } from "recoil";

export const isDarkState = atom({
  key: "isDark",
  default: localStorage.getItem("isDark") === "true",
});
