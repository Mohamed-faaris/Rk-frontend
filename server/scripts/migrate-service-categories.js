import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Portfolio from '../models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support both server/.env and workspace-root .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const projectCategoryMap = {
  'Web Development': 'Website Development',
  Branding: 'Branding Designs',
  Marketing: 'Social Media Designs'
};

const portfolioCategoryMap = {
  'Web Design': 'Website Design',
  Branding: 'Branding Designs',
  Photography: 'Photoshop Services',
  'UI/UX': 'UI/UX Design',
  Development: 'Website Development'
};

const migrateCollection = async (Model, mapping, label) => {
  let totalUpdated = 0;

  for (const [oldCategory, newCategory] of Object.entries(mapping)) {
    const result = await Model.updateMany(
      { category: oldCategory },
      { $set: { category: newCategory } }
    );

    const updated = result.modifiedCount || 0;
    totalUpdated += updated;

    if (updated > 0) {
      console.log(`[${label}] ${oldCategory} -> ${newCategory}: ${updated} updated`);
    }
  }

  console.log(`[${label}] Total updated: ${totalUpdated}`);
  return totalUpdated;
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const projectUpdates = await migrateCollection(Project, projectCategoryMap, 'Project');
  const portfolioUpdates = await migrateCollection(Portfolio, portfolioCategoryMap, 'Portfolio');

  console.log(`Migration complete. Total records updated: ${projectUpdates + portfolioUpdates}`);
};

run()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Migration failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  });
