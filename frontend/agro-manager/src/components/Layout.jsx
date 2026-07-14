import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <main className="p-4 w-full bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}