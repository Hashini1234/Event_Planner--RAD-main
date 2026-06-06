import { Schema, model, Types } from 'mongoose'

const budgetSchema = new Schema(
  {
    event: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
    customer: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    plannedAmount: { type: Number, min: 0 },
    actualAmount: { type: Number, min: 0 },
    vendor: { type: Types.ObjectId, ref: 'Vendor' },
    notes: String,
    paid: { type: Boolean, default: false },
  },
  { timestamps: true },
)

budgetSchema.pre('validate', function normalizeBudgetAmounts(next) {
  this.plannedAmount ??= this.amount
  this.actualAmount ??= this.amount
  this.amount ??= this.actualAmount ?? this.plannedAmount
  next()
})

export const BudgetModel = model('Budget', budgetSchema)
