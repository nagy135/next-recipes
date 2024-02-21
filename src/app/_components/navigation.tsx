"use client";

import Link from "next/link";
import homeIcon from "~/assets/icons/home";
import magnifyingGlassIcon from "~/assets/icons/magnifying-glass";
import plusIcon from "~/assets/icons/plus";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

const pages: Record<string, { name?: string; icon?: JSX.Element }> = {
  "/": {
    icon: homeIcon,
  },
  "/add": { name: "Add", icon: plusIcon },
  "/find": { name: "Find", icon: magnifyingGlassIcon },
} as const;

export default () => {
  return (
    <NavigationMenu className="p-2">
      <NavigationMenuList>
        {Object.entries(pages).map(([k, v]) => (
          <NavigationMenuItem>
            <Link href={k} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {v.icon ? <span className="pr-3">{v.icon}</span> : null}{" "}
                {v.name ?? ""}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
