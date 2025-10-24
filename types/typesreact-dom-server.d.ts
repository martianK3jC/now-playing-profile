declare module "react-dom/server" {
  import { ReactElement } from "react";
  export function renderToString(element: ReactElement<any, any>): string;
}
