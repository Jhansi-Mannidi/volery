"use client"

import { useState } from "react"
import { Package, Plus, SquarePen } from "lucide-react"
import { Button } from "@/ShadcnComponents/ui/button"
import {
  ProfileSectionCard,
  ProfileSectionEmpty,
  ProfileSectionHeader,
  ProfileSectionList,
  ProfileSectionRow,
  SectionActionButton,
} from "../../ProfileSection"
import { useOrgProfile } from "../org-profile-context"
import OrgProductModel from "../OrgModels/OrgProductsModel"
import OrgProductEditModel from "../OrgModels/OrgProductsEditModel"

export default function OrgProfileProducts() {
  const { orgProfile } = useOrgProfile()
  const [isModeOpen, setIsModelOpen] = useState(false)
  const [isOpenEditModel, setIsOpenEditModel] = useState(false)
  const [productId, setProductId] = useState("")
  const products = orgProfile.products

  return (
    <ProfileSectionCard>
      <ProfileSectionHeader
        icon={<Package className="h-4 w-4" />}
        title="Products"
        subtitle={
          products.length === 0
            ? "No products yet"
            : `${products.length} product${products.length === 1 ? "" : "s"}`
        }
        action={
          <SectionActionButton icon={<Plus />} onClick={() => setIsModelOpen(true)} ariaLabel="Add a product" />
        }
      />
      {products.length > 0 ? (
        <ProfileSectionList>
          {products.map((product) => (
            <ProfileSectionRow
              key={product.id}
              logoUrl={product.productLogo}
              fallbackIcon={<Package className="h-5 w-5" />}
              title={product.productName}
              subtitle={product.category}
              description={product.description}
              action={
                <SectionActionButton
                  icon={<SquarePen />}
                  onClick={() => {
                    setIsOpenEditModel(true)
                    setProductId(product.id)
                  }}
                  ariaLabel={`Edit ${product.productName ?? "product"}`}
                />
              }
            />
          ))}
        </ProfileSectionList>
      ) : (
        <ProfileSectionEmpty
          icon={<Package className="h-8 w-8" />}
          title="No products yet"
          hint="Add what your organization builds so people can discover it here."
          action={
            <Button type="button" size="sm" className="gap-1.5" onClick={() => setIsModelOpen(true)}>
              <Plus size={16} />
              Add a product
            </Button>
          }
        />
      )}
      <OrgProductEditModel
        isModalOpen={isOpenEditModel}
        handleModalClose={() => setIsOpenEditModel(false)}
        productId={productId}
      />
      <OrgProductModel isModalOpen={isModeOpen} handleModalClose={() => setIsModelOpen(false)} />
    </ProfileSectionCard>
  )
}
