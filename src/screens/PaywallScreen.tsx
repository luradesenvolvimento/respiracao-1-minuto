import React from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { usePremium } from '../premium/PremiumContext';
import FooterLinks from "../ui/FooterLinks";
import { buyProduct, buySubscription } from '../iap/iapService';
import { Header } from '../ui/Header';

export const PaywallScreen: React.FC = () => {
  const { subscriptions, products, loading, refresh } = usePremium();

  const monthly = subscriptions.find(s => s.id === 'premium_monthly');
  const yearly = subscriptions.find(s => s.id === 'premium_yearly');
  const onetime = products.find(p => p.id === 'premium_onetime');

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Premium" subtitle="Desbloqueie todos os recursos" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
        <FooterLinks />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Premium" subtitle="Desbloqueie todos os recursos" />
      <View style={styles.content}>
        <Text style={styles.title}>Desbloqueie o Premium</Text>
        <Text style={styles.benefits}>
          • Todas as sessões de respiração{'\n'}
          • Rituais diários{'\n'}
          • Acesso offline
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={async () => {
            if (!monthly) return Alert.alert('Não disponível', 'Plano mensal não carregado ainda.');
            await buySubscription(monthly.id);
          }}
        >
          <Text style={styles.primaryButtonText}>
            {monthly?.displayPrice ? `Mensal — ${monthly.displayPrice}` : 'Mensal — Assinar'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={async () => {
            if (!yearly) return Alert.alert('Não disponível', 'Plano anual não carregado ainda.');
            await buySubscription(yearly.id);
          }}
        >
          <Text style={styles.secondaryButtonText}>
            {yearly?.displayPrice ? `Anual — ${yearly.displayPrice}` : 'Anual — Assinar'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.linkButton}
          onPress={async () => {
            if (!onetime) return Alert.alert('Não disponível', 'Produto avulso não carregado ainda.');
            await buyProduct(onetime.id);
          }}
        >
          <Text style={styles.linkButtonText}>
            {onetime?.displayPrice
              ? `Prefere acesso vitalício? Pague uma vez: ${onetime.displayPrice}`
              : 'Prefere acesso vitalício? Pague uma vez'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.restoreButton}
          onPress={async () => {
            await refresh();
            Alert.alert('Restaurado', 'Verificamos suas compras.');
          }}
        >
          <Text style={styles.restoreButtonText}>Restaurar compras</Text>
        </Pressable>
      </View>
      <FooterLinks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#101828',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
  },
  benefits: {
    fontSize: 16,
    opacity: 0.8,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#5ac8fa',
    width: '100%',
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#101828',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5ac8fa',
    width: '100%',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#5ac8fa',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  linkButton: {
    padding: 14,
    borderRadius: 12,
    width: '100%',
    marginBottom: 8,
  },
  linkButtonText: {
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
  restoreButton: {
    padding: 10,
    width: '100%',
  },
  restoreButtonText: {
    textAlign: 'center',
    opacity: 0.8,
    color: '#fff',
    fontSize: 14,
  },
});
