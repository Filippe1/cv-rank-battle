import React, { useEffect, useState } from "react";
import { Trophy, Medal, Crown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/cv-rank/leaderboard");
        const data = await res.json();

        const formatted = (data.leaderboard || []).map((p, index) => ({
          id: index,
          alias: p.name,
          wins: p.wins,
          losses: p.losses,
        }));

        setLeaders(formatted);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortedLeaders = [...leaders].sort((a, b) => b.wins - a.wins);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 1:
        return <Medal className="h-4 w-4 text-zinc-300" />;
      case 2:
        return <Medal className="h-4 w-4 text-orange-400" />;
      default:
        return (
          <span className="text-zinc-600 font-mono text-[10px] ml-1">
            #{index + 1}
          </span>
        );
    }
  };

  const getRowStyle = (index) => {
    if (index === 0) return "bg-yellow-500/5 border-l-2 border-l-yellow-500";
    if (index === 1) return "bg-zinc-100/5 border-l-2 border-l-zinc-400";
    if (index === 2) return "bg-orange-500/5 border-l-2 border-l-orange-600";
    return "border-l-2 border-l-transparent";
  };

  return (
    <div className="dark w-full max-w-2xl mx-auto">
      <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden">
        <CardHeader className="bg-zinc-900/50 border-b border-zinc-800 flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <Trophy className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-widest italic text-white">
                Global <span className="text-violet-500">Rankings</span>
              </CardTitle>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                Season 01 // Hall of Fame
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="font-mono text-violet-400 border-violet-500/30"
          >
            {loading ? "..." : sortedLeaders.length} REGISTERED
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader className="bg-zinc-900/30 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-[80px] text-[14px] uppercase font-bold text-zinc-500 tracking-widest">
                    Rank
                  </TableHead>
                  <TableHead className="text-[14px] uppercase font-bold text-zinc-500 tracking-widest">
                    Alias
                  </TableHead>
                  <TableHead className="text-right text-[14px] uppercase font-bold text-zinc-500 tracking-widest">
                    Wins
                  </TableHead>
                  <TableHead className="text-right text-[14px] uppercase font-bold text-zinc-500 tracking-widest">
                    Losses
                  </TableHead>
                  <TableHead className="text-right text-[14px] uppercase font-bold text-zinc-500 tracking-widest">
                    Ratio
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedLeaders.map((player, index) => {
                  const winRatio = (
                    (player.wins / (player.wins + player.losses)) *
                    100
                  ).toFixed(0);

                  return (
                    <TableRow
                      key={player.id}
                      className={`${getRowStyle(
                        index
                      )} border-zinc-900 hover:bg-violet-500/5 transition-colors group`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(index)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`font-bold tracking-tight ${
                            index < 3
                              ? "text-zinc-100"
                              : "text-zinc-400"
                          }`}
                        >
                          {player.alias}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-mono font-bold text-emerald-400">
                        <span className="text-[16px]"> 
                        {player.wins} 
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-mono text-red-500/70">
                        {player.losses}
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="text-[12px] font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-zinc-400 group-hover:border-violet-500/50 transition-colors">
                          {winRatio}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!loading && sortedLeaders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-zinc-500 py-10"
                    >
                      No leaderboard data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}