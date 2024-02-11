import { Client as DbConn } from 'ts-postgres';

export default class SomeEntityRepository {
  private _db: DbConn;
  constructor(db: DbConn) {
    this._db = db;
  }
  
}
