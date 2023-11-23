import express, { Response } from 'express';
import { tokenVarify } from '../services/userService';
import { mesageValidation } from '../middleware/messageValidation';
import {
  sendMessage,
  seeMessages,
  deleteChats,
  deleteAllChat,
  editmessage,
} from '../controller/messageController';

export const messageRoutes = express.Router();

messageRoutes.post(
  '/conversation/message/:id',
  tokenVarify,
  mesageValidation,
  sendMessage,
);
messageRoutes.get('/conversation/chat', (_, res: Response) => {
  res.render('message');
});

messageRoutes.get('/chat', (_, res: Response) => {
  res.render('test');
});

messageRoutes.get('/conversation/message/:id', tokenVarify, seeMessages);
messageRoutes.delete('/conversation/message/:id', tokenVarify, deleteChats);
messageRoutes.put('/conversation/message/edit/:id', tokenVarify, editmessage);

messageRoutes.delete(
  '/conversation/message/allchat/:id',
  tokenVarify,
  deleteAllChat,
);
