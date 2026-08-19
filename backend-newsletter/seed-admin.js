import bcrypt from 'bcrypt';
import sequelize from './config/database.js';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie pour le seeding.');

    const identifiant = 'admin';
    const motDePasse = 'adminpassword123'; // Le mot de passe clair
    const hashedPassword = await bcrypt.hash(motDePasse, 10); // Hachage avec un salt de 10

    // Utilisation d'upsert pour créer ou mettre à jour l'admin
    const [admin, created] = await Admin.upsert({
      identifiant: identifiant,
      motDePasse: hashedPassword, // Stocke le mot de passe haché
    }, {
      where: { identifiant: identifiant }, // Critère pour la mise à jour
      returning: true, // Retourne l'instance créée ou mise à jour
    });

    if (created) {
      console.log(`Admin '${identifiant}' créé avec succès !`);
    } else {
      console.log(`Admin '${identifiant}' mis à jour avec succès !`);
    }

  } catch (error) {
    console.error('Erreur lors du seeding de l\'admin :', error);
  } finally {
    await sequelize.close();
    console.log('Connexion à la base de données fermée.');
  }
};

seedAdmin();
