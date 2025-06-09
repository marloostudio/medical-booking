import { SystemCheckClient } from "./client"

export default function SystemCheckPage({ searchParams }: { searchParams: { tab?: string; debug?: string } }) {
  const tab = searchParams.tab || "environment"
  const debug = searchParams.debug === "true"

  return <SystemCheckClient initialTab={tab} debug={debug} />
}
