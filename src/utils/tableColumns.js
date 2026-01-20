export const ticketColumns = [
  {
    label: "REQUESTER",
    value: "issuer_number",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-semibold">
          {row?.issuer_user_type?.slice(0, 2).toUpperCase() || "NA"}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row?.issuer_user_type === "customer"
              ? "Customer"
              : row?.issuer_user_type === "cc"
              ? "CC"
              : "Unknown"}
          </div>
          <div className="text-xs text-gray-500">{row?.issuer_number}</div>
        </div>
      </div>
    ),
  },
  {
    label: "SUBJECT",
    value: "title",
    render: (row) => (
      <div className="flex items-start gap-2">
        <span className="text-sm text-gray-700 line-clamp-2">{row?.title}</span>
      </div>
    ),
  },
  {
    label: "AGENT",
    value: "group_name",
    render: (row) => (
      <span className="text-sm text-gray-700">
        {row?.agent?.agent_name || "Unassigned"}
      </span>
    ),
  },
  {
    label: "STATUS",
    value: "ticket_status",
    render: (row) => (
      <span
        className={`text-sm font-medium ${
          row?.ticket_status === "open"
            ? "text-blue-700"
            : row?.ticket_status === "in_progress"
            ? "text-green-700"
            : "text-red-700"
        }`}
      >
        {row?.ticket_status === "open"
          ? "Open"
          : row?.ticket_status === "in_progress"
          ? "In Progress"
          : "Solved"}
      </span>
    ),
  },
  {
    label: "LAST MESSAGE",
    value: "comments",
    render: (row) => {
      if (!row.comments?.length)
        return <span className="text-sm text-gray-500">No comments yet</span>;

      const latest = [...row.comments].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )[0];

      const diffMs = new Date() - new Date(latest.created_at);
      const mins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(mins / 60);
      const days = Math.floor(hrs / 24);

      const timeAgo =
        mins < 1
          ? "Just now"
          : mins < 60
          ? `${mins}m ago`
          : hrs < 24
          ? `${hrs}h ago`
          : `${days}d ago`;

      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{timeAgo}</span>
        </div>
      );
    },
  },
];
