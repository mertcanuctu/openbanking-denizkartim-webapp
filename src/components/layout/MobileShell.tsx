"use client";

import { BottomNav } from "./BottomNav";

interface MobileShellProps {
  children: React.ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] bg-navy overflow-x-hidden">
      {/* Main content area */}
      <main className="pb-nav min-h-screen">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
