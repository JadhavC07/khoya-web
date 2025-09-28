import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-medium">Khoya</p>
            <p className="text-sm text-muted-foreground">{"Bringing People Back Together"}</p>
          </div>
          <nav className="flex items-center gap-4" aria-label="Footer">
            <Link href="/privacy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="/#report" className="text-sm hover:underline">
              Report
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          {"© "}
          {new Date().getFullYear()}
          {" Khoya. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
