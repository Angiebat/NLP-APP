import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreatePlanScreen from './create-plan';
import DashboardScreen from './dashboard';
import GrowthScreen from './growth';
import ProfileScreen from './profile';

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const TabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'dashboard' && styles.tabActive]}
        onPress={() => setActiveTab('dashboard')}
      >
        <Text style={styles.tabIcon}>📋</Text>
        <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.tabLabelActive]}>
          Tasks
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'growth' && styles.tabActive]}
        onPress={() => setActiveTab('growth')}
      >
        <Text style={styles.tabIcon}>📈</Text>
        <Text style={[styles.tabLabel, activeTab === 'growth' && styles.tabLabelActive]}>
          Growth
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'create' && styles.tabActive]}
        onPress={() => setActiveTab('create')}
      >
        <Text style={styles.tabIcon}>➕</Text>
        <Text style={[styles.tabLabel, activeTab === 'create' && styles.tabLabelActive]}>
          New
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
        onPress={() => setActiveTab('profile')}
      >
        <Text style={styles.tabIcon}>👤</Text>
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'growth':
        return <GrowthScreen />;
      case 'create':
        return <CreatePlanScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row' as const,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  tabActive: {
    backgroundColor: 'transparent',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#999',
  },
  tabLabelActive: {
    color: '#007AFF',
  },
});