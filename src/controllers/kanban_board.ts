import { Request, RequestHandler, Response } from "express";
import { decodeToken } from "../utils/decode_token";
import { KanbanBoard, TTaskType, TUserType } from "../models/kanban_baord";
import { generateUniqueSixDigitId } from "../utils/generate_id";
import { getUserDetails } from "../utils/user_details";

// create project
export const createProject: RequestHandler = async (
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
        Message: "Unauthorized access.",
        Data: null,
      });
      return;
    }
    const loggedInUserDetails = await decodeToken(token as string);
    const { projectName, projectDescription, projectMembers, projectState } =
      req.body;
    const newObject = new KanbanBoard({
      projectName: projectName ? projectName : null,
      projectDescription: projectDescription ? projectDescription : null,
      projectMembers: [
        {
          userId: loggedInUserDetails.id,
          userName: loggedInUserDetails.userName,
          userEmail: loggedInUserDetails.userEmail,
          userProfileImage: null,
        },
        ...projectMembers,
      ],
      isProjectDetailsEditAccess: [loggedInUserDetails.id],
      projectCreatedBy: loggedInUserDetails.id,
      projectCreatedDate: new Date(),
      projectUpdatedDate: new Date(),
      projectUpdatedHistory: [],
      isProjectDeleted: false,
      isProjectDisabled: false,
      projectStatus: true,
      projectState: projectState ? projectState : "private",
      projectSprintDetails: [
        {
          sprintName: "Sprint 1 (Default)",
          sprintStartDate: new Date(),
          sprintEndDate: new Date().setDate(new Date().getDate() + 7),
          isActiveSprint: true,
          sprintBoardDetails: [
            {
              boardName: "TO DO",
              isDisabled: false,
              boardTasks: [],
            },
            {
              boardName: "IN PROGRESS",
              isDisabled: false,
              boardTasks: [],
            },
            {
              boardName: "TESTING",
              isDisabled: false,
              boardTasks: [],
            },
            {
              boardName: "DONE",
              isDisabled: false,
              boardTasks: [],
            },
          ],
        },
      ],
    });

    const savedProject = await newObject.save();
    if (!savedProject) {
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
      Message: "Project created successfully.",
      Data: savedProject,
    });
    return;
  } catch (error) {
    console.log("Error", error);
  }
};

// add member

// remove member

// add remove edit access of project

// add sprint

// remove sprint

// list projects only
export const listProject: RequestHandler = async (
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
        Message: "Unauthorized access.",
        Data: null,
      });
      return;
    }
    const loggedInUserDetails = await decodeToken(token as string);
    const listProject = await KanbanBoard.find({
      projectMembers: {
        $elemMatch: {
          userId: loggedInUserDetails.id,
        },
      },
    });

    if (!listProject || listProject.length < 0) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "No project list found.",
        data: [],
      });
      return;
    }
    const projects = await Promise.all(
      listProject.map(async (project) => {
        return {
          projectId: project._id,
          projectName: project.projectName,
          projectDescription: project.projectDescription,
          projectMembers: project.projectMembers,
          projectCreatedDate: project.projectCreatedDate,
          projectUpdatedDate: project.projectUpdatedDate,
          projectState: project.projectState,
        };
      })
    );
    res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Project list found successfully.",
      Data: projects,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// get details project only by Id
