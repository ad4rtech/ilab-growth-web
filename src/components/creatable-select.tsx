"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const CREATE_VALUE = "__create_new__";

export function CreatableSelect({
  label,
  placeholder,
  items,
  value,
  onValueChange,
  onCreate,
}: {
  label: string;
  placeholder: string;
  items: string[];
  value: string;
  onValueChange: (v: string) => void;
  onCreate: (name: string) => Promise<boolean>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const selectItems = [
    ...items.map((i) => ({ value: i, label: i })),
    { value: CREATE_VALUE, label: `Add new ${label.toLowerCase()}...` },
  ];

  function handleChange(v: string | null) {
    if (v === null) return;
    if (v === CREATE_VALUE) {
      setDialogOpen(true);
      return;
    }
    onValueChange(v);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setSaving(true);
    const success = await onCreate(newName.trim());
    setSaving(false);
    if (success) {
      onValueChange(newName.trim());
      setNewName("");
      setDialogOpen(false);
    }
  }

  return (
    <>
      <Select items={selectItems} value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
          <SelectItem value={CREATE_VALUE} className="text-blue-700">
            <span className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add new {label.toLowerCase()}...
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="new-item-name">{label} name</Label>
            <Input
              id="new-item-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`e.g. ${placeholder}`}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving || !newName.trim()}>
              {saving ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}