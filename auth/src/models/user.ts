import mongoose from 'mongoose';

// UserAttrs describes the properties that are required to create a user
interface UserAttrs {
  email: String;
  password: String;
}

// UserModel describes the properties of a user model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// UserDoc describes the properties of a user document
interface UserDoc extends mongoose.Document {
  email: String;
  password: String;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
