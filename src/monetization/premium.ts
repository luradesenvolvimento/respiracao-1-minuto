import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNIap from "react-native-iap";
import { Platform } from "react-native";

const PREMIUM_KEY = "isPremium";

// 1 compra única (managed product)
export const PREMIUM_PRODUCT_ID = "support_premium";

export async function getLocalPremium(): Promise<boolean> {
  const v = await AsyncStorage.getItem(PREMIUM_KEY);
  return v === "true";
}

export async function setLocalPremium(value: boolean) {
  await AsyncStorage.setItem(PREMIUM_KEY, value ? "true" : "false");
}

export async function initIAP() {
  await RNIap.initConnection();
}

export async function endIAP() {
  try {
    await RNIap.endConnection();
  } catch {}
}

export async function getPremiumProduct() {
  const products = await RNIap.fetchProducts({
    skus: [PREMIUM_PRODUCT_ID],
  });
  return products?.[0];
}

export async function buyPremium() {
  const purchase = await RNIap.requestPurchase({
    type: "in-app",
    request:
      Platform.OS === "ios"
        ? { apple: { sku: PREMIUM_PRODUCT_ID } }
        : { google: { skus: [PREMIUM_PRODUCT_ID] } },
  });

  // Marca premium localmente (MVP).
  // (Ideal futuro: validar recibo/servidor, mas pra app simples ok começar assim.)
  if (purchase) {
    await setLocalPremium(true);

    // Finalizar transação
    const purchaseToFinish = Array.isArray(purchase) ? purchase[0] : purchase;
    if (purchaseToFinish) {
      try {
        await RNIap.finishTransaction({
          purchase: purchaseToFinish,
          isConsumable: false,
        });
      } catch {}
    }
  }

  return purchase;
}

export async function restorePremium() {
  // Para produtos gerenciados, pegar compras disponíveis
  const purchases = await RNIap.getAvailablePurchases();

  const hasPremium = purchases?.some(p => p.productId === PREMIUM_PRODUCT_ID);
  if (hasPremium) {
    await setLocalPremium(true);
  }
  return hasPremium;
}
