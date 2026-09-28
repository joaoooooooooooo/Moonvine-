const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function distribute(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  let allocated = 0;
  return weights.map((weight, index) => {
    const value = index === weights.length - 1 ? total - allocated : Math.floor(total * weight / sum);
    allocated += value;
    return value;
  });
}

// Synthetic daily values whose totals match the source's weekly fixtures.
export function searchClicksSeries(lens) {
  const current = distribute(lens.value, [67, 89, 64, 74, 112, 121, 98]);
  const previous = distribute(Math.round(lens.value / (1 + lens.delta / 100)), [64, 85, 68, 71, 108, 116, 92]);
  return days.map((day, index) => ({ day, current: current[index], previous: previous[index] }));
}
