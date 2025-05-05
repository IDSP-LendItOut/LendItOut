import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const conversations = await prisma.conversation.findMany({
      include: {
        participants: true,
        listing: {
          include: {
            media: true, 
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  
    res.render('messages/index', {
      title: 'Messages',
      conversations,
      showSearchbar: false,

    });
});

router.get('/:id', async (req, res) => {
  const userId = 1; // temporary

  const conversationId = parseInt(req.params.id);

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: true,
      listing: {
        include: {
          media: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: true },
      },
    },
  });
  if (!conversation) {
     res.status(404).send('Conversation not found');
  }
  const receiver = conversation?.participants.find(p => p.id !== userId);
  const receiverId = receiver?.id || null;

  res.render('messages/show', {
    title: 'Messages',
    conversation,
    userId,
    receiverId,
    layout: false
  });
});



router.post('/:id/send', express.json(), async (req, res, next) => {
  try {
    const userId = 1;
    const conversationId = parseInt(req.params.id);
    const { text } = req.body;

    if (!text || !conversationId) {
      res.status(400).json({ error: 'Invalid' });
      return;
    }

    const message = await prisma.message.create({
      data: {
        text,
        conversationId,
        senderId: userId
      }
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
});


export default router;
