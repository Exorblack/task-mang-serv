import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument , Document} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {

  @Prop()
  name: string;

  @Prop({unique:[true , 'Duplicate email']})
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);