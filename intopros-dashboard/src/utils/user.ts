export const getUserProfileCompletion = (
  userDetails: any,
  profileWeightage: any
) => {
  let completionValue = 0;

  if (userDetails?.firstName)
    completionValue += profileWeightage?.basicInfo ?? 0;

  if (userDetails?.about) completionValue += profileWeightage?.about ?? 0;

  return completionValue;
};
