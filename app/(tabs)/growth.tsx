import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { analyzeOverallGrowth } from '../../utils/growthAnalyzer';

export default function GrowthScreen() {
  const [loading, setLoading] = useState(true);
  const [overallAnalysis, setOverallAnalysis] = useState<any>(null);

  useEffect(() => {
    fetchAndAnalyze();
    const interval = setInterval(fetchAndAnalyze, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAndAnalyze = async () => {
    try {
      const plansSnapshot = await getDocs(
        collection(db, 'users', auth.currentUser!.uid, 'plans')
      );

      const plans: any[] = [];
      plansSnapshot.forEach((doc) => {
        plans.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      const analysis = analyzeOverallGrowth(plans);
      setOverallAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing growth:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Analyzing your progress...</Text>
      </View>
    );
  }

  if (!overallAnalysis || overallAnalysis.totalPlans === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Plans Yet</Text>
          <Text style={styles.emptyText}>
            Create a plan to start tracking growth!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📈 Your Growth</Text>
        <Text style={styles.status}>{overallAnalysis.overallStatus}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{overallAnalysis.totalPlans}</Text>
            <Text style={styles.statLabel}>Plans</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{overallAnalysis.overallCompletionRate}%</Text>
            <Text style={styles.statLabel}>Overall</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{overallAnalysis.completedPlans}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Tips</Text>
        <Text style={styles.tipText}>
          • Complete 1-2 tasks daily{'\n'}
          • Stay consistent{'\n'}
          • Celebrate small wins{'\n'}
          • Review progress weekly
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={fetchAndAnalyze}>
        <Text style={styles.buttonText}>🔄 Refresh Analysis</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
  },
  stat: {
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    opacity: 0.8,
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
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center' as const,
  },
});