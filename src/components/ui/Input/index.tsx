import classNames from "classnames";
import React, { FC, forwardRef } from "react";
import Props, { InputRef } from "./Input.types";

const Input: FC<Props> = forwardRef(
  ({ fullWidth, ...props }, ref: InputRef) => {
    return (
      <input
        ref={ref}
        className={classNames(
          fullWidth && "w-full",
          "block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
