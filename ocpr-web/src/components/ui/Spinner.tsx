export default function Spinner({ size = 20 }: { size?: number }) {
  const s = `${size}px`;
  return <span style={{ width: s, height: s }} className="inline-block animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 align-[-2px]" />;
}
