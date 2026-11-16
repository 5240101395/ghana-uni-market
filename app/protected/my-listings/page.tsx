import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trash2, Eye } from "lucide-react";

async function MyProducts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/auth/login");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  async function deleteProduct(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    const supabaseServer = await createClient();
    await supabaseServer.from("products").delete().eq("id", productId);
    redirect("/protected/my-listings");
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">You have no listings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-4">Start selling to other students today!</p>
        <Link href="/protected/upload" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Post an Item
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No img</div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg dark:text-white">{product.title}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold">GH₵ {product.price.toFixed(2)}</p>
              {product.is_sold && (
                <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full mt-1 inline-block">SOLD</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link 
              href={`/product/${product.id}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" /> View
            </Link>

            <form action={deleteProduct} className="flex-1 sm:flex-none">
              <input type="hidden" name="productId" value={product.id} />
              <button type="submit" className="w-full flex items-center justify-center gap-1 text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Listings</h1>
        <Suspense fallback={<p className="text-slate-500 animate-pulse">Loading your listings...</p>}>
          <MyProducts />
        </Suspense>
      </main>
    </div>
  );
}