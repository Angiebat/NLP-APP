import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "expo-router";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

    } catch (err: any) {
      Alert.alert("Signup Error", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Signup</Text>

      <Text>Name</Text>
      <TextInput style={{ borderWidth: 1 }} value={name} onChangeText={setName} />

      <Text>Email</Text>
      <TextInput style={{ borderWidth: 1 }} value={email} onChangeText={setEmail} />

      <Text>Password</Text>
      <TextInput
        style={{ borderWidth: 1 }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Create Account" onPress={signup} />

      <Link href={{ pathname: "/login" }} asChild>
        <Text style={{ marginTop: 20, color: "blue" }}>
          Already have an account? Login
        </Text>
      </Link>
    </View>
  );
}
