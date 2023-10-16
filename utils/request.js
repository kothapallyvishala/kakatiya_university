import axios from "axios";
import { server } from "../config";
import { getErrMessage } from "./error";

export const registeruser = async (payload) => {
  try {
    const res = await axios.post("/api/signup", payload);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const askForApproval = async (payload) => {
  try {
    const res = await axios.post("/api/user/approval", payload);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const updateuser = async (payload) => {
  try {
    const res = await axios.put(`/api/user/${payload.uid}`, payload);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const deleteuser = async (id) => {
  try {
    const res = await axios.delete(`/api/user/${id}`);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getuser = async (id) => {
  try {
    const res = await axios.get(`${server}/api/user/${id}`);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const postClass = async (payload) => {
  try {
    const res = await axios.post(`/api/classlink`, payload);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getClasses = async (branchString) => {
  try {
    const res = await axios.get(`${server}/api/classlink?${branchString}`);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getClass = async (id) => {
  try {
    const res = await axios.get(`${server}/api/classlink/${id}`);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getUserClassLinks = async (id) => {
  try {
    const res = await axios.get(`${server}/api/user/classlink/${id}`);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getUnapprovedFacultyDetails = async () => {
  try {
    const res = await axios.get(`${server}/api/user/approval`);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const updateClassLink = async (payload) => {
  try {
    const res = await axios.put(
      `${server}/api/classlink/${payload.id}`,
      payload
    );
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const deleteClassLink = async (payload) => {
  try {
    const res = await axios.delete(`${server}/api/classlink/${payload.id}`, {
      data: payload
    });
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getAssignments = async () => {
  try {
    const res = await axios.get(`${server}/api/assignments`);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getAssignment = async (id, submitId) => {
  try {
    let res;
    if (submitId) {
      res = await axios.get(
        `${server}/api/assignments/${id}?submission=${submitId}`
      );
    } else {
      res = await axios.get(`${server}/api/assignments/${id}`);
    }
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const getSubmission = async (id, submitId) => {
  try {
    const res = await axios.get(
      `${server}/api/assignments/${id}?submission=${submitId}`
    );
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const postAssignment = async (payload) => {
  try {
    const res = await axios.post(`/api/assignments`, payload);
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const updateAssignment = async (payload) => {
  try {
    const res = await axios.put(
      `${server}/api/assignments/${payload.id}`,
      payload
    );
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};

export const deleteAssignment = async (payload) => {
  try {
    const res = await axios.delete(`${server}/api/assignments/${payload.id}`, {
      data: payload
    });
    return res.data;
  } catch (error) {
    return getErrMessage(error);
  }
};
