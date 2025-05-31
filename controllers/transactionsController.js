import {sql} from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try {
        const {userId} = req.params;
        const transactions = await sql`
            SELECT *
            FROM transactions
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;
        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error getting the transactions", error);
        res.status(500).json({message: "Internal server Error"});
    }
}

export async function createTransaction(req, res) {
    console.log('transactions', req.body);
    //title, amount, category, user_id
    try {
        const {title, amount, category, user_id} = req.body;
        if (!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({message: "All fields are required"});
        }

        const transaction = await sql`
            INSERT INTO transactions (title, amount, category, user_id)
            VALUES (${title}, ${amount}, ${category}, ${user_id}) RETURNING *
        `;
        console.log(transaction);
        res.status(201).json(transaction[0]);

    } catch (error) {
        console.log("Error creating the transaction", error);
        res.status(500).json({message: "Internal server Error"});
    }
}

export async function deleteTransaction(req, res) {
    try {
        const {id} = req.params;
        console.log('id ', id);

        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({message: "Invalid transaction id"});
        }

        const result = await sql`DELETE
                                 FROM transactions
                                 WHERE id = ${id} RETURNING *`;

        if (result.length === 0) {
            return res.status(404).json({message: "Transaction not found"});
        }
        res.status(200).json({message: "Transaction deleted successfully"});
    } catch (error) {
        console.log("Error deleting the transaction", error);
        res.status(500).json({message: "Internal server Error"});
    }
}

export async function getSummaryByUserId(req, res) {
    try {
        const {userId} = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance
            FROM transactions
            WHERE user_id = ${userId}`;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income
            FROM transactions
            WHERE user_id = ${userId}
              AND amount > 0`;

        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expenses
            FROM transactions
            WHERE user_id = ${userId}
              AND amount < 0
        `;
        console.log('incomeResult ', incomeResult)

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses
        })

    } catch (error) {
        console.log("Error getting the transactions", error);
        res.status(500).json({message: "Internal server Error"});
    }
}

