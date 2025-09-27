// /assessment_engine/frontend/services/api.ts

import axios from 'axios';
import { Assessment, FinalReport, SubmissionPayload, UserDemographics, AvailableAssessment } from '../types/assessment';

const apiClient = axios.create({
  baseURL: 'http://localhost:8069/assessment',
});

export const listAssessments = async (): Promise<AvailableAssessment[]> => {
  const response = await apiClient.get('/list');
  return response.data;
};

export const startAssessment = async (assessmentId: string, demographics: UserDemographics): Promise<Assessment> => {
  const response = await apiClient.post(`/start/${assessmentId}`, demographics);
  return response.data;
};

export const submitAssessment = async (assessmentId: string, submission: SubmissionPayload): Promise<FinalReport> => {
  const response = await apiClient.post(`/submit/${assessmentId}`, submission);
  return response.data;
};