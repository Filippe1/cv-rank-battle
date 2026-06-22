import { CvRankerForm } from "@/components/CvRankerForm";
import { CvBattleCard } from "@/components/CvBattleCard";
import { Leaderboard } from "@/components/Leaderboard";
import { RivalCard } from "@/components/RivalCard";
import { BuyCreditsButton } from "@/components/BuyCreditsButton";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  // new code: 
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1); // 🔁 changes value → forces refetch
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 md:p-12">
  {/* Header Section */}
  <div className="max-w-7xl mx-auto mb-12 text-center">
    <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">
      CV<span className="text-violet-600"> RANK </span> BATTLE
    </h1>
    <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em]">Battle-Hardened Recruitment Terminal</p>
  </div>

  <div className="max-w-4xl mx-auto mb-6">
    <Link href="/dashboard">
      <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-400">
        Back to Dashboard
      </Button>
    </Link>
  </div>

  <div className="max-w-4xl mx-auto mb-6">
    <Link href="/dashboard/cv-rank-battle/profile">
      <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-400">
        Profile
      </Button>
    </Link>
  </div>

  {/* Changed grid-cols-12 to a simpler max-width container for better scaling */}
  <div className="max-w-4xl mx-auto space-y-12"> 
    
    {/* Section 01 */}
    <section className="w-full">
      <h2 className="text-zinc-600 text-[12px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-zinc-800"></span> 01. Resume Intake
      </h2>
      {/* Ensure CvRankerForm doesn't have a max-width inside it */}
      <CvRankerForm onDone={triggerRefresh}/>
    </section>

    {/* Section 02 - The Battle Arena */}
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-zinc-600 text-[12px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-zinc-800"></span> 02. Auto Combat
        </h2>
        <CvBattleCard refreshKey={refreshKey} />
        <div className="flex justify-center w-full pt-2">
        <div className="w-55 md:w-64">
        <Link href="/tools/cv-rank-battle">
          <BuyCreditsButton />
          </Link>
        </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-zinc-600 text-[12px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-zinc-800"></span> 03. Target Rival
        </h2>
        <RivalCard onDone={triggerRefresh}/>
      </div>
    </section>

    {/* Section 03 */}
    <section className="w-full">
      <h2 className="text-zinc-600 text-[12px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-zinc-800"></span> 04. Global Rankings
      </h2>
      <Leaderboard />
    </section>

  </div>
</main>
  );
}