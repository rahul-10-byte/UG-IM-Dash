import { Schema, model } from 'mongoose';

// Define a schema that maps to a MongoDB collection and define the shape of the documents within the selected collection.
export const influencerSchema = new Schema({
    influencerName: { type: String },
    reachedOutBy: { type: String },
    date: { type: Date },
    content: { type: String }
});

export const Influencer = model('Influencer', influencerSchema);