export const projectDetails: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.query.token;
    if (!token) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Unauthorized access.",
        Data: null,
      });
      return;
    }
    const loggedInUserDetails = await decodeToken(token as string);
    const { projectId } = req.body;
    if (!projectId) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 401,
        Message: "Unauthorized access",
        Data: null,
      });
      return;
    }
    const response = await KanbanBoard.findById(projectId);
    if (!response) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "Project not found.",
        Data: null,
      });
      return;
    }
    const kanbanboardObject = {
      projectId: response._id,
      projectName: response.projectName,
      projectDescription: response.projectDescription,
      projectMembers: response.projectMembers,
      isProjectDetailsEditAccess: response.isProjectDetailsEditAccess,
      projectCreatedBy: response.projectCreatedBy,
      projectCreatedDate: response.projectCreatedDate,
      projectUpdatedDate: response.projectUpdatedDate,
      projectUpdatedHistory: response.projectUpdatedHistory,
      isProjectDeleted: response.isProjectDeleted,
      isProjectDisabled: response.isProjectDisabled,
      projectStatus: response.projectStatus,
      projectState: response.projectState,
      projectSprintDetails: response.projectSprintDetails?.map((sprint) => {
        return {
          sprintId: sprint._id,
          sprintName: sprint.sprintName,
          sprintStartDate: sprint.sprintStartDate,
          sprintEndDate: sprint.sprintEndDate,
          isActiveSprint: sprint.isActiveSprint,
          sprintBoardDetails: sprint.sprintBoardDetails.map((board) => {
            return {
              boardId: board._id,
              boardName: board.boardName,
              isDisabled: board.isDisabled,
              boardTasks: board.boardTasks?.map((task) => {
                return {
                  id: task._id,
                  taskId: task.taskId,
                  taskName: task.taskName,
                  taskDescription: task.taskDescription,
                  taskType: task.taskType,
                  taskAssignedTo: task.taskAssignedTo,
                  taskReportedTo: task.taskReportedTo,
                  taskOriginalEstimatedTime: task.taskOriginalEstimatedTime,
                  taskCompletedTime: task.taskCompletedTime,
                  taskRemainingTime: task.taskRemainingTime,
                  taskStoryPoints: task.taskStoryPoints?.map((storypoint) => {
                    return {
                      storyPointId: storypoint._id,
                      userId: storypoint.userId,
                      storyPoint: storypoint.storyPoint,
                    };
                  }),
                  taskComments: task.taskComments?.map((comment) => {
                    return {
                      commentId: comment._id,
                      userId: comment.userId,
                      comment: comment.comment,
                    };
                  }),
                  taskStatus: task.taskStatus,
                  taskCreatedDate: task.taskCreatedDate,
                };
              }),
            };
          }),
        };
      }),
    };
    res.json({
      Type: "Success",
      Success: true,
      Status: 200,
      Message: "Message found successfully.",
      Data: kanbanboardObject,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// delete project

// update project details

// add task
export const addTaskController: RequestHandler = async (
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
        Message: "Unauthorized access.",
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
        Message: "Unauthorized access.",
        Data: null,
      });
      return;
    }
    const { projectId, sprintId, boardId } = req.body;
    if (!projectId || !sprintId || !boardId) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 403,
        Message: "Missing Field.",
        Data: null,
      });
      return;
    }
    const { taskName } = req.body;
    const project = await KanbanBoard.findById(projectId);
    if (!project) {
      res.json({
        Type: "Success",
        Success: false,
        Status: 404,
        Message: "Project not found.",
        Data: null,
      });
      return;
    }
    const newTask: TTaskType = {
      taskId: generateUniqueSixDigitId(),
      taskName: taskName,
      taskDescription: null,
      taskType: "TASK",
      taskAssignedTo: null,
      taskReportedTo: {
        userId: loggedInUserDetails.id,
        userName: loggedInUserDetails.userName,
        userEmail: loggedInUserDetails.userEmail,
        userProfileImage: null,
      },
      taskOriginalEstimatedTime: null,
      taskCompletedTime: null,
      taskRemainingTime: null,
      taskStoryPoints: [],
      taskComments: [],
      taskStatus: boardId,
      taskCreatedDate: new Date(),
    };

    const currentSprint = project.projectSprintDetails?.find(
      (sprint) => String(sprint._id) === String(sprintId)
    );
    if (!currentSprint) {
      res.json({});
      return;
    }
    const currentBoard = currentSprint.sprintBoardDetails.find(
      (board) => String(board._id) === String(boardId)
    );
    currentBoard?.boardTasks?.push(newTask);
    const savedTask = await project.save();
    if (!savedTask) {
      res.json({});
      return;
    }
    res.json({
      Type: "Success",
      Success: true,
      Status: 201,
      Message: "Success",
      Data: savedTask,
    });
    return;
  } catch (error) {
    throw new Error(error as any);
  }
};

// update task

// delete task

// comment task

// remove comment from task

// add story point

// update story point

// move task from one board to another board

// assign unassign task to member
