import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as RNIap from 'react-native-iap';
import { iapInit, iapEnd, iapLoadProducts, iapRestoreHasPremium, finalizePurchase } from '../iap/iapService';

import type { Product, ProductSubscription } from 'react-native-iap';

type PremiumState = {
  premium: boolean;
  loading: boolean;
  subscriptions: ProductSubscription[];
  products: Product[];
  refresh: () => Promise<void>;
};

const Ctx = createContext<PremiumState | null>(null);

export function usePremium() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePremium must be used within PremiumProvider');
  return v;
}

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<ProductSubscription[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  async function refresh() {
    setLoading(true);
    try {
      const { subscriptions, products } = await iapLoadProducts();
  setSubscriptions(subscriptions as ProductSubscription[]);
      setProducts(products);

      const hasPremium = await iapRestoreHasPremium();
      setPremium(hasPremium);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  let purchaseUpdateSub: RNIap.EventSubscription | undefined;
  let purchaseErrorSub: RNIap.EventSubscription | undefined;

    (async () => {
      await iapInit();
      await refresh();

  purchaseUpdateSub = RNIap.purchaseUpdatedListener(async (purchase) => {
        try {
          // ✅ entrega benefício
          setPremium(true);
          // ✅ ack/finaliza
          await finalizePurchase(purchase);
        } catch {
          // log opcional
        }
      });

  purchaseErrorSub = RNIap.purchaseErrorListener((_error) => {
        // cancelamento/erro de rede/etc (log opcional)
      });
    })();

    return () => {
      purchaseUpdateSub?.remove();
      purchaseErrorSub?.remove();
      iapEnd();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ premium, loading, subscriptions, products, refresh }),
    [premium, loading, subscriptions, products]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
