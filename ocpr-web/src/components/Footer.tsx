export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white/60">
      <div className="container-px mx-auto py-8 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} MedicalPRS. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-blue-700">Privacy</a>
          <a href="#" className="hover:text-blue-700">Terms</a>
        </div>
      </div>
    </footer>
  );
}
