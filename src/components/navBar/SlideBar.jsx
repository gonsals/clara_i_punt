import {
    Disclosure,
    Transition,
    TransitionChild,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";

const Sidebar = ({ open = false, setOpen }) => {
    return (
        <>
            <Transition show={open}>
                <TransitionChild
                    className="fixed right-0 top-0 w-[250px] z-30 h-screen"
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                >
                    <div
                        id="sidebar"
                        className={`fixed right-0 top-0 w-[250px] h-screen pt-20 p-8 z-50 bg-white`}
                    >
                        <button
                            onClick={() => setOpen(false)}
                            aria-expanded={open}
                            aria-controls="sidebar"
                        >
                            <span className=" absolute top-5 right-5">X</span>
                            {/* <img
                                className="absolute top-5 right-5"
                                src="images/icon-close-menu.svg"
                                alt="Close Menu"
                            /> */}
                        </button>
                        <ul className="flex flex-col space-y-3">
                            <li>
                                <Disclosure>
                                    {({ open }) => (
                                        <>
                                            <DisclosureButton className="flex items-center text-left">
                                                <span className="mr-4">
                                                    bbbbbbbbb
                                                </span>
                                                {/* <img
                                                    clasName=""
                                                    src={`images/icon-arrow-${
                                                        open ? "up" : "down"
                                                    }.svg`}
                                                    alt="Arrow"
                                                /> */}
                                                ⬇️
                                            </DisclosureButton>
                                            <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                <ul className="flex flex-col space-y-3">
                                                    <li className="cursor-pointer">
                                                        {/* <img
                                                            src="images/icon-todo.svg"
                                                            className="inline w-4 mr-3"
                                                            alt="Todo List Icon"
                                                        /> */}
                                                        bbbbbbb
                                                    </li>
                                                    <li className="cursor-pointer">
                                                        {/* <img
                                                            src="images/icon-calendar.svg"
                                                            className="inline w-4 mr-3"
                                                            alt="Calendar Icon"
                                                        /> */}
                                                        bbbbbbbbb
                                                    </li>
                                                    <li className="cursor-pointer">
                                                        {/* <img
                                                            src="images/icon-reminders.svg"
                                                            className="inline w-4 mr-3"
                                                            alt="Reminders Icon"
                                                        /> */}
                                                        bbbbbbbbb
                                                    </li>
                                                    <li className="cursor-pointer">
                                                        {/* <img
                                                            src="images/icon-planning.svg"
                                                            className="inline w-4 mr-3"
                                                            alt="Planning Icon"
                                                        /> */}
                                                        bbbbbbb
                                                    </li>
                                                </ul>
                                            </DisclosurePanel>
                                        </>
                                    )}
                                </Disclosure>
                            </li>
                            <li>
                                <Disclosure>
                                    {({ open }) => (
                                        <>
                                            <DisclosureButton className="flex items-center text-left">
                                                <span className="mr-4">
                                                    aaaaaa
                                                </span>
                                                {/* <img
                                                    clasName=""
                                                    src={`images/icon-arrow-${
                                                        open ? "up" : "down"
                                                    }.svg`}
                                                    alt="Arrow"
                                                /> */}
                                                ⬇️
                                            </DisclosureButton>
                                            <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                <ul className="flex flex-col space-y-3">
                                                    <li className="cursor-pointer">
                                                        aaaaaaa
                                                    </li>
                                                    <li className="cursor-pointer">
                                                        aaaaaaa
                                                    </li>
                                                    <li className="cursor-pointer">
                                                        aaaaaaa
                                                    </li>
                                                </ul>
                                            </DisclosurePanel>
                                        </>
                                    )}
                                </Disclosure>
                            </li>
                            <li>ababababab</li>
                            <li>ababababab</li>
                        </ul>

                        <div className="flex flex-col space-y-5 items-center justify-items-center pt-8">
                            <div className="hover:text-almost-black cursor-pointer">
                                aaaaaaaaa
                            </div>
                            <div className="w-full">
                                <button className="w-full border-2 hover:border-almost-black hover:text-almost-black rounded-xl px-4 py-2">
                                    bbbbbbbbbb
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ... */}
                </TransitionChild>
                <TransitionChild
                    enter="transition-opacity ease-linear duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        onClick={() => setOpen(false)}
                        className="w-full h-full fixed bg-black opacity-80 z-40 inset-0"
                    ></div>
                </TransitionChild>
            </Transition>
        </>
    );
};

export default Sidebar;
