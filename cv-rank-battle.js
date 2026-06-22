// cv rank battle part
import { useEffect, useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Target, Swords,
  Flame, Menu, X, 
  Cpu, 
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Head from 'next/head';


// --- New Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0 gap-2">
            <Swords className="h-6 w-6 text-violet-500" />
            <span className="text-xl font-black italic tracking-tighter uppercase text-white">
              CV<span className="text-violet-600"> RANK BATTLE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div>
            <Button variant="ghost" asChild className="text-[10px] font-black uppercase tracking-widest text-zinc-100 hover:bg-zinc-900">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest px-6 h-9">
              <Link href="/signup">Signup</Link>
            </Button>
          </div>

          
        </div>
      </div>

     
    </nav>
  );
};


const PurchaseLink = () => {
  useEffect(() => {
    // Ensuring the Polar script is available and initializing
    if (window.PolarEmbedCheckout) {
      window.PolarEmbedCheckout.init();
    }
  }, []);

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-violet-500/30">

      <Head>
        <title>Add Credits | CV Rank Battle - Level Up Your Resume </title>
        <meta name="description" content="Purchase Battle Tokens to rank your CV with AI." />
        <meta property="og:title" content="CV Rank battle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />
      {/* Script Tag for Polar - Best practice to keep it in the component for single-page use */}
      <script src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js" defer data-auto-init></script>

      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
          <ArrowLeft className="h-3 w-3" /> Return to Home
        </Link> 

        {/* Header Section */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-violet-500 text-violet-400 font-mono tracking-widest px-4">
           AI RESUME ANALYSIS CREDITS
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
          Get CV Battle <span className="text-violet-600">Credits</span>
          </h1>
          <p className="text-zinc-500 text-m md:text-base max-w-xl mx-auto font-medium">
            Acquire combat tokens to fuel your AI resume analysis and CV ranking simulations.
            Higher tiers grant priority processing and advanced analytics.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1: Recruit Free */}
          <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col justify-between group hover:border-zinc-700 transition-all">
            <CardHeader>
              <Target className="h-6 w-6 text-zinc-500 mb-2" />
              <CardTitle className="text-xl font-black italic tracking-tight text-white uppercase">Recruit Bundle</CardTitle>
              <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Single Operation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">Free</span>
                <span className="text-zinc-600 font-mono text-xs uppercase">/ 3 Credits</span>
              </div>
              <ul className="text-s space-y-2 text-zinc-400 font-medium">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-violet-500 rounded-full" /> 3 Battle Tokens</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-violet-500 rounded-full" /> Standard Analysis</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-[10px]">
                
                  <Link href="/signup">
                      Try for Free
                      </Link>
                  
                
              </Button>
            </CardFooter>
          </Card>

          {/* Tier 2: Challenger (Recommended) */}
          <Card className="bg-zinc-900 border-violet-600 shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col justify-between relative scale-105 z-10">
            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl-lg tracking-widest">
              Most Popular
            </div>
            <CardHeader>
              <Zap className="h-6 w-6 text-violet-500 mb-2 fill-violet-500" />
              <CardTitle className="text-xl font-black italic tracking-tight text-white uppercase">Challenger Tier</CardTitle>
              <CardDescription className="text-violet-400 text-[10px] font-bold uppercase tracking-widest">Standard Package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-zinc-500 font-mono text-xs uppercase">/ 50 Credits</span>
              </div>
              <ul className="text-s space-y-2 text-zinc-300 font-medium">
                <li className="flex items-center gap-2 text-violet-400 font-bold underline decoration-violet-500/30 underline-offset-4">
                   Best Battle Value
                </li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-violet-500 rounded-full" /> 50 Battle Tokens</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-violet-500 rounded-full" /> Priority Processing</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-violet-500 rounded-full" /> Export Combat Logs</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-violet-500/20">
                
                <Link href="https://buy.polar.sh/polar_cl_OyGngxj81Nhz0BPyTqZT5Yrahd8NxXjdL8km231zzag" 
                   >
                    Purchase Challenger
                  </Link>
                  
                
              </Button>
            </CardFooter>
          </Card>

          {/* Tier 3: Elite */}
          <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col justify-between group hover:border-zinc-700 transition-all">
            <CardHeader>
              <Flame className="h-6 w-6 text-orange-500 mb-2" />
              <CardTitle className="text-xl font-black italic tracking-tight text-white uppercase">Elite Tier</CardTitle>
              <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Elite Access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$49</span>
                <span className="text-zinc-600 font-mono text-xs uppercase">/ 150 Credits</span>
              </div>
              <ul className="text-s space-y-2 text-zinc-400 font-medium">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-500 rounded-full" /> 150 Battle Tokens</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-500 rounded-full" /> Updates included</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-500 rounded-full" /> 24/7 Support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-[10px]">
                
                  <Link href="https://buy.polar.sh/polar_cl_MexAsMEOQFOutuY5L3m5GHiv2C4snI6uPYhPr2Ghjr5" 
                   >
                    Purchase Elite

                   </Link>
                  
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* How It Works Section */}
<section className="py-12 border-y border-zinc-900">
  <div className="text-center mb-16 space-y-4">
    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
      How it <span className="text-violet-600">Works</span>
    </h2>
    <p className="text-zinc-500 text-s max-w-2xl mx-auto">
      CV Battle uses AI to simulate a high-stakes hiring environment by matching and competing against other resumes. 
      Here is how you dominate the applicant pool.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
    {/* Step 1 */}
    <div className="space-y-4">
      <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-violet-500 font-black italic">
        01
      </div>
      <h3 className="text-lg font-black uppercase italic tracking-tight text-zinc-100">Deploy Your CV</h3>
      <p className="text-s text-zinc-500 leading-relaxed">
        Upload your resume in PDF format. Our AI extracts your core stats & skills, 
        experience, and impact metrics—preparing your profile for the ranking arena.
      </p>
    </div>

    {/* Step 2 */}
    <div className="space-y-4">
      <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-violet-500 font-black italic">
        02
      </div>
      <h3 className="text-lg font-black uppercase italic tracking-tight text-zinc-100">Global Ranking</h3>
      <p className="text-s text-zinc-500 leading-relaxed">
        Our algorithm benchmarks your CV against other industry resumes. 
        See where you land in the leaderboard for your resume.
      </p>
    </div>

    {/* Step 3 */}
    <div className="space-y-4">
      <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-violet-500 font-black italic">
        03
      </div>
      <h3 className="text-lg font-black uppercase italic tracking-tight text-zinc-100">Target Rivals</h3>
      <p className="text-s text-zinc-500 leading-relaxed">
        Have a specific competitor or benchmark in mind? Use your Battle Tokens to 
        target specific CV profiles and invite your friends to fight against their CV.
      </p>
    </div>
  </div>
</section>

        {/* Security Footer */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-950 rounded-lg">
              <CreditCard className="h-5 w-5 text-zinc-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-100 tracking-widest">Secure Checkout</p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase">Powered by Polar Infrastructure</p>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase text-zinc-100 tracking-widest">Contact Info</p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase">Email: 11ffilippi@gmail.com </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <ShieldCheck className="h-4 w-4 text-emerald-500" />
             <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">SSL Encrypted / PCI Compliant</span>
             <Link href="/tos" className="hover:text-red-500">Terms</Link>
            <Link href="/privacy" className="hover:text-red-500">Privacy</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

// Internal CardDescription helper
function CardDescription({ children, className }) {
  return <p className={`text-sm ${className}`}>{children}</p>;
}

export default PurchaseLink;