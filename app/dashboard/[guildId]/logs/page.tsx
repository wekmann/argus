import { LogsPanel } from "@/components/dashboard/LogsPanel";

type Props = {
  params: Promise<{ guildId: string }>;
};

export default async function LogsPage({ params }: Props) {
  const { guildId } = await params;
  return <LogsPanel guildId={guildId} />;
}
