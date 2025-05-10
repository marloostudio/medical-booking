import { SystemCheckClient } from "./system-check-client"

export default function SystemCheckPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab || "all"

  return <SystemCheckClient initialTab={tab} />
}
