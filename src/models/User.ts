import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({});

export default mongoose.model<IUser>('User', UserSchema);
