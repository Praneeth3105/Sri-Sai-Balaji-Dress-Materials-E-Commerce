import FilterSidebar from "@/components/FilterSidebar";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const items = [
  { label: "Price: Low to High", value: "lowtoHigh" },
  { label: "Price: High to Low", value: "highToLow" },
];

const Products = () => {
  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* sidebar */}
        <FilterSidebar />
        {/* Main Product Section */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select items={items}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Sort By Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
