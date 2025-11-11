import execute from "./ticket";
import { API_BASE_URL } from "../config";
import axios from "axios";


//validation
export function validate() {
  return axios.get(`${API_BASE_URL}/api/v1/users/validate-token`);
}


export function getTicketsByPage(pageNo, selectedTab, selectedGroupId, ticketIdForMyTicket, issueForMyTicket, selectedSubGroupId, statusForMyTicket, pNumberForMyTicket,startDate,endDate) {
  return execute.get(
    `${API_BASE_URL}/api/v1/tickets/user-type-wise-tickets/${pageNo}?${selectedTab ? `issuer_user_type=${selectedTab}` : ""}${selectedGroupId ? `&group_id=${selectedGroupId}` : ""}${selectedSubGroupId ? `&sub_group_id=${selectedSubGroupId}` : ""}${ticketIdForMyTicket ? `&ticket_id=${ticketIdForMyTicket}` : ""}${issueForMyTicket ? `&issued_to=${issueForMyTicket}` : ""}${statusForMyTicket ? `&status=${statusForMyTicket}` : ""}${pNumberForMyTicket ? `&problematic_number=${pNumberForMyTicket}` : ""}${startDate ? `&start_date=${startDate}` : ""}${endDate ? `&end_date=${endDate}` : ""}`
  );
}

export function getAllGroups() {
  return execute.get(`${API_BASE_URL}/api/v1/groups`);
}

export function getSubGroups(id) {
  return execute.get(`${API_BASE_URL}/api/v1/groups/${id}/subgroups`);
}

export function getTicketById(id) {
  return execute.get(`${API_BASE_URL}/api/v1/tickets/get-ticket-by-id/${id}`);
}

export function postAttachmentToS3(url, formData) {
  const config = {
    "Content-Type": "multipart/form-data",
  };
  return axios.post(url, formData, config);
}


export function issueTicket(data) {
  return execute.post(`${API_BASE_URL}/api/v1/tickets/issue-ticket`, data);
}

//file upload
export function getPresignedPost(data) {
  return execute.post(
    `${API_BASE_URL}/api/v1/tickets/get-presigned-post`,
    data
  );
}

export function getForwardedTicket(page) {
  return execute.get(`${API_BASE_URL}/api/v1/tickets/forward-chain-tickets/${page}`);
}

export function forwardTicket(data) {
  return execute.post(`${API_BASE_URL}/api/v1/tickets/forward-ticket`, data);
}

export function resolveTicket(data) {
  return execute.post(`${API_BASE_URL}/api/v1/tickets/resolve-ticket`, data);
}

export function createSubGroup(groupId, data) {
  return execute.post(
    `${API_BASE_URL}/api/v1/groups/${groupId}/subgroups`,
    data
  );
}

export function deleteGroup(id) {
  return execute.delete(`${API_BASE_URL}/api/v1/groups/${id}`);
}

export function deleteSubgroup(groupId, subgroupId) {
  return execute.delete(
    `${API_BASE_URL}/api/v1/groups/${groupId}/${subgroupId}`
  );
}


export function editGroup(id, groupName) {
  const groupData = { group_name: groupName };
  return execute.put(`${API_BASE_URL}/api/v1/groups/${id}`, groupData);
}

export function editSubgroup(groupId, subgroupId, subgroup_bn, subgroup_en) {
  const subgroupData = { sub_group_bn: subgroup_bn, sub_group_en: subgroup_en };
  return execute.put(
    `${API_BASE_URL}/api/v1/groups/${groupId}/${subgroupId}`,
    subgroupData
  );
}

export function getAllSubGroups() {
  return execute.get(`${API_BASE_URL}/api/v1/groups/subgroups`);
}

export function createGroup(data) {
  return execute.post(`${API_BASE_URL}/api/v1/groups`, data);
}

export function getUser() {
  return execute.get(`${API_BASE_URL}/api/v1/users`);
}


export function report(data) {
  return execute.post(`${API_BASE_URL}/api/v1/tickets/report`, data);
}

export function deleteUser(id) {
  return execute.delete(`${API_BASE_URL}/api/v1/users/${id}`);
}

export function editUser(id, userData) {
  return execute.put(`${API_BASE_URL}/api/v1/users/${id}`, userData);
}

export function createUser(data) {
  return execute.post(`${API_BASE_URL}/api/v1/users/signup`, data);
}

export function generateOtp(data) {
  return axios.post(`${API_BASE_URL}/api/v1/users/generate-otp`, data, {
    "Content-Type": "application/json",
  });
}

export function login(data) {
  return axios.post(`${API_BASE_URL}/api/v1/users/login`, data, {
    "Content-Type": "application/json",
  });
}

export function validateAccessToken(token) {
  const config = {
    headers: { Authorization: "Bearer " + token },
  };
  return axios.get(`/api/v1/users/validate-token`, config);
} // <-- Added missing closing brace