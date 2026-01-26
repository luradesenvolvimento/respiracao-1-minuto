import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { HomeIcon } from './icon/HomeIcon';
import { HistoryIcon } from './icon/HistoryIcon';
import { PremiumIcon } from './icon/PremiumIcon';
import { LockedIcon } from './icon/LockedIcon';

type TabType = 'respiracao' | 'historico' | 'premium' | 'config';

interface TabBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.tabBar}>
      <Pressable
        style={styles.tabItem}
        onPress={() => onTabPress('respiracao')}
      >
        <Text style={[styles.tabIcon, activeTab === 'respiracao' && styles.tabIconActive]}>
          <HomeIcon width={32} height={32} color="#5ac8fa" />
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'respiracao' && styles.tabLabelActive]}>Respiração</Text>
      </Pressable>
      <Pressable
        style={styles.tabItem}
        onPress={() => onTabPress('historico')}
      >
        <Text style={[styles.tabIcon, activeTab === 'historico' && styles.tabIconActive]}>
          <HistoryIcon width={32} height={32} color="#5ac8fa" />
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'historico' && styles.tabLabelActive]}>Histórico</Text>
      </Pressable>
      <Pressable
        style={styles.tabItem}
        onPress={() => onTabPress('premium')}
      >
        <View style={styles.premiumTabIcon}>
          <Text style={styles.tabIcon}>
            <PremiumIcon width={32} height={32} color="#5ac8fa" />
          </Text>
          <View style={styles.premiumLockBadge}>
            <Text style={{fontSize: 8}}>
              <LockedIcon width={14} height={14} color="#ccd0a0ff" />
            </Text>
          </View>
        </View>
        <Text style={[styles.tabLabel, activeTab === 'premium' && styles.tabLabelActive]}>Premium</Text>
      </Pressable>
      {/* <Pressable
        style={styles.tabItem}
        onPress={() => onTabPress('config')}
      >
        <Text style={[styles.tabIcon, activeTab === 'config' && styles.tabIconActive]}>⚙️</Text>
        <Text style={[styles.tabLabel, activeTab === 'config' && styles.tabLabelActive]}>Configurações</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 22, 40, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 150, 200, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: '#7a9cba',
    fontSize: 10,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#5ac8fa',
  },
  premiumTabIcon: {
    position: 'relative',
  },
  premiumLockBadge: {
    position: 'absolute',
    bottom: 0,
    right: -6,
    backgroundColor: '#0a1628',
    borderRadius: 6,
    padding: 1,
  },
});