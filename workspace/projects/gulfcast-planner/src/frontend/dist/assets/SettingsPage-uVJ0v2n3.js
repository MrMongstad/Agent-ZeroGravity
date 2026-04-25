import { a as createLucideIcon, h as useMilestoneStore, k as useTheme, r as reactExports, j as jsxRuntimeExports, B as Button, c as cn, M as Moon, l as Sun, g as ue } from "./index-ByULjW2Y.js";
import { A as AnimatePresence, L as Label, I as Input, C as Check, X, P as Pen } from "./label-CTjz4LZA.js";
import { m as motion, C as CircleCheck } from "./proxy-DzBZnJ3Y.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10 8h.01", key: "1r9ogq" }],
  ["path", { d: "M12 12h.01", key: "1mp3jc" }],
  ["path", { d: "M14 8h.01", key: "1primd" }],
  ["path", { d: "M16 12h.01", key: "1l6xoz" }],
  ["path", { d: "M18 8h.01", key: "emo2bl" }],
  ["path", { d: "M6 8h.01", key: "x9i8wu" }],
  ["path", { d: "M7 16h10", key: "wp8him" }],
  ["path", { d: "M8 12h.01", key: "czm47f" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }]
];
const Keyboard = createLucideIcon("keyboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
const SHORTCUTS = [
  { key: "D", description: "Toggle dark / light mode", icon: "🌙" },
  { key: "N", description: "Open Add Milestone modal", icon: "✦" },
  { key: "Esc", description: "Close any open modal", icon: "⎋" }
];
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: "easeOut" }
  }
};
function SettingsPage() {
  const { projectName, setProjectName, resetToDefaults } = useMilestoneStore();
  const { isDark, toggleTheme } = useTheme();
  const [editingName, setEditingName] = reactExports.useState(false);
  const [nameValue, setNameValue] = reactExports.useState(projectName);
  const [showResetConfirm, setShowResetConfirm] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!editingName) setNameValue(projectName);
  }, [projectName, editingName]);
  const handleStartEdit = () => {
    setNameValue(projectName);
    setEditingName(true);
    setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 0);
  };
  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== projectName) {
      setProjectName(trimmed);
      ue.success("Project name updated", {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 })
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
    ue.success("Reset to default GulfCast 2024 milestones", {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 })
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 lg:p-8 min-h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "mb-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium", children: "Preferences" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "gradient-text font-display font-black text-3xl lg:text-4xl", children: "Settings" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
        className: "space-y-5 max-w-2xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              variants: cardVariants,
              className: "glass-card rounded-2xl p-6",
              "data-ocid": "settings.project.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-foreground", children: "Project Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Displayed in the header and on reports" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: editingName ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.97 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.97 },
                    transition: { duration: 0.15 },
                    className: "flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "project-name-input", className: "sr-only", children: "Project name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "project-name-input",
                          ref: inputRef,
                          value: nameValue,
                          onChange: (e) => setNameValue(e.target.value),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") handleSaveName();
                            if (e.key === "Escape") handleCancelEdit();
                          },
                          onBlur: handleSaveName,
                          className: "max-w-xs glass-card border-border font-display font-bold text-base",
                          "data-ocid": "settings.project_name.input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          onClick: handleSaveName,
                          "aria-label": "Save project name",
                          "data-ocid": "settings.project_name.save_button",
                          className: "text-primary hover:bg-primary/10 shrink-0",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          onClick: handleCancelEdit,
                          "aria-label": "Cancel editing",
                          "data-ocid": "settings.project_name.cancel_button",
                          className: "text-muted-foreground hover:bg-muted/40 shrink-0",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                        }
                      )
                    ]
                  },
                  "editing"
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.15 },
                    className: "flex items-center gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-display font-bold text-xl text-foreground min-w-0 truncate",
                          title: projectName,
                          children: projectName
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: handleStartEdit,
                          "aria-label": "Edit project name",
                          "data-ocid": "settings.project_name.edit_button",
                          className: cn(
                            "p-1.5 rounded-lg text-muted-foreground hover:text-foreground",
                            "hover:bg-muted/50 transition-smooth shrink-0"
                          ),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 14 })
                        }
                      )
                    ]
                  },
                  "display"
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              variants: cardVariants,
              className: "glass-card rounded-2xl p-6",
              "data-ocid": "settings.theme.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-foreground mb-1", children: "Appearance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-5", children: "Switch between dark glassmorphism and light mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-smooth",
                          isDark ? "bg-primary/15 text-primary" : "bg-amber-400/15 text-amber-400"
                        ),
                        children: isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 18 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "theme-pill-toggle",
                          className: "font-semibold text-sm text-foreground cursor-pointer block",
                          children: isDark ? "Dark Mode" : "Light Mode"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Press D to toggle" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      id: "theme-pill-toggle",
                      type: "button",
                      role: "switch",
                      "aria-checked": isDark,
                      "aria-label": "Toggle dark mode",
                      onClick: toggleTheme,
                      "data-ocid": "settings.theme.switch",
                      className: cn(
                        "relative flex items-center w-[88px] h-10 rounded-full p-1 transition-smooth shrink-0",
                        isDark ? "bg-primary/20 border border-primary/30" : "bg-amber-400/20 border border-amber-400/30"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2.5 text-muted-foreground opacity-60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 13 }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2.5 text-muted-foreground opacity-60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 13 }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.span,
                          {
                            layout: true,
                            transition: { type: "spring", stiffness: 500, damping: 32 },
                            className: cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-smooth",
                              isDark ? "bg-primary text-primary-foreground ml-0" : "bg-amber-400 text-background ml-auto"
                            ),
                            children: isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 14 })
                          }
                        )
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              variants: cardVariants,
              className: "glass-card rounded-2xl p-6",
              "data-ocid": "settings.shortcuts.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { size: 16 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-foreground", children: "Keyboard Shortcuts" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Quick actions available anywhere in the app" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: SHORTCUTS.map(({ key, description, icon }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: {
                      delay: 0.28 + i * 0.07,
                      duration: 0.3,
                      ease: "easeOut"
                    },
                    className: cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl",
                      "bg-muted/30 border border-border/40 hover:bg-muted/50 transition-smooth"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0", "aria-hidden": "true", children: icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate", children: description })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "kbd",
                        {
                          className: cn(
                            "inline-flex items-center px-3 py-1.5 rounded-lg ml-4",
                            "glass-card border border-primary/30 text-primary",
                            "text-xs font-mono font-bold tracking-wider shadow-sm shrink-0",
                            "min-w-[44px] justify-center"
                          ),
                          children: key
                        }
                      )
                    ]
                  },
                  key
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              variants: cardVariants,
              className: "glass-card rounded-2xl p-6",
              "data-ocid": "settings.reset.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 15, className: "text-destructive" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-foreground", children: "Reset Data" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-5 ml-6", children: "Restore all milestones to the original GulfCast 2024 dataset. This will overwrite any changes you've made." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !showResetConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.15 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => setShowResetConfirm(true),
                        "aria-label": "Reset all data to defaults",
                        "data-ocid": "settings.reset.open_modal_button",
                        className: cn(
                          "rounded-full gap-2 border-destructive/50 text-destructive",
                          "hover:bg-destructive/10 hover:border-destructive transition-smooth"
                        ),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 14 }),
                          "Reset to Default Data"
                        ]
                      }
                    )
                  },
                  "trigger"
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8, scale: 0.98 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 8, scale: 0.98 },
                    transition: { duration: 0.2 },
                    className: "rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-4",
                    "data-ocid": "settings.reset.dialog",
                    "aria-live": "polite",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium leading-relaxed", children: "Are you sure? This will reset all milestones to the original 8 GulfCast milestones." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            onClick: handleReset,
                            "aria-label": "Confirm reset",
                            "data-ocid": "settings.reset.confirm_button",
                            className: cn(
                              "rounded-full bg-destructive text-destructive-foreground",
                              "hover:bg-destructive/90 gap-1.5"
                            ),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 13 }),
                              "Confirm Reset"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            onClick: () => setShowResetConfirm(false),
                            "aria-label": "Cancel reset",
                            "data-ocid": "settings.reset.cancel_button",
                            className: "rounded-full text-muted-foreground hover:text-foreground",
                            children: "Cancel"
                          }
                        )
                      ] })
                    ]
                  },
                  "confirm"
                ) })
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  SettingsPage as default
};
