import { Navbar, NavbarItem, Link, NavbarBrand, NavbarContent } from "@heroui/react";

export function Header() {
  return (
    <Navbar className="flex border-b border-gray-200 dark:border-[#212222]">
      <NavbarBrand>
        <Link href="/">
          <p className="font-bold text-xl text-foreground">SmartPark</p>
        </Link>
      </NavbarBrand>

      <NavbarContent>
        <NavbarItem></NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
