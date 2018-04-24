export const Dispatched = 1;
export const Active = 3;
export const Completed = 5;
export const Deleted = 7;
export const Assigned = 9;
export const JobStateMap = {
  [Deleted]: -1,
  [Assigned]: -1,
  [Dispatched]: 0,
  [Active]: 1,
  [Completed]: 2
};

export const CustomFieldNamespaceMap = {
  job: 0,
  route: 1
};
