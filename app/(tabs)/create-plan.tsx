import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CreatePlanScreen() {
  const router = useRouter();

  const handleCreateNew = () => {
    router.navigate('swot' as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Plan</Text>
        <Text style={styles.subtitle}>
          Let's create a personalized plan for your next goal
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 How it works</Text>
        <Text style={styles.cardText}>
          1. Choose a goal category{'\n'}
          2. Select time frame{'\n'}
          3. Fill out a SWOT analysis{'\n'}
          4. AI generates your plan{'\n'}
          5. Start completing tasks!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateNew}
      >
        <Text style={styles.buttonText}>Start Creating Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});