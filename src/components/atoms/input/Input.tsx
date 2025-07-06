import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        {...props}
        className={`border rounded-2xl border-[#878787] p-2 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${props.className || ""}`}
      />
    </div>
  );
}

export const InputSubmit = ({...props}) => {
  return (
    <input
    {...props}
      className="bg-[#6629DE] text-white rounded-2xl w-full mt-4 py-3 cursor-pointer hover:opacity-90 transition duration-300"
    />
  );
} 

export const InputSearch = ({...props}) => {
  return (
    <input
      {...props}
      type="text"
      className="pl-7 pr-3 py-1.5 rounded-2xl bg-[#f5edff] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 transition w-60"
    />
  );
}
export const InputProfile = ({...props}) => {
  return (
    <input
      {...props}
      className="flex-1 outline-none"
    />
  );
}