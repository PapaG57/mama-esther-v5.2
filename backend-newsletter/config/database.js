import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false, // Passer à console.log pour le debug
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Requis pour Supabase/Render
    }
  }
});

export default sequelize;
