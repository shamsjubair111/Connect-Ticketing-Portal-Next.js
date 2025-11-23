"use client";

import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { FaCirclePlus } from "react-icons/fa6";
import { getAllPriorities, deletePriority } from "@/api/ticketingApis";

import AddPriorityModal from "./AddPriorityModal";
import EditPriorityModal from "./EditPriorityModal";
import DeletePriorityModal from "./DeletePriorityModal";
import PriorityList from "./PriorityList";

export default function PriorityPage() {
  const [loader, setLoader] = useState(false);
  const [priorityData, setPriorityData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPriorities, setTotalPriorities] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [paginationKey, setPaginationKey] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Fetch Priorities
  const getData = async () => {
    try {
      setLoader(true);
      const res = await getAllPriorities();

      const list = res?.data?.data || [];
      const meta = res?.data?.meta || { total: 0 };

      setPriorityData(list);
      setTotalPriorities(meta.total);
    } catch (err) {
      console.error("Error fetching priorities:", err);
      setPriorityData([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const resetToFirstPage = () => {
    setPage(1);
    setPaginationKey((prev) => prev + 1);
    getData(1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gray-50 px-6 pt-6 pb-3 flex-shrink-0">
        <div className="border border-gray-200 rounded-sm bg-white flex items-center justify-between h-[52px] px-5 w-full mb-4 shadow-sm">
          <h1 className="font-bold text-[18px] text-primary">Priority List</h1>

          <Button
            color="blue"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 text-white text-sm font-semibold cursor-pointer"
          >
            Add Priority
            <FaCirclePlus className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loader ? (
          <div className="flex items-center justify-center py-10">
            <i className="fa fa-refresh fa-spin text-2xl text-gray-500" />
          </div>
        ) : priorityData.length > 0 ? (
          <div className="flex justify-center">
            <PriorityList
              data={priorityData}
              setEditData={setEditData}
              setDeleteData={setDeleteData}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 text-gray-500">
            No priorities found.
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPriorityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={resetToFirstPage}
      />

      <EditPriorityModal
        editData={editData}
        onClose={() => setEditData(null)}
        onSuccess={() => getData(page)}
      />

      <DeletePriorityModal
        deleteData={deleteData}
        onClose={() => setDeleteData(null)}
        onSuccess={() => getData(page)}
      />
    </div>
  );
}
