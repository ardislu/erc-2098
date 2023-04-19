/**
 * Convert a canonical Ethereum signature into an ERC-2098 compact signature.
 * @param {string} signature - The canonical signature to convert.
 * @returns {string} The ERC-2098 compact signature.
 */
export function toCompact(signature) {
  if (signature[130] === 'b') {
    return signature.substring(0, 128);
  }
  // 578...968n === 1n << 255n
  const vs = BigInt(`0x${signature.substring(66, 128)}`) | 57896044618658097711785492504343953926634992332820282019728792003956564819968n;
  return `${signature.substring(0, 66)}${vs.toString(16)}`;
}
