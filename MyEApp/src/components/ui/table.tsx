// components/Table.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface TableProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
export const Table: React.FC<TableProps> = ({ children, style }) => {
  return <View style={[styles.tableContainer, style]}>{children}</View>;
};

interface SectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
export const TableHeader: React.FC<SectionProps> = ({ children, style }) => {
  return <View style={[styles.tableHeader, style]}>{children}</View>;
};

export const TableBody: React.FC<SectionProps> = ({ children, style }) => {
  return <View style={[styles.tableBody, style]}>{children}</View>;
};

export const TableFooter: React.FC<SectionProps> = ({ children, style }) => {
  return <View style={[styles.tableFooter, style]}>{children}</View>;
};

interface RowProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
export const TableRow: React.FC<RowProps> = ({ children, style }) => {
  return <View style={[styles.tableRow, style]}>{children}</View>;
};

interface CellProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
export const TableHead: React.FC<CellProps> = ({ children, style, textStyle }) => {
  return (
    <View style={[styles.tableHead, style]}>
      <Text style={[styles.tableHeadText, textStyle]}>{children}</Text>
    </View>
  );
};

export const TableCell: React.FC<CellProps> = ({ children, style, textStyle }) => {
  return (
    <View style={[styles.tableCell, style]}>
      <Text style={[styles.tableCellText, textStyle]}>{children}</Text>
    </View>
  );
};

interface CaptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}
export const TableCaption: React.FC<CaptionProps> = ({ children, style }) => {
  return <Text style={[styles.tableCaption, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%",
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 4,
  },
  tableBody: {},
  tableFooter: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  tableHead: {
    flex: 1,
    padding: 8,
  },
  tableHeadText: {
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    padding: 8,
  },
  tableCellText: {},
  tableCaption: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
