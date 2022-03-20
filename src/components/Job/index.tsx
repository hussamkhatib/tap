import React from "react";
import { UserGroupIcon, UserIcon, ClockIcon } from "@heroicons/react/solid";
import Link from "next/link";
import JobDetails from "./job.types";
import Button from "../ui/Button";

const Job = ({
  title,
  employeesRange,
  applied,
  timeLeftInDays,
  eligibility,
  jobRoles,
}: JobDetails) => {
  return (
    <div className="border-2 p-2 my-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center text-sm text-gray-400">
            <UserGroupIcon className="h-4 w-4" />
            <span> {employeesRange} Employees</span>
          </div>
        </div>
        <div className="flex gap-x-4 text-sm text-gray-400">
          <div className="flex items-center h-max">
            <UserIcon className="h-4 w-4" />
            <span> {applied} applied</span>
          </div>
          <div className="flex items-center h-max">
            <ClockIcon className="h-4 w-4" />
            <span> {timeLeftInDays} days left</span>
          </div>
        </div>
      </div>
      {Boolean(jobRoles?.length) && (
        <div className="my-4">
          {jobRoles.map((jobRole) => (
            <div
              key={jobRole.title}
              className="flex justify-between border-2 my-1 p-2"
            >
              <div className="flex flex-col">
                <span>{jobRole.title}</span>
                <div className="flex gap-x-4 text-gray-400 text-sm">
                  <span>{jobRole?.salaryRange}</span>
                  <span>{jobRole?.location}</span>
                  <span>{jobRole.esopRange}</span>
                </div>
              </div>
              <div className="flex gap-x-4 h-max ">
                <Button
                  className="border-2 border-black px-2 py-1"
                  variant="outline"
                >
                  Save
                </Button>
                <Link href="/events">
                  <a className="bg-black text-white  px-2 py-1">Full Details</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {eligibility && (
        <div className="p-2">
          <p>Eligibility</p>
          <ul className="list-disc list-inside">
            <li>Backlogs : {eligibility.backlogs}</li>
            <li>Cgpa : {eligibility.cgpa}</li>
            <li>Offer Count : {eligibility.offerCount}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Job;