import { Router } from "express";
import SomeController from "./controllers/some";

const router = Router();
const someController = new SomeController();

router
  .route("/")
  .get(someController.getSome);

export default router;
