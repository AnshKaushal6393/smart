import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const createProfile = async (payload) => (await api.post("/api/profile", payload)).data;
export const getProfile = async (profileId) => (await api.get(`/api/profile/${profileId}`)).data;
export const analyzeProfile = async (profileId) => (await api.post("/api/analysis", { profile_id: profileId })).data;
export const generateGoalPlan = async (profileId) => (await api.post("/api/goals/plan", { profile_id: profileId })).data;
