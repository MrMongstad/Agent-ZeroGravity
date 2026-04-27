import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMilestones } from "../hooks/useMilestones";
import { COLOR_MAP } from "../types/milestone";
import type {
  Milestone,
  MilestoneColor,
  MilestoneStatus,
} from "../types/milestone";

interface FormData {
  title: string;
  desc: string;
  date: string;
  status: MilestoneStatus;
  color: MilestoneColor;
}

interface MilestoneModalProps {
  milestone: Milestone | null;
  onClose: () => void;
}

export function MilestoneModal({ milestone, onClose }: MilestoneModalProps) {
  const { addMilestone, updateMilestone } = useMilestones();
  const isEdit = !!milestone;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    values: {
      title: milestone?.title ?? "",
      desc: milestone?.desc ?? "",
      date: milestone?.date ?? new Date().toISOString().split("T")[0],
      status: milestone?.status ?? "upcoming",
      color: milestone?.color ?? "blue",
    },
  });

  const selectedColor = watch("color");
  const selectedStatus = watch("status");

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Focus trap + Escape close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Auto-focus the dialog container on mount
    dialog.focus();

    const FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onSubmit = (data: FormData) => {
    if (isEdit && milestone) {
      updateMilestone(milestone.id, data);
      toast.success("Milestone updated");
    } else {
      addMilestone(data);
      toast.success("Milestone added");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-ocid="milestone.modal"
      >
        <motion.dialog
          ref={dialogRef}
          key="modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="glass-card rounded-2xl w-full max-w-md shadow-2xl bg-transparent p-0 open:flex flex-col"
          open
          aria-modal="true"
          aria-label={isEdit ? "Edit Milestone" : "Add Milestone"}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.08)]">
            <h2 className="font-display font-bold text-lg text-foreground">
              {isEdit ? "Edit Milestone" : "Add Milestone"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              data-ocid="milestone.modal.close_button"
              className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 space-y-4"
            noValidate
          >
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-medium text-foreground"
              >
                Title *
              </Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="Milestone title..."
                className="glass-card border-border"
                data-ocid="milestone.modal.title.input"
              />
              {errors.title && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="milestone.modal.title.field_error"
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="desc"
                className="text-xs font-medium text-foreground"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                {...register("desc")}
                placeholder="Brief description..."
                rows={3}
                className="glass-card border-border resize-none"
                data-ocid="milestone.modal.desc.textarea"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label
                htmlFor="date"
                className="text-xs font-medium text-foreground"
              >
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                {...register("date", { required: "Date is required" })}
                className="glass-card border-border"
                data-ocid="milestone.modal.date.input"
              />
              {errors.date && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="milestone.modal.date.field_error"
                >
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Status
              </Label>
              <Select
                defaultValue={selectedStatus}
                onValueChange={(v) => setValue("status", v as MilestoneStatus)}
              >
                <SelectTrigger
                  className="glass-card border-border text-foreground"
                  data-ocid="milestone.modal.status.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-border">
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Accent color */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">
                Accent Color
              </Label>
              <div
                className="flex gap-3"
                role="radiogroup"
                aria-label="Accent color"
              >
                {(
                  Object.entries(COLOR_MAP) as [
                    MilestoneColor,
                    (typeof COLOR_MAP)["red"],
                  ][]
                ).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setValue("color", key)}
                    aria-label={config.label}
                    aria-pressed={selectedColor === key}
                    data-ocid={`milestone.modal.color_${key}.radio`}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                      selectedColor === key
                        ? "scale-110 border-foreground"
                        : "border-transparent scale-100 hover:scale-[1.04]",
                    )}
                    style={{ background: config.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={onClose}
                data-ocid="milestone.modal.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-full font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
                }}
                data-ocid="milestone.modal.submit_button"
              >
                {isEdit ? "Save Changes" : "Add Milestone"}
              </Button>
            </div>
          </form>
        </motion.dialog>
      </motion.div>
    </AnimatePresence>
  );
}
