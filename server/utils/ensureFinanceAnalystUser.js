import User from '../models/User.js';

const FINANCE_ANALYST_ACCOUNT = {
  name: 'Mr VISWA GURU PRASATH J',
  email: 'viswaguruofficial7@gmail.com',
  password: 'vgp.rkch',
  role: 'finance_analyst',
  isActive: true
};

export const ensureFinanceAnalystUser = async () => {
  try {
    const existingUser = await User.findOne({ email: FINANCE_ANALYST_ACCOUNT.email }).select('+password');

    if (!existingUser) {
      await User.create(FINANCE_ANALYST_ACCOUNT);
      console.log('✅ Finance Analyst account created:', FINANCE_ANALYST_ACCOUNT.email);
      return;
    }

    let updated = false;

    if (existingUser.name !== FINANCE_ANALYST_ACCOUNT.name) {
      existingUser.name = FINANCE_ANALYST_ACCOUNT.name;
      updated = true;
    }

    if (existingUser.role !== 'finance_analyst') {
      existingUser.role = 'finance_analyst';
      updated = true;
    }

    if (existingUser.isActive === false || existingUser.isDeleted) {
      existingUser.isActive = true;
      existingUser.isDeleted = false;
      existingUser.deletedAt = null;
      updated = true;
    }

    const passwordMatches = await existingUser.matchPassword(FINANCE_ANALYST_ACCOUNT.password);
    if (!passwordMatches) {
      existingUser.password = FINANCE_ANALYST_ACCOUNT.password;
      updated = true;
    }

    if (updated) {
      await existingUser.save();
      console.log('✅ Finance Analyst account updated:', FINANCE_ANALYST_ACCOUNT.email);
    } else {
      console.log('ℹ️ Finance Analyst account already up to date:', FINANCE_ANALYST_ACCOUNT.email);
    }
  } catch (error) {
    console.error('❌ Failed to ensure Finance Analyst account:', error.message);
  }
};
