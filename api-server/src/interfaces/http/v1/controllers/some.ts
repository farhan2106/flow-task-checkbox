import { Request, Response } from "express";
import { dbPool } from "../../../../infra/database";

export default class SomeController {
  async getSome(req: Request, res: Response) {
    let dbConn;
    try {
      dbConn = await dbPool.getClient();
    } catch (e) {
      console.error(e);
      res.status(500).send((<Error>e).message);
    } finally {
      dbConn?.release();
    }
  }
}
