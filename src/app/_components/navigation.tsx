"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import homeIcon from "~/assets/icons/home";
import magnifyingGlassIcon from "~/assets/icons/magnifying-glass";
import plusIcon from "~/assets/icons/plus";
import questionMark from "~/assets/icons/question-mark";
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
  "/about": { icon: questionMark },
} as const;

export default function Navigation() {
  const pathname = usePathname();
  return (
    <NavigationMenu className="p-2">
      <NavigationMenuList>
        {Object.entries(pages).map(([k, v]) => (
          <NavigationMenuItem key={`menu-item-${k}`}>
            <div className={pathname === k ? "border-white border-2 rounded" : ""}>
              <Link href={k} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <div className="flex items-center">
                    {v.icon ?? <div>{v.icon}</div>}
                    {v.name ?? <div>{v.name}</div>}
                  </div>
                </NavigationMenuLink>
              </Link>
            </div>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
