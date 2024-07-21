import React from "react";

export default async function ChannelPage({
  params,
}: {
  params: { channelId: string };
}) {
  return <div>Hello channel {params.channelId}</div>;
}
