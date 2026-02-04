import FocusFlowApp from '@/components/app/FocusFlowApp';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-8 bg-background p-4 pt-12 sm:p-8 sm:pt-16">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Daily Focus Planner
        </h1>
      </header>
      <FocusFlowApp />
    </main>
  );
}
