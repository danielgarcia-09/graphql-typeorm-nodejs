import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLString,
} from "graphql";
import { User } from "../../Entities/User";
import { UserType } from "../typeDefs/User";
import bcrypt from "bcryptjs";
import { MessageType } from "../typeDefs/Message";

export const CREATE_USER = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    try {
      const { name, username, password } = args;

      const encryptedPassword = await bcrypt.hash(password, 10);
      const result = await User.save({
        name,
        username,
        password: encryptedPassword,
      });

      return result;
    } catch (error) {
      return error;
    }
  },
};

export const DELETE_USER = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, { id }: any) {
    try {
      const result = await User.delete({ id });
      return result.affected === 1 ? true : false;
    } catch (error) {
      return error;
    }
  },
};

export const UPDATE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    input: {
      type: new GraphQLInputObjectType({
        name: "UserInput",
        fields: {
          name: { type: GraphQLString },
          username: { type: GraphQLString },
          oldPassword: { type: GraphQLString },
          password: { type: GraphQLString },
        },
      }),
    },
  },
  async resolve(
    parent: any,
    { id, input }: any
  ) {
    try {
      const {name, username, oldPassword, password} = input;

      const userFound = (await User.findOneBy({ id })) as User;

      if (!userFound) return { success: false, message: "User not found" };

      const isMatch = await bcrypt.compare(oldPassword, userFound.password);

      if (!isMatch) return { success: false, message: "Wrong password" };

      const newPassword = await bcrypt.hash(password, 10);

      const result = await User.update(
        { id },
        {
          name,
          username,
          password: newPassword,
        }
      );

      const isUpdated = result.affected === 1;

      return {
        success: isUpdated ? true : false,
        message: isUpdated
          ? "User updated successfully"
          : "Error with user update, retry :(",
      };
    } catch (error) {
      return error;
    }
  },
};
