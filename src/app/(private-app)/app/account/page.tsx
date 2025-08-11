import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";

export default function AccountPage() {
  return (
    <main>
      <H1 className="font-medium text-2xl leading-6">Your Account</H1>

      <ContentBlock>
        <p>Logged in as ...</p>
      </ContentBlock>
    </main>
  );
}
