import React from 'react';
//import { WidgetPreview } from 'expo-widget';
import { View, Text, StyleSheet } from 'react-native';

// Widget Data Interface
interface WidgetData {
  title: string;
  description: string;
  date: string;
}

// This is the widget preview (shows in app)
export function HomeWidgetPreview({ data }: { data: WidgetData }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <Text style={styles.date}>{data.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    minHeight: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});