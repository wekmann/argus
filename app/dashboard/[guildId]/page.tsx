import { GeminiKeyPanel } from "@/components/dashboard/GeminiKeyPanel";

type Props = {
  params: Promise<{ guildId: string }>;
};

export default async function GuildSettingsPage({ params }: Props) {
  const { guildId } = await params;
  return <GeminiKeyPanel guildId={guildId} />;
}
