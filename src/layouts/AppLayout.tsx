import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useOffers } from '../hooks/useOffers'
import { useShows } from '../hooks/useShows'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⬡' },
  { path: '/artists', label: 'Artists', icon: '♪' },
  { path: '/venues', label: 'Venues', icon: '▣' },
  { path: '/offers', label: 'Offers', icon: '◈' },
  { path: '/shows', label: 'Shows', icon: '▶' },
]

function NavBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="ml-auto text-xs font-mono border border-accent-cyan text-accent-cyan px-1.5 py-0.5 leading-none">
      {count}
    </span>
  )
}

function SidebarNav({ onNavigate }: { onNavigate: () => void }) {
  const location = useLocation()
  const { data: offers } = useOffers()
  const { data: shows } = useShows()

  const activeOffers = offers?.filter((o) =>
    ['Draft', 'Sent', 'Negotiating'].includes(o.status),
  ).length ?? 0

  const activeShows = shows?.filter((s) =>
    ['Confirmed', 'OnSale'].includes(s.status),
  ).length ?? 0

  return (
    <nav className="flex flex-col gap-1 mt-4">
      {navItems.map(({ path, label, icon }) => {
        const isActive =
          path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)

        return (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={[
              'flex items-center gap-3 px-4 py-2.5 text-sm font-mono tracking-wider transition-all',
              'border-l-2',
              isActive
                ? 'border-l-accent-cyan text-accent-cyan bg-accent-cyan/5 glow-text-cyan'
                : 'border-l-transparent text-text-muted hover:text-text-primary hover:border-l-border-bright',
            ].join(' ')}
          >
            <span className="text-base w-4 text-center">{icon}</span>
            <span>{label}</span>
            {label === 'Offers' && <NavBadge count={activeOffers} />}
            {label === 'Shows' && <NavBadge count={activeShows} />}
          </NavLink>
        )
      })}
    </nav>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'w-52 flex-shrink-0 bg-bg-base border-r-2 border-border-bright flex flex-col relative overflow-hidden',
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200',
          'md:static md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        {/* Logo / header */}
        <div className="px-4 py-4 border-b border-border relative flex items-start justify-between">
          <div>
            <div className="text-accent-cyan font-display text-2xl glow-text-cyan tracking-widest">
              STAGECRAFT
            </div>
            <div className="text-text-muted text-xs tracking-widest mt-0.5">
              <span className="text-accent-green glow-text-green">●</span>{' '}
              SYSTEM ONLINE
            </div>
          </div>
          <button
            className="md:hidden text-text-muted hover:text-text-primary transition-colors text-2xl font-mono leading-none mt-1"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <SidebarNav onNavigate={() => setMobileOpen(false)} />

        {/* Footer */}
        <div className="mt-auto px-4 py-3 border-t border-border text-text-muted text-xs font-mono">
          <div className="text-accent-amber/60 tracking-widest">&gt;_ v1.0.0</div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-bg-base border-b-2 border-border-bright flex-shrink-0 relative z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-text-muted hover:text-accent-cyan transition-colors font-mono text-xl leading-none"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="text-accent-cyan font-display text-xl tracking-widest glow-text-cyan">
            STAGECRAFT
          </span>
        </div>

        <main className="flex-1 overflow-y-auto bg-bg-base">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
