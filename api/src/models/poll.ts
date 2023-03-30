import mongoose, { Schema } from 'mongoose';

export interface PollInput {
  prompt: string;
  options: {
    title: string;
  }[];
  author: string;
}

export interface OptionsDocument extends mongoose.Document {
  title: string;
  votes: number;
}

export interface PollDocument extends mongoose.Document {
  prompt: string;
  options: OptionsDocument[];
  author: string;
  totalVoteCount: number;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

const optionsSchema = new Schema({
  title: { type: String, required: true },
  votes: { type: Number, required: true, default: 0 },
});

export const pollSchema = new Schema(
  {
    prompt: { type: String, required: true },
    author: { type: String, required: true },
    options: [optionsSchema],
    totalVoteCount: { type: Number, require: true, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const Polls = mongoose.model('Polls', pollSchema);
