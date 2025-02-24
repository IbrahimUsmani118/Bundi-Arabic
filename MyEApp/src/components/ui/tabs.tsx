// components/Tabs.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";

export type Tab = {
  key: string;
  title: string;
  content: React.ReactNode;
};

export interface TabsProps {
  tabs: Tab[];
  initialKey?: string;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, initialKey, style }) => {
  const [activeKey, setActiveKey] = useState(initialKey || tabs[0].key);
  const activeTab = tabs.find((tab) => tab.key === activeKey);

  return (
    <View style={[styles.tabsContainer, style]}>
      <View style={styles.tabsList}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveKey(tab.key)}
            style={[styles.tabTrigger, activeKey === tab.key && styles.tabTriggerActive]}
          >
            <Text style={[styles.tabTriggerText, activeKey === tab.key && styles.tabTriggerTextActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabsContent}>{activeTab?.content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    width: "100%",
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 4,
    borderRadius: 4,
  },
  tabTrigger: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 4,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
  },
  tabTriggerActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabTriggerText: {
    fontSize: 16,
    color: "#374151",
  },
  tabTriggerTextActive: {
    fontWeight: "bold",
    color: "#111827",
  },
  tabsContent: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
});
