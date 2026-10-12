import SubscriptionModal from "@/components/SubscriptionModal";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SubscriptionPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="flex-1 p-6 max-w-6xl mx-auto">
      <SubscriptionModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          router.push("/subscriptions");
        }}
      />
    </main>
  );
}
