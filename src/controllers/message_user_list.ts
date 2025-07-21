import { Request, RequestHandler, Response } from "express";
import { MessageUser, TMessageUserType } from "../models/message_user_list";
import { decodeToken } from "../utils/decode_token";
import { areArraysEqual } from "../utils/match_array";
import fetch from "node-fetch";
import { Message } from "../models/messages";
import { getUserDetails } from "../utils/user_details";

// Create Message user
export const createMessageUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token;
    const tokenData = decodeToken(token as string);
    const { chatName, chatMembers, chatType } = req.body as TMessageUserType;
    if (!chatMembers || !chatType) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field.",
        Data: null,
      });
      return;
    }

    const matchedMember = await MessageUser.find();
    let isDuplicate = false;

    for (const chat of matchedMember) {
      const existingMembers = chat.chatMembers;

      if (areArraysEqual(chatMembers, existingMembers)) {
        isDuplicate = true;
        break;
      }
    }
    if (chatType === "private" && isDuplicate) {
      res.json({
        Type: "Error",
        Success: false,
        Status: 409,
        Message: "Chat already exists with these members.",
        Data: null,
      });
      return;
    }

    const newObject = new MessageUser({
      chatName: chatName ? chatName : null,
      lastestMessage: null,
      chatMembers: chatMembers,
      chatCreateDate: new Date(),
      chatDeleted: false,
      chatAdmin: [String((await tokenData).id)],
      chatType: chatType ? chatType : "private",
      chatUpdatedData: [],
    });

    const savedMessageUser = await newObject.save();
    if (!savedMessageUser) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong.",
        Data: null,
      });
      return;
    }
    res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Chat added successfully.",
      Data: savedMessageUser,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// List of Message user
export const listMessageUsers: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token;
    const tokenData = decodeToken(token as string);
    const loggedInUserId = (await tokenData).id;
    const findMessageList = await MessageUser.find({ chatDeleted: false });
    const filteredMessage = findMessageList.filter((item) =>
      item.chatMembers.some(
        (member) => String(member) === String(loggedInUserId)
      )
    );
    if (!filteredMessage || filteredMessage.length === 0) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "Messages not found.",
        Data: null,
      });
      return;
    }
    const messageObject = await Promise.all(
      filteredMessage.map(async (item) => {
        return {
          chatId: item.id,
          chatName: item.chatName,
          lastestMessage: item.lastestMessage,
          chatMembers: await Promise.all(
            item.chatMembers.map(async (idx) => {
              const users = await getUserDetails(
                idx as string,
                token as string
              );
              return {
                id: users.id ?? null,
                userName: users.userName ?? null,
                userEmail: users.userEmail ?? null,
                userGender: users.userGender ?? null,
                userRole: users.userRole ?? null,
              };
            })
          ),
          chatCreateDate: item.chatCreateDate,
          chatDeleted: item.chatDeleted,
          chatAdmin: await Promise.all(
            item.chatAdmin.map(async (idx) => {
              const users = await getUserDetails(
                idx as string,
                token as string
              );
              return {
                id: users.id ?? null,
                userName: users.userName ?? null,
                userEmail: users.userEmail ?? null,
                userGender: users.userGender ?? null,
                userRole: users.userRole ?? null,
              };
            })
          ),
          chatType: item.chatType,
          chatUpdatedData: item.chatUpdatedData,
        };
      })
    );
    res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Messages Fetched successfully.",
      Data: messageObject,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// Permanent Delete chat/group message users
export const permanentDeleteMessageUser: RequestHandler = async (
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
        Message: "Missing field.",
        Data: null,
      });
      return;
    }
    const findChat = await MessageUser.findById(chatId);
    const ValidUserChat = findChat?.chatMembers.includes(
      (await loggedInUserDetails).id
    );
    if (!ValidUserChat) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Not authorize to delete.",
        Data: null,
      });
      return;
    }
    const deletedChat = await MessageUser.findByIdAndDelete(chatId);
    const deleteMessage = await Message.deleteMany({ chatId: chatId });
    if (!deleteMessage && !deletedChat) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong.",
        Data: null,
      });
      return;
    }
    res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Chat deleted successfully.",
      Data: null,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// Temporary delete chat/group message users
export const temporaryDeleteMessageUser: RequestHandler = async (
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
        Message: "Missing field.",
        Data: null,
      });
      return;
    }
    const findChat = await MessageUser.findById(chatId);
    const ValidUserChat = findChat?.chatMembers.includes(
      (await loggedInUserDetails).id
    );
    if (!ValidUserChat) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Not authorize to delete.",
        Data: null,
      });
      return;
    }
    const deletedChat = await MessageUser.findByIdAndUpdate(chatId, {
      chatDeleted: true,
    });
    if (!deletedChat) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Something went wrong.",
        Data: null,
      });
      return;
    }
    res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Chat deleted successfully.",
      Data: null,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// // Add admin from group
// export const makeAdmin: RequestHandler = async (
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

// // Remove admin from group
// export const removeAdmin: RequestHandler = async (
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

// // Add user in group
// export const addUserGroup: RequestHandler = async (
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

// // Remove user from group
// export const removeUserGroup: RequestHandler = async (
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
