// components/HeroSection.tsx
import React from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.6; // roughly 60% of viewport height

const HeroSection = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21' }}
      style={[styles.background, { height: HERO_HEIGHT }]}
      imageStyle={styles.image}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Miami</Text>
        <Text style={styles.subtitle}>Discover the magic of the Magic City</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    zIndex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48, // adjust as needed for different devices
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },
});

export default HeroSection;
