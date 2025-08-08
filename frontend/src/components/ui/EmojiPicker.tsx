import React, { useState } from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Smile } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const { actualTheme } = useTheme()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="p-2 cursor-pointer"
          aria-label="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-auto">
        <Picker
          data={data}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEmojiSelect={(emoji: any) => {
            onSelect(emoji.native);
            setOpen(false);
          }}
          previewPosition="none"
          skinTonePosition="none"
          theme={actualTheme}
          style={{ border: "none", boxShadow: "none" }}
        />
      </PopoverContent>
    </Popover>
  );
}; 