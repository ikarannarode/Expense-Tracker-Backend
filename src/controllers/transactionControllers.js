import {sql} from '../config/db.js';


//Get all transactions 
const getTransactions=async(req,res)=>{
  try{
    const {userid}=req.params;
    const transactions=await sql`
    SELECT * FROM transactions WHERE user_id=${userid} ORDER BY created_at DESC
   `
   res.status(200).json({
    success:true,
    message:"Data fetched success",
    data:transactions
   })
  }
  catch(error){
    console.log("error in fetching data:",error);

  return res.json({
      success:false,
      message:"Internal server error"
    })
  }
}

// Get all transactions summary

const getSummary=async (req,res)=>{
  try{
    const {userId}=req.params;

    const balanceResult=await sql`
    SELECT COALESCE(SUM(ammount),0) as balance FROM transactions WHERE user_id=${userId}`;

    const incomeResult=await sql`
    SELECT COALESCE(SUM(ammount),0) as income FROM transactions
    WHERE user_id=${userId} AND ammount >0
    `
    const expensesResult=await sql`
    SELECT COALESCE(SUM(ammount),0) as expenses FROM transactions
    WHERE user_id=${userId} AND ammount <0
    `
res.status(200).json({
  success:true,
  balance:balanceResult[0].balance,
  income:incomeResult[0].income,
  expenses:expensesResult[0].expenses
})
  }
  catch(error){
    console.log('error in getting summary:',error)
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }

}

//Delete transaction

const deleteTransaction=async(req,res)=>{
  try{
    const {id}=req.params;

if(isNaN(parseInt(id))){
  return res.status(400).json({message:"Invalid transaction id"})
}



    const transactions=await sql`
    DELETE FROM transactions WHERE id=${id} RETURNING *
   `


   if(transactions.length===0){
    return res.status(404).json({
      success:false,
      message:"Transaction not found"
    })
   }
   return res.status(200).json({
    success:true,
    message:"Transaction deleted success",
    data:transactions
   })
  }
  catch(error){
    console.log("error in deleting data:",error);

  return res.json({
      success:false,
      message:"Internal server error"
    })
  }
}



// Add new Transaction
const addTransaction=async(req,res)=>{
  try{
    const {title,amount,category,user_id}=req.body;
    console.log(req.body)
if([title,amount,category,user_id].some(field=>!field||field.trim===""||field===0)){
  return res.status(400).json({
    success:false,
    message:'All fields are required!'
  })
}


const transaction=await sql`INSERT INTO transactions(user_id,title,amount,category)
VALUES (${user_id},${title},${amount},${category})
RETURNING *
`;

console.log(transaction)
return res.status(201).json({
  success:true,
  message:"Transaction created successfully"
})
  }
  catch(error){
    console.log('Error in creating transaction',error)
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })

  }
}






export {addTransaction,getTransactions,getSummary,deleteTransaction}