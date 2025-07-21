import {
  createMessageUser,
  listMessageUsers,
  permanentDeleteMessageUser,
  temporaryDeleteMessageUser,
} from "../../controllers/message_user_list";
import express from "express";
import {
  receiveMessages,
  sendMessageController,
} from "../../controllers/messages";
import {
  createTopicQuestion,
  deleteTopicQuestion,
  listTopicQuestion,
} from "../../controllers/topic_question_list";
import {
  addTaskController,
  createProject,
  listProject,
  projectDetails,
} from "../../controllers/kanban_board";

const route = express.Router();

// Chat/Message
route.route("/create-message-user").post(createMessageUser);
route.route("/list-message-user").get(listMessageUsers);
route.route("/delete-chat").post(temporaryDeleteMessageUser);
route.route("/permanent-delete-chat").post(permanentDeleteMessageUser);
route.route("/send-message").post(sendMessageController);
route.route("/receive-message").post(receiveMessages);

// quizz
route.route("/create-topic-question").post(createTopicQuestion);
route.route("/list-topic-question").post(listTopicQuestion);
route.route("/delete-topic-question").post(deleteTopicQuestion);

// Kanban board
route.route("/create-project").post(createProject);
route.route("/list-projects").get(listProject);
route.route("/details-project").post(projectDetails);
route.route("/add-task").post(addTaskController);

export { route };
