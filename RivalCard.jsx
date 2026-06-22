import React, { useState } from "react";
import { Swords, Activity, ShieldAlert, Zap, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function RivalCard({ onDone }) {
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [rivalEmail, setRivalEmail] = useState("");
  
  // Note: Since we aren't fetching stats, I've defaulted tries to a static number 
  // or you could pass this as a prop.
  const [triesLeft, setTriesLeft] = useState(5); 

  const handleBattle = async () => {
    if (!rivalEmail || triesLeft <= 0) return;
    
    setIsBattling(true);
    setBattleResult(null);

    try {
      const response = await fetch('/api/cv-rank/rival', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rivalEmail: rivalEmail,
          timestamp: new Date().toISOString()
        }) 
      });
      
      if (!response.ok) throw new Error('Server side error');
  
      const data = await response.json(); 
      setTriesLeft((prev) => prev - 1);

      if (data.victory) {
        setBattleResult({ 
          status: "VICTORY", 
          msg: `You dominated ${rivalEmail}!`, 
          color: "text-emerald-400" 
        });
      } else {
        setBattleResult({ 
          status: "DEFEAT", 
          msg: `${rivalEmail} had a stronger CV.`, 
          color: "text-red-400" 
        });
      }
    } catch (error) {
      setBattleResult({ 
        status: "ERROR", 
        msg: "The Arena is currently closed.", 
        color: "text-orange-400" 
      });
    } finally {
      setIsBattling(false);
      if (onDone) {
        onDone(); // 🔁 triggers CvBattleCard reload
      }
    }
  };

  return (
    <div className="dark w-full max-w-md mx-auto">
      <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
        {/* Status Header */}
        <div className="bg-violet-600/10 border-b border-zinc-800 px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-violet-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest">
              Direct Challenge Mode
            </span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-[9px]">PVP</Badge>
        </div>

        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-black italic text-white uppercase italic">
            Targeted Strike
          </CardTitle>
          <p className="text-zinc-500 text-[12px] uppercase font-bold tracking-tight">
            Enter a rival's email to initiate a CV comparison
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Input Area */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
            <Input 
              type="email"
              placeholder="rival@example.com"
              value={rivalEmail}
              onChange={(e) => setRivalEmail(e.target.value)}
              className="pl-10 bg-zinc-950 border-zinc-800 focus:border-violet-500 text-white placeholder:text-zinc-700 font-mono text-sm"
            />
          </div>

          {/* Result Display Area */}
          <div className={`h-24 flex flex-col justify-center items-center border border-dashed rounded-lg transition-all ${battleResult ? 'bg-zinc-950 border-zinc-700' : 'border-zinc-800 bg-transparent'}`}>
            {isBattling ? (
              <div className="flex flex-col items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400 animate-bounce" />
                <span className="text-[12px] font-mono text-zinc-500 animate-pulse">ANALYZING RIVAL...</span>
              </div>
            ) : battleResult ? (
              <div className="text-center p-2 animate-in zoom-in-95 duration-300">
                <h4 className={`text-lg font-black italic tracking-widest ${battleResult.color}`}>
                  {battleResult.status}
                </h4>
                <p className="text-[14px] text-zinc-400 font-mono italic px-4">{battleResult.msg}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-zinc-600">
                <ShieldAlert className="h-5 w-5 mb-1 opacity-20" />
                <span className="text-[12px] uppercase font-bold tracking-tighter">Awaiting Target Selection</span>
              </div>
            )}
          </div>
          
          
          

          <Button 
            onClick={handleBattle}
            disabled={isBattling || triesLeft === 0 || !rivalEmail}
            className="w-full group relative overflow-hidden bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest transition-all border-b-4 border-violet-800 active:border-b-0 active:translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Swords className={`h-4 w-4 ${isBattling ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
              {triesLeft === 0 ? "Out of Energy" : isBattling ? "Comparing..." : "Initiate Duel"}
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}