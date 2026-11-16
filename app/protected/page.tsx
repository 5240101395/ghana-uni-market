import { Suspense } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import RecentlyViewed from "../../components/RecentlyViewed";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search } from "lucide-react";

async function ProductList({ searchParams }: { searchParams: Promise<{ q?: string, category?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const searchQuery = params.q || "";
  const categoryQuery = params.category || "";

  let query = supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      image_url,
      is_sold,
      category,
      created_at,
      profiles!products_seller_id_fkey (
        institution,
        is_verified,
        whatsapp_number
      )
    `)
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  if (categoryQuery && categoryQuery !== "All") {
    query = query.eq("category", categoryQuery);
  }

  const { data: products, error } = await query;

  if (error) {
    console.log("SUPABASE ERROR: ", error.message);
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No items found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Try a different search or be the first to post this item!</p>
        <Link href="/protected/upload" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
          Post an Item
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const profile: any = Array.isArray(product.profiles) ? product.profiles[0] : product.profiles;
        let phone = profile?.whatsapp_number || "";
        if (phone.startsWith("0")) phone = "233" + phone.slice(1);
        
        const whatsappLink = phone 
          ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I'm interested in your listing "${product.title}" on Ghana UNI Market.`)}`
          : "#";

        return (
          <ProductCard 
            key={product.id} 
            id={product.id} 
            title={product.title} 
            price={product.price} 
            institution={profile?.institution || "Unknown"} 
            imageUrl={product.image_url || undefined}
            isVerified={profile?.is_verified || false}
            isSold={product.is_sold || false}
            whatsappLink={whatsappLink}
            sellerPhone={profile?.whatsapp_number || ""}
            createdAt={product.created_at}
          />
        );
      })}
    </div>
  );
}

export default function ProtectedPage({ searchParams }: { searchParams: Promise<{ q?: string, category?: string }> }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-slate-950 transition-colors">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        <RecentlyViewed />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Campus Marketplace</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Find items from verified students across Ghana.</p>
          </div>
          
          {/* UPDATED SEARCH BAR */}
          <form className="relative w-full md:w-96">
            <input 
              type="text" 
              name="q"
              placeholder="Search for laptops, books, hoodies..." 
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </form>
        </div>

        {/* UPDATED CATEGORY PILLS */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {["All", "Electronics", "Books", "Fashion", "Hostel", "Other"].map((cat) => (
            <Link 
              key={cat}
              href={`/protected?category=${cat}`}
              className="px-5 py-2 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-all whitespace-nowrap"
            >
              {cat === "All" ? "All Items" : cat}
            </Link>
          ))}
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 h-64 animate-pulse flex flex-col overflow-hidden shadow-sm">
                <div className="aspect-square bg-slate-200 dark:bg-slate-700 w-full" />
                <div className="p-4 space-y-3 flex-grow">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        }>
          <ProductList searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}