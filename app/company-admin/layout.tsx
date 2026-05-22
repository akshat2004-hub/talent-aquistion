"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getStoredUser, logout } from "../../lib/adminApi";

const NAV_ITEMS = [
  { href: "/company-admin", label: "Dashboard", icon: "◫" },
  { href: "/company-admin/actions", label: "Actions", icon: "⚡" },
  { href: "/company-admin/playbooks", label: "Playbooks", icon: "⌘" },
  { href: "/company-admin/categories", label: "Categories", icon: "▦" },
  { href: "/company-admin/knowledge", label: "Knowledge Base", icon: "◉" },
  { href: "/company-admin/chunking-inspector", label: "Chunking Inspector", icon: "◨" },
  { href: "/company-admin/employees", label: "Employees", icon: "◌" },
  { href: "/company-admin/skills", label: "Skills Config", icon: "✦" },
  { href: "/company-admin/widget-admin", label: "Widget Admin", icon: "⌁" },
  { href: "/company-admin/how-to-use", label: "How To Use", icon: "⋯" },
  { href: "/company-admin/audit", label: "Audit Logs", icon: "☰" },
];

export default function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useMemo(() => getStoredUser(), [pathname]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  useEffect(() => {
    if (!user || !["admin", "editor", "viewer"].includes(user.role)) {
      if (pathname !== "/company-admin/login") router.push("/company-admin/login");
    }
  }, [router, pathname, user]);

  const commandItems = useMemo(
    () => [
      { id: "go-dashboard", label: "Go to Dashboard", action: () => router.push("/company-admin") },
      {
        id: "go-knowledge",
        label: "Go to Knowledge Base",
        action: () => router.push("/company-admin/knowledge"),
      },
      {
        id: "go-actions",
        label: "Go to Actions",
        action: () => router.push("/company-admin/actions"),
      },
      {
        id: "go-playbooks",
        label: "Go to Playbooks",
        action: () => router.push("/company-admin/playbooks"),
      },
      {
        id: "go-chunking-inspector",
        label: "Go to Chunking Inspector",
        action: () => router.push("/company-admin/chunking-inspector"),
      },
      {
        id: "go-employees",
        label: "Go to Employees",
        action: () => router.push("/company-admin/employees"),
      },
      {
        id: "go-skills",
        label: "Go to Skills Config",
        action: () => router.push("/company-admin/skills"),
      },
      {
        id: "go-widget-admin",
        label: "Go to Widget Admin",
        action: () => router.push("/company-admin/widget-admin"),
      },
      {
        id: "go-how-to-use",
        label: "Go to How To Use",
        action: () => router.push("/company-admin/how-to-use"),
      },
      {
        id: "toggle-sidebar",
        label: isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar",
        action: () => setIsSidebarCollapsed((prev) => !prev),
      },
      {
        id: "open-qa-sandbox",
        label: "Open QA Sandbox (coming soon)",
        action: () => router.push("/company-admin/knowledge"),
      },
    ],
    [router, isSidebarCollapsed],
  );

  const filteredCommandItems = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) return commandItems;
    return commandItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [commandItems, paletteQuery]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const triggerPalette = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (triggerPalette) {
        event.preventDefault();
        setIsPaletteOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setIsPaletteOpen(false);
        setPaletteQuery("");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  
  function closePalette() {
    setIsPaletteOpen(false);
    setPaletteQuery("");
  }

  if (pathname === "/company-admin/login") return <>{children}</>;
  if (!user) return null;

  return (
    <div className="admin-shell">
      <div
        className="admin-frame"
        style={{ gridTemplateColumns: isSidebarCollapsed ? "76px 1fr" : "268px 1fr" }}
      >
        <aside className="admin-sidebar flex flex-col">
          <div className="px-3 py-4 border-b border-gray-800">
            <div className="flex items-start justify-between gap-2">
              {!isSidebarCollapsed && (
                <div>
                  <h1 className="text-base font-semibold tracking-tight text-white">
                    Company Console
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                </div>
              )}
              <button
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="h-8 w-8 rounded-md border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? "»" : "«"}
              </button>
            </div>
          </div>
          <nav className="flex-1 py-3 space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/company-admin"
                  ? pathname === "/company-admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors border ${
                    active
                      ? "bg-white text-gray-950 border-white shadow-[inset_3px_0_0_0_#4f46e5]"
                      : "text-gray-300 border-transparent hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-center">{item.icon}</span>
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-800 transition-colors mb-2"
            >
              {isSidebarCollapsed ? "⌘K" : "Command Palette  ⌘K"}
            </button>
            <button
              onClick={() => {
                logout();
                router.push("/company-admin/login");
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              {isSidebarCollapsed ? "↩" : "Sign out"}
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="text-sm font-medium text-gray-700">
              Tenant Administration
            </div>
            <div className="text-xs text-gray-500">
              Role:{" "}
              <span className="font-semibold text-gray-700 uppercase">{user.role}</span>
            </div>
          </header>
          <main className="admin-content">{children}</main>
        </div>
      </div>
      {isPaletteOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/45 px-4 py-16"
          onClick={closePalette}
        >
          <div
            className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-200 px-4 py-3">
              <input
                autoFocus
                value={paletteQuery}
                onChange={(event) => setPaletteQuery(event.target.value)}
                placeholder="Search commands..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommandItems.length === 0 && (
                <p className="px-2 py-6 text-sm text-slate-500 text-center">No commands found.</p>
              )}
              {filteredCommandItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => {
                    item.action();
                    closePalette();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
