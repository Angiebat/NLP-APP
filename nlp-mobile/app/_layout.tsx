import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Layout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/profile"); // нэвтэрсэн бол profile руу
      } else {
        router.replace("/login");   // нэвтрээгүй бол login руу
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return null;

  return <Stack />;
}
