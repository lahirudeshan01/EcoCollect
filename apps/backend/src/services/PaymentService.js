// This simulates communication with a PaymentGateway and handling the Account model.

class PaymentService {
    /**
     * Processes payment and checks for and applies recycling paybacks.
     * @param {string} userId - The ID of the Resident.
     * @param {object} paymentDetails - Card number, amount, etc.
     * @returns {object} Transaction result.
     */
    static async processPayment(userId, paymentDetails) {
        // 1. Simulate external Payment Gateway Transaction
        if (paymentDetails.amount < 0.01) {
            return { success: false, message: "Invalid payment amount." };
        }
        
        // ** (Use Case Step 7: Payment Gateway validates and processes) **
        const isTransactionSuccessful = Math.random() > 0.1; // 90% success rate

        if (isTransactionSuccessful) {
            // 2. ** (Post-conditions: Update account with new payment) **
            // await Account.recordPayment(userId, paymentDetails.amount);

            let paybacksCredited = 0;
            
            // 3. ** (Extension 6.a: Check for recycling paybacks) **
            const qualifiesForPaybacks = await this.checkPaybackEligibility(userId); 

            if (qualifiesForPaybacks) {
                // await Account.creditBalance(userId, 5.00); // Credit the account
                // await PaymentHistory.logPayback(userId, 5.00); // Log the transaction
                paybacksCredited = 5.00;
            }

            return { 
                success: true, 
                message: "Payment processed successfully.",
                paybacksCredited: paybacksCredited 
            };
        }

        return { success: false, message: "Transaction failed at gateway." };
    }

    /** Helper function to simulate payback eligibility check. */
    static async checkPaybackEligibility(userId) {
        // In a real app: checks WasteHistory for high recycling percentage/quantity
        return userId === 'someId' ? true : Math.random() > 0.5;
    }
}

module.exports = PaymentService;
