import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import Table from "@/components/shared/Table";

export default function TicketsPage() {
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
        <Filter />
        <Pagination />
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <Table />
      </div>
    </div>
  );
}
