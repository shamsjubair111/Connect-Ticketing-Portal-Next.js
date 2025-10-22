"use client";

import { getTicketsByPage } from "@/api/ticketingApis";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import Table from "@/components/shared/Table";
import { useEffect, useState } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([]);

  const fetchTickets = async (pageNo) => {
    setLoading(true);

    const params = buildFilterParams(); // ← create params from selected filters

    const res = await getTicketsByPage(
      pageNo,
      params.selectedTab || "", // from Ticket Type
      "", // selectedGroupId (if you have)
      params.ticketIdForMyTicket || "", // from Ticket Id
      params.issueForMyTicket || "", // from Issued To
      "", // selectedSubGroupId (if you have)
      params.statusForMyTicket || "", // from Status
      params.pNumberForMyTicket || "", // from Problematic Number
      "", // startDate (optional)
      "" // endDate (optional)
    );

    setTickets(res.data.data);
    setTotalTickets(res.data.total_tickets);
    setLoading(false);
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const buildFilterParams = () => {
    const params = {};
    filters.forEach((f) => {
      if (f.value) {
        if (f.label === "Ticket Id") params.ticketIdForMyTicket = f.value;
        else if (f.label === "Problematic Number")
          params.pNumberForMyTicket = f.value;
        else if (f.label === "Status")
          params.statusForMyTicket = f.value.toLowerCase();
        else if (f.label === "Issued To") params.issueForMyTicket = f.value;
        else if (f.label === "Ticket Type") params.selectedTab = f.value;
      }
    });
    return params;
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page, filters]);

  return (
    // Full height container
    <div className="flex flex-col h-full">
      {/* Fixed (non-scrollable) top section */}
      <div className="bg-gray-50 px-6 pt-6 pb-3 flex-shrink-0">
        {/* Title bar */}
        <div className="border border-gray-200 rounded-sm bg-white flex items-center h-[52px] px-5 w-full mb-4">
          <h3 className="font-bold text-[18px]">All recent tickets</h3>
        </div>

        {/* Filter and pagination stay fixed */}
        <Filter onFilterChange={handleFilterChange} />
        <Pagination
          totalItems={totalTickets}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <Table data={tickets} loading={loading} />
      </div>
    </div>
  );
}
