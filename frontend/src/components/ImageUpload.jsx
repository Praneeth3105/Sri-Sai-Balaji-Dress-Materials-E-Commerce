import React from "react";
import { Label } from "./ui/label";
import { Button, Input } from "@base-ui/react";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

const ImageUpload = ({ productData, handleImageChange }) => {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold font-serif text-gray-700">
        Product Images
      </Label>

      <Input
        type="file"
        id="file-upload"
        name="files"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      <Button
        variant="outline"
        type="button"
        className="w-full h-11 rounded-lg border-2 border-dashed border-gray-300 bg-white font-serif font-semibold text-gray-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer"
      >
        <label htmlFor="file-upload" className="w-full cursor-pointer">
          Upload Images
        </label>
      </Button>

      {productData?.productImg?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {productData.productImg.map((file, idx) => {
            const preview = URL.createObjectURL(file);

              return (
                <>
                  <Card
                    key={idx}
                    className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                  >
                    <CardContent className="p-2">
                      <img
                        src={preview}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </CardContent>
                  </Card>

                  <button
                    type="button"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X
                      className="bg-black/50 text-white p-1 rounded-full"
                      size={22}
                    />
                  </button>
                </>
              );
          })}
        </div>
      )}
              </div>
              
          );
          
};

export default ImageUpload;
