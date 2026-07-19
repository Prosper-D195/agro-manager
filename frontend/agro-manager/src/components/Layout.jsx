import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef7ef] flex flex-col">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.45),_transparent_28%),radial-gradient(circle_at_center,_rgba(255,255,255,0.35),_transparent_45%)]" />
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute top-28 right-16 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 bg-[radial-gradient(circle,_rgba(87,130,92,0.18)_0%,_rgba(87,130,92,0.08)_35%,_transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 bg-[radial-gradient(circle,_rgba(87,130,92,0.18)_0%,_rgba(87,130,92,0.08)_35%,_transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 left-0 h-80 w-32 -rotate-12 bg-[linear-gradient(180deg,rgba(107,142,111,0.22),rgba(107,142,111,0.08),transparent)] blur-2xl rounded-full" />
        <div className="absolute bottom-0 left-10 h-64 w-16 rotate-6 bg-[linear-gradient(180deg,rgba(120,170,125,0.3),rgba(120,170,125,0.08),transparent)] blur-2xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-80 w-32 rotate-12 bg-[linear-gradient(180deg,rgba(107,142,111,0.22),rgba(107,142,111,0.08),transparent)] blur-2xl rounded-full" />
        <div className="absolute bottom-0 right-10 h-64 w-16 -rotate-6 bg-[linear-gradient(180deg,rgba(120,170,125,0.3),rgba(120,170,125,0.08),transparent)] blur-2xl rounded-full" />
      </div>

      <div className="relative z-10">
        <Navbar />
      </div>

      <div className="relative z-10 flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto min-h-[calc(100vh-180px)] flex flex-col">
            <div className="flex-1">{children}</div>

            <footer className="mt-8 rounded-2xl border border-white/60 bg-white/55 backdrop-blur-md px-5 py-4 text-sm text-gray-600 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="font-semibold text-gray-800">Agro Manager</div>
                  <p>Solution de gestion pour exploitations agricoles.</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Contact</div>
                  <p>Téléphone : +221 70 113 66 45</p>
                  <p>Email : prosperdossou211@gmail.com</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Adresse</div>
                  <p>SOMONE, Sénégal</p>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}