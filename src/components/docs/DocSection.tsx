import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DocSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        {icon}
        <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}