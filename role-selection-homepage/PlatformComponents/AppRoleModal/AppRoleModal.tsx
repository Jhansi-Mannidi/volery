"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ShadcnComponents/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/ShadcnComponents/ui/radio-group"
import { Label } from "@/ShadcnComponents/ui/label"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface AppRole {
  appRoleId: string
  appRoleName: string
}

interface AppRoleModalProps {
  isOpen: boolean
  setIsopen: (open: boolean) => void
  appRoles: AppRole[]
  selectedRole: string
  setSelectedRole: (roleId: string) => void
  onRoleCardClick: (id: string) => void
}

const AppRoleModal: React.FC<AppRoleModalProps> = ({
  isOpen,
  setIsopen,
  appRoles,
  selectedRole,
  setSelectedRole,
  onRoleCardClick,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsopen}>
      <DialogContent className="max-h-[85vh] sm:max-w-[420px]" style={{ fontSize: "13px" }}>
        <DialogHeader className="pb-3 text-center">
          <DialogTitle className="text-[14px] font-semibold text-foreground">
            Select App Role
          </DialogTitle>
          <DialogDescription className="mt-1 text-[14px] text-muted-foreground">
            You have the following app roles in this app. Please select one to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto px-1">
          <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-2">
            {appRoles.map((role) => {
              const isSelected = selectedRole === role.appRoleId
              return (
                <div
                  key={role.appRoleId}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-3 rounded-md border-2 p-2.5 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => {
                    setSelectedRole(role.appRoleId)
                    onRoleCardClick(role.appRoleId)
                  }}
                >
                  <RadioGroupItem
                    value={role.appRoleId}
                    id={role.appRoleId}
                    className="h-4 w-4 flex-shrink-0"
                  />
                  <Label
                    htmlFor={role.appRoleId}
                    className="flex flex-1 cursor-pointer items-center gap-2.5"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span
                      className={cn(
                        "text-[13px] font-medium",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {role.appRoleName}
                    </span>
                  </Label>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  )}
                </div>
              )
            })}
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AppRoleModal
