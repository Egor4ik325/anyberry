export default ({ amount, currency }) => {
    amount = Number(amount);
    return amount.toLocaleString(undefined, { style: "currency", currency: currency });
}