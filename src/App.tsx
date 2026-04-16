/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Copy, Eraser, Wand2, Database } from 'lucide-react';
import { formatSQL } from '@/src/lib/sql-formatter-logic';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      toast.error('請輸入 SQL 或 Stored Procedure 代碼');
      return;
    }
    const formatted = formatSQL(input);
    setOutput(formatted);
    toast.success('排版完成！');
  }, [input]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('已複製到剪貼簿');
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    toast.info('已清除內容');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white border-b border-border px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Database size={18} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-primary">SQL_SMOOTH_PRETTIER</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              TAB to 2 Spaces
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              No Auto-wrap
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              SP Optimization
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Ready to Format
          </span>
        </div>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Input Section */}
        <section className="space-y-3">
          <div className="editor-container flex flex-col bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Raw SQL Input</span>
              <span className="text-[9px] font-medium text-slate-400 uppercase">CTRL+V TO PASTE</span>
            </div>
            <Textarea
              placeholder="在此貼入您的 SQL 或 Stored Procedure..."
              className="min-h-[650px] border-none focus-visible:ring-0 rounded-none font-mono text-[13px] p-5 resize-none bg-[#1e1e1e] text-[#d4d4d4] leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </section>

        {/* Output Section */}
        <section className="space-y-3">
          <div className="editor-container flex flex-col bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Formatted Result</span>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-primary uppercase">2 SPACES INDENT</span>
                {output && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    className="h-6 px-2 text-[10px] font-bold uppercase hover:bg-primary hover:text-white rounded-md border border-primary/20 text-primary transition-all"
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </Button>
                )}
              </div>
            </div>
            <div className="relative group">
              <AnimatePresence mode="wait">
                {output ? (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 font-mono text-[13px] whitespace-pre overflow-x-auto min-h-[650px] leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] selection:bg-primary/30"
                  >
                    {output}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="p-5 font-mono text-[13px] flex items-center justify-center min-h-[650px] italic uppercase tracking-widest bg-[#1e1e1e] text-[#d4d4d4]"
                  >
                    Waiting for input...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Floating Action Button */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleClear}
            className="bg-white border-border hover:bg-slate-50 text-muted-foreground font-bold px-8 rounded-xl shadow-lg transition-all"
          >
            <Eraser className="mr-2 h-4 w-4" />
            CLEAR
          </Button>
          <Button 
            size="lg" 
            onClick={handleFormat}
            className="bg-primary hover:bg-blue-700 text-white font-bold px-10 rounded-xl shadow-xl shadow-primary/30 transition-all transform hover:scale-105 active:scale-95"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            PRETTIFY SQL STRUCTURE
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6 text-[11px] font-medium text-muted-foreground">
          <span>Engine: V8 Core</span>
          <span className="w-1 h-1 bg-border rounded-full" />
          <span>Protocol: MSSQL/TSQL</span>
          <span className="w-1 h-1 bg-border rounded-full" />
          <span>Build 2024.0.1</span>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          Pressing Format will automatically clear TAB characters and apply 2-space indentation.
        </p>
        <div className="text-[11px] font-bold text-primary uppercase tracking-tighter">
          © 2024 SQL_SMOOTH_PRETTIER
        </div>
      </footer>
    </div>
  );
}
