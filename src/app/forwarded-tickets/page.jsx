"use client";

import { useEffect, useState } from "react";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import { getForwardedTicket } from "@/api/ticketingApis";
import { ticketColumns } from "@/utils/tableColumns";

export default function ForwardedTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch forwarded tickets
  const fetchForwardedTickets = async (pageNo) => {
    try {
      setLoading(true);
      const res = await getForwardedTicket(pageNo);

      // API returns shape: { data, total_tickets, total_pages, ... }
      setTickets(res?.data?.data || []);
      setTotalTickets(res?.data?.total_tickets || 0);
    } catch (err) {
      console.error("Error fetching forwarded tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial + page change
  useEffect(() => {
    fetchForwardedTickets(page);
  }, [page]);

  // Optional: auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchForwardedTickets(page);
    }, 30000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed top section */}
      <div className="bg-gray-50 px-6 pt-6 pb-3 flex-shrink-0">
        <div className="border border-gray-200 rounded-sm bg-white flex items-center h-[52px] px-5 w-full mb-4">
          <h3 className="font-bold text-[18px]">Forwarded Tickets</h3>
        </div>

        {/* Pagination at top */}
        <Pagination
          totalItems={totalTickets}
          itemsPerPage={10}
          onPageChange={setPage}
        />
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <Table
          data={tickets}
          loading={loading}
          columns={ticketColumns}
          reload={fetchForwardedTickets}
          page={page}
        />
      </div>
    </div>
  );
}
