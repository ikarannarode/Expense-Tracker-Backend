import express from "express";
import {getTransactions,getSummary,deleteTransaction,addTransaction} from "../controllers/transactionControllers.js"
const router =express.Router();


router.get("/:id",getTransactions)


router.delete("/:id",deleteTransaction)


router.post("/",addTransaction)


router.get("/summary/:userId",getSummary)



export default router;