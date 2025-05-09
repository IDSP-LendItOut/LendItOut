import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.redirect('/login');

    const user = await prisma.user.findUnique({ where: { id: userId } });

    res.render('settings/set', { user });
  } catch (err) {
    console.error('Error loading settings:', err);
    res.status(500).send('Internal Server Error');
  }
});


export default router;
