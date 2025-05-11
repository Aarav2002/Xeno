import mongoose, { Document, Schema } from 'mongoose';

export interface ISegment extends Document {
  name: string;
  description: string;
  rules: {
    field: string;
    operator: string;
    value: string | number;
  }[];
  customerCount: number;
  createdAt: Date;
  lastUpdated: Date;
}

const SegmentSchema = new Schema<ISegment>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rules: [{
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
  }],
  customerCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

// Update lastUpdated before saving
SegmentSchema.pre<ISegment>('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export const Segment = mongoose.model<ISegment>('Segment', SegmentSchema); 