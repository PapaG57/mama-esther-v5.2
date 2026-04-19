import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

const lookup = promisify(dns.lookup);
let uri = process.env.POSTGRES_URI;

// 🚀 Hack IPv4 pour Render + Supabase
if (uri && uri.includes('supabase.co')) {
  try {
    const url = new URL(uri);
    // On force la résolution DNS en IPv4 (family: 4)
    const { address } = await lookup(url.hostname, { family: 4 });
    console.log(`🌐 DNS Resolution (IPv4): ${url.hostname} -> ${address}`);
    url.hostname = address;
    uri = url.toString();
  } catch (err) {
    console.error("❌ Échec de la résolution DNS IPv4 :", err.message);
  }
}

if (!uri) {
  console.error("❌ ERREUR : La variable POSTGRES_URI est manquante.");
}

const sequelize = new Sequelize(uri || 'postgres://localhost:5432/fallback', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;
