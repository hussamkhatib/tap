import NavTabs from "../../NavTabs";
import tabs from "./profileTabs.data";

export const Profile = () => {
  return (
    <div>
      <NavTabs tabs={tabs} />
    </div>
  );
};
