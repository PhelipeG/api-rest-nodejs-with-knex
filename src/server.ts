import { env } from "./env";
import { app } from "./app";

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
