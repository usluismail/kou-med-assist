import { Redirect } from "expo-router";
import { useAuth } from "@/lib/api/AuthContext";
import { studentHomeHref } from "@/lib/nav";

export default function OgrenciIndex() {
  const { user } = useAuth();
  const period = user?.role === "student" ? user.period : undefined;
  return <Redirect href={studentHomeHref(period)} />;
}
