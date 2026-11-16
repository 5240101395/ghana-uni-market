import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CheckCircle2, Trash2, ShieldAlert, Store, Users, Package, MessageCircle } from "lucide-react";

const ADMIN_EMAIL = "sampsonantwi96@gmail.com"; 

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/protected"); 
  }

  // 1. Fetch students who are NOT verified
  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_verified", false);

  // 2. Fetch scam reports
  const { data: reports } = await supabase
    .from("reports")
    .select(`*, products ( title, id )`);

  // 3. Fetch seller upgrade requests
  const { data: sellerRequests } = await supabase
    .from("seller_requests")
    .select(`*, profiles ( full_name, id )`)
    .eq("status", "pending");

  // 4. Fetch support messages
  const { data: supportMessages } = await supabase
    .from("support_messages")
    .select("*")
    .eq("is_resolved", false)
    .order("created_at", { ascending: false });

  // 5. Fetch counts for the summary cards
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true });

  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true });

  // Server Actions
  async function verifyStudent(formData: FormData) {
    "use server";
    const studentId = formData.get("studentId") as string;
    const supabaseServer = await createClient();
    await supabaseServer.from("profiles").update({ is_verified: true }).eq("id", studentId);
    redirect("/admin");
  }

  async function deleteProduct(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    const supabaseServer = await createClient();
    await supabaseServer.from("products").delete().eq("id", productId);
    redirect("/admin");
  }

  async function approveSeller(formData: FormData) {
    "use server";
    const requestId = formData.get("requestId") as string;
    const userId = formData.get("userId") as string;
    const supabaseServer = await createClient();
    
    await supabaseServer.from("profiles").update({ role: 'seller' }).eq("id", userId);
    await supabaseServer.from("seller_requests").update({ status: 'approved' }).eq("id", requestId);
    
    redirect("/admin");
  }

  async function resolveMessage(formData: FormData) {
    "use server";
    const msgId = formData.get("msgId") as string;
    const supabaseServer = await createClient();
    await supabaseServer.from("support_messages").update({ is_resolved: true }).eq("id", msgId);
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Admin Dashboard</h1>
        
        {/* ADMIN SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalUsers || 0}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalProducts || 0}</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* SECTION 1: PENDING VERIFICATIONS */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Pending Student Verifications</h2>
            {!students || students.length === 0 ? (
              <p className="text-slate-500 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">No pending verifications.</p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg dark:text-white">{student.full_name || "No Name Provided"}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">ID: {student.student_id || "N/A"}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">School: {student.institution || "N/A"}</p>
                    </div>
                    <form action={verifyStudent}>
                      <input type="hidden" name="studentId" value={student.id} />
                      <button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <CheckCircle2 className="w-4 h-4" /> Verify Student
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: SELLER REQUESTS */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Store className="w-6 h-6" /> Seller Upgrade Requests
            </h2>
            {!sellerRequests || sellerRequests.length === 0 ? (
              <p className="text-slate-500 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">No pending upgrade requests.</p>
            ) : (
              <div className="space-y-4">
                {sellerRequests.map((req) => {
                  const reqProfile: any = Array.isArray(req.profiles) ? req.profiles[0] : req.profiles;
                  return (
                    <div key={req.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">{reqProfile?.full_name || "Unknown User"}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Transaction ID: <strong>{req.transaction_id}</strong></p>
                      </div>
                      <form action={approveSeller}>
                        <input type="hidden" name="requestId" value={req.id} />
                        <input type="hidden" name="userId" value={reqProfile?.id} />
                        <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          <CheckCircle2 className="w-4 h-4" /> Approve Seller
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* SECTION 3: SCAM REPORTS */}
          <section>
            <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" /> Scam Reports
            </h2>
            {!reports || reports.length === 0 ? (
              <p className="text-slate-500 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">No scam reports. Great job everyone!</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => {
                  const product: any = Array.isArray(report.products) ? report.products[0] : report.products;
                  return (
                    <div key={report.id} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
                      <p className="font-bold text-red-800 dark:text-red-400">Reason: {report.reason}</p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">Product: {product?.title || "Deleted Product"}</p>
                      <form action={deleteProduct} className="mt-3">
                        <input type="hidden" name="productId" value={product?.id} />
                        <button type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          <Trash2 className="w-4 h-4" /> Delete Product
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* SECTION 4: CUSTOMER SUPPORT MESSAGES */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" /> Customer Support Messages
            </h2>
            {!supportMessages || supportMessages.length === 0 ? (
              <p className="text-slate-500 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">No new support messages.</p>
            ) : (
              <div className="space-y-4">
                {supportMessages.map((msg) => (
                  <div key={msg.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">{msg.name}</h3>
                        <p className="text-sm text-slate-500">{msg.email || "No email provided"}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(msg.created_at).toLocaleString()}</p>
                      </div>
                      <form action={resolveMessage}>
                        <input type="hidden" name="msgId" value={msg.id} />
                        <button type="submit" className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors font-medium whitespace-nowrap">
                          Mark Resolved
                        </button>
                      </form>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm mt-3">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
          
        </div>
      </main>
    </div>
  );
}