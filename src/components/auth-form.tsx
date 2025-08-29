import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AuthForm({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[300px] h-[260px] px-6 py-8 border-[0.3px] rounded-sm shadow-lg ring">
      <form className="space-y-4 w-full h-full">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>

        <div className="mb-4 space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>

        <Button className="w-full my-3">{children}</Button>
      </form>
    </div>
  );
}
