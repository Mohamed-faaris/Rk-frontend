import User from '../models/User.js';

const ADMIN_ACCOUNT = {
  name: 'Mr Sivasuriyan Raja',
  email: 'rajkayal7281@gmail.com',
  password: 'rajkayal2025',
  role: 'admin',
  isActive: true
};

export const ensureAdminUser = async () => {
  try {
    const existingUser = await User.findOne({ email: ADMIN_ACCOUNT.email }).select('+password');

    if (!existingUser) {
      await User.create(ADMIN_ACCOUNT);
      console.log('✅ Admin (Founder) account created:', ADMIN_ACCOUNT.email);
      return;
    }

    let updated = false;

    if (existingUser.name !== ADMIN_ACCOUNT.name) {
      existingUser.name = ADMIN_ACCOUNT.name;
      updated = true;
    }

    if (existingUser.role !== 'admin') {
      existingUser.role = 'admin';
      updated = true;
    }

    if (existingUser.isActive === false || existingUser.isDeleted) {
      existingUser.isActive = true;
      existingUser.isDeleted = false;
      existingUser.deletedAt = null;
      updated = true;
    }

    const passwordMatches = await existingUser.matchPassword(ADMIN_ACCOUNT.password);
    if (!passwordMatches) {
      existingUser.password = ADMIN_ACCOUNT.password;
      updated = true;
    }

    if (updated) {
      await existingUser.save();
      console.log('✅ Admin (Founder) account updated:', ADMIN_ACCOUNT.email);
    } else {
      console.log('ℹ️ Admin (Founder) account already up to date:', ADMIN_ACCOUNT.email);
    }
  } catch (error) {
    console.error('❌ Failed to ensure Admin (Founder) account:', error.message);
  }
};
