export const generateColorFromSeed = (seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
};

// Generate checksum digit from seed + product id
export const generateChecksumId = (productId, seed) => {
    let sum = productId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
    return productId + (sum % 10);
};

// Platform fee: (seed_number % 10) % of subtotal
export const calculatePlatformFee = (subtotal, seedNumber) => {
    return subtotal * ((seedNumber % 10) / 100);
};
