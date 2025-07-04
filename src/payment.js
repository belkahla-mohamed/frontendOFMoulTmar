import React, { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PaymentPage = () => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartID, setCartID] = useState(null);
  const [userID, setUserID] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setUserID(jwtDecode(token).id);
    }
  }, [token]);

  // Fetch cart from backend
  useEffect(() => {
    async function fetchCart() {
      if (!userID) return;
      try {
        const res = await axios.post("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/cart", { userID });
        if (res.data.items) {
          setCartItems(res.data.items);
          setCartID(res.data._id || res.data.cartID || null); // fallback for cartID
          setTotalPrice(res.data.total || 0);
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'خطأ في تحميل السلة', text: err.message });
      }
    }
    fetchCart();
  }, [userID]);

  // Remove from cart (backend)
  const removeFromCart = async (id) => {
    try {
      const res = await axios.delete("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/cart/remove", {
        data: { userID, dateId: id }
      });
      if (res.data.cart && res.data.cart.items) {
        setCartItems(res.data.cart.items);
        setTotalPrice(res.data.cart.items.reduce((total, item) => total + (item.price * item.weight), 0));
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'خطأ في حذف العنصر', text: err.message });
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
          const res = await axios.put("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/cart/update", {
            userID,
            dateId: id,
            weight
          });
          if (res.data.cart && res.data.cart.items) {
            setCartItems(res.data.cart.items);
            setTotalPrice(res.data.cart.items.reduce((total, item) => total + (item.price * item.weight), 0));
          }
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

  // Handle payment form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const cardNumber = form.cardNumber.value;
    const expiryDate = form.expiryDate.value;
    const cvv = form.cvv.value;
    try {
      const res = await axios.post("https://tmar-node-usamohamed2005-9148s-projects.vercel.app/payments", {
        userID,
        cartID,
        amount: totalPrice,
        name,
        email,
        cardNumber,
        expiryDate,
        cvv
      });
      if (res.data.status === 'success') {
        Swal.fire({ icon: 'success', title: 'تم الدفع بنجاح', text: res.data.message });
        // Optionally clear cart here
      } else {
        Swal.fire({ icon: 'error', title: 'فشل الدفع', text: res.data.message });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'فشل الدفع', text: err.response?.data?.message || err.message });
    }
  };

  // Prepare cart data for display
  const filteredCartData = cartItems
    .map(({ name, price, weight }) => `${name}: DH${price} _ الوزن : kg${weight} `)
    .join("\n");

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#f4f4f9] to-[#ffffff] font-[Almarai]">
      <div className="flex justify-center items-center h-full">
        <div className="w-[100%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[35%] bg-white sm:p-12 p-5 rounded-xl shadow-lg">
          <div className="relative w-full flex justify-center items-center">
            <h2 className="text-[#4b2d1f] sm:text-4xl text-3xl font-semibold text-center mb-8">
              تأكيد الطلب
            </h2>
            <div onClick={() => setShowCart(!showCart)} className="absolute -top-2 sm:top-0 right-0 ">
              <i className="fa bg-green-600/30 fa-shopping-cart text-[#4b2d1f] relative py-4 px-4 rounded mr-3"></i>
              <p className="absolute -top-2 right-1 bg-red-500 rounded-[50%] px-2 ">{cartItems.length}</p>
            </div>
          </div>

          {/* Payment form to backend */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              name="name"
              placeholder="الاسم الكامل"
              className="p-4 font-[Almarai] text-end border-2 border-[#ddd] rounded-lg shadow-sm w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#4b2d1f] focus:border-[#4b2d1f] transition-all"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              className="p-4 font-[Almarai] text-end border-2 border-[#ddd] rounded-lg shadow-sm w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#4b2d1f] focus:border-[#4b2d1f] transition-all"
              required
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="رقم البطاقة"
              className="p-4 font-[Almarai] text-end border-2 border-[#ddd] rounded-lg shadow-sm w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#4b2d1f] focus:border-[#4b2d1f] transition-all"
              required
              maxLength={16}
            />
            <input
              type="text"
              name="expiryDate"
              placeholder="تاريخ الانتهاء (MM/YY)"
              className="p-4 font-[Almarai] text-end border-2 border-[#ddd] rounded-lg shadow-sm w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#4b2d1f] focus:border-[#4b2d1f] transition-all"
              required
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className="p-4 font-[Almarai] text-end border-2 border-[#ddd] rounded-lg shadow-sm w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#4b2d1f] focus:border-[#4b2d1f] transition-all"
              required
              maxLength={3}
            />
            {/* Show cart summary */}
            <textarea
              value={filteredCartData}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-end font-[Almarai]"
              rows={cartItems.length + 1}
            />
            <button
              type="submit"
              className="w-full bg-[#4b2d1f] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#5c3928] transition-all ease-in-out duration-300"
            >
              إرسال الطلب
            </button>
          </form>
        </div>
      </div>

      <div className={`fixed ${showCart ? 'translate-x-0' : 'translate-x-[700px]'} transition-all easeInOut w-[500px] flex max-sm:w-full flex-col w-1/3 min-h-screen z-40 bg-[#F7EFE6] top-16 sm:top-20 right-0 shadow-lg duration-300`}>
        <div className="flex justify-between items-center p-5">
          <div className="flex">
            <p className="text-xl font-bold">{totalPrice.toFixed(2)}DH </p>
            <p className="text-xl font-bold">: المجموع</p>
          </div>
          <div className="cursor-pointer text-[30px]" onClick={() => setShowCart(false)}><IoIosClose /></div>
        </div>

        <div className="overflow-y-auto flex py-20 flex-col items-center h-[calc(100vh-130px)] px-4">
          {cartItems.map((u) => (
            <div key={u.dateId || u._id || u.ID} className="w-full flex text-center justify-center mb-9 bg-white rounded-2xl py-[2em] shadow-md hover:translate-y-3 transition-transform duration-300">
              <div>
                <div className="text-[30px] mb-2 font-bold font-[Almarai]">{u.name || u.Name}</div>
                <div className="text-xl text-gray-700">{u.price || u.Price} </div>
                <div className="text-lg text-gray-600"><span className="font-bold font-[Almarai]">الوزن:</span> {u.weight} كغ</div>
                <button onClick={() => updateWeight(u.dateId || u._id || u.ID)} className="text-yellow-500 mx-4 mt-4 font-bold font-[Almarai]">تحديث الوزن</button>
                <button onClick={() => removeFromCart(u.dateId || u._id || u.ID)} className="text-red-500 mt-4 font-bold font-[Almarai]">حذف من السلة</button>
              </div>
              <div className="w-1/2 flex justify-center">
                <img src={`/PHP/${u.imagePath || u.ImagePath}`} alt={u.name || u.Name} className="w-[160px] h-[160px] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
