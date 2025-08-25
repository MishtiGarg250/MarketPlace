

export const ASSIGNMENT_SEED = "FRONT25-MKT2024"

export function getSeedNumber(seed : string):number{
    let num =0
    for(let i=0;i<seed.length;i++){
        num +=seed.charCodeAt(i)
    }
    return num
}

export function generateColorFromSeed(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Generate a vibrant color
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 50%)`
}

export function calculatePlatformfee(subTotal: number, seed:string): number{
    const seedNumber = getSeedNumber(seed);
    const feePercentage =(seedNumber %10)/100;
    return subTotal * feePercentage
}

export function generateProductChecksum(productId: number, seed: string): string {
  const seedNumber = getSeedNumber(seed)
  const checksum = (productId + seedNumber) % 100
  return checksum.toString().padStart(2, "0")
}