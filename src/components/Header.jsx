import NavMenu from "./NavMenu";
import { useState } from "react";
import Sidebar from "./SlideBar";

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className=" flex items-center justify-center bg-[#111111] w-full">
            <div className="container flex py-5 px-3">
                <div className="flex items-center pt-3">
                    <a href="/">
                        <img src="/images/logo.svg" alt="Snap Logo" />
                    </a>
                </div>
                <div className="flex-grow flex items-center justify-center z-20">
                    <NavMenu />
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => setOpen(true)}
                        aria-expanded={open}
                        aria-controls="sidebar"
                        aria-label="Open Menu"
                        className="text-white"
                    >
                        <img
                            className="block lg:hidden"
                            src="images/icon-menu.svg"
                            alt="Menu"
                        />
                    </button>
                    <Sidebar open={open} setOpen={setOpen} />
                    <div className="hidden lg:flex lg:space-x-5 lg:items-center">
                        <div className="hover:text-almost-black cursor-pointer text-black bg-white px-6 py-2 rounded-[80px]">
                            -----
                        </div>
                        <div>
                            <button className="  text-white">-----</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
