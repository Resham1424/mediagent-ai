import { Router, type IRouter } from "express";
import healthRouter from "./health";
import triageRouter from "./triage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(triageRouter);

export default router;
