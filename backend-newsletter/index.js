import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connexion réussie à MongoDB Atlas');
  mongoose.connection.close();
})
.catch(err => {
  console.error('❌ Erreur de connexion :', err.message);
});