import {
    Menu,
    Transition,
    MenuItem,
    MenuItems,
    MenuButton,
} from "@headlessui/react";

const NavMenuLinks = [
    {
        label: "My account",
        subLinks: [
            { href: "/settings", label: "Settings" },
            { href: "/support", label: "Support" },
            { href: "/license", label: "License" },
        ],
    },
    { href: "/license", label: "License" },
    {
        label: "Careers",
        subLinks: [
            { href: "/settings", label: "Settings" },
            { href: "/support", label: "Support" },
            { href: "/license", label: "License" },
        ],
    },
    { href: "/about", label: "About" },
];

const NavMenu = () => {
    return (
        <nav>
            <ul className="hidden lg:flex lg:space-x-7">
                {NavMenuLinks.map((link, id) => (
                    <li key={id}>
                        <Menu>
                            <MenuButton className="hover:text-almost-black text-white">
                                {link.subLinks ? (
                                    <span className="flex items-center gap-1">
                                        {link.label}
                                        <svg
                                            className="size-5 flex-none text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                ) : (
                                    <a href={link.href}>{link.label}</a>
                                )}
                            </MenuButton>

                            {/* TODO poner una flexha */}
                            {link.subLinks && (
                                <Transition
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <MenuItems
                                        anchor="bottom"
                                        className="mt-4 w-40 py-3 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    >
                                        {link.subLinks &&
                                            link.subLinks.map((subLink) => (
                                                <MenuItem
                                                    key={subLink.href}
                                                    className="block data-[focus]:bg-blue-100 text-black"
                                                >
                                                    {({ active }) => (
                                                        <a
                                                            className={`${
                                                                active &&
                                                                "bg-gray-100 text-gray-900"
                                                            } block w-full text-left px-4 py-2 text-sm cursor-pointer`}
                                                            href={subLink.href}
                                                        >
                                                            {subLink.label}
                                                        </a>
                                                    )}
                                                </MenuItem>
                                            ))}
                                    </MenuItems>
                                </Transition>
                            )}
                        </Menu>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavMenu;
