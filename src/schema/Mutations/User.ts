import { GraphQLBoolean, GraphQLID, GraphQLString } from "graphql";
import { User } from "../../Entities/User";
import { UserType } from "../typeDefs/User";
import bcrypt from 'bcryptjs';

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
    id: {type: GraphQLID}
  },
  async resolve(parent: any, { id }: any) {
    try {
      const result = await User.delete({ id })
      return result.affected === 1 ? true : false;      
    } catch (error) {
      return error
    }
  }
}

export const UPDATE_USER = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve( parent: any, { id, name, username, oldPassword, password }: any) {
    try {
      const userFound = await User.findOne(id) as User;
      
      const isMatch = await bcrypt.compare(oldPassword, userFound.password);

      if(!isMatch) return false;

      const newPassword = await bcrypt.hash(password, 10);
      
      const result = await User.update({id}, {
        name,
        username,
        password : newPassword
      });

      return result.affected === 1 ? true : false;
      
    } catch (error) {
      return error;
    }
  }
}