import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Sidebar({ visible }) {
  if (!visible) return null;

  return (
    <View style={styles.sidebar}>
      <Image source={{ uri: 'https://i.imgur.com/yourImage.png' }} style={styles.avatar} />
      <Text style={styles.name}>Joy Mitchell</Text>
      <Text style={styles.item}>Templates</Text>
      <Text style={styles.item}>Categories</Text>
      <Text style={styles.item}>Analytics</Text>
      <Text style={styles.item}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    backgroundColor: '#102542',
    paddingTop: 60,
    paddingLeft: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  name: {
    color: 'white',
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  item: {
    color: '#bbb',
    fontSize: 16,
    marginVertical: 10,
  },
});
