import express from 'express';
import { tokenVarify } from '../services/userService';
import {
  friendRequestAccept,
  sendFriendRequest,
  seeFriendRequest,
  friendRequestReject,
  blockMessage,
  unFriend,
} from '../controller/friendRequestController';

export const friendRequestRoutes = express.Router();

friendRequestRoutes.get('/sendRequest/:id', tokenVarify, sendFriendRequest);
friendRequestRoutes.get('/friendrequest', tokenVarify, seeFriendRequest);
friendRequestRoutes.get('/acceptRequest/:id', tokenVarify, friendRequestAccept);
friendRequestRoutes.get('/reject/:id', tokenVarify, friendRequestReject);
friendRequestRoutes.patch('/user/block/:id', tokenVarify, blockMessage);
friendRequestRoutes.get('/user/unFriend/:id', tokenVarify, unFriend);
