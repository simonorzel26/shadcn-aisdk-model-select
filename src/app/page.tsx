import { AccessingState } from "@/components/docs/AccessingState";
import { ComponentShowcase } from "@/components/docs/ComponentShowcase";
import { GettingStarted } from "@/components/docs/GettingStarted";
import { Header } from "@/components/docs/Header";
import { HowItWorks } from "@/components/docs/HowItWorks";
import { LiveDemo } from "@/components/docs/LiveDemo";
import { TinyModelSelectorModes } from "@/components/docs/TinyModelSelectorModes";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 md:p-16">
      <div className="w-full max-w-4xl space-y-16">
        <Header />
        <LiveDemo />
        <GettingStarted />
        <HowItWorks />
        <ComponentShowcase />
        <TinyModelSelectorModes />
        <AccessingState />
      </div>
    </main>
  );
}
