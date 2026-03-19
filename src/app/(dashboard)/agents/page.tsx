import { LoadingState } from "@/components/loading-state";
import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { ErrorState } from "@/components/error-state";
import { AgentsListHeader } from "@/modules/agents/ui/components/agent-list-header";
import type { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
  searchParams: Promise<SearchParams>
}

const page = async ({searchParams}: Props) => {
  const filters = await loadSearchParams(searchParams)
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
      ...filters,
  }));

  return (
    <>
    <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState
              title="agent loading"
              description="it may take few seconds"
            />
          }
        >
          <ErrorBoundary
            fallback={
              <ErrorState
                title="agent error"
                description="something went wrong in agent page"
              />
            }
          >
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default page;
