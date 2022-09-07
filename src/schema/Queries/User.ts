import { GraphQLList, GraphQLID } from "graphql";
import { User } from "../../Entities/User";
import { UserType } from "../typeDefs/User";

export const GET_ALL_USERS = {
  type: GraphQLList(UserType),
  async resolve() {
    try {
      return await User.find();
    } catch (error) {
      return error;
    }
  },
};

export const GET_USER = {
    type: UserType,
    args: {
        id: { type: GraphQLID }
    },
    async resolve( parent: any, args: any) {
        try{
            const { id } = args;
            return await User.findOneBy({ id });    
        } catch( error ) {
            return error;
        } 
    }
}