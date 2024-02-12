import 'module-alias/register';
import initHttp from "./interfaces/http";
import { redisClient } from "./infra/cache";
import { dbPool } from "./infra/database";

/**
 * Bootstrap Function
 *
 * Start applications here
 */
async function main() {
  const app = await initHttp();

  app.set("port", process.env.PORT || 3001);
  const server = app.listen(process.env.PORT || 3001, () => {
    console.log("Server started");
    console.log(`> Ready on http://localhost:${process.env.PORT || 3001}`);
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received.");
    console.log("Shutting down server instance.");

    server.close(async (err) => {
      if (err) return console.error(err);

      try {
        // Close any connections to external systems db, redis etc
        await redisClient.disconnect();
        await dbPool.end();

        console.log("All connections terminated.");
        process.exit(0);
      } catch (e) {
        console.error(err);
        process.exit(1);
      }
    });
  });
}

main();
