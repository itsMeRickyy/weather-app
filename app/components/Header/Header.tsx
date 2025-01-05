import React, { useEffect, useRef, useState } from "react";
import { useStore } from "store/useStore";
import SunIconFilled from "../Icons/SunIconFilled";
import SunIcon from "../Icons/SunIcon";

function Header() {
  const { toggle, setToggle } = useStore();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // const handleOutsideClick = (event: MouseEvent) => {
  //   if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //     setShowModal(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleOutsideClick);
  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, []);
  return (
    <>
      <div className="flex gap-5 items-center justify-items-center relative">
        <div className="relative modalBtn">
          <div className="hidden w-9 h-9 rounded-full bg-gray-800"></div>
        </div>
        <div className="flex items-center justify-center">
          <button onClick={() => setToggle(!toggle)} className=" text-white p-2 rounded-lg text-2xl focus:outline-none">
            {toggle ? <SunIconFilled /> : <SunIcon />}
          </button>
        </div>
        <div ref={modalRef} className={`Modal ${showModal ? `block` : `hidden`} absolute w-[95vw] h-[95vh] top-10 right-0 mx-auto flex justify-end`}>
          <div className={` ${toggle ? `bg-darkMode-100 ` : `bg-gray-200 `} p-5  h-[30vh] w-[40vw] rounded-lg flex`}>
            <h1 className="text-sm">Dark mode?</h1>
            <button onClick={() => setToggle(!toggle)} className=" h-10 flex justify-center items-center text-white p-2 rounded-lg text-2xl focus:outline-none">
              {toggle ? <SunIconFilled /> : <SunIcon />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
