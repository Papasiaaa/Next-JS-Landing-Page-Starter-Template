// src/pages/buy/[id].js
import { useRouter } from "next/router";
import Link from "next/link";
import { products } from "../../data/products";
import { useState } from "react";

export default function BuyPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find(p => p.id === id) || products[0];

  const WALLET = process.env.NEXT_PUBLIC_WALLET_ADDR || "YOUR_TONKEEPER_ADDRESS";
  const [email, setEmail] = useState("");
  const [txid, setTxid] = useState("");

  const mailtoBody = encodeURIComponent(
    `سلام،%0D%0A
    من تراکنش را انجام دادم.%0D%0A
    محصول: ${product.title}%0D%0A
    ایمیل: ${email}%0D%0A
    TXID: ${txid}%0D%0A
    `
  );
  const mailtoLink = `mailto:you@yourmail.com?subject=Payment%20for%20${encodeURIComponent(product.title)}&body=${mailtoBody}`;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("کپی شد!");
    } catch (e) {
      alert("کپی نشد — لطفا دستی کپی کنید.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <img src={product.image} alt="cover" className="w-48 mb-4" />
      <p className="mb-2">{product.description}</p>
      <p className="mb-2">قیمت: <b>{product.priceText}</b></p>

      <div className="bg-gray-50 p-4 rounded mb-4">
        <p className="mb-2">آدرس Tonkeeper برای واریز:</p>
        <pre className="bg-white p-2 rounded break-words">{WALLET}</pre>
        <div className="flex gap-2 mt-2">
          <button onClick={()=>copyToClipboard(WALLET)} className="px-3 py-2 bg-blue-600 text-white rounded">کپی آدرس</button>
          <a href="/assets/images/qr.png" target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-200 rounded">مشاهده QR</a>
        </div>
        <p className="text-sm text-gray-600 mt-2">توضیح: لطفاً بعد از واریز، TXID را در فرم وارد کنید تا پرداخت بررسی شود.</p>
      </div>

      <form onSubmit={(e)=>{ e.preventDefault(); window.location.href = mailtoLink; }}>
        <label className="block mb-1">ایمیل</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required className="border p-2 w-full mb-2" />
        <label className="block mb-1">TXID تراکنش</label>
        <input value={txid} onChange={e=>setTxid(e.target.value)} required className="border p-2 w-full mb-2" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">ثبت و ارسال اطلاع رسانی</button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        پس از دریافت ایمیل/اطلاع، پرداخت بررسی می‌شود و لینک دانلود برای شما ایمیل خواهد شد.
      </p>

      <p className="mt-6"><Link href="/"><a className="text-blue-500">بازگشت به فروشگاه</a></Link></p>
    </div>
  );
}
