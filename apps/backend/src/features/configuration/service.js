// Billing Strategy Pattern for computing charges
// Interface: strategy.calculate({ weightKg?: number }): number

class FlatFeeStrategy {
  constructor(rate = 0) {
    this.rate = typeof rate === 'number' ? rate : 0;
  }
  calculate(_ctx = {}) {
    return this.rate;
  }
}

class WeightBasedStrategy {
  constructor(ratePerKg = 0) {
    this.ratePerKg = typeof ratePerKg === 'number' ? ratePerKg : 0;
  }
  calculate(ctx = {}) {
    const weight = typeof ctx.weightKg === 'number' ? ctx.weightKg : 0;
    return this.ratePerKg * weight;
  }
}

// Select strategy from configuration document
// We treat the first billingModels[0] as the active model
function selectBillingStrategy(systemConfig) {
  const model = Array.isArray(systemConfig?.billingModels) ? systemConfig.billingModels[0] : null;
  const name = String(model?.name || '').toLowerCase();
  const rate = typeof model?.rate === 'number' ? model.rate : 0;
  if (name === 'weight' || name === 'weight-based' || name === 'weightbased') {
    return new WeightBasedStrategy(rate);
  }
  // default to flat
  return new FlatFeeStrategy(rate);
}

module.exports = { FlatFeeStrategy, WeightBasedStrategy, selectBillingStrategy };
