import mongoose, { Model } from "mongoose";

export interface TMessageType {
  chatId: string;
  contentType:
    | "image"
    | "message"
    | "emoji"
    | "video"
    | "pdf"
    | "excel"
    | "word"
    | "presentation"
    | "poll";
  content: string;
  contentDateTime: Date;
  isEdited: boolean;
  isDeleted: boolean;
  deletedMembers: Array<string>;
  contentSendFrom: string;
  isRead: Array<string>;
}

type MessageType = TMessageType & mongoose.Document;

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: false,
    default: null,
  },
  contentType: {
    type: String,
    required: false,
    enum: [
      "image",
      "message",
      "emoji",
      "video",
      "video",
      "pdf",
      "excel",
      "word",
      "presentation",
      "poll",
    ],
    default: "message",
  },
  content: {
    type: String,
    required: false,
    default: null,
  },
  contentDateTime: {
    type: Date,
    required: false,
    default: new Date(),
  },
  isEdited: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  deletedMembers: {
    type: Array<String>,
    required: false,
    default: null,
  },
  contentSendFrom: {
    type: String,
    required: false,
    default: null,
  },
  isRead: {
    type: Array<String>,
    required: false,
    default: null,
  },
});

const Message: Model<MessageType> = mongoose.model<MessageType>(
  "Message",
  MessageSchema
);

export { Message };
