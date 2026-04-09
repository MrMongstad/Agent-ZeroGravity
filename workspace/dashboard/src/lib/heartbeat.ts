export const STATE_POLLING_INTERVAL = 8000;

export const stateFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Vortex polling failed');
  return res.json();
};

export const formatCurrency = (val: string | number) => {
  if (typeof val === 'number') return `$${val.toFixed(2)}`;
  return val;
};
