import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { PremiumCard } from '../premium/PremiumCard';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  isPremium: boolean | null;
  priceLabel: string;
  onBuy: () => void;
  onRestore: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  isPremium,
  priceLabel,
  onBuy,
  onRestore
}) => {
  // If user already became premium while modal is open, close it automatically
  useEffect(() => {
    if (visible && isPremium) {
      onClose();
    }
  }, [visible, isPremium, onClose]);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.cardContainer}>
          <PremiumCard
            isPremium={isPremium ?? false}
            priceLabel={priceLabel}
            onBuy={onBuy}
            onRestore={onRestore}
          />
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: '#4F8EF7', fontWeight: 'bold', fontSize: 15 }}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#101828',
    borderRadius: 18,
    padding: 24,
    minWidth: 300,
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5
  },
  closeBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4F8EF7',
    backgroundColor: 'transparent',
    alignSelf: 'center'
  }
});