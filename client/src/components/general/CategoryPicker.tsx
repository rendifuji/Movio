import { useState } from "react";
import { Button } from "@/components";

const categories = ["Action", "Romance", "Horror", "Coming Soon"];

const CategoryPicker = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isSelected = category === selectedCategory;

        return (
          <Button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            aria-pressed={isSelected}
            className={
              "rounded-full px-5 py-2 text-sm font-medium transition focus:outline-none " +
              (isSelected
                ? "bg-primary text-primary-foreground border border-transparent"
                : "bg-transparent border border-border text-white hover:border-white hover:bg-white/5")
            }
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryPicker;
