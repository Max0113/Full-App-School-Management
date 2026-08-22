"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import { useRouter } from "next/navigation";

export function RoleGuard({ role, children }) {
  const { checkAuth } = useAuth();
  const route = useRouter();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;
    const verify = async () => {
      try {
        const u = await checkAuth();
        if (!active) return;
        if (role && u?.role !== role) {
          setStatus("denied");
          route.replace("/login");
          return;
        }
        setStatus("ready");
      } catch {
        if (!active) return;
        setStatus("denied");
        route.replace("/login");
      }
    };
    verify();
    return () => {
      active = false;
    };
  }, [checkAuth, role, route]);

  if (status !== "ready") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return children;
}

export default RoleGuard;
