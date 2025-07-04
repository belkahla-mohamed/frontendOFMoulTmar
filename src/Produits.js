import { useEffect, useState } from "react";
import CardDate from "./CardDate";
import { Link, useNavigate } from "react-router-dom";

import { IoIosClose } from "react-icons/io";
import Swal from "sweetalert2";
import { easeInOut, motion } from "framer-motion"
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Produits() {
    const [Message, setMessage] = useState('');
    const [Dates, setDates] = useState([]);
    const [datesfilrer, setDatesfilrer] = useState([]);
    const [Search, setSearch] = useState("");
    const [cartItems, setCartItems] = useState([]); // Backend cart
    const [showCart, setShowCart] = useState(false);
    const token = sessionStorage.getItem('token');
    const [userID, setUserID] = useState(null);
    const navigate = useNavigate()

    // Fetch dates
    useEffect(() => {
        const filtrage = () => {
            setDatesfilrer(Dates.filter((date) => date.Name.toLowerCase().includes(Search.toLowerCase())));
        };
        filtrage();
    }, [Search,Dates]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/dates");
                const data = await res.json();
                if (data.status === "success") {
                    setDates(data.dates);
                    setDatesfilrer(data.dates);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if(token){
            setUserID(jwtDecode(token).id);
        }
    }, [token]);

    // Fetch cart from backend (use POST to send userID in body)
    useEffect(() => {
        async function fetchCart() {
            if (!userID) return;
            try {
                const res = await axios.post("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/cart", { userID });
                if (res.data.items) setCartItems(res.data.items);
                else if (res.data.message) setMessage(res.data.message);
            } catch (err) {
                setMessage("خطأ في تحميل السلة");
                console.error("Error fetching cart:", err);
            }
        }
        fetchCart();
    }, [userID]);

    // Add to cart (backend)
    async function pn(id) {
        const find = Dates.find((date) => date._id === id);
        if (!find) return;
        if (!userID) {
            Swal.fire({
                title: 'يجب تسجيل الدخول ',
                icon: 'error',
                customClass: { title: 'font-[Almarai] font-bold', confirmButton: 'bg-green-500' },
                confirmButtonText: 'حسنا',
            }).then((result) => {
                if (result.isConfirmed) navigate('/login')
            });
            return;
        }
        // Prompt for weight
        Swal.fire({
            title: `الاسم: ${find.Name}<br> الوزن بالكيلوغرام:`,
            input: "number",
            customClass: { title: 'font-[Almarai] text-[#4b2d1f]', confirmButton: 'bg-green-500' },
            inputAttributes: {
                autocapitalize: "off",
                placeholder: "يرجى إدخال رقم",
                oninvalid: "this.setCustomValidity('يرجى إدخال رقم صالح')",
                oninput: "this.setCustomValidity('')"
            },
            showCancelButton: true,
            cancelButtonText: 'إلغــاء',
            confirmButtonText: "أضــف",
            showLoaderOnConfirm: true,
            preConfirm: async (number) => {
                try {
                    const weight = parseFloat(number);
                    if (!number || isNaN(weight) || weight <= 0) throw new Error("يرجى إدخال وزن صحيح.");
                    // Call backend to add item, send userID and dateId
                    const res = await axios.post("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/cart/add", {
                        userID,
                        dateId: find._id, // use MongoDB _id
                        name: find.Name,
                        price: find.Price,
                        imagePath: find.ImagePath,
                        weight
                    });
                    if (res.data.cart && res.data.cart.items) setCartItems(res.data.cart.items);
                    setShowCart(true);
                } catch (error) {
                    Swal.showValidationMessage(error.message);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: `تم الإضافة للسلة`, icon: "success", draggable: true });
            }
        });
    }

    // Remove from cart (backend)
    const removeFromCart = async (id) => {
        try {
            // Send userID and dateId in body using axios.delete with data
            const res = await axios.delete("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/cart/remove", {
                data: { userID, dateId: id }
            });
            if (res.data.cart && res.data.cart.items) setCartItems(res.data.cart.items);
        } catch (err) {
            console.error("Error removing from cart:", err);
        }
    };

    // Update weight (backend)
    const updateWeight = (id) => {
        Swal.fire({
            title: ":أدخل الوزن الجديد بالكيلوغرام",
            input: "number",
            customClass: { title: 'font-[Almarai] text-[#4b2d1f]', confirmButton: 'bg-green-500' },
            inputAttributes: { autocapitalize: "off" },
            showCancelButton: true,
            cancelButtonText: 'إلغــاء',
            confirmButtonText: "تحديث",
            showLoaderOnConfirm: true,
            preConfirm: async (number) => {
                try {
                    const weight = parseFloat(number);
                    if (!number || isNaN(weight) || weight <= 0) throw new Error("يرجى إدخال وزن صحيح.");
                    // Call backend to update item, send userID and dateId
                    const res = await axios.put("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/cart/update", {
                        userID,
                        dateId: id,
                        weight
                    });
                    if (res.data.cart && res.data.cart.items) setCartItems(res.data.cart.items);
                } catch (error) {
                    Swal.showValidationMessage(error.message);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ title: `تم تحديث الوزن`, icon: "success", draggable: true });
            }
        });
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.weight), 0);

    return (
        <div className="pt-20 w-full h-full bg-[#F7EFE6] scroll-smooth transition-all duration-300">

            <div className="flex justify-center items-center my-8">
                <motion.input
                    initial={{ y: -500, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: easeInOut }}
                    type="text"
                    placeholder="...بحث"
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-end bg-[#F7EFE6] pl-10 pr-4 py-2 w-auto sm:w-[400px] rounded-lg shadow-lg outline-none font-[Almarai] font-bold ring-2 ring-[#4B2D1F] border-[#4B2D1F] transition-all duration-300"
                />
            </div>


            <div
                className="z-10 fixed top-[45%] -right-16 bg-red-500 px-2 rounded-l-full cursor-pointer shadow-lg transition-all duration-300"
                onClick={() => setShowCart(!showCart)}
            >
                <i className="fa fa-shopping-cart text-white py-4 px-2 mr-3"></i>
                Panier
            </div>

            {datesfilrer.length > 0 ? (
                <div className="px-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-[40px]">
                    {datesfilrer.map((date, index) => (
                        <motion.div key={date._id || index}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.2, ease: easeInOut,
                                delay: 0.2 * index
                            }}
                        >
                            <CardDate AddPanier={pn} pn={pn} date={date} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="w-full text-center bg-[#F7EFE6] sm:text-[30px] font-bold font-[Almarai]">
                    {Message ? Message : "...جاري التحميل"}
                </p>
            )}

            {showCart && (
                <div className="fixed flex max-sm:w-full flex-col w-1/3 min-h-screen z-[99] bg-[#F7EFE6] top-0 right-0 rounded-l-3xl shadow-lg transition-transform duration-300">
                    <div className="flex justify-between items-center p-5">
                        <div className="flex">
                            <p className="text-xl font-bold">{totalPrice.toFixed(2)}DH </p>
                            <p className="text-xl font-bold">: المجموع</p>
                        </div>
                        <div className="cursor-pointer text-[30px]" onClick={() => setShowCart(false)}><IoIosClose /></div>
                    </div>

                    <div className="overflow-y-auto h-[calc(100vh-130px)] px-4">
                        {cartItems.map((u) => (
                            <div
                                key={u.dateId || u._id || u.ID}
                                className="w-auto flex text-center justify-center mb-9 bg-white rounded-2xl py-[2em] shadow-md hover:translate-y-3 transition-transform duration-300"
                            >
                                <div>
                                    <div className="text-[30px] mb-2 font-bold font-[Almarai]">{u.name || u.Name}</div>
                                    <div className="text-xl text-gray-700">{u.price || u.Price} </div>
                                    <div className="text-lg text-gray-600"><span className="font-bold font-[Almarai]">الوزن:</span> {u.weight} كغ</div>
                                    <button onClick={() => updateWeight(u.dateId || u._id || u.ID)} className="text-yellow-500 mx-4 mt-4 font-bold font-[Almarai]">تحديث الوزن</button>
                                    <button onClick={() => removeFromCart(u.dateId || u._id || u.ID)} className="text-red-500 mt-4 font-bold font-[Almarai]">حذف من السلة</button>
                                </div>
                                <div className="w-1/2 flex justify-center">
                                    <img
                                        src={`/PHP/${u.imagePath || u.ImagePath}`}
                                        alt={u.name || u.Name}
                                        className="w-[200px] h-[160px] rounded-lg shadow-md"
                                    />
                                </div>
                            </div>
                        ))}
                        {/* الدفع*/}
                        {totalPrice > 0 ? (
                            <Link to="/payment"><button className="bg-[#8B4513] text-white mb-5 w-full py-3 rounded-lg font-bold font-[Almarai] hover:bg-[#A0522D] ">
                                الدفع
                            </button>
                            </Link>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
