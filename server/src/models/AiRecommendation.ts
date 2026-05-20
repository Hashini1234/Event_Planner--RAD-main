import { Schema, model, Types } from 'mongoose'

const aiRecommendationSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: Types.ObjectId, ref: 'Event', index: true },
    type: {
      type: String,
      enum: ['budget', 'vendor', 'checklist', 'seating', 'planning'],
      required: true,
    },
    prompt: { type: String, required: true },
    response: { type: Schema.Types.Mixed, required: true },
    model: String,
  },
  { timestamps: true },
)

export const AiRecommendationModel = model('AiRecommendation', aiRecommendationSchema)
