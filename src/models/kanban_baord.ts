import mongoose, { Model } from "mongoose";

export interface TUserType {
  userId: string;
  userName: string;
  userEmail: string;
  userProfileImage: string | null;
}

export interface TTaskStoryPointType {
  _id: string;
  userId: string;
  storyPoint: string;
}

export interface TTaskCommentType {
  _id: string;
  userId: string;
  comment: string;
}

export interface TTaskType {
  _id?: string;
  taskId: number;
  taskName: string | null;
  taskDescription: string | null;
  taskType: string | null;
  taskAssignedTo: TUserType | null;
  taskReportedTo: TUserType | null;
  taskOriginalEstimatedTime: string | number | null;
  taskCompletedTime: String | number | null;
  taskRemainingTime: String | number | null;
  taskStoryPoints: Array<TTaskStoryPointType> | null;
  taskComments: Array<TTaskCommentType> | null;
  taskStatus: string | null;
  taskCreatedDate: Date;
}

export interface TBoardType {
  _id: string;
  boardName: string | null;
  isDisabled: boolean;
  boardTasks: Array<TTaskType> | null;
}

export interface TSprintType {
  _id: string;
  sprintName: string;
  sprintStartDate: Date;
  sprintEndDate: Date;
  isActiveSprint: boolean;
  sprintBoardDetails: Array<TBoardType>;
}

export interface TProjectType {
  projectName: string | null;
  projectDescription: string | null;
  projectMembers: Array<TUserType> | null;
  isProjectDetailsEditAccess: Array<string> | null;
  projectCreatedBy: string | null;
  projectCreatedDate: Date | null;
  projectUpdatedDate: Array<Date> | null;
  projectUpdatedHistory: Array<string> | null;
  isProjectDeleted: boolean;
  isProjectDisabled: boolean;
  projectStatus: boolean;
  projectState: "public" | "private";
  projectSprintDetails: Array<TSprintType> | null;
}

type KanbanBoardType = TProjectType & mongoose.Document;

const KanbanBoardSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: false,
    default: null,
  },
  projectDescription: {
    type: String,
    required: false,
    default: null,
  },
  projectMembers: [
    {
      userId: {
        type: String,
        required: false,
        default: null,
      },
      userName: {
        type: String,
        required: false,
        default: null,
      },
      userEmail: {
        type: String,
        required: false,
        default: null,
      },
      userProfileImage: {
        type: String,
        required: false,
        default: null,
      },
    },
  ],
  isProjectDetailsEditAccess: {
    type: Array<String>,
    required: false,
    default: [],
  },
  projectCreatedBy: {
    type: String,
    required: false,
    default: null,
  },
  projectCreatedDate: {
    type: Date,
    required: false,
    default: new Date(),
  },
  projectUpdatedDate: {
    type: Date,
    required: false,
    default: new Date(),
  },
  projectUpdatedHistory: {
    type: Array<String>,
    required: false,
    default: null,
  },
  isProjectDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  isProjectDisabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  projectStatus: {
    type: Boolean,
    required: false,
    default: true,
  },
  projectState: {
    type: String,
    required: false,
    enum: ["public", "private"],
    default: "private",
  },
  projectSprintDetails: [
    {
      sprintName: {
        type: String,
        required: false,
        default: null,
      },
      sprintStartDate: {
        type: Date,
        required: false,
        default: new Date(),
      },
      sprintEndDate: {
        type: Date,
        required: false,
        default: new Date(),
      },
      isActiveSprint: {
        type: Boolean,
        required: false,
        default: true,
      },
      sprintBoardDetails: [
        {
          boardName: {
            type: String,
            required: false,
            default: null,
          },
          isDisabled: {
            type: Boolean,
            required: false,
            default: false,
          },
          boardTasks: [
            {
              taskName: {
                type: String,
                required: false,
                default: null,
              },
              taskDescription: {
                type: String,
                required: false,
                default: null,
              },
              taskType: {
                type: String,
                required: false,
                default: null,
              },
              taskAssignedTo: {
                userId: {
                  type: String,
                  required: false,
                  default: null,
                },
                userName: {
                  type: String,
                  required: false,
                  default: null,
                },
                userEmail: {
                  type: String,
                  required: false,
                  default: null,
                },
                userProfileImage: {
                  type: String,
                  required: false,
                  default: null,
                },
              },
              taskReportedTo: {
                userId: {
                  type: String,
                  required: false,
                  default: null,
                },
                userName: {
                  type: String,
                  required: false,
                  default: null,
                },
                userEmail: {
                  type: String,
                  required: false,
                  default: null,
                },
                userProfileImage: {
                  type: String,
                  required: false,
                  default: null,
                },
              },
              taskOriginalEstimatedTime: {
                type: String,
                required: false,
                default: null,
              },
              taskCompletedTime: {
                type: String,
                required: false,
                default: null,
              },
              taskRemainingTime: {
                type: String,
                required: false,
                default: null,
              },
              taskStoryPoints: [
                {
                  userId: {
                    type: String,
                    required: false,
                    default: null,
                  },
                  storyPoint: {
                    type: String,
                    required: false,
                    default: null,
                  },
                },
              ],
              taskComments: [
                {
                  userId: {
                    type: String,
                    required: false,
                    default: null,
                  },
                  comment: {
                    type: String,
                    required: false,
                    default: null,
                  },
                },
              ],
              taskStatus: {
                type: String,
                required: false,
                default: null,
              },
              taskCreatedDate: {
                type: Date,
                required: false,
                default: new Date(),
              },
            },
          ],
        },
      ],
    },
  ],
});

const KanbanBoard: Model<KanbanBoardType> = mongoose.model<KanbanBoardType>(
  "KanbanBoard",
  KanbanBoardSchema
);

export { KanbanBoard };
