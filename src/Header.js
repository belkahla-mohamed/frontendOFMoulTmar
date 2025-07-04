import axios from "axios";
import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { easeInOut, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

export default function Header() {

  const [action, setAction] = useState(true);
  const token = sessionStorage.getItem('token');
  const locate = useLocation();
  const [render, setRender] = useState(false)
  const [idUser, setIdUser] = useState(null);

  function logout() {
    setAction(!action);
    axios.post('https://tmar-node-usamohamed2005-9148s-projects.vercel.app/users/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.status === 'success') {
          sessionStorage.removeItem('token')
          localStorage.removeItem('paniersl')
          setRender(!render)
        }
      })
  }

  useEffect(() => {
    if(token){
      setIdUser(jwtDecode(token).id)
    }
  }, [render, token, idUser])

  return (
    <motion.div className="fixed px-3 bg-[#f7efe6] py-3 text-[#4b2d1f] w-full shadow top-0 left-0 mb-[0px] z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: easeInOut }}
    >
      <div className="flex justify-between items-center">
        {/* Desktop Header */}
        <div className="hidden sm:flex space-x-4">
          {/* Login/Account Button */}
          {!token ? (
            <button className="bg-[#3a8e3a] text-[#f7efe6] font-bold px-[20px] py-[8px] rounded border-[2px] border-[#f7efe6] hover:bg-[#f7efe6] hover:border-[#3a8e3a] hover:text-[#3a8e3a] transition duration-[0.6s] ease-in-out">
              <Link to="/login" className="font-[Almarai]">تسجيل الدخول </Link>
            </button>
          ) : (
            <button className="bg-[#f39c12] text-[#f7efe6] font-bold px-[20px] py-[8px] rounded border-[2px] border-[#f7efe6] hover:bg-[#f7efe6] hover:border-[#3a8e3a] hover:text-[#3a8e3a] transition duration-[0.6s] ease-in-out">
              <Link to={`/Profile/${idUser}`} className="font-[Almarai]">الحساب</Link>
            </button>
          )}

          {/* Logout Button */}
          {token && (
            <button
              onClick={logout}
              className="bg-[#f7efe6] text-[#4b2d1f] font-bold px-[20px] py-[8px] rounded border-[2px] border-[#4b2d1f] hover:bg-[#4b2d1f] hover:border-[#f7efe6] hover:text-[#f7efe6] transition duration-[0.6s] ease-in-out"
            >
              <Link to="/login" className="font-[Almarai]">تسجيل الخروج</Link>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex space-x-4">
          <div
            className={`bg-[#f7efe6] flex px-4 py-3 sm:flex hidden focus-within:border-black-500 overflow-hidden max-w-md mx-auto font-[sans-serif]`}
          >
            <div className="flex items-center justify-between gap-[30px]">

              {locate.pathname === "/" ?
                <p className="text-[25px] font-bold text-[#f7efe6] font-[Almarai]">القائمة الرئيسية</p>
                :
                <Link to="/"><p className="text-[25px] font-bold  font-[Almarai]">القائمة الرئيسية</p></Link>

              }

            </div>
          </div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button className="flex sm:hidden" onClick={() => setAction(!action)}>
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>





        {/* Brand Name */}
        <div className="font-bold text-[30px] cursor-pointer" style={{ fontFamily: "Reem Kufi" }}>
          <Link to="/">
            &#127796;  مـُـول الـتّــمـر
          </Link>
        </div>

      </div>












      {/* Mobile Navigation Menu */}
      <div
        className={`${action ? "hidden" : ""
          } mt-[2em] sm:hidden space-y-4 h-screen text-center`}
      >

        <ul className="space-y-4">
          <li onClick={() => setAction(!action)}><Link to="/"><p className="text-[19px] font-[Almarai] font-bold">القائمة الرئيسية</p></Link></li>

        </ul>
        <ul className="space-y-4">
          <li>
            {!token ? (
              <button onClick={() => setAction(!action)} className="bg-[#3a8e3a] text-[#f7efe6] font-bold px-[20px] py-[8px] rounded border-[2px] border-[#f7efe6] hover:bg-[#f7efe6] hover:border-[#3a8e3a] hover:text-[#3a8e3a] transition duration-[0.6s] ease-in-out">
                <Link to="/login" className="font-[Almarai]">تسجيل الدخول </Link>
              </button>
            ) : (
              <button onClick={() => setAction(!action)} className="bg-[#f39c12] text-[#f7efe6] font-bold px-[20px] py-[8px] rounded border-[2px] border-[#f7efe6] hover:bg-[#f7efe6] hover:border-[#3a8e3a] hover:text-[#3a8e3a] transition duration-[0.6s] ease-in-out">
                <Link to={`/Profile/${idUser}`} className="font-[Almarai]">الحساب</Link>
              </button>
            )}
          </li>
          <li>
            {token && (
              <button onClick={logout} className="bg-[#f7efe6] text-[#4b2d1f] font-bold px-[20px] py-[8px] rounded border-[2px] border-[#4b2d1f] hover:bg-[#4b2d1f] hover:border-[#f7efe6] hover:text-[#f7efe6] transition duration-[0.6s] ease-in-out">
                <Link to="/login" className="font-[Almarai]">تسجيل الخروج</Link>
              </button>
            )}
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
