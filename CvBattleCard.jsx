import React, { useState, useEffect } from "react";
import { Swords, Trophy, Skull, Activity, ShieldAlert, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function CvBattleCard({ cvName = "Candidate #1042", initialWins = 12, initialLosses = 4, refreshKey }) {
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });

  const [cvStatus, setCvStatus] = useState("loading");

  const totalGames = stats.wins + stats.losses;
  const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;
  const [triesLeft, setTriesLeft] = useState(0);
  const [cvNameState, setCvNameState] = useState("");
  const [loading, setLoading] = useState(true);

  // new code for fetching stats: 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/cv-rank/stats');
        if (!res.ok) throw new Error('Failed to fetch stats, make sure you upload cv first');
  
        const result = await res.json();
  
        const { name, wins, losses, cola } = result.data;
  
        setStats({ wins, losses });
        setTriesLeft(cola);
        setCvNameState(name);
        setCvStatus("active"); // ✅ success

      } catch (err) {
        console.error(err);

        setCvStatus("inactive"); // ❌ failure

      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, [refreshKey]);

  if (loading) {
    return <div className="text-white text-center">Loading stats...</div>;
  }


  const handleBattle = async () => {
    if (triesLeft <= 0) return; 
    
    setIsBattling(true);
    setTriesLeft((prev) => prev - 1); 
    setBattleResult(null);

    try {
      // does battle on the backend

      //const response = await fetch('/api/cv-rank/battle');
      const response = await fetch('/api/cv-rank/battle', {
        method: 'POST', // Change to POST so we can send the ID
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'the-actual-user-uuid-here' }) 
      });
      
      if (!response.ok) throw new Error('Server side error');
  
      const data = await response.json(); 

      // 'data' is now correctly scoped within the try block
      if (data.victory) {
        setStats((prev) => ({ ...prev, wins: prev.wins + 1 }));
        setBattleResult({ 
          status: "VICTORY", 
          msg: `${data.msg} (Opponent: ${data.opponentName})`, 
          color: "text-emerald-400" 
        });
      } else {
        setStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
        setBattleResult({ 
          status: "DEFEAT", 
          msg: `${data.msg} (Opponent: ${data.opponentName})`, 
          color: "text-red-400" 
        });
      }
    } catch (error) {
      setBattleResult({ 
        status: "ERROR", 
        msg: "The API connection fumbled.", 
        color: "text-orange-400" 
      });
    } finally {
      setIsBattling(false);
    }
  };
    
  

  return (
    <div className="dark w-full max-w-md mx-auto">
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden relative">
        {/* Top "Status" Bar */}
        <div className="bg-violet-600/10 border-b border-zinc-800 px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-violet-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest">
            CV Status: {cvStatus === "active" ? "Active" : "Inactive, upload your CV in step 1"}</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-[9px]">READY</Badge>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-end">
            <span className="text-xl font-black italic text-white uppercase truncate">{cvNameState || "Loading..."}</span>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-[14px]">WINS</span>
                <span className="text-emerald-400 text-[16px] font-bold">{stats.wins}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-[14px]">LOSS</span>
                <span className="text-red-500 text-[16px] font-bold">{stats.losses}</span>
              </div>
            </div>
          </CardTitle>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
              <span>Win Rate</span>
              <span>{winRate.toFixed(1)}%</span>
            </div>
            <Progress value={winRate} className="h-1.5 bg-zinc-800" indicatorClassName="bg-violet-500" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Battle Result Display */}
          <div className={`h-35 flex flex-col justify-center items-center border border-dashed rounded-lg transition-all ${battleResult ? 'bg-zinc-950 border-zinc-700' : 'border-zinc-800 bg-transparent'}`}>
            {isBattling ? (
              <div className="flex flex-col items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400 animate-bounce" />
                <span className="text-[14px] font-mono text-zinc-500 animate-pulse">CALCULATING DOMINANCE...</span>
              </div>
            ) : battleResult ? (
              <div className="text-center p-2 animate-in zoom-in-95 duration-300">
                <h4 className={`text-lg font-black italic tracking-widest ${battleResult.color}`}>
                  {battleResult.status}
                </h4>
                <p className="text-[14px] text-zinc-400 font-mono italic">{battleResult.msg}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-zinc-600">
                <ShieldAlert className="h-5 w-5 mb-1 opacity-20" />
                <span className="text-[14px] uppercase font-bold tracking-tighter">Waiting for combat...</span>
              </div>
            )}
          </div>
          
  
  {/* Battle Tokens Numeric Display */}
<div className="flex justify-between items-center mb-2 px-1">
  <span className="text-[12px] font-black uppercase text-zinc-500 tracking-tighter">
    Remaining Attempts
  </span>
  <div className="flex items-center gap-1.5">
    <Zap className={`h-3 w-3 ${triesLeft > 0 ? "text-yellow-400 fill-yellow-400" : "text-zinc-700"}`} />
    <span className={`font-mono text-sm font-bold ${triesLeft > 0 ? "text-white" : "text-red-500"}`}>
      {triesLeft} <span className="text-zinc-600 text-[10px]"> </span>
    </span>
  </div>
</div>



          <Button 
            onClick={handleBattle}
            disabled={isBattling || triesLeft === 0}
            className="w-full group relative overflow-hidden bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest transition-all"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Swords className={`h-4 w-4 ${isBattling ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
              {triesLeft === 0 ? "Out of Energy" : isBattling ? "In Combat..." : "Enter Battle Arena"}
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}