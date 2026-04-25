import User from '../models/User.js';

const CEO_ACCOUNT = {
  name: 'Mr MOHAMED ABU BAKKAR M',
  email: 'mmohamedabub@gmail.com',
  password: 'abu.rkch',
  role: 'ceo',
  isActive: true
};

export const ensureCEOUser = async () => {
  try {
    const existingUser = await User.findOne({ email: CEO_ACCOUNT.email }).select('+password');

    if (!existingUser) {
      await User.create(CEO_ACCOUNT);
      console.log('✅ CEO account created:', CEO_ACCOUNT.email);
      return;
    }

    let updated = false;

    if (existingUser.name !== CEO_ACCOUNT.name) {
      existingUser.name = CEO_ACCOUNT.name;
      updated = true;
    }

    if (existingUser.role !== 'ceo') {
      existingUser.role = 'ceo';
      updated = true;
    }

    if (existingUser.isActive === false || existingUser.isDeleted) {
      existingUser.isActive = true;
      existingUser.isDeleted = false;
      existingUser.deletedAt = null;
      updated = true;
    }

    // Keep requested password in sync for this dedicated account.
    const passwordMatches = await existingUser.matchPassword(CEO_ACCOUNT.password);
    if (!passwordMatches) {
      existingUser.password = CEO_ACCOUNT.password;
      updated = true;
    }

    if (updated) {
      await existingUser.save();
      console.log('✅ CEO account updated:', CEO_ACCOUNT.email);
    } else {
      console.log('ℹ️ CEO account already up to date:', CEO_ACCOUNT.email);
    }
  } catch (error) {
    console.error('❌ Failed to ensure CEO account:', error.message);
  }
};
