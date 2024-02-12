import { Request, Response } from "express";
import { dbPool } from "../../../../infra/database";

export default class TaskController {
  async getTasks(req: Request, res: Response) {
    let dbConn;
    try {
      dbConn = await dbPool.getClient();

      return res.status(200).send("OK");
    } catch (e) {
      console.error(e);
      res.status(500).send((<Error>e).message);
    } finally {
      dbConn?.release();
    }
  }

  async createTask(req: Request, res: Response) {
    let dbConn;
    try {
      dbConn = await dbPool.getClient();

      return res.status(200).send("OK");
    } catch (e) {
      console.error(e);
      res.status(500).send((<Error>e).message);
    } finally {
      dbConn?.release();
    }
  }

  async editTask(req: Request, res: Response) {
    let dbConn;
    try {
      dbConn = await dbPool.getClient();

      return res.status(200).send("OK");
    } catch (e) {
      console.error(e);
      res.status(500).send((<Error>e).message);
    } finally {
      dbConn?.release();
    }
  }
}
