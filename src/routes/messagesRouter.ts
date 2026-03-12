import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();



const mockUserId = '68257d5bf3a70e053f9545ba';

router.get('/', async (req, res) => {
  try {
    const userConversations = await prisma.userConversation.findMany({
      where: { userId: mockUserId },
      include: {
        conversation: {
          include: {
            listing: {
              include: { media: true }
            },
            participants: {
              include: { user: true }
            }
          }
        }
      }
    });

    // Extract conversations and fetch latest message for each
    const conversations = await Promise.all(userConversations.map(async (uc) => {
      const { conversation } = uc;
    
      const lastMessage = await prisma.message.findFirst({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'desc' },
      });
    
      return {
        id: conversation.id,
        listing: conversation.listing,
        participants: conversation.participants,
        messages: lastMessage ? [lastMessage] : [],
      };
    }));
    

    res.render('messages/index', {
      title: 'Messages',
      conversations,
      showSearchbar: false,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading messages');
  }
});


router.get('/:id', async (req, res) => {
  try {
    const conversationId = req.params.id;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        listing: {
          include: { media: true }
        },
        participants: {
          include: { user: true }
        }
      }
    });


    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });

    const receiver = conversation?.participants
    ?.map(p => p.user)
    .find(user => user.id !== mockUserId) || null;
  

    res.render('messages/show', {
      title: 'Messages',
      conversation: { ...conversation, messages },
      userId: mockUserId,
      receiverId: receiver?.id || null,
      layout: false
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load conversation');
  }
});

router.post('/:id/send', express.json(), async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { text } = req.body;

    const message = await prisma.message.create({
      data: {
        text,
        senderId: mockUserId,
        conversationId,
      }
    });

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send message');
  }
});


export default router;
