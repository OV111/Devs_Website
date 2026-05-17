import { Router } from "express";
import { deleteAccount } from "../controllers/accountController.js";

const router = Router();

router.delete("/deleteAccount", deleteAccount);

export default router;
