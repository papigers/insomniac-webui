import logo from 'assets/logo.png';

export default function Header() {
  return (
    <>
      <header className="text-gray-700 bg-white border-b body-font sticky top-0 z-20">
        <div className="container flex flex-col flex-wrap p-5 mx-auto md:items-center md:flex-row h-20">
          <a
            href="/"
            className="flex items-center w-40 h-full mb-4 font-medium text-gray-900 title-font md:mb-0"
          >
            <img src={logo} alt="Insomniac" className="max-h-full w-auto" />
            <span className="ml-2 text-xl">Insomniac</span>
          </a>
          {/* <div className="flex items-center mx-auto lg:pl-20">
            <div className="relative w-full mr-4 text-left ">
              <input
                type="text"
                id="hero-field"
                name="hero-field"
                className="flex-grow w-full px-4 py-2 mr-4 text-base text-blue-700 bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:ring-0"
              />
            </div>
            <button className="flex items-center px-4 py-2 mt-auto font-semibold text-white transition duration-500 ease-in-out transform rounded-lg l bg-gradient-to-r from-blue-700 hover:from-blue-600 to-blue-600 hover:to-blue-700 focus:ring focus:outline-none">
              Action
            </button>
          </div>
          <button className="p-1 ml-auto text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring ">
            <span className="sr-only">View notifications</span>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button
            className="flex ml-3 text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            id="user-menu"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 border border-white rounded-full"
              src="https://res.cloudinary.com/the-unicorns-feed/image/upload/v1606463246/avatars/mke2_wnzylr.png"
              alt=""
            />
          </button>
         */}
        </div>
      </header>
    </>
  );
}
