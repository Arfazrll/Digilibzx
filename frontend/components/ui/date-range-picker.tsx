"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DateRangePicker({
  className,
  onSelect,
}: React.HTMLAttributes<HTMLDivElement> & {
  onSelect?: (range: DateRange | undefined) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>();

  const handleSelect = (selected: unknown) => {
    // Pastikan selected bukan event DOM
    if (typeof selected === "object" && selected !== null && "from" in selected && "to" in selected) {
      const range = selected as DateRange;

      if (range.from && range.to) {
        const difference = Math.abs(range.to.getTime() - range.from.getTime());
        const days = difference / (1000 * 60 * 60 * 24);

        if (days > 5) {
          const adjustedTo = addDays(range.from, 5);
          const adjustedRange = { from: range.from, to: adjustedTo };
          setDate(adjustedRange);
          onSelect?.(adjustedRange);
        } else {
          setDate(range);
          onSelect?.(range);
        }
      } else {
        setDate(range);
        onSelect?.(range);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
