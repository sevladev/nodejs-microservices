import "./infra/env";

import { App } from "./infra/app";
import { Application } from "express";

new App()
  .setup()
  .then((app: Application) => {
    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log("app on ");
    });
  })
  .catch(console.warn);
