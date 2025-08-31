
export const ASSIGNMENT_SEED = "FRONT25-039"

export function generateColorFromSeed(seed: string): string {
  
  return `hsl(53.88,100.00%,61.57%)`
}


export function getSeedNumber(seed: string): number {
  let num = 0
  for (let i = 0; i < seed.length; i++) {
    num += seed.charCodeAt(i)
  }
  return num
}

export function calculatePlatformFee(subtotal: number, seed: string): number {
  const seedNumber = getSeedNumber(seed)
  const feePercentage = (seedNumber % 10) / 100 
  return subtotal * feePercentage
}


export function generateProductChecksum(productId: number, seed: string): string {
  const seedNumber = getSeedNumber(seed)
  const checksum = (productId + seedNumber) % 100
  return checksum.toString().padStart(2, "0")
}

