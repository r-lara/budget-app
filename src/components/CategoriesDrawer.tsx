import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import React, { useEffect, useState } from "react";

interface CategoriesDrawerProps {
  open: boolean
  handleClose: () => void
}

export const CategoriesDialog: React.FC<CategoriesDrawerProps> = ({ open, handleClose }) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const categories = [
    { id: 1, name: "Food" },
    { id: 2, name: "Transportation" },
    { id: 3, name: "Housing" },
    { id: 4, name: "Travel" },
    { id: 5, name: "Healthcare" },
  ];

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  useEffect(() => {
    if (!open) {
      setSelectedCategories([]);
    }
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select more categories</DialogTitle>
      <DialogContent>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Chip
              key={category.id}
              label={category.name}
              clickable
              color="primary"
              variant={
                selectedCategories.includes(category.id)
                  ? "filled"
                  : "outlined"
              }
              onClick={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="subscription-form">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}