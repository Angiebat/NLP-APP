import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function DashboardScreen() {
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    fetchAllTasks();
    const interval = setInterval(fetchAllTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllTasks = async () => {
    try {
      const plansSnapshot = await getDocs(
        collection(db, 'users', auth.currentUser!.uid, 'plans')
      );

      const tasks: any[] = [];
      plansSnapshot.forEach((planDoc) => {
        const planData = planDoc.data();
        planData.tasks?.forEach((task: any) => {
          tasks.push({
            ...task,
            planId: planDoc.id,
            completed: planData.completedTasks?.includes(task.id) || false,
          });
        });
      });

      setAllTasks(tasks);
      setCompletedCount(tasks.filter((t) => t.completed).length);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = (planId: string, taskId: number) => {
    setAllTasks(
      allTasks.map((t) =>
        t.id === taskId && t.planId === planId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const completionPercentage =
    allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

  const renderTask = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && styles.taskCompleted]}
      onPress={() => toggleTaskComplete(item.planId, item.id)}
    >
      <View style={styles.checkbox}>
        <Text style={styles.checkboxText}>{item.completed ? '✓' : '○'}</Text>
      </View>
      <View style={styles.taskContent}>
        <Text style={[styles.taskName, item.completed && styles.taskNameStrike]}>
          {item.title}
        </Text>
        <Text style={styles.taskFrequency}>
          {item.frequency} • {item.estimatedDays} days
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 My Tasks</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${completionPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedCount} / {allTasks.length} done ({completionPercentage}%)
          </Text>
        </View>
      </View>

      {allTasks.length > 0 ? (
        <FlatList
          data={allTasks}
          renderItem={renderTask}
          keyExtractor={(item) => `${item.planId}-${item.id}`}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks yet</Text>
          <Text style={styles.emptyStateSubtext}>Create a new plan to get started!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 10,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row' as const,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center' as const,
  },
  taskCompleted: {
    backgroundColor: '#f9f9f9',
  },
  checkbox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  taskNameStrike: {
    textDecorationLine: 'line-through' as const,
    color: '#999',
  },
  taskFrequency: {
    fontSize: 13,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    color: '#bbb',
  },
});