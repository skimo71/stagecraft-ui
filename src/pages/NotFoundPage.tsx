import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <pre className="text-accent-cyan glow-text-cyan text-xs leading-tight mb-6 opacity-80">{`
  ╔═══════════════════════════╗
  ║                           ║
  ║    404 // NOT FOUND       ║
  ║                           ║
  ║  The page you requested   ║
  ║  does not exist in this   ║
  ║  system.                  ║
  ║                           ║
  ╚═══════════════════════════╝`}</pre>
      <Link
        to="/"
        className="text-sm font-mono text-accent-cyan border border-accent-cyan px-4 py-2 hover:bg-accent-cyan hover:text-text-inverse transition-colors tracking-widest uppercase"
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
