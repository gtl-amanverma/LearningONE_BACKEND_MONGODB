import { Request, RequestHandler, Response } from "express";
import { decodeToken } from "../utils/decode_token";
import { TopicQuestion } from "../models/topic_question_list";

// create topic with question controller
export const createTopicQuestion: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token;
    if (!token) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field.",
        Data: null,
      });
      return;
    }
    const loggedInUserDetails = await decodeToken(token as string);
    if (!loggedInUserDetails) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unauthorized access",
        Data: null,
      });
      return;
    }
    const { topicName, topicDescription, examTime, questions } = req.body;
    if (!topicName || !topicDescription || !examTime || !questions) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field.",
        Data: null,
      });
      return;
    }
    const newObject = new TopicQuestion({
      title: topicName,
      description: topicDescription,
      examTime: examTime,
      questions: questions,
      isDeleted: false,
    });
    const savedTopic = await newObject.save();
    if (!savedTopic) {
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
      Message: "Topic created successfully.",
      Data: savedTopic,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// list all topic question controller
export const listTopicQuestion: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token;
    if (!token) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unauthorized access",
        Data: null,
      });
      return;
    }
    const loggedInUserDetails = await decodeToken(token as string);
    if (!loggedInUserDetails) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unauthorized access",
        Data: null,
      });
      return;
    }
    const list = await TopicQuestion.find({ isDeleted: false });
    if (!list || list.length < 0) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "List are empty.",
        Data: [],
      });
      return;
    }
    res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "List fetch Successfully.",
      Data: list,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// delete topic question controller
export const deleteTopicQuestion: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token;
    if (!token) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unauthorized access",
        Data: null,
      });
      return;
    }
    const loggedInUserDetails = await decodeToken(token as string);
    if (!loggedInUserDetails) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unauthorized access",
        Data: null,
      });
      return;
    }
    const { topicQuestionId } = req.body;
    if (!topicQuestionId) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing field.",
        Data: null,
      });
      return;
    }
    const deletedTopic = await TopicQuestion.findByIdAndDelete(topicQuestionId);
    if (!deletedTopic) {
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
      Message: "Topic deleted successfully.",
      Data: deletedTopic,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};
