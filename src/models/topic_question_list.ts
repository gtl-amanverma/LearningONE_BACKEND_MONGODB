import mongoose, { Model } from "mongoose";

export interface TQuestionType {
  question: string;
  description: string;
  options: {
    answer: string;
  }[];
  correctAnswer: {
    answer: string;
  }[];
}

export interface TTopicQuestionType {
  title: string;
  description: string;
  examTime: string;
  questions: Array<TQuestionType>;
  isDeleted: boolean;
}

type TopicQuestionTyp = TTopicQuestionType & mongoose.Document;

const TopicQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    default: null,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  examTime: {
    type: String,
    required: false,
    default: null,
  },
  questions: [
    {
      question: {
        type: String,
        required: false,
        default: null,
      },
      description: {
        type: String,
        required: false,
        default: null,
      },
      options: [
        {
          answer: {
            type: String,
            required: false,
            default: null,
          },
        },
      ],
      correctAnswer: [
        {
          answer: {
            type: String,
            required: false,
            default: null,
          },
        },
      ],
    },
  ],
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const TopicQuestion: Model<TopicQuestionTyp> = mongoose.model<TopicQuestionTyp>(
  "TopicQuestion",
  TopicQuestionSchema
);

export { TopicQuestion };
