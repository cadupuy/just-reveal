import Experience from "../Experience/Experience";

declare var window: Window;

declare global {
  interface Window {
    experience: Experience;
  }
}
