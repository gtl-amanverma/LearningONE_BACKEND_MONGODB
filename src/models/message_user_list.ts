import mongoose, { Model } from "mongoose";

export interface TMessageUserType {
  chatName: string | null;
  lastestMessage: string | null;
  chatMembers: Array<String>;
  chatCreateDate: Date;
  chatDeleted: boolean;
  chatAdmin: Array<string>;
  chatType: "public" | "private";
  chatUpdatedData: {
    updatedData: string;
    date: Date;
  }[];
}

type MessageUserType = TMessageUserType & mongoose.Document;

const MessageUserSchema = new mongoose.Schema({
  chatName: {
    type: String,
    required: false,
    default: null,
  },
  lastestMessage: {
    type: String,
    required: false,
    default: null,
  },
  chatMembers: {
    type: Array<String>,
    required: false,
    default: [],
  },
  chatCreateDate: {
    type: Date,
    required: false,
    default: new Date(),
  },
  chatDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  chatAdmin: {
    type: Array<String>,
    required: false,
    default: [],
  },
  chatType: {
    type: String,
    required: false,
    enum: ["public", "private", "personal"],
    default: "personal",
  },
  chatUpdatedData: [
    {
      updatedData: {
        type: String,
        required: false,
        default: null,
      },
      date: {
        type: Date,
        required: false,
        default: new Date(),
      },
    },
  ],
  isRead: {
    type: Array<String>,
    required: false,
    default: [],
  },
});

const MessageUser: Model<MessageUserType> = mongoose.model<MessageUserType>(
  "MessageUser",
  MessageUserSchema
);

export { MessageUser };
