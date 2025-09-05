"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

function PayementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [isPending, startTransition] = useTransition();
  console.log(searchParams);
  return (
    <main className=" flex flex-col items-center space-y-10">
      <H1>PetSoft acces requires payment</H1>

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime acces for 299$
        </Button>
      )}
      {searchParams.success && (
        <p className="text-sm text-green-700 ">
          {" "}
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled! You can try again.
        </p>
      )}
    </main>
  );
}

export default PayementPage;
