import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Profile() {
  const user = auth.currentUser;
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Profile</Text>

      <Text>Name: {profile?.name}</Text>
      <Text>Email: {user?.email}</Text>

      <Button title="Logout" onPress={() => signOut(auth)} />
    </View>
  );
}
