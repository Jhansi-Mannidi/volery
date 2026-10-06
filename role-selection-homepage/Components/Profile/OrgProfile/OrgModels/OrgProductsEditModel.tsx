"use client"

import React, { useEffect, useRef } from "react"
import { Camera, Package, Trash2, OctagonMinus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ShadcnComponents/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ShadcnComponents/ui/form"
import { Input } from "@/ShadcnComponents/ui/input"
import { Button } from "@/ShadcnComponents/ui/button"
import { Textarea } from "@/ShadcnComponents/ui/textarea"
import { DEFAULT_PRODUCT_LOGO, readImageFile } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

interface ProductFormValues {
  productName: string
  category: string
  description: string
  productLogo: string
}

export default function OrgProductEditModel({
  isModalOpen,
  handleModalClose,
  productId,
}: {
  isModalOpen: boolean
  handleModalClose: () => void
  productId: string
}) {
  const { orgProfile, updateProducts } = useOrgProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const form = useForm<ProductFormValues>({
    mode: "onBlur",
    defaultValues: { productName: "", category: "", description: "", productLogo: "" },
  })
  const productLogo = form.watch("productLogo")

  useEffect(() => {
    if (!isModalOpen) return
    const product = orgProfile.products.find((item) => item.id === productId)
    if (!product) return
    form.reset({
      productName: product.productName || "",
      category: product.category || "",
      description: product.description || "",
      productLogo: product.productLogo || "",
    })
  }, [isModalOpen, productId, orgProfile.products, form])

  const onSubmit = (values: ProductFormValues) => {
    updateProducts(
      orgProfile.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              productName: values.productName.trim(),
              category: values.category.trim(),
              description: values.description.trim(),
              productLogo: values.productLogo || DEFAULT_PRODUCT_LOGO,
            }
          : product
      )
    )
    toast.success("Product updated successfully")
    handleModalClose()
  }

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full flex-col overflow-hidden bg-background p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pb-3 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-4 w-4" />
            </span>
            Edit Product
          </SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Update product details shown on your organization page.
          </p>
        </SheetHeader>
        <Form {...form}>
          <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit(onSubmit, () => toast.error("Product name is required"))}>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pt-3 pb-4">
              <div className="flex items-start gap-4">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">
                    <img src={productLogo || DEFAULT_PRODUCT_LOGO} alt="Product logo" className="h-full w-full object-cover" />
                  </div>
                  <Button type="button" variant="outline" size="sm" className="h-7 gap-1 px-2 text-[11px]" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="h-3.5 w-3.5" />
                    {productLogo ? "Change logo" : "Upload logo"}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      try {
                        form.setValue("productLogo", await readImageFile(file))
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Failed to upload logo")
                      }
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="productName"
                    rules={{ validate: (value) => !!value.trim() || "Product name is required" }}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} className="bg-background dark:bg-muted" />
                        </FormControl>
                        {fieldState.error && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                            <OctagonMinus className="h-3.5 w-3.5" /> {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} className="bg-background dark:bg-muted" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="pb-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[120px] bg-background text-sm dark:bg-muted" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-background px-6 py-4">
              <Button
                type="button"
                variant="destructive"
                className="gap-1.5"
                onClick={() => {
                  updateProducts(orgProfile.products.filter((product) => product.id !== productId))
                  toast.success("Product deleted successfully")
                  handleModalClose()
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
