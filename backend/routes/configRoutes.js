const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
const { protect } = require('../middleware/auth');
const Admin = require('../models/Admin');
const SiteConfig = require('../models/SiteConfig');

// --- Existing config routes ---
router.get('/', getConfig);
router.put('/', protect, updateConfig);

// --- TEMPORARY: Secure admin seed route ---
// POST /api/config/seed-admin?token=SECRET
router.post('/seed-admin', async (req, res) => {
  const seedToken = process.env.SEED_ADMIN_TOKEN;
  if (!seedToken || req.query.token !== seedToken) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing admin credentials in env' });
    }
    // Remove all other admins
    await Admin.deleteMany({ email: { $ne: email } });
    // Upsert the single admin
    let admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      admin = await Admin.create({
        email,
        password,
        name: 'Gyanaranjan Das',
        role: 'superadmin',
      });
    } else {
      admin.password = password;
      admin.name = 'Gyanaranjan Das';
      admin.role = 'superadmin';
      await admin.save();
    }
    // Optionally seed SiteConfig if not present (optional, safe to skip if not needed)
    const existingConfig = await SiteConfig.findOne();
    if (!existingConfig) {
      await SiteConfig.create({
        heroTitle: 'GYANARANJAN DAS',
        heroSubtitle: 'Full-Stack MERN Developer',
        aboutText: 'Gyanaranjan Das, a full-stack developer based in India, crafts immersive digital experiences that blend clean architecture with striking design. His work transforms complex problems into seamless, high-performance web applications that connect users with technology.',
        socialLinks: {
          github: 'https://github.com/gyanaranjan-das',
          linkedin: 'https://www.linkedin.com/in/gyanaranjan-das/',
          instagram: 'https://www.instagram.com/gyanlabs.io/',
          email: 'gyanlabs.io@gmail.com',
        },
      });
    }
    res.json({ message: 'Admin seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

module.exports = router;
