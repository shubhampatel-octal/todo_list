import { useEffect, useRef, useState } from 'react';
// import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import BusinessModel from '../components/BusinessModel';
import { IBusiness } from '../type';

function Business() {
  const [todo, setTodo] = useState('');
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { user, setUser, businessData, setBusinessData } = useAuth();
  const [searchResult, setSearchResult] = useState<IBusiness[] | null>(businessData);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchResult(businessData);
  }, [businessData]);

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buttonRef.current?.click();
    }
  };

  const handleSearch = async () => {
    const searchResult = businessData?.filter((business) =>
      business.name.toLowerCase().includes(todo.toLowerCase())
    );

    setSearchResult(searchResult || []);
  };

  const handleLogout = async () => {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <>
      <Sidebar />
      <div className="flex w-full justify-end">
        <div className="min-h-screen w-[85%] scroll-auto px-4 py-10">
          <section className="mx-auto w-[90vw] max-w-5xl rounded-xl bg-white px-6 py-6 shadow-lg transition-all duration-300 ease-in-out">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="text-xl font-semibold text-gray-800 capitalize">
                Welcome, {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md border border-red-500 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-red-500"
              >
                Logout
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-6 flex rounded-md shadow-sm">
              <input
                type="text"
                className="w-full rounded-l-md border border-amber-400 bg-gray-100 px-4 py-2 text-base focus:outline-amber-500"
                placeholder="Enter Business Name"
                value={todo}
                onKeyDown={handleInputKeyPress}
                onChange={(e) => setTodo(e.target.value)}
              />
              <button
                ref={buttonRef}
                onClick={handleSearch}
                className="rounded-r-md bg-yellow-400 px-5 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-yellow-500"
              >
                Search
              </button>
            </div>

            {/* Business Section */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Business</h3>
                <button
                  type="button"
                  className="rounded-full bg-yellow-400 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-yellow-500"
                  onClick={() => setOpen(true)}
                >
                  Create Business
                </button>
              </div>

              {/* Business Cards */}
              <div className="space-y-3">
                {searchResult?.map((business) => (
                  <div
                    key={business._id}
                    onClick={() => navigate('/businessDetail/' + business._id)}
                    className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={business.imgLink}
                          alt={business.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800">{business.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">Owner: {business.ownerName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <BusinessModel open={open} setOpen={setOpen} setBusinessData={setBusinessData} />
    </>
  );
}

export default Business;
