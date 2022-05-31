import Link from "next/link";
import { users } from "../../prisma/data";
import { ExternalLinkIcon } from "@heroicons/react/solid";

export const studentCols = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "USN",
    accessor: "usn",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Branch",
    accessor: "branch",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Opted",
    accessor: "opted",
  },
  {
    Header: "Validated",
    accessor: "validated",
  },
  {
    Header: "Resume",
    accessor: "resume",
    Cell: ({ cell: { value } }: { cell: any }) =>
      value && (
        <Link href={value}>
          <a target="_blank">
            <ExternalLinkIcon className="w-5 h-5" aria-hidden="true" />
          </a>
        </Link>
      ),
  },
];
export const branches = ["CSE", "ISE", "EEE", "EC"];
export const sampleStudents = {
  data: users.map((student) => ({
    ...student,
    branch: branches[Math.floor(Math.random() * branches.length)],
  })),
  columns: studentCols,
};

export const sampleStudent = {
  data: [
    {
      ...users[0],
      branch: "CSE",
    },
  ],
  columns: studentCols,
};

export default sampleStudents;

export const validationMsg: any = {
  notvalidated: {
    status: "error",
    description: "Your Profile is not validated",
  },
  pending: {
    status: "info",
    description: "Your Profile is under validation",
  },
  validated: {
    status: "success",
    description: "Your Profile is validated",
  },
};
