import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_KEY = "@respiracao1min:isPremium";

// ID do produto na Google Play / App Store
export const PREMIUM_PRODUCT_ID = "support_premium";

// ============================================================
// MODO DE EXECUÇÃO
// ============================================================
// __DEV__ é true no Expo Go / desenvolvimento
// __DEV__ é false no build de produção (EAS Build)
export const IS_DEV_MODE = __DEV__ || false;

// ============================================================
// STORAGE LOCAL - Persistência do estado premium
// ============================================================

/**
 * Verifica se o usuário é premium (salvo localmente)
 * Chamado no início do app para restaurar o estado
 */
export async function getLocalPremium(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(PREMIUM_KEY);
    return value === "true";
  } catch {
    return false;
  }
}

/**
 * Salva o estado premium localmente
 * Chamado após uma compra ou restauração bem-sucedida
 */
export async function setLocalPremium(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(PREMIUM_KEY, value ? "true" : "false");
  } catch (error) {
    console.error("[Premium] Erro ao salvar estado:", error);
  }
}

// ============================================================
// IN-APP PURCHASE (IAP)
// ============================================================

export async function initIAP(): Promise<void> {
  if (IS_DEV_MODE) {
    console.log("[IAP] Modo desenvolvimento - IAP simulado");
    return;
  }
  // TODO: Implementar com react-native-iap no build nativo
  // await RNIap.initConnection();
}

export async function endIAP(): Promise<void> {
  if (IS_DEV_MODE) return;
  // TODO: await RNIap.endConnection();
}

export async function getPremiumProduct(): Promise<null> {
  if (IS_DEV_MODE) return null;
  // TODO: Buscar produto real da loja
  return null;
}

export async function buyPremium(): Promise<boolean> {
  if (IS_DEV_MODE) {
    // Modo teste: simula compra salvando localmente
    await setLocalPremium(true);
    return true;
  }
  
  // TODO: Produção - usar react-native-iap
  // await RNIap.requestPurchase({ sku: PREMIUM_PRODUCT_ID });
  throw new Error("Compras não disponíveis. Use um build nativo.");
}

export async function restorePremium(): Promise<boolean> {
  if (IS_DEV_MODE) {
    // Modo teste: restaura do storage local
    return await getLocalPremium();
  }
  
  // TODO: Produção - verificar compras na loja
  // const purchases = await RNIap.getAvailablePurchases();
  // const hasPremium = purchases.some(p => p.productId === PREMIUM_PRODUCT_ID);
  throw new Error("Restauração não disponível. Use um build nativo.");
}

// ============================================================
// UTILITÁRIOS PARA DEBUG/TESTE (só aparecem em dev)
// ============================================================

/**
 * Limpa o estado premium (reset para testes)
 * Só funciona em modo desenvolvimento
 */
export async function DEBUG_clearPremium(): Promise<void> {
  if (!IS_DEV_MODE) return;
  console.log("[DEBUG] Limpando estado premium");
  await AsyncStorage.removeItem(PREMIUM_KEY);
}
