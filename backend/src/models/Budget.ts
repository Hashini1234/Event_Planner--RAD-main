import { Schema, model, Types } from 'mongoose'

const budgetSchema = new Schema(
  {
    event: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
    category: { type: String, required: true, index: true },
    title: { type: String, required: true },
    plannedAmount: { type: Number, required: true, min: 0 },
    actualAmount: { type: Number, default: 0, min: 0 },
    vendor: { type: Types.ObjectId, ref: 'Vendor' },
    notes: String,
    paid: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const BudgetModel = model('Budget', budgetSchema)
