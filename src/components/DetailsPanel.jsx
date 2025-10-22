"use client";

import { useState } from "react";
import { Copy, MoreVertical, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DetailsPanel() {
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Medium");

  return (
    <div className="w-full lg:w-96 bg-white p-6 shadow-none">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Details</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Accordion Sections */}
      <Accordion type="single" collapsible className="space-y-4">
        {/* Ticket Info */}
        <AccordionItem value="ticket-info">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Ticket info
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4 pt-2">
            <div>
              <label className="text-sm text-gray-600">Ticket ID:</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-sm text-gray-900">ETK714</span>
                <button className="text-gray-400 hover:text-gray-600">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Created:</label>
              <p className="mt-1 text-sm text-gray-900">20 Oct 2025</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Last message:</label>
              <p className="mt-1 text-sm text-gray-900">20 Oct 2025</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
              >
                <option>Open</option>
                <option>Closed</option>
                <option>Pending</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Rating:</label>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-900">
                Not rated
                <Info size={16} className="text-gray-400" />
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Source:</label>
              <p className="mt-1 text-sm text-gray-900">Email</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Language:</label>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-900">
                Not detected
                <Info size={16} className="text-gray-400" />
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Tags
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              + Add tag
            </button>
          </AccordionContent>
        </AccordionItem>

        {/* Custom Fields */}
        <AccordionItem value="custom-fields">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Custom fields
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2 text-center">
            <p className="text-sm font-semibold text-gray-900">
              No custom fields yet
            </p>
            <p className="mt-2 text-xs text-gray-600">
              Create your first custom field to add more useful details to your
              tickets.
            </p>
            <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
              Create custom field
            </button>
          </AccordionContent>
        </AccordionItem>

        {/* Responsibility */}
        <AccordionItem value="responsibility">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Responsibility
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">Team</p>
              <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-orange-500 text-sm font-bold text-white">
                    NI
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      NID Photo upload issue
                    </p>
                    <p className="text-xs text-gray-600">
                      1481504077@tickets.helpdesk.com
                    </p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Change
                </button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
