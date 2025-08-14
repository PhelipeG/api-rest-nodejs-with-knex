import { env } from "./env";
import { app } from "./app";

app.listen({ 
  port: env.PORT, 
  host: env.HOST 
}, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${env.HOST}:${env.PORT}`);
});
