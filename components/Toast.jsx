import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    PanResponder,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Toast({ message, type, onClose }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        // Fade in
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
            Math.abs(gestureState.dx) > 10,
        onPanResponderMove: Animated.event([null, { dx: pan.x }], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx < -100 || gestureState.dx > 100) {
                handleClose();
            } else {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.toast,
                {
                    opacity,
                    transform: [{ translateX: pan.x }],
                },
            ]}
        >
            <View style={[styles.toastContent, styles[type]]}>
                <Text style={styles.message}>{message}</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </Animated.View>

    );
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        elevation: 10,
    },
    toastContent: {
        maxWidth: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
    },


    success: {
        backgroundColor: '#4caf50',
    },
    error: {
        backgroundColor: '#f44336',
    },
    message: {
        color: 'white',
        fontSize: 14,
        flex: 1,
        textAlign: 'center', // ✅ opcional
        fontFamily: 'GoogleSans-Regular',
    },

    closeButton: {
        marginLeft: 12,
        padding: 4,
    },
});
