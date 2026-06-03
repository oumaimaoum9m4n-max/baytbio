const formatPrice = (price: number, withMad: boolean = true) => {
  return (
    new Intl.NumberFormat("fr-MA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(price)
      .replace(/\./g, " ") + (withMad ? "DH" : "")
  ); // Replaces non-breaking spaces with regular spaces
};
export default formatPrice;
