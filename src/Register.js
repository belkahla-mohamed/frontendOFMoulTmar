import axios from "axios";
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
export default function Register() {
    const [Register, setRegister] = useState({ firstName: "", lastName: "", userName: "", phone: null, email: "", password: "", Role: "user" })

    const navigate = useNavigate();

    const [msg, setmsg] = useState("");
    const formData = new FormData();
    function register() {
        if (Register.userName && Register.password) {
           
            for(const [key , value] of Object.entries(Register) )
            {
                formData.append(key , value);
            }

            axios.post('https://tmar-node-usamohamed2005-9148s-projects.vercel.app/users/signup', formData)
            .then((res)=>{
                if(res.data.status === 'success'){
                    setmsg(res.data.message)
                    navigate('/login')
                }else{
                    setmsg(res.data.message)
                }
            })

        } else {
            setmsg("يجب ملء جميع الحقول")
        }


    }
    return (
        <div className="flex h-screen  bg-[#4b2d1f]  text-center text-[#f7efe6]  w-full justify-center items-center ">
            <div className=" bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-[#4b2d1f] ">

                <h1 className="text-2xl  font-bold mb-3 text-[#4b2d1f]">إنشاء حساب</h1>

                <input type="text" className=" text-end p-1 w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4b2d1f]" placeholder="الاسم" required onChange={(e) => setRegister({ ...Register, firstName: e.target.value })} /><br />
                <input type="text" className=" text-end p-1 w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4b2d1f]" placeholder="الاسم الأول" onChange={(e) => setRegister({ ...Register, lastName: e.target.value })} /><br />
                <input type="text" className=" text-end p-1 w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4b2d1f]" placeholder="اسم المستخدم" onChange={(e) => setRegister({ ...Register, userName: e.target.value })} /><br />
                <input type="tel" className=" text-end p-1 w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4b2d1f]" placeholder="رقم الهاتف" onChange={(e) => setRegister({ ...Register, phone: e.target.value })} /><br />
                <input type="email" className=" text-end p-1 w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4b2d1f]" placeholder="البريد الإلكتروني" onChange={(e) => setRegister({ ...Register, email: e.target.value })} /><br />
                <input type="password" className="text-end p-1 w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4b2d1f]" placeholder="كلمة المرور" required onChange={(e) => setRegister({ ...Register, password: e.target.value })} /><br />
                <div className=" text-[#f7efe6] e">
                    <button onClick={register} className="w-full bg-[#4b2d1f] text-[#f7efe6] py-2 rounded hover:bg-[#3a2318] transition duration-300 font-[Almarai]">إنشاء حساب</button><br />
                    <button className="text-[#4b2d1f] underline hover:text-[#3a2318] transition duration-300 mt-3 " > <Link to="/login" className="font-[Almarai]"> تسجيل الدخول </Link></button><label className="mt-4  mr-1 text-sm text-gray-600">  لدي بالفعل حساب ؟      </label> <br />
                    <p className="text-red-500">{msg}</p>
                </div>




            </div>

        </div>
    )
}