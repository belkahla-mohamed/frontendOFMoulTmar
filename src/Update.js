import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";


export default function Update() {
  const { id } = useParams()
  const navigate = useNavigate();
  const [infos, setInfos] = useState();
  const [message, setMessage] = useState();

  function edit() {
    if(!infos?.oldPassword){
      setMessage("الرجاء إدخال كلمة السر القديمة");
      return;
    }
    axios.put(`https://tmar-node-usamohamed2005-9148s-projects.vercel.app/users/update/${id}`,
      infos,
      { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
    )
      .then((res) => {
        if (res.data.status === 'success') {
          navigate(`/Profile/${id}`)
        } else {
          setMessage(res.data.message)
        }
      })
      .catch((err)=> {
         if (err.response) {
        // السيرفر جاوب ولكن فيه مشكل
        setMessage(err.response.data.message); // هنا توصلك رسالة الخطأ
      } else {
        // مشكل آخر: الشبكة أو السيرفر طايح
        setMessage("حدث خطأ غير متوقع");
      }
      })

  }
  console.log(infos)

  useEffect(() => {
    if (!id) {
      navigate('/Produits')
    }
    axios.get(`https://tmar-node-usamohamed2005-9148s-projects.vercel.app/users/profile/${id}`,
      { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
    )
      .then((res) => {
        if (res.data.status === 'success') {
          setInfos(res.data.user)
        }
      })
  }, [id, navigate])


  return (
    <div className="flex h-screen bg-gray-100 pt-16 sm:pt-0 text-center w-full justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-5 text-gray-800">تفاصيل المستخدم</h1>
        <input
          type="text"
          defaultValue={infos?.firstName}
          className="w-full p-3 mb-4 text-end border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="الاسم"
          onChange={(e) => setInfos({ ...infos, firstName: e.target.value })}
        />
        <input
          type="text"
          defaultValue={infos?.lastName}
          className="w-full p-3 mb-4 text-end border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="الاسم الأول"
          onChange={(e) => setInfos({ ...infos, lastName: e.target.value })}
        />
        <input
          type="text"
          defaultValue={infos?.userName}
          className="w-full p-3 mb-4 text-end border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="الاسم الأول"
          onChange={(e) => setInfos({ ...infos, userName: e.target.value })}
        />
        <input
          type="tel"
          defaultValue={infos?.phone}
          className="w-full p-3 mb-4 text-end border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="رقم الهاتف"
          onChange={(e) => setInfos({ ...infos, phone: Number(e.target.value) })}
        />
        <input
          type="email"
          defaultValue={infos?.email}
          className="w-full text-end p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="البريد الإلكتروني"
          onChange={(e) => setInfos({ ...infos, email: e.target.value })}
        />
        <input
          type="password"

          className="w-full text-end p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="كلمة السر الخاص بك"
          onChange={(e) => setInfos({ ...infos, oldPassword: e.target.value })}
          required
        />
        <input
          type="password"
          className="w-full text-end p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="كلمة السر جديدة"
          onChange={(e) => setInfos({ ...infos, newPassword: e.target.value })}
        />
        <button
          onClick={edit}
          className="w-full bg-[#3a8e3a] text-white py-3 font-bold font-[Almarai] rounded-lg hover:bg-[#6BBF59] transition duration-300"
        >
          تعديل
        </button>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}