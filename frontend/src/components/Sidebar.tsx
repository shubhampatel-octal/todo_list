import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItem = [
    { name: 'Todo', link: '/' },
    { name: 'Business', link: '/business' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-[15%] bg-white px-2 pt-4 text-center shadow-lg">
      <div>
        <h1 className="text-2xl">sidebar</h1>
      </div>
      <div className="mt-4 flex h-full flex-col gap-4">
        {menuItem?.map((item) => (
          <Link key={item.name} to={item.link} className="block">
            <div className="rounded-md bg-gradient-to-r from-[#e0f7fa] to-[#e1f5fe] py-3 pl-6 text-start shadow-md transition-all duration-300 ease-in-out hover:from-[#0288d1] hover:to-[#26c6da] hover:text-white">
              <h1 className="text-lg font-medium">{item.name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
