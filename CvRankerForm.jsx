import React, { useState } from "react";
import { Upload, Sword, Eye, EyeOff, Terminal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function CvRankerForm({ onDone }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [rankName, setRankName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(""); // clear previous errors

    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const res = await fetch("/api/cv-rank/pdf", { method: "POST", body: formData });
      const data = await res.json();
      setText(data.text);

      // Stop if backend returned an error
      if (!res.ok) {
        setErrorMessage(data.message || "Upload failed");
        setLoading(false);
        return;
      }

      await fetch("/api/cv-rank/todb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.text,
          rankName: rankName || "Anonymous Challenger",
          isPublic,
        }),
      });
    } catch (error) {
      console.error("Critical Failure:", error);
    } finally {
      setLoading(false);
      if (onDone) {
        onDone(); // 🔁 triggers CvBattleCard reload
      }
    }
  };

  return (
    // The 'dark' class here ensures Shadcn components use dark variables
    <div className="dark w-full max-w-2xl mx-auto">
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Badge variant="outline" className="border-violet-500 text-violet-400 font-mono tracking-widest">
              SYSTEM ONLINE
            </Badge>
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white">
            CV <span className="text-violet-500">Rank</span> Battle
          </CardTitle>
          <CardDescription className="text-zinc-400">Calculate your professional power level.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all cursor-pointer"
            >
              <Upload className={`w-8 h-8 mb-2 ${file ? "text-emerald-400" : "text-zinc-500"}`} />
              <span className="text-s font-bold uppercase text-zinc-300">
                {file ? file.name : "Upload PDF"}
              </span>
              <input id="cv-upload" type="file" className="hidden" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-zinc-500">Codename</Label>
                <Input
                  placeholder="Enter Alias..."
                  value={rankName}
                  onChange={(e) => setRankName(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800 self-end">
                <span className="text-[12px] font-bold uppercase text-zinc-400 flex items-center gap-2 px-2">
                  {isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} Public
                </span>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
            </div>

            {errorMessage && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {errorMessage}
            </div>
            )}


            <Button
              type="submit"
              //onClick={onRefresh} // could remove
              disabled={!file || loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase"
            >
              {loading ? "Analyzing..." : "Initiate Ranking"}
            </Button>
          </form>

          {text && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
              <Separator className="mb-4 bg-zinc-800" />
              <div className="rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="bg-zinc-900 px-3 py-1 border-b border-zinc-800 flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-emerald-400" />
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Output_Log</span>
                </div>
                <ScrollArea className="h-40 p-3 text-[11px] font-mono text-zinc-400">
                  {text}
                </ScrollArea>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}