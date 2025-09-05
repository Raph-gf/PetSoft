"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import React from "react";
import { useTransition } from "react";

type SearchParamsType = {
  success?: string | string[];
  cancelled?: string | string[];
};

function PayementPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const [isPending, startTransition] = useTransition();
  const params = React.use(searchParams);

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>

      {!params.success && (
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for 299$
        </Button>
      )}

      {params.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}

      {params.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled! You can try again.
        </p>
      )}
    </main>
  );
}

export default PayementPage;
