"use client"

import React, { useEffect, useRef, useState } from "react"
import { Camera, Package, OctagonMinus } from "lucide-react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ShadcnComponents/ui/sheet"
import { Label } from "@/ShadcnComponents/ui/label"
import { Input } from "@/ShadcnComponents/ui/input"
import { Button } from "@/ShadcnComponents/ui/button"
import { Textarea } from "@/ShadcnComponents/ui/textarea"
import { DEFAULT_PRODUCT_LOGO, readImageFile } from "../OrgProfile.util"
import { useOrgProfile } from "../org-profile-context"

export default function OrgProductModel({
  isModalOpen,
  handleModalClose,
}: {
  isModalOpen: boolean
  handleModalClose: () => void
}) {
  const { orgProfile, updateProducts } = useOrgProfile()
  const [productName, setProductName] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productLogo, setProductLogo] = useState("")
  const [nameError, setNameError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isModalOpen) return
    setProductName("")
    setProductCategory("")
    setProductDescription("")
    setProductLogo("")
    setNameError(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [isModalOpen])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!productName.trim()) {
      setNameError(true)
      return
    }
    updateProducts([
      ...orgProfile.products,
      {
        id: crypto.randomUUID(),
        productName: productName.trim(),
        category: productCategory.trim(),
        description: productDescription.trim(),
        productLogo: productLogo || DEFAULT_PRODUCT_LOGO,
      },
    ])
    toast.success("Product added successfully")
    handleModalClose()
  }

  return (
    <Sheet open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <SheetContent className="flex h-full flex-col overflow-hidden bg-background p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 pt-4 pr-14 pb-3 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-4 w-4" />
            </span>
            Add Product
          </SheetTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Showcase a product or service on your organization page.
          </p>
        </SheetHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pt-3 pb-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-5">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">
                <img src={productLogo || DEFAULT_PRODUCT_LOGO} alt="Product logo preview" className="h-full w-full object-cover" />
              </div>
              <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs" onClick={() => fileInputRef.current?.click()}>
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
                    setProductLogo(await readImageFile(file))
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Failed to upload logo")
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="productName" className="mb-1 text-xs">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="productName"
                value={productName}
                onChange={(event) => {
                  setProductName(event.target.value)
                  if (event.target.value.trim()) setNameError(false)
                }}
                className="border border-muted-foreground bg-background dark:bg-muted"
              />
              {nameError && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                  <OctagonMinus className="h-3.5 w-3.5" /> Product name is required
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="category" className="mb-1 text-xs">
                Category
              </Label>
              <Input
                id="category"
                value={productCategory}
                onChange={(event) => setProductCategory(event.target.value)}
                className="border border-muted-foreground bg-background dark:bg-muted"
              />
            </div>
            <div className="flex flex-col pb-2">
              <Label htmlFor="description" className="mb-1 text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                value={productDescription}
                onChange={(event) => setProductDescription(event.target.value)}
                className="min-h-[120px] border border-muted-foreground bg-background text-sm dark:bg-muted"
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
