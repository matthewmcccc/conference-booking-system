const calcPrice = (basePrice, t) => {
    const tempDiff = Math.abs(t - 21);
    
    if (tempDiff >= 0 && tempDiff < 2) {
        basePrice;
    } else if (tempDiff >= 2 && tempDiff < 5) {
        basePrice *= 1.1;
    } else if (tempDiff >= 5 && tempDiff < 10) {
        basePrice *= 1.2;
    } else if (tempDiff >= 10 && tempDiff < 20) {
        basePrice *= 1.3;
    } else if (tempDiff >= 20) {
        basePrice *= 1.5;
    }
 
    return Math.round(basePrice * 100) / 100;
}

module.exports = calcPrice;