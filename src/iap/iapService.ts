
import * as RNIap from 'react-native-iap';
import type { Product, ProductSubscription, Purchase } from 'react-native-iap';
import { SUBS_SKUS, IAP_SKUS } from './skus';

export type StoreProducts = {
  subscriptions: ProductSubscription[];
  products: Product[];
};

export async function iapInit(): Promise<void> {
  await RNIap.initConnection();
  // A função flushFailedPurchasesCachedAsPendingAndroid foi removida na v8+
  // Não é mais necessária ou disponível
}

export async function iapEnd(): Promise<void> {
  await RNIap.endConnection();
}

export async function iapLoadProducts(): Promise<StoreProducts> {
  // fetchProducts pode retornar tipos mistos, então filtramos corretamente
  const [subsRaw, prodsRaw] = await Promise.all([
    RNIap.fetchProducts({ skus: [...SUBS_SKUS], type: 'subs' }),
    RNIap.fetchProducts({ skus: [...IAP_SKUS], type: 'in-app' }),
  ]);
  const subscriptions = (Array.isArray(subsRaw) ? subsRaw : []).filter(
    (item): item is ProductSubscription => item && item.type === 'subs'
  );
  const products = (Array.isArray(prodsRaw) ? prodsRaw : []).filter(
    (item): item is Product => item && item.type === 'in-app'
  );
  return { subscriptions, products };
}

export async function buySubscription(sku: string): Promise<void> {
  // requestPurchase espera um objeto com 'request' por plataforma
  await RNIap.requestPurchase({
    request: {
      android: { skus: [sku] },
      ios: { sku },
    },
    type: 'subs',
  });
}

export async function buyProduct(sku: string): Promise<void> {
  // requestPurchase espera um objeto com 'request' por plataforma
  await RNIap.requestPurchase({
    request: {
      android: { skus: [sku] },
      ios: { sku },
    },
    type: 'in-app',
  });
}

export async function iapRestoreHasPremium(): Promise<boolean> {
  const purchases = await RNIap.getAvailablePurchases();

  const hasOneTime = purchases.some(p => p.productId === 'premium_onetime');
  const hasSub = purchases.some(p => SUBS_SKUS.includes(p.productId as any));

  return hasOneTime || hasSub;
}

export async function finalizePurchase(purchase: RNIap.Purchase): Promise<void> {
  // isConsumable=false porque é assinatura ou non-consumable
  await RNIap.finishTransaction({ purchase, isConsumable: false });
}
