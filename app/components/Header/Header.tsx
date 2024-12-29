import React from "react";
import { useStore } from "store/useStore";
import SunIcon from "../Icons/sunIcon";
import SunIconFilled from "../Icons/SunIconFilled";

function Header() {
  const { toggle, setToggle } = useStore();
  return (
    <>
      <div className="flex gap-5 items-center justify-items-center relative">
        <div className="">
          <div className="w-9 h-9 rounded-full bg-gray-800"></div>
        </div>
        <div className="flex items-center justify-center">
          <button onClick={() => setToggle(!toggle)} className=" text-white p-2 rounded-lg text-2xl focus:outline-none">
            {toggle ? <SunIconFilled /> : <SunIcon />}
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
