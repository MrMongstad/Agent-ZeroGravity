import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle2,
  Edit2,
  Keyboard,
  Moon,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "../hooks/useTheme";
import { useMilestoneStore } from "../store/useMilestoneStore";

const SHORTCUTS = [
  { key: "D", description: "Toggle dark / light mode", icon: "ðŸŒ™" },
  { key: "N", description: "Open Add Milestone modal", icon: "âœ¦" },
  { key: "Esc", description: "Close any open modal", icon: "âŽ‹" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: "easeOut" as const },
  },
};

export default function SettingsPage() {
  const { projectName, setProjectName, resetToDefaults } = useMilestoneStore();
  const { isDark, toggleTheme } = useTheme();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(projectName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingName) setNameValue(projectName);
  }, [projectName, editingName]);

  const handleStartEdit = () => {
    setNameValue(projectName);
    setEditingName(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== projectName) {
      setProjectName(trimmed);
      toast.success("Project name updated", {
        icon: <CheckCircle2 size={16} />,
      });
    }
    setEditingName(false);
  };

  const handleCancelEdit = () => {
    setNameValue(projectName);
    setEditingName(false);
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    toast.success("Reset to default NorCast 2026 milestones", {
      icon: <CheckCircle2 size={16} />,
    });
  };

  return (
    <div className="p-6 lg:p-8 min-h-full">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">
          Preferences
        </p>
        <h1 className="gradient-text font-display font-black text-3xl lg:text-4xl">
          Settings
        </h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5 max-w-2xl"
      >
        {/* â”€â”€ Project Name â”€â”€ */}
        <motion.section
          variants={cardVariants}
          className="glass-card rounded-2xl p-6"
          data-ocid="settings.project.card"
        >
          <div className="mb-4">
            <h2 className="font-display font-bold text-base text-foreground">
              Project Name
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Displayed in the header and on reports
            </p>
          </div>

          <AnimatePresence mode="wait">
            {editingName ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Label htmlFor="project-name-input" className="sr-only">
                  Project name
                </Label>
                <Input
                  id="project-name-input"
                  ref={inputRef}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  onBlur={handleSaveName}
                  className="max-w-xs glass-card border-border font-display font-bold text-base"
                  data-ocid="settings.project_name.input"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSaveName}
                  aria-label="Save project name"
                  data-ocid="settings.project_name.save_button"
                  className="text-primary hover:bg-primary/10 shrink-0"
                >
                  <Check size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  aria-label="Cancel editing"
                  data-ocid="settings.project_name.cancel_button"
                  className="text-muted-foreground hover:bg-muted/40 shrink-0"
                >
                  <X size={16} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <span
                  className="font-display font-bold text-xl text-foreground min-w-0 truncate"
                  title={projectName}
                >
                  {projectName}
                </span>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  aria-label="Edit project name"
                  data-ocid="settings.project_name.edit_button"
                  className={cn(
                    "p-1.5 rounded-lg text-muted-foreground hover:text-foreground",
                    "hover:bg-muted/50 transition-smooth shrink-0",
                  )}
                >
                  <Edit2 size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* â”€â”€ Appearance â”€â”€ */}
        <motion.section
          variants={cardVariants}
          className="glass-card rounded-2xl p-6"
          data-ocid="settings.theme.card"
        >
          <h2 className="font-display font-bold text-base text-foreground mb-1">
            Appearance
          </h2>
          <p className="text-xs text-muted-foreground mb-5">
            Switch between dark glassmorphism and light mode
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-smooth",
                  isDark
                    ? "bg-primary/15 text-primary"
                    : "bg-amber-400/15 text-amber-400",
                )}
              >
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <div>
                <Label
                  htmlFor="theme-pill-toggle"
                  className="font-semibold text-sm text-foreground cursor-pointer block"
                >
                  {isDark ? "Dark Mode" : "Light Mode"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Press D to toggle
                </p>
              </div>
            </div>

            {/* Pill toggle */}
            <button
              id="theme-pill-toggle"
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              data-ocid="settings.theme.switch"
              className={cn(
                "relative flex items-center w-[88px] h-10 rounded-full p-1 transition-smooth shrink-0",
                isDark
                  ? "bg-primary/20 border border-primary/30"
                  : "bg-amber-400/20 border border-amber-400/30",
              )}
            >
              <span className="absolute left-2.5 text-muted-foreground opacity-60">
                <Moon size={13} />
              </span>
              <span className="absolute right-2.5 text-muted-foreground opacity-60">
                <Sun size={13} />
              </span>
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-smooth",
                  isDark
                    ? "bg-primary text-primary-foreground ml-0"
                    : "bg-amber-400 text-background ml-auto",
                )}
              >
                {isDark ? <Moon size={14} /> : <Sun size={14} />}
              </motion.span>
            </button>
          </div>
        </motion.section>

        {/* â”€â”€ Keyboard Shortcuts â”€â”€ */}
        <motion.section
          variants={cardVariants}
          className="glass-card rounded-2xl p-6"
          data-ocid="settings.shortcuts.card"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Keyboard size={16} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-muted-foreground">
                Quick actions available anywhere in the app
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {SHORTCUTS.map(({ key, description, icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.28 + i * 0.07,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl",
                  "bg-muted/30 border border-border/40 hover:bg-muted/50 transition-smooth",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-base shrink-0" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="text-sm text-foreground truncate">
                    {description}
                  </span>
                </div>
                <kbd
                  className={cn(
                    "inline-flex items-center px-3 py-1.5 rounded-lg ml-4",
                    "glass-card border border-primary/30 text-primary",
                    "text-xs font-mono font-bold tracking-wider shadow-sm shrink-0",
                    "min-w-[44px] justify-center",
                  )}
                >
                  {key}
                </kbd>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* â”€â”€ Reset Data â”€â”€ */}
        <motion.section
          variants={cardVariants}
          className="glass-card rounded-2xl p-6"
          data-ocid="settings.reset.card"
        >
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw size={15} className="text-destructive" />
            <h2 className="font-display font-bold text-base text-foreground">
              Reset Data
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-5 ml-6">
            Restore all milestones to the original NorCast 2024 dataset. This
            will overwrite any changes you&apos;ve made.
          </p>

          <AnimatePresence mode="wait">
            {!showResetConfirm ? (
              <motion.div
                key="trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(true)}
                  aria-label="Reset all data to defaults"
                  data-ocid="settings.reset.open_modal_button"
                  className={cn(
                    "rounded-full gap-2 border-destructive/50 text-destructive",
                    "hover:bg-destructive/10 hover:border-destructive transition-smooth",
                  )}
                >
                  <RotateCcw size={14} />
                  Reset to Default Data
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-4"
                data-ocid="settings.reset.dialog"
                aria-live="polite"
              >
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  Are you sure? This will reset all milestones to the original 8
                  NorCast 2026 milestones.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={handleReset}
                    aria-label="Confirm reset"
                    data-ocid="settings.reset.confirm_button"
                    className={cn(
                      "rounded-full bg-destructive text-destructive-foreground",
                      "hover:bg-destructive/90 gap-1.5",
                    )}
                  >
                    <RotateCcw size={13} />
                    Confirm Reset
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowResetConfirm(false)}
                    aria-label="Cancel reset"
                    data-ocid="settings.reset.cancel_button"
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </div>
  );
}
