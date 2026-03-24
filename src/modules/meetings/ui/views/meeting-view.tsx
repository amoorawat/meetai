"use client";

import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "../../hooks/use-meetings-filter";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters()
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
    ...filters 
  }));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col">
      <DataTable
        data={data?.items}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination page={filters.page} totalPages={data.totalPages} onPageChange={(page) => setFilters({page})} />

      {data.items.length === 0 && (
        <EmptyState
          title="Create your First Meeting"
          description="create a meeting with your agent. tap to create meeting button on top-right corner button."
        />
      )}
    </div>
  );
};
