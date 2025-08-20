import { MerkleChat } from "@/components/MerkleChat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  component: RouteComponent
});

function RouteComponent() {
  return <MerkleChat />;
}
