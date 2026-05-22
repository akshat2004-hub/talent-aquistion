"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getStoredUser, logout } from "../../lib/adminApi";

const NAV_ITEMS = [
  { href: "/superadmin", label: "Dashboard" },
  { href: "/superadmin/tenants", label: "Tenants" },
  { href: "/superadmin/users", label: "Users" },
  { href: "/superadmin/skills", label: "Skill Templates" },
  { href: "/superadmin/policies", label: "AI Governance" },
  { href: "/superadmin/defaults", label: "Defaults" },
  { href: "/superadmin/widget-admin", label: "Widget Admin" },
  { href: "/superadmin/how-to-use", label: "How To Use" },
  { href: "/superadmin/audit", label: "Audit Logs" },
];

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useMemo(() => getStoredUser(), [pathname]);

  useEffect(() => {
    if (!user || user.role !== "superadmin") {
      if (pathname !== "/superadmin/login") router.push("/superadmin/login");
    }
  }, [router, pathname, user]);

  if (pathname === "/superadmin/login") return <>{children}</>;
  if (!user) return null;

  return (
    <div className="admin-shell">
      <div className="admin-frame">
        <aside className="admin-sidebar flex flex-col">
          <div className="px-4 py-4 border-b border-gray-800">
            <h1 className="text-base font-semibold tracking-tight text-white">
              Superadmin Console
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
          </div>
          <nav className="flex-1 py-3 space-y-0.5 px-2">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/superadmin"
                  ? pathname === "/superadmin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => {
                logout();
                router.push("/superadmin/login");
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="text-sm font-medium text-gray-700">
              Platform Administration
            </div>
            <div className="text-xs text-gray-500">
              Role: <span className="font-semibold text-gray-700">Superadmin</span>
            </div>
          </header>
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
