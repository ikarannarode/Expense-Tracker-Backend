import express from 'express';
import cors from 'cors';    
import {config} from 'dotenv';
import {sql} from './config/db.js'; // Adjust the path as necessary
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoutes from './routes/transactionsRoute.js'
import job from "./config/cron.js"; // Adjust the path as necessary
config({path:"./.env"});

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(rateLimiter);
if (process.env.NODE_ENV === 'production')  job.start(); // Start the cron job only in production
// Routes
app.use("/api/transactions",transactionRoutes)



app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running smoothly',
  });
});

async function initDB(){
    try {
        
        await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log("Database initialized successfully...")
    } catch (error) {
        console.log("Database initialized failed:",error);
        process.exit(1)
        
    }




}




initDB()

.then(  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
)