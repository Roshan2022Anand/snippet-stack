import mongoose, { Schema } from 'mongoose';
import { UserType } from '@/lib/types';

const UserSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
mongoose.model<UserType>('User', UserSchema);
