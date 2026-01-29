import { PenLine } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            <span className="font-display text-xl tracking-wider">WRITEIN</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Share your thoughts with the world
          </p>
          <p className="text-xs text-muted-foreground/60">
            Created by <span className="text-primary">Vaishnavi Bais</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
