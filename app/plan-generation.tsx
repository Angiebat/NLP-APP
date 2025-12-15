import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { generatePlan } from '../utils/geminiHelper';

export default function PlanGenerationScreen() {
  const params = useLocalSearchParams();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    generatePlanAsync();
  }, []);

  const generatePlanAsync = async () => {
    try {
      setLoading(true);
      setError(null);

      const swotData = JSON.parse(params.swotData as string);

      const generatedPlan = await generatePlan(
        swotData,
        params.goal as string,
        params.category as string
      );

      setPlan(generatedPlan);
      await savePlanToDatabase(generatedPlan);
    } catch (err: any) {
      setError(err.message);
      Alert.alert('Error', 'Failed to generate plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePlanToDatabase = async (planData: any) => {
    try {
      await addDoc(
        collection(db, 'users', auth.currentUser!.uid, 'plans'),
        {
          swotId: params.swotId,
          goal: params.goal,
          category: params.category,
          duration: params.duration,
          tasks: planData.tasks,
          kpis: planData.kpis,
          tips: planData.tips,
          createdAt: new Date(),
          completedTasks: [],
          startDate: new Date(),
        }
      );
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>🤖 Generating your plan...</Text>
        <Text style={styles.loadingSubtext}>This may take 10-20 seconds</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={generatePlanAsync}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleStartPlan = () => {
    router.navigate('(tabs)/dashboard' as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✨ Your Personal Plan</Text>
      <Text style={styles.subtitle}>Goal: {params.goal}</Text>

      <Text style={styles.sectionTitle}>📋 Your Action Tasks</Text>
      {plan?.tasks?.map((task: any, index: number) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardNumber}>{index + 1}</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.cardDescription}>{task.description}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.metaText}>🔄 {task.frequency}</Text>
              <Text style={styles.metaText}>⏱️ {task.estimatedDays} days</Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>📊 Success Metrics</Text>
      {plan?.kpis?.map((kpi: any, index: number) => (
        <View key={index} style={styles.kpiCard}>
          <Text style={styles.kpiMetric}>📈 {kpi.metric}</Text>
          <Text style={styles.kpiTarget}>Target: {kpi.target}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>💡 Tips</Text>
      {plan?.tips?.map((tip: any, index: number) => (
        <View key={index} style={styles.tipCard}>
          <Text style={styles.tipNumber}>{index + 1}</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartPlan}
      >
        <Text style={styles.buttonText}>✓ Start My Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.regenerateButton}
        onPress={generatePlanAsync}
      >
        <Text style={styles.regenerateButtonText}>🔄 Regenerate Plan</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
    marginBottom: 25,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 15,
    minWidth: 30,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  cardDescription: {
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
    fontSize: 13,
  },
  cardMeta: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#777',
  },
  kpiCard: {
    backgroundColor: '#F0F4C3',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#FBC02D',
  },
  kpiMetric: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 5,
    color: '#333',
  },
  kpiTarget: {
    color: '#666',
    fontSize: 13,
  },
  tipCard: {
    backgroundColor: '#FFE0B2',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row' as const,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
  },
  tipNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FF9800',
    marginRight: 12,
    minWidth: 25,
  },
  tipText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    marginTop: 25,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  regenerateButton: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  regenerateButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center' as const,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 10,
    fontSize: 13,
    color: '#999',
    textAlign: 'center' as const,
  },
  errorText: {
    fontSize: 24,
    textAlign: 'center' as const,
    marginBottom: 15,
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center' as const,
    marginBottom: 25,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});