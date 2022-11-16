import fs from 'fs';
import { Stock, Transaction } from './stocks.interface';

/**
* Get current stock level information according to sku value
* @param skuId 
* @returns 
*/
export const getCurrentStockLevel = async (skuId: string): Promise<any> => {
    try {
        const stockFile = fs.readFileSync('./stock.json', 'utf8');
        const stockFileData = JSON.parse(stockFile);
        const filteredStockResult = stockFileData.filter((obj: Stock) => obj.sku === skuId);
        if (filteredStockResult && filteredStockResult.length > 0) {
            const transactionsFile = fs.readFileSync('./transactions.json', 'utf8');
            const transactionsFileData = JSON.parse(transactionsFile);
            const filteredTransactionsResult = transactionsFileData.filter((obj: Transaction) => obj.sku === skuId);
            if (filteredTransactionsResult && filteredTransactionsResult.length > 0) {
                let totalTransValue = 0;
                for (let i = 0; i < filteredTransactionsResult.length; i++) {
                    if (filteredTransactionsResult[i].type === 'order') {
                        totalTransValue = totalTransValue + filteredTransactionsResult[i].qty;
                    } else if (filteredTransactionsResult[i].type === 'refund') {
                        totalTransValue = totalTransValue - filteredTransactionsResult[i].qty;
                    }
                }
                return { "sku": skuId, "qty": (filteredStockResult[0].stock - totalTransValue) };
            } else {
                return { "sku": skuId, "qty": filteredStockResult[0].stock };
            }
        } else {
            throw new Error('Invalid skuId.');
        }
    } catch (error: any) {
        error.status = 400;
        throw error;
    }
}