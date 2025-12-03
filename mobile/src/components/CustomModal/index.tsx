import { colors } from '@/src/styles/colors'
import React, { useEffect, useRef, type ReactNode } from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  type ModalProps,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '../Text'

const { width, height } = Dimensions.get('window')

interface CustomModalProps {
  visible: boolean
  onClose: () => void
  title: string
  children: ReactNode
  animationType?: ModalProps['animationType']
  transparent?: boolean
}

export const CustomModal = ({
  visible,
  onClose,
  title,
  children,
  animationType = 'fade',
  transparent = true
}: CustomModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, fadeAnim])

  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.overlayTouch}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1} 
            onPress={onClose}
          />
          <View style={styles.modalContainer} pointerEvents="box-none">
            <View style={styles.modalContent}>
              {/* Header do Modal */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close-circle" size={28} color={colors.gray100} />
                </TouchableOpacity>
              </View>

              {/* Conteúdo do Modal */}
              <View style={styles.modalBody}>
                {children}
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouch: {
    flex: 1,
    position: 'relative',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 15,
    width: width * 0.95,
    maxHeight: height * 0.92,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    minHeight: height * 0.75,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.black200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black200,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    maxHeight: height * 0.85,
  },
})