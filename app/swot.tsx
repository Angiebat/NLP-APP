import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

const CATEGORIES = ['Health', 'Career', 'Finance', 'Hobby'];
const DURATIONS = ['Short term (1-3 months)', 'Long term (6-12 months)'];

export default function SWOTScreen() {
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [goal, setGoal] = useState('');
  const [swot, setSWOT] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSaveSWOT = async () => {
    if (!category || !duration || !goal || !swot.strengths) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'users', auth.currentUser!.uid, 'swot'), {
        category,
        duration,
        goal,
        strengths: swot.strengths,
        weaknesses: swot.weaknesses,
        opportunities: swot.opportunities,
        threats: swot.threats,
        createdAt: new Date(),
        status: 'pending',
      });

      router.push({
        pathname: 'plan-generation' as any,
        params: {
          swotId: docRef.id,
          swotData: JSON.stringify({
            strengths: swot.strengths,
            weaknesses: swot.weaknesses,
            opportunities: swot.opportunities,
            threats: swot.threats,
          }),
          goal,
          category,
          duration,
        },
      } as any);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Goal Plan</Text>

      <Text style={styles.label}>What type of goal?</Text>
      <View style={styles.buttonGroup}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.optionButton,
              category === cat && styles.optionButtonSelected,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.optionText,
                category === cat && styles.optionTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Time frame?</Text>
      <View style={styles.buttonGroup}>
        {DURATIONS.map((dur) => (
          <TouchableOpacity
            key={dur}
            style={[
              styles.optionButton,
              duration === dur && styles.optionButtonSelected,
            ]}
            onPress={() => setDuration(dur)}
          >
            <Text
              style={[
                styles.optionText,
                duration === dur && styles.optionTextSelected,
              ]}
            >
              {dur}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>What is your main goal?</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Example: Get back to fitness"
        value={goal}
        onChangeText={setGoal}
        multiline
        editable={!loading}
      />

      <Text style={styles.sectionTitle}>SWOT Analysis</Text>

      <Text style={styles.label}>Strengths</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Your strengths..."
        value={swot.strengths}
        onChangeText={(text) => setSWOT({ ...swot, strengths: text })}
        multiline
        editable={!loading}
      />

      <Text style={styles.label}>Weaknesses</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Your weaknesses..."
        value={swot.weaknesses}
        onChangeText={(text) => setSWOT({ ...swot, weaknesses: text })}
        multiline
        editable={!loading}
      />

      <Text style={styles.label}>Opportunities</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Opportunities..."
        value={swot.opportunities}
        onChangeText={(text) => setSWOT({ ...swot, opportunities: text })}
        multiline
        editable={!loading}
      />

      <Text style={styles.label}>Threats</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Threats..."
        value={swot.threats}
        onChangeText={(text) => setSWOT({ ...swot, threats: text })}
        multiline
        editable={!loading}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveSWOT}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Generating...' : 'Generate My Plan'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    margin: 5,
    flex: 1,
    minWidth: '45%',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    textAlign: 'center' as const,
    color: '#333',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  largeInput: {
    minHeight: 100,
    textAlignVertical: 'top' as const,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center' as const,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});