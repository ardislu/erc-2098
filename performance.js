/* Implementations */

// Baseline
function toCompact(signature) {
  if (signature[131] === 'b') {
    return signature.substring(0, 130);
  }
  // 578...968n === 1n << 255n
  const vs = BigInt(`0x${signature.substring(66, 130)}`) | 57896044618658097711785492504343953926634992332820282019728792003956564819968n;
  return `${signature.substring(0, 66)}${vs.toString(16)}`;
}

// Using only bitwise operations to calculate vs
function bitwiseOnly(signature) {
  const s = BigInt(`0x${signature.substring(66, 130)}`);
  const v = BigInt(`0x${signature.substring(130)}`);
  const vs = (v - 27n) << 255n | s; // Store v in the unused left-most bit of s
  return `${signature.substring(0, 66)}${vs.toString(16)}`;
}

/* Setup random canonical signatures to convert */
const signatures = [];
for (let i = 0; i < 100_000; i++) {
  const rAndSSeed = new BigUint64Array(8);
  const vSeed = new Uint8Array(1);
  globalThis.crypto.getRandomValues(rAndSSeed);
  globalThis.crypto.getRandomValues(vSeed);
  signatures[i] = `0x${[...rAndSSeed].map(v => v.toString(16).padStart(16, '0')).join('')}${vSeed[0] > 127n ? '1b' : '1c'}`;
}

/* Tests */
performance.mark('baseline-started');
for (const signature of signatures) {
  toCompact(signature);
}
performance.mark('baseline-ended');
const baselineMeasure = performance.measure('baseline', 'baseline-started', 'baseline-ended');

performance.mark('bitwiseOnly-started');
for (const signature of signatures) {
  bitwiseOnly(signature);
}
performance.mark('bitwiseOnly-ended');
const bitwiseOnlyMeasure = performance.measure('bitwiseOnly', 'bitwiseOnly-started', 'bitwiseOnly-ended');

console.table([
  { name: baselineMeasure.name, duration: baselineMeasure.duration },
  { name: bitwiseOnlyMeasure.name, duration: bitwiseOnlyMeasure.duration }
]);
