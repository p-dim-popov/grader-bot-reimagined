import { ProblemTypeDescription } from '@/models/ProblemTypeDescription';
import { getAxios } from '@/utils';

export const fetchMostRecentProblem = async () => {
  const response = await getAxios().get<ProblemTypeDescription>(
    '/problems/most-recent'
  );
  return response.data;
};
