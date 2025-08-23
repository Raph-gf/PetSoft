import { Plus } from "lucide-react";
import { Button } from "./ui/button";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
};

export default function PetButton({ actionType, children }: PetButtonProps) {
  if (actionType === "add") {
    return (
      <Button size="icon">
        {" "}
        <Plus className="size-6" />
      </Button>
    );
  }
  if (actionType === "edit") {
    return <Button variant="secondary">{children}</Button>;
  }

  if (actionType === "checkout") {
    return <Button variant="secondary">{children}</Button>;
  }
}
