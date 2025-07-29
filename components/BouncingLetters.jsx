import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const BouncingLetters = ({ text = 'Bienvenido' }) => {
  const letters = text.split('');
  const animations = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animationsSequence = letters.map((_, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 100),
          Animated.timing(animations[i], {
            toValue: -15,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animations[i], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.stagger(100, animationsSequence).start();
  }, []);

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.letter,
            { transform: [{ translateY: animations[index] }] },
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  letter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 1,
  },
});

export default BouncingLetters;
