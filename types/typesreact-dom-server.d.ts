declare module "react-dom/server.js" {
  import { ReactElement } from "react";
  export function renderToString(element: ReactElement<any, any>): string;
}
