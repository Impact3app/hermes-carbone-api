import { buildApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const host = "0.0.0.0";

const app = buildApp();

app
  .listen({ port, host })
  .then(() => {
    app.log.info({ port }, "Hermes API started");
  })
  .catch((error) => {
    app.log.error(error, "Hermes API failed to start");
    process.exit(1);
  });
