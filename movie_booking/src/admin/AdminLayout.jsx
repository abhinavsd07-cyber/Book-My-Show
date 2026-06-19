import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LuLayoutDashboard,
  LuFilm,
  LuBuilding2,
  LuCalendarDays,
  LuTicket,
  LuClapperboard,
  LuGlobe,
  LuLogOut,
  LuMenu,
  LuX,
  LuBell,
  LuUtensils,
} from "react-icons/lu";

const NAV_ITEMS = [
  { path: "/admin/dashboard", icon: LuLayoutDashboard, label: "Dashboard"    },
  { path: "/admin/movies",    icon: LuFilm,            label: "Movies"       },
  { path: "/admin/theatres",  icon: LuBuilding2,       label: "Theatres"     },
  { path: "/admin/shows",     icon: LuCalendarDays,    label: "Shows"        },
  { path: "/admin/bookings",  icon: LuTicket,          label: "Bookings"     },
  { path: "/admin/snacks",    icon: LuUtensils,        label: "Snacks & F&B" },
  { path: "/admin/banners",   icon: LuClapperboard,    label: "Banners / Ads"},
];

const ACCENT = "#F84464";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  const isMobile = () => window.innerWidth < 768;

  /* mobile: drawer open/closed  |  desktop: expanded vs mini rail */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini]             = useState(false);

  /* close mobile drawer on navigation */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* keep state sane on resize */
  useEffect(() => {
    const onResize = () => {
      if (!isMobile()) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleToggle = () => {
    if (isMobile()) setMobileOpen((v) => !v);
    else            setMini((v) => !v);
  };

  /* sidebar is "visible" when: desktop (always) OR mobile + drawer open */
  const sidebarVisible = !isMobile() || mobileOpen;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ════════════════════════ SIDEBAR ════════════════════════ */}
      <aside
        style={{ width: mini ? 72 : 240 }}
        className={`
          fixed md:relative inset-y-0 left-0 z-50 h-full flex flex-col flex-shrink-0
          bg-[#0F172A] text-slate-300
          transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div
          className={`h-16 flex items-center flex-shrink-0 border-b border-white/8
            ${mini ? "justify-center" : "px-5 gap-3"}`}
        >
          {mini ? (
            <LuClapperboard size={22} style={{ color: ACCENT }} className="flex-shrink-0" />
          ) : (
            <div className="flex flex-col leading-none overflow-hidden mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 26" className="h-6 w-auto">
                <g fill="none">
                  <path fill="#F84464" d="m55.433 7.383-1.444-2.43-2.583 1.213-1.444-2.43L47.38 4.95l-1.445-2.43-2.582 1.215-1.445-2.43-2.582 1.212L37.88.087 35.3 1.3l-5.476 17.591 6.643 2.005a3.516 3.516 0 0 1 3.363-2.45c1.944 0 3.52 1.557 3.52 3.478l-.001.07c.016.315-.021.634-.118.946l6.756 2.042 5.446-17.6"/>
                  <path fill="#FFFFFF" d="M35.52 17.438a.705.705 0 0 1-.591-.705V8.122a.715.715 0 0 1 .724-.717h6.297c.164 0 .329.016.489.043a2.798 2.798 0 0 1 2.336 2.749v6.536a.705.705 0 0 1-.217.51.73.73 0 0 1-.641.195.704.704 0 0 1-.59-.705v-6.536a1.363 1.363 0 0 0-1.377-1.358h-1.372v7.894a.723.723 0 0 1-.86.705.705.705 0 0 1-.59-.705V8.838h-2.75v7.895a.704.704 0 0 1-.216.51.728.728 0 0 1-.642.195m10.47 3.752a.704.704 0 0 1-.592-.706.71.71 0 0 1 .209-.51.73.73 0 0 1 .516-.206c.61 0 1.14-.39 1.315-.97l.748-2.462-2.448-8.083a.722.722 0 0 1 .483-.904.742.742 0 0 1 .896.473l1.82 6.03 1.839-6.026c.091-.34.46-.556.839-.49l.051.011a.726.726 0 0 1 .489.907l-2.52 8.295-.796 2.655c-.206.61-.56 1.106-1.022 1.44-.5.365-1.086.557-1.694.557a.708.708 0 0 1-.133-.012"/>
                  <path fill="#FFFFFF" d="M1.614 15.87h1.428c.788 0 1.43-.633 1.43-1.413v-4.141c0-.687-.498-1.272-1.183-1.391a1.501 1.501 0 0 0-.247-.022l-1.43.001.002 6.965zM.72 17.347a.732.732 0 0 1-.616-.734V3.758c0-.203.077-.391.218-.53a.751.751 0 0 1 .666-.203c.362.062.624.37.624.734v3.656h1.43a2.91 2.91 0 0 1 2.938 2.901l-.001 4.141c0 1.601-1.318 2.902-2.938 2.902H.86a.676.676 0 0 1-.14-.011zm10.376-8.508a1.478 1.478 0 0 0-.246-.02c-.801 0-1.43.62-1.43 1.412v4.313a1.413 1.413 0 0 0 1.43 1.412c.788 0 1.429-.632 1.43-1.412l-.001-4.313c0-.688-.498-1.272-1.183-1.392m-.763 8.564a2.905 2.905 0 0 1-2.42-2.86V10.23c0-.778.304-1.507.858-2.054a2.94 2.94 0 0 1 2.079-.847 2.91 2.91 0 0 1 2.938 2.902l-.001 4.313c0 .775-.308 1.504-.867 2.055a2.94 2.94 0 0 1-2.07.847 2.948 2.948 0 0 1-.517-.043m8.569-8.564a1.47 1.47 0 0 0-.245-.02c-.802 0-1.428.62-1.428 1.412v4.313a1.412 1.412 0 0 0 1.428 1.412c.378 0 .733-.146 1.005-.41.273-.268.424-.624.424-1.002V10.23c0-.687-.498-1.27-1.184-1.391m-.762 8.564a2.907 2.907 0 0 1-2.42-2.859v-4.313c0-1.601 1.317-2.903 2.937-2.903.17 0 .34.014.506.043a2.91 2.91 0 0 1 2.431 2.86v4.313c0 .777-.308 1.504-.867 2.055a2.94 2.94 0 0 1-2.07.847c-.174 0-.348-.014-.517-.043m6.002.031a.733.733 0 0 1-.614-.733V3.758a.735.735 0 0 1 .753-.745.746.746 0 0 1 .754.745v7.66l3.474-3.843a.766.766 0 0 1 .697-.228c.139.024.27.085.379.175.309.28.33.75.052 1.048l-2.615 2.88 2.717 4.902a.705.705 0 0 1 .066.553.732.732 0 0 1-.37.443.755.755 0 0 1-.5.082.749.749 0 0 1-.526-.356l-2.444-4.433-.93 1.013v3.047c0 .202-.08.39-.225.532a.758.758 0 0 1-.668.201m33.268-.008a2.782 2.782 0 0 1-1.96-1.355.75.75 0 0 1-.068-.569.739.739 0 0 1 .346-.45c.15-.084.33-.114.505-.084a.75.75 0 0 1 .525.358c.199.335.509.546.895.614.42.066.803-.048 1.116-.316.29-.267.442-.648.404-1.016a1.22 1.22 0 0 0-.548-.964l-2.031-1.425a2.708 2.708 0 0 1-1.155-2.013 2.642 2.642 0 0 1 .884-2.152 2.754 2.754 0 0 1 2.24-.694h.001c.856.15 1.555.63 1.95 1.323a.746.746 0 0 1 .07.563.747.747 0 0 1-.348.454.757.757 0 0 1-.504.083.747.747 0 0 1-.526-.357c-.172-.3-.482-.51-.856-.575a1.189 1.189 0 0 0-1.021.296c-.26.238-.403.596-.382.96.019.351.22.694.523.894l2.032 1.404a2.729 2.729 0 0 1 1.177 2.101 2.651 2.651 0 0 1-.906 2.214 2.84 2.84 0 0 1-2.307.714l-.055-.008m5.835.021a.75.75 0 0 1-.625-.735V3.77c0-.202.08-.39.226-.533a.762.762 0 0 1 .667-.2.733.733 0 0 1 .615.733v3.655h1.43c.174 0 .348.015.516.045a2.902 2.902 0 0 1 2.42 2.857l.001 6.385a.741.741 0 0 1-.883.734.747.747 0 0 1-.625-.735v-6.384a1.41 1.41 0 0 0-1.43-1.412h-1.429v7.797a.742.742 0 0 1-.754.746.781.781 0 0 1-.13-.01M73.609 8.85a1.429 1.429 0 0 0-1.26.39c-.268.265-.416.62-.416 1v4.316c0 .686.494 1.27 1.173 1.388a1.43 1.43 0 0 0 1.261-.388c.274-.268.424-.622.424-1.001V10.24c0-.687-.497-1.272-1.182-1.391m-.763 8.563a2.903 2.903 0 0 1-2.42-2.857V10.24c-.001-1.6 1.317-2.902 2.937-2.902.169 0 .34.013.506.043a2.91 2.91 0 0 1 2.43 2.859v4.315a2.856 2.856 0 0 1-.867 2.054 2.938 2.938 0 0 1-2.586.803m15.046-9.158a.712.712 0 0 0-.077-.545.781.781 0 0 0-.49-.342.747.747 0 0 0-.864.546 920.42 920.42 0 0 1-1.452 5.726l-.014.056-.013-.056c-.62-2.458-1.447-5.69-1.456-5.724a.706.706 0 0 0-.58-.55.75.75 0 0 0-.85.548c-.01.03-.819 3.268-1.454 5.726l-.014.056-.014-.056c-.618-2.458-1.447-5.695-1.455-5.726a.74.74 0 0 0-.889-.536.73.73 0 0 0-.542.877l2.185 8.632a.754.754 0 0 0 .714.556.708.708 0 0 0 .715-.557c.008-.033.837-3.27 1.456-5.73l.013-.054.016.054c.64 2.483 1.451 5.73 1.452 5.732a.754.754 0 0 0 .715.556.71.71 0 0 0 .714-.559l2.184-8.63"/>
                </g>
              </svg>
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-[0.15em] ml-[3px] mt-0.5">
                Admin Console
              </span>
            </div>
          )}
        </div>

        {/* Section label */}
        {!mini && (
          <p className="px-5 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 select-none">
            Main Menu
          </p>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pt-1 pb-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                title={mini ? label : undefined}
                className={`
                  group relative flex items-center rounded-lg
                  text-sm font-medium transition-all duration-150 select-none
                  ${mini ? "justify-center px-0 py-3" : "gap-3 px-3.5 py-2.5"}
                  ${active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}
                `}
              >
                {/* Active left pill */}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                )}

                <Icon
                  size={17}
                  className="flex-shrink-0 transition-colors duration-150"
                  style={active ? { color: ACCENT } : undefined}
                />

                {!mini && <span className="truncate">{label}</span>}

                {/* Mini tooltip */}
                {mini && (
                  <span className="
                    pointer-events-none absolute left-full ml-3 z-50
                    whitespace-nowrap rounded-lg bg-slate-800 border border-slate-700
                    px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl
                    opacity-0 translate-x-1
                    group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-150
                  ">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/8 px-2 py-3 flex flex-col gap-0.5 flex-shrink-0">
          {!mini && (
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100 transition-all duration-150"
            >
              <LuGlobe size={17} className="flex-shrink-0" />
              <span>View Site</span>
            </Link>
          )}

          <button
            onClick={() => { logout(); navigate("/login"); }}
            title={mini ? "Logout" : undefined}
            className={`
              group relative flex items-center rounded-lg w-full
              text-sm font-medium text-red-400
              hover:bg-red-500/10 hover:text-red-300
              transition-all duration-150
              ${mini ? "justify-center px-0 py-3" : "gap-3 px-3.5 py-2.5"}
            `}
          >
            <LuLogOut size={17} className="flex-shrink-0" />
            {!mini && <span>Logout</span>}
            {mini && (
              <span className="
                pointer-events-none absolute left-full ml-3 z-50
                whitespace-nowrap rounded-lg bg-slate-800 border border-slate-700
                px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl
                opacity-0 translate-x-1
                group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-150
              ">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ════════════════════════ MAIN ════════════════════════ */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] z-30">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-150"
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? <LuX size={20} /> : <LuMenu size={20} />}
            </button>

            {/* Current page label */}
            <span className="hidden sm:block text-sm font-semibold text-slate-700">
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.label ?? "Admin"}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Bell */}
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-150">
              <LuBell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-[2px] border-white"
                style={{ backgroundColor: ACCENT }}
              />
            </button>

            <div className="w-px h-7 bg-slate-200 hidden sm:block mx-1" />

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0 select-none"
                style={{ backgroundColor: ACCENT }}
              >
                {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
              </div>
              <div className="hidden md:flex flex-col leading-none">
                <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[130px]">
                  {user?.name ?? "Admin"}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: ACCENT }}
                >
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}