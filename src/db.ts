import { DataSource } from "typeorm";
import { User } from "./Entities/User";

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '0913',
    entities: [User],
    database: 'graphql-typeorm',
    synchronize: false,
    logging: true,
    ssl: false
})

export const connectDB = async() => {
    await AppDataSource.initialize();
}