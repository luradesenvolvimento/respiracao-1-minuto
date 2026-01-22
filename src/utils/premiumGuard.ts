export function mustGoPaywall(isPremium: boolean, itemIsPremium: boolean) {
  return itemIsPremium && !isPremium;
}
