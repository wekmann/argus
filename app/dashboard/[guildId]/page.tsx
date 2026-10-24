import { Suspense } from "react";
import { GeminiKeyPanel } from "@/components/dashboard/GeminiKeyPanel";

type Props = {
  params: Promise<{ guildId: string }>;
}

async function GuildSettingsContent({ params }: Props) {
  const { guildId } = await params;
  return <GeminiKeyPanel guildId={guildId} />;
}

export default function GuildSettingsPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading settings...</div>}>
      <GuildSettingsContent params={params} />
    </Suspense>
  );
}