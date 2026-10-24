import { AiBuilder } from "@/components/dashboard/AiBuilder";
import { GeminiKeyPanel } from "@/components/dashboard/GeminiKeyPanel";

type Props = {
  params: Promise<{ guildId: string }>;
};

export default async function GuildAiBuildPage({ params }: Props) {
  const { guildId } = await params;
  return (
    <div className="space-y-6">
      <GeminiKeyPanel guildId={guildId} />
      <AiBuilder guildId={guildId} />
    </div>
  );
}