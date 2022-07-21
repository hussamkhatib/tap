import { Role, Validation } from "@prisma/client";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import AxiosErrorMsg from "../../../components/AxiosErrorMsg";
import StudentProfile from "../../../components/StudentProfile";
import Button from "../../../components/ui/Button";
import ButtonGroup from "../../../components/ui/Button/ButtonGroup";

const StudentPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const { usn } = router.query as any;

  const { isLoading, data, error } = useQuery(
    ["studentProfileByUsn", `${usn}?profile=full`],
    () => fetchStudentProfileByUsn(`${usn}?profile=full`)
  );

  const { mutate: handleValdidation, isLoading: isLoadingMutation } =
    useMutation(
      (value: boolean) =>
        axios.patch(`/api/student/${usn}`, {
          validated: value ? Validation.validated : Validation.notvalidated,
        }),
      {
        onSettled: (data, error) => {
          if (data) {
            queryClient.setQueryData(
              ["studentProfileByUsn", `${usn}?profile=full`],
              data.data
            );
            toast.success(`Profiles were validated successfully`);
          }
          if (error instanceof Error) toast.error(`Error: ${error.message}`);
        },
      }
    );

  if (session?.user.role === Role.student)
    return <p>You are not allowed to view this page</p>;

  return (
    <div className="max-w-xl mx-auto">
      {isLoading ? (
        <span>Loading...</span>
      ) : error instanceof Error ? (
        <AxiosErrorMsg error={error as AxiosError} />
      ) : (
        <Fragment>
          <div className="min-h-[50px] flex justify-end items-center">
            {data.validated === Validation.pending ? (
              <ButtonGroup align="end">
                <Button
                  onClick={() => handleValdidation(true)}
                  loading={isLoadingMutation}
                >
                  Accept
                </Button>
                <Button
                  color="secondary"
                  onClick={() => handleValdidation(false)}
                  loading={isLoadingMutation}
                >
                  Reject
                </Button>
              </ButtonGroup>
            ) : (
              <div>
                Status:{" "}
                <span
                  className={classNames(
                    data.validated === Validation.validated
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {data.validated === Validation.validated
                    ? "Validated"
                    : "Not Validated"}
                </span>
              </div>
            )}
          </div>
          <StudentProfile details={data} />
        </Fragment>
      )}
    </div>
  );
};

export default StudentPage;

const fetchStudentProfileByUsn = async (query: string) => {
  const { data } = await axios.get(`/api/student/${query}`);
  return data;
};
