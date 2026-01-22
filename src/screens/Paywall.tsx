import React from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { usePremium } from '../premium/PremiumContext';
import { buyProduct, buySubscription } from '../iap/iapService';

export default function Paywall() {
  const { subscriptions, products, loading, refresh } = usePremium();

  const monthly = subscriptions.find(s => s.id === 'premium_monthly');
  const yearly = subscriptions.find(s => s.id === 'premium_yearly');
  const onetime = products.find(p => p.id === 'premium_onetime');

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Unlock Premium</Text>
      <Text style={{ fontSize: 16, opacity: 0.8 }}>
        • All breathing sessions{'\n'}
        • Daily rituals{'\n'}
        • Offline access
      </Text>

      <Pressable
        style={{ padding: 14, borderRadius: 12, backgroundColor: 'black' }}
        onPress={async () => {
          if (!monthly) return Alert.alert('Not available', 'Monthly plan not loaded yet.');
          await buySubscription(monthly.id);
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>
          {monthly?.displayPrice ? `Monthly — ${monthly.displayPrice}` : 'Monthly — Subscribe'}
        </Text>
      </Pressable>

      <Pressable
        style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}
        onPress={async () => {
          if (!yearly) return Alert.alert('Not available', 'Yearly plan not loaded yet.');
          await buySubscription(yearly.id);
        }}
      >
        <Text style={{ textAlign: 'center', fontWeight: '700' }}>
          {yearly?.displayPrice ? `Annual — ${yearly.displayPrice}` : 'Annual — Subscribe'}
        </Text>
      </Pressable>

      <Pressable
        style={{ padding: 14, borderRadius: 12 }}
        onPress={async () => {
          if (!onetime) return Alert.alert('Not available', 'One-time product not loaded yet.');
          await buyProduct(onetime.id);
        }}
      >
        <Text style={{ textAlign: 'center', textDecorationLine: 'underline' }}>
          {onetime?.displayPrice
            ? `Prefer one-time access? Pay once: ${onetime.displayPrice}`
            : 'Prefer one-time access? Pay once'}
        </Text>
      </Pressable>

      <Pressable
        style={{ padding: 10 }}
        onPress={async () => {
          await refresh();
          Alert.alert('Restored', 'We checked your purchases.');
        }}
      >
        <Text style={{ textAlign: 'center', opacity: 0.8 }}>Restore purchases</Text>
      </Pressable>
    </View>
  );
}
