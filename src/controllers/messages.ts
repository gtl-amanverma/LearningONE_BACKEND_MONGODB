import { Request, RequestHandler, Response } from "express";
import { MessageUser, TMessageUserType } from "../models/message_user_list";
import { decodeToken } from "../utils/decode_token";
import { areArraysEqual } from "../utils/match_array";
import fetch from "node-fetch";
import { Message } from "../models/messages";
import { getUserDetails } from "../utils/user_details";

// send message
export const sendMessageController: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token;
    const loggedInUserDetails = decodeToken(token as string);
    const { chatId, content, contentType } = req.body;
    if (!chatId || !content || !contentType) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing Field.",
        Data: null,
      });
      return;
    }
    const chatDetails = await MessageUser.findById(chatId);
    if (!chatDetails) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Messgae: "Chat not found.",
        Data: null,
      });
      return;
    }
    const newMessageObject = new Message({
      chatId: chatId,
      contentType: contentType ? contentType : "message",
      content: content,
      contentDateTime: new Date(),
      isEdited: false,
      isDeleted: false,
      deletedMembers: [],
      contentSendFrom: (await loggedInUserDetails).id,
      isRead: [(await loggedInUserDetails).id],
    });
    const sendMessage = await newMessageObject.save();
    if (!sendMessage) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong.",
        Data: null,
      });
      return;
    }
    await MessageUser.findByIdAndUpdate(chatId, {
      lastestMessage: content,
    });
    const message = {
      messageId: sendMessage.id,
      chatId: sendMessage.chatId,
      contentType: sendMessage.contentType,
      content: sendMessage.content,
      contentDateTime: sendMessage.contentDateTime,
      isEdited: sendMessage.isEdited,
      isDeleted: sendMessage.isDeleted,
      contentSendFrom: await getUserDetails(
        sendMessage.contentSendFrom as string,
        token as string
      ),
      isRead: sendMessage.isRead,
    };
    res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Message sent successfully.",
      Data: message,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// receive messages
export const receiveMessages: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token;
    const loggedInUserDetails = decodeToken(token as string);
    const { chatId } = req.body;
    if (!chatId) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing Field.",
        Data: null,
      });
      return;
    }
    const messages = await Message.find(
      { chatId: chatId },
      {
        isDeleted: false,
      }
    );
    if (!messages || messages.length < 0) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "Message not found",
        Data: null,
      });
      return;
    }
    const allMessages = (
      await Promise.all(
        messages.map(async (message) => {
          const userId = (await loggedInUserDetails).id;

          const isDeleted = message.deletedMembers.includes(userId);
          if (!isDeleted) {
            return {
              messageId: message.id,
              chatId: message.chatId,
              contentType: message.contentType,
              content: message.content,
              contentDateTime: message.contentDateTime,
              isEdited: message.isEdited,
              isDeleted: message.isDeleted,
              contentSendFrom: await getUserDetails(
                message.contentSendFrom as string,
                token as string
              ),
              isRead: message.isRead,
            };
          } else {
            return null;
          }
        })
      )
    ).filter((msg) => msg !== null);
    res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Fetch Successfully.",
      Data: allMessages,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// // edit message
// export const editMessage: RequestHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const token = req.query.token;
//     const loggedInUserDetails = decodeToken(token as string);
//   } catch (error) {
//     throw new Error(error as any);
//   }
// };

// // delete message
// export const deleteMessage: RequestHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const token = req.query.token;
//     const loggedInUserDetails = decodeToken(token as string);
//   } catch (error) {
//     throw new Error(error as any);
//   }
// };

// // delete message for everyone
// export const deleteMessageForEveryOne: RequestHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const token = req.query.token;
//     const loggedInUserDetails = decodeToken(token as string);
//   } catch (error) {
//     throw new Error(error as any);
//   }
// };
