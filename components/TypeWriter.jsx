import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const TypeWriter = ({ text = 'Bienvenido a la app, Aldrick!', speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{displayedText}<Text style={styles.cursor}>|</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cursor: {
    color: '#888',
  },
});

export default TypeWriter;
