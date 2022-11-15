/**
* Stock interface
*/
export interface Stock {
    sku: string,
    qty: number
}

/**
* Transaction interface
*/
export interface Transaction {
    sku: string,
    type: string,
    qty: number
}