import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  User, 
  Mail, 
  Coins, 
  Calendar, 
  RefreshCcw, 
  ShieldCheck, 
  PlusCircle, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';

import Link from "next/link";


// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setProfile(data.profile);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-violet-500 animate-spin" />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Decrypting Profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]">VERIFIED OPERATOR</Badge>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              User <span className="text-violet-500">Profile</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
          <Link href="/dashboard/cv-rank-battle">
             <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-400">
               Back to CV Rank Battle
             </Button>
             </Link>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Credit Card Module */}
          <Card className="md:col-span-1 bg-gradient-to-br from-violet-600 to-indigo-700 border-none shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-black">Available Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-white" />
                <span className="text-5xl font-black text-white italic">{profile.cola}</span>
              </div>
              <Button className="w-full bg-white text-violet-700 hover:bg-zinc-100 font-black uppercase tracking-widest text-xs group">
                <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                
                
                <Link href="/tools/cv-rank-battle">
                Buy More Credits
                </Link>
                  
                
              </Button>
            </CardContent>
          </Card>

          {/* Account Details Module */}
          <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Identity Specs</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold">
                  <User className="h-3 w-3" /> System ID
                </span>
                <p className="font-mono text-sm text-zinc-200 truncate">{profile.user_id}</p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold">
                  <Mail className="h-3 w-3" /> Email Address
                </span>
                <p className="font-mono text-sm text-zinc-200 truncate">{profile.email}</p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold">
                  <Calendar className="h-3 w-3" /> Enlisted On
                </span>
                <p className="font-mono text-sm text-zinc-200">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold">
                  <RefreshCcw className="h-3 w-3" /> Last Synced
                </span>
                <p className="font-mono text-sm text-zinc-200">
                  {new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Utility Bar */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono text-zinc-500">
              STATUS: <span className="text-emerald-500 font-bold">STABLE</span>
            </div>
            <Separator orientation="vertical" className="h-4 bg-zinc-800 hidden sm:block" />
            <div className="text-[10px] font-mono text-zinc-500">
              LATENCY: <span className="text-violet-500 font-bold">24MS</span>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}