export interface TTaskCommentStoryPointsDetailsType {
  userId: string;
  commentStoryPoint: string;
}

export interface TProjectUpdatedHistoryType {
  updatedDate: Date;
  updatedData: string;
}

export interface TProjectSprintBoardTaskDetailsType {
  taskNumber: string;
  taskName: string;
  taskDescription: string;
  taskType: "Bug" | "Task";
  taskAssignedTo: string;
  taskReportedTo: string;
  taskOriginalEstimatedTime: string;
  taskCompletedTime: string;
  taskRemainingTime: string;
  isTaskParent: boolean;
  isTaskChildren: boolean;
  parentTaskNumber: string;
  parentTaskId: string;
  taskCreatedDate: Date;
  isTaskActivated: boolean;
  isTaskDeleted: boolean;
  taskBoardId: string;
  taskComments: Array<TTaskCommentStoryPointsDetailsType>;
  taskStoryPoints: Array<TTaskCommentStoryPointsDetailsType>;
}

export interface TProjectSprintBoardDetailsType {
  boardName: string;
  isBoardDeleted: boolean;
  isBoardActivated: boolean;
  boardTaskDetails: Array<TProjectSprintBoardTaskDetailsType>;
  boardCreatedDate: Date;
}

export interface TProjectSprintDetailsType {
  sprintName: string;
  sprintStartDate: Date;
  sprintEndDate: Date;
  isActiveSprint: boolean; // to check the this sprint is active or not means if this sprint is current sprint by date then its active otherwise not
  isSprintActivated: boolean;
  isSprintDeleted: boolean;
  sprintBoardDetails: Array<TProjectSprintBoardDetailsType>;
  sprintCreatedDate: Date;
}

export interface TProjectType {
  projectName: string;
  projectDescription: string;
  projectMember: Array<string>;
  projectCreatedBy: string;
  projectAdmin: string;
  projectMembers: Array<string>;
  projectEditAccess: Array<string>;
  projectCreatedDate: Date;
  projectUpdatedHistory: Array<TProjectUpdatedHistoryType>;
  isProjectDeleted: boolean;
  isProjectActivated: boolean;
  projectType: "private" | "public";
  projectRank: number;
  projectSprintDetails: Array<TProjectSprintDetailsType>;
}
