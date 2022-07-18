import { Role } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AxiosErrorMsg from "../components/AxiosErrorMsg";
import { branches } from "../store/student.data";

const Dashboard = () => {
  const { data: session }: { data: any } = useSession();
  if (session?.user.role === Role.student) return null;
  return (
    <div>
      <CompanyWiseOffers />
      <BranchWiseOffers />
      hey
      <PlacedNonPlacedRatioBranchWise />
    </div>
  );
};

export default Dashboard;

const CompanyWiseOffers = () => {
  const { isLoading, data, error } = useQuery(
    "companyWiseOffers",
    fetchCompanyWiseOffers
  );

  return (
    <section className="max-w-5xl py-10 mx-auto">
      <h2 className="py-4 text-xl font-semibold">Company Wise Offers</h2>
      {isLoading ? (
        <span>Loading...</span>
      ) : error ? (
        <AxiosErrorMsg error={error as AxiosError} />
      ) : (
        <BarChart
          width={1000}
          height={300}
          data={data.results}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="offers" fill="#8884d8" />
        </BarChart>
      )}
    </section>
  );
};

const fetchCompanyWiseOffers = async () => {
  const { data } = await axios.get("/api/company");
  return data;
};

const BranchWiseOffers = () => {
  const { isLoading, data, error } = useQuery(
    "branchWiseOffers",
    fetchBranchWiseOffers,
    {
      select: (data) => {
        const branchWiseOffersKeys = Object.keys(data);
        return branchWiseOffersKeys.map((k) => {
          return {
            name: k,
            unique: data[k][0],
            multiple: data[k][1],
          };
        });
      },
    }
  );

  return (
    <section className="max-w-5xl py-10 mx-auto">
      <h2 className="py-4 text-xl font-semibold">Branch Wise Offers</h2>
      {isLoading ? (
        <span>Loading...</span>
      ) : error ? (
        <AxiosErrorMsg error={error as AxiosError} />
      ) : (
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="unique" fill="#8884d8" />
          <Bar dataKey="multiple" fill="#82ca9d" />
        </BarChart>
      )}
    </section>
  );
};

const fetchBranchWiseOffers = async () => {
  const { data } = await axios.get("/api/branch/offers");
  return data;
};
const PlacedNonPlacedRatioBranchWise = () => {
  const { isLoading, data, error } = useQuery(
    "placedNonPlacedBranchWise",
    fetchPlacedNonPlacedRatioBranchWise
  );

  const COLORS = ["#0088FE", "#00C49F"];
  return (
    <section className="max-w-5xl py-10 mx-auto">
      <h2 className="py-4 text-xl font-semibold">
        Placed/Non Placed Ratio Branch Wise
      </h2>

      {isLoading ? (
        <span>Loading...</span>
      ) : error ? (
        <AxiosErrorMsg error={error as AxiosError} />
      ) : (
        <div className="grid items-baseline grid-cols-3 space-y-4 justify-items-center">
          {branches?.map((branch) => {
            const res = [
              {
                name: "Placed",
                value: data[branch][0],
              },
              {
                name: "Non-Placed",
                value: data[branch][1],
              },
            ];
            return (
              <div key={branch}>
                <p className="text-lg font-bold text-center ">{branch}</p>
                <PieChart width={200} height={200}>
                  <Pie
                    data={res}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {res?.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const fetchPlacedNonPlacedRatioBranchWise = async () => {
  const { data } = await axios.get("/api/branch/placement");
  return data;
};
