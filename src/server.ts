import { env } from "./env";
import { app } from "./app";

const port = process.env.PORT || 3333;

app.listen({ port: env.PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${env.HOST}:${env.PORT}`);
});
