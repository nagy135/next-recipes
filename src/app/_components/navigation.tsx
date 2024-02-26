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
  "/add": { icon: plusIcon },
  "/find": { icon: magnifyingGlassIcon },
} as const;

export default () => {
  return (
    <NavigationMenu className="p-2">
      <NavigationMenuList>
        {Object.entries(pages).map(([k, v]) => (
          <NavigationMenuItem key={`menu-item-${k}`}>
            <Link href={k} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div className="flex items-center">
                  {v.icon ?? <div>{v.icon}</div>}
                  {v.name ?? <div>{v.name}</div>}
                </div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
