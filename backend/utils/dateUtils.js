const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

const calculateTotalPrice = (pricePerDay, startDate, endDate) => {
  const days = calculateDays(startDate, endDate);
  return pricePerDay * days;
};

const checkDateConflict = (bookedDates, pickupDate, dropoffDate) => {
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);
  return bookedDates.some(({ startDate, endDate }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return pickup < end && dropoff > start;
  });
};

module.exports = { calculateDays, calculateTotalPrice, checkDateConflict };
