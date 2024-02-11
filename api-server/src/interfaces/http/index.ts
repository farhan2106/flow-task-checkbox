import path from "path";
require("dotenv").config({
  path: path.resolve(process.cwd(), "config", ".env"),
});

import express from "express";
import morgan from "morgan";
import cors from "cors";
import glob from "glob";
import { verifyOrigin } from "./middlewares/verify_origin";
import helmet from "helmet";
import { dbPool } from "../../infra/database";

export default async function () {
  const app = express();
  app.use(express.json());

  app.use(helmet());

  // middleware to log requests
  app.use(morgan("combined"));

  // Cors Orgin
  const corsOptionsDelegate = function (
    req: any,
    callback: (arg0: null, arg1: { origin: boolean }) => void
  ) {
    let corsOptions = { origin: false };

    if (verifyOrigin(req)) {
      corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }

    callback(null, corsOptions); // callback expects two parameters: error and options
  };

  app.use(cors(corsOptionsDelegate));

  app.options("*", (_, res) => {
    res.status(204).end();
  });

  app.get("/api/health-check", async (req, res) => {
    if (!req.query.key || req.query.key !== "apigatewaytest") {
      return res.status(403).send("Forbidden");
    }

    let dbConn;

    try {
      dbConn = await dbPool.getClient();
      await dbConn.query(`
        SELECT 'It works!'
      `);
      return res.json({
        statusCode: 200,
        message: "OK",
        dbConnectionStatus: "OK",
        dbConnectionMessage: undefined,
      });
    } catch (err: any) {
      return res.json({
        statusCode: 500,
        message: "error",
        dbConnectionStatus: "failed",
        dbConnectionMessage: err.message,
      });
    } finally {
      dbConn?.release();
    }
  });

  /* Mount HTTP */
  const httpPath = "v**";
  glob(
    path.join(__dirname, `${httpPath}/*` + path.extname(__filename)),
    (err, files: string[]) => {
      if (err) return Promise.reject(err);

      // Loading http routes
      files = files.filter((file) => !file.includes("/controllers/"));
      files.forEach((file: string) => {
        const apiPath = path
          .relative(path.join(__dirname, httpPath), file)
          .slice(0, -3);
        const relativepath = apiPath.replace(/\\/g, "/").replace("../", "");
        const router = require(file).default;
        router.stack.forEach((stack: any) => {
          const stackPath = stack.route.path === "/" ? "" : stack.route.path;
          console.log(`Mounting /api/${relativepath}${stackPath}`);
        });
        app.use("/api/" + relativepath, require(file).default);
      });

      console.log("Completed mounting API routes.");
    }
  );

  return app;
}
