import NavTabs from "../../components/NavTabs";
import Table from "../../components/Table";
import {
  adminEventTabs,
  studentEventTabs,
} from "../../components/NavTabs/tabs";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { adminEventColumns, eventColumns } from "../../store/events.data";
import usePagination from "../../hooks/usePagination";
import { trpc } from "../../utils/trpc";

const Events = () => {
  const { data: session } = useSession();
  const tabs =
    session?.user.role === Role.student ? studentEventTabs : adminEventTabs;

  return (
    <div>
      <NavTabs tabs={tabs} />
      <EventsTable />
    </div>
  );
};

export default Events;

const EventsTable = () => {
  const { data: session } = useSession();
  const columns =
    session?.user.role === Role.student ? eventColumns : adminEventColumns;

  const { pagination, pageSize, setPagination, fetchDataOptions } =
    usePagination(0, 10);

  const { isLoading, data, error } = trpc.useQuery([
    "events.get",
    fetchDataOptions,
  ]);
  if (isLoading) return <span>Loading...</span>;
  if (error instanceof Error)
    return (
      // TODO:3a8f839d-357b-441b-a4fc-6b1d83c31f30
      <span>errror</span>
    );

  return data ? (
    <Table
      columns={columns}
      data={data.results}
      setPagination={setPagination}
      state={{ pagination, columnVisibility: { id: false } }}
      pageCount={Math.ceil(data.count / pageSize)}
      manualPagination
    />
  ) : null;
};
