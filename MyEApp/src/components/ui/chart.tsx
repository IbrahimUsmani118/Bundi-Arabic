// chart.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// @ts-ignore - suppress type errors from react-native-chart-kit
import { LineChart } from 'react-native-chart-kit';

interface ChartProps {
  data: number[];
  labels?: string[];
  title?: string;
}

export function Chart({ data, labels, title }: ChartProps) {
  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: labels || [],
    datasets: [
      {
        data: data,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Title if desired */}
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {/* @ts-ignore next-line */}
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          strokeWidth: 2,
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 8,
    marginTop: 8,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
