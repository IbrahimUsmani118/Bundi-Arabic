
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';

interface CalendarProps {
  /** Callback when day is pressed. */
  onDayPress?: (day: DateData) => void;
  /** The initial date (YYYY-MM-DD). */
  initialDate?: string;
}

export function Calendar({ onDayPress, initialDate }: CalendarProps) {
  return (
    <View style={styles.container}>
      <RNCalendar
        current={initialDate}
        onDayPress={onDayPress}
        style={styles.calendar}
        theme={{
          arrowColor: '#007bff',
          todayTextColor: '#dc3545',
          // ... more theme customizations
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  calendar: {
    borderRadius: 8,
  },
});
