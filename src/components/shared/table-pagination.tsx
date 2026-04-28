"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-muted-foreground">
        Page <strong>{currentPage}</strong> of{" "}
        <strong>{totalPages || 1}</strong>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 rounded-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 rounded-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
