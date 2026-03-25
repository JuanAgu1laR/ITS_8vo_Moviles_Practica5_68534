import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';

interface NeumorphicBoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
  inverted?: boolean;
}

export const NeumorphicBox: React.FC<NeumorphicBoxProps> = ({ children, style, inverted }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.topShadow, inverted && styles.invertedTopShadow]}>
        <View style={[styles.bottomShadow, inverted && styles.invertedBottomShadow]}>
          <View style={[styles.inner, inverted && styles.invertedInner]}>
            {children}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E5EC',
  },
  inner: {
    backgroundColor: '#E0E5EC',
    borderRadius: 20,
    padding: 20,
  },
  topShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOffset: { width: -6, height: -6 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  bottomShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#a3b1c6',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  // Simplified for cross-platform without specific libs for now
  invertedTopShadow: {
    // Inverted effect is harder with pure CSS in RN without SVG or Shadow libs
  },
  invertedBottomShadow: {},
  invertedInner: {
    backgroundColor: '#D1D9E6',
  }
});
