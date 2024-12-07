import mongoose, { Schema } from 'mongoose';
import { PostType } from '@/lib/types';

//schema for the post
const PostSchema = new Schema<PostType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
      default: '',
    },
    views: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    upVote: {
      type: Number,
      default: 0,
    },
    downVote: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post ||
mongoose.model<PostType>('Post', PostSchema);
