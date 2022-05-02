import { useEffect, useState } from "react";
import NavTabs from "../../NavTabs";
import Table from "../../Table";
import { eventTabs } from "./events.data";

export const All = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [table, setTable] = useState({
    columns: [],
    data: [],
  });

  useEffect(() => {
    fetch("/events")
      .then((res) => res.json())
      .then((data) => {
        setTable(data);
        setIsLoaded(true);
      });
  }, []);

  return (
    <div>
      <NavTabs tabs={eventTabs} />
      <Table columns={table.columns} data={table.data} isLoading={!isLoaded} />
    </div>
  );
};
