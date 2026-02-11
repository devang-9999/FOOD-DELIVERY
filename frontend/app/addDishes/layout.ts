"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";

export default function RestaurntLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentUser = useAppSelector(
    (state) => state.auth.user,
  );

  useEffect(() => {
    if (currentUser?.role!=="RESTAURANT OWNER" ) router.replace("/authentication/login");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return children;
}