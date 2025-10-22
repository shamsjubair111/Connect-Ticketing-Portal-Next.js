import axios from "axios";
import execute from "./tixket";
import { API_BASE_URL } from "../config";


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