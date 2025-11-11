"use client";

import { useEffect, useState } from "react";
import { getTicketsByPage } from "@/api/ticketingApis";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import Table from "@/components/shared/Table";
import { useTicketContext } from "@/context/TicketContext";
import { ticketColumns } from "@/utils/tableColumns";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const { selectedItem } = useTicketContext();

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  // ✅ Build query params based on selected filters
  const buildFilterParams = () => {
    const params = {};
    filters.forEach((f) => {
      if (f.value) {
        switch (f.label) {
          case "Ticket Id":
            params.ticketIdForMyTicket = f.value;
            break;
          case "Problematic Number":
            params.pNumberForMyTicket = f.value;
            break;
          case "Status":
            params.statusForMyTicket = f.value.toLowerCase();
            break;
          case "Issued To":
            params.issueForMyTicket = f.value;
            break;
          case "Ticket Type":
            params.selectedTab = f.value;
            break;
          case "Group":
            params.selectedGroupId = f.value;
            break;
          case "Subgroup":
            params.selectedSubGroupId = f.value;
            break;
          case "Start Date":
            params.startDate = f.value;
            break;
          case "End Date":
            params.endDate = f.value;
            break;
          default:
            break;
        }
      }
    });
    return params;
  };

  const fetchTickets = async (pageNo) => {
    const params = buildFilterParams();
    setLoading(true);

    try {
      const res = await getTicketsByPage(
        pageNo,
        params.selectedTab || "",
        params.selectedGroupId || "",
        params.ticketIdForMyTicket || "",
        params.issueForMyTicket || "",
        params.selectedSubGroupId || "",
        params.statusForMyTicket || "",
        params.pNumberForMyTicket || "",
        params.startDate || "",
        params.endDate || ""
      );

      setTickets(res.data.data);
      setTotalTickets(res.data.total_tickets);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounce ticket API calls on filter change
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTickets(page);
    }, 700); // wait 700ms after last filter change
    return () => clearTimeout(debounce);
  }, [page, filters]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-50 px-6 pt-6 pb-3 flex-shrink-0">
        <div className="border border-gray-200 rounded-sm bg-white flex items-center h-[52px] px-5 w-full mb-4">
          <h3 className="font-bold text-[18px]">All recent tickets</h3>
        </div>

        <Filter onFilterChange={handleFilterChange} />
        <Pagination
          totalItems={totalTickets}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <Table data={tickets} loading={loading} columns={ticketColumns} />
      </div>
    </div>
  );
}
