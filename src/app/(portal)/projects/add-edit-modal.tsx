"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Project } from "@/lib/types/project"
import { createProject, updateProject } from "@/app/actions/projectActions"
import { getContacts } from "@/app/actions/contactActions"
import { Loader2 } from "lucide-react"
import { ModalFooter} from "@/components/modal"
import { useForm } from "@/hooks/useForm"
import type { Contact } from "@/lib/types/contact"
import { useFetch } from "@/hooks/useFetch"
import { SearchableSelect } from "@/components/searchable-select"
import { useEffect, useMemo } from "react"
import { Card, CardContent} from "@/components/ui/card"

interface ProjectFormProps {
  onClose: () => void
  onSuccess?: (data: Project, message: string) => void
  onError?: (error: string) => void
  currentProject: Project | null
}

export function ProjectForm({ onClose, onSuccess, onError, currentProject }: ProjectFormProps) {
  const {
    records: contacts = [],
    isLoading: isLoadingContacts,
    error: contactsError,
  } = useFetch<Contact, { search: string }>({
    fetchAction: getContacts,
    initialFilters: { search: "" },
    initialPageSize: 100,
  })

  const contactOptions = useMemo(() => {
    return contacts.map((contact) => ({
      value: contact._id,
      label: `${contact.firstName} ${contact.lastName}`,
    }))
  }, [contacts])

  const initialValues: Project = {
    _id: currentProject?._id ?? "",
    name: currentProject?.name ?? "",
    address: currentProject?.address ?? undefined,
    supervisedBy: currentProject?.supervisedBy?.map((person) => person._id ) ?? [],
    inductedBy: currentProject?.inductedBy?.map((person) => person._id) ?? [],
    street: currentProject?.street ?? "",
    city:currentProject?.city??"",
    postCode:currentProject?.postCode??"",
    county:currentProject?.county??"",
    country:currentProject?.country??""

  }

  const { formState, errors, isLoading, handleSubmit, getInputProps, getSelectProps } = useForm<Project>({
    initialValues,
    submitAction: async (state, formData) => {
      return currentProject ? updateProject(state, formData) : createProject(state, formData)
    },   
    onSuccess: (data, message) => {
      onSuccess?.(data, message);
    },
    onError: (error) => {
      onError?.(typeof error === "string" ? error : "Form validation failed");
      //console.log('formState ',formState);
    },
   
    resetOnSuccess: !currentProject,
  })

  useEffect(()=>{

    console.log("formState:",formState)

  }, [formState, errors])

  return (
    <>
    

      <div className="flex-1 overflow-y-auto px-6">
        <form id="project-form" action={handleSubmit} className="space-y-6">
          {currentProject && <input type="hidden" name="id" value={currentProject._id} />}

          <Card>
         
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input {...getInputProps("name")} />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-500">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="inductedBy" className="text-sm font-medium">
                    Inducted By
                  </label>
                  <SearchableSelect
                    {...getSelectProps("inductedBy")}
                    options={contactOptions}
                    placeholder="Search contacts..."
                    isLoading={isLoadingContacts}
                    isMulti={true}
                    required={true}
                  />
                  {errors.inductedBy && (
                    <p id="inductedBy-error" className="text-sm text-red-500">
                      {errors.inductedBy[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="supervisedBy" className="text-sm font-medium">
                    Supervised By
                  </label>
                  <SearchableSelect
                    {...getSelectProps("supervisedBy")}
                    options={contactOptions}
                    placeholder="Search contacts..."
                    isLoading={isLoadingContacts}
                    isMulti={true}
                    required={true}
                  />
                  {errors.supervisedBy && (
                    <p id="supervisedBy-error" className="text-sm text-red-500">
                      {errors.supervisedBy[0]}
                    </p>
                  )}
                </div>
              </div>
     
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="street" className="text-sm font-medium">
                    Street
                  </label>
                  <Input {...getInputProps("street")} required={false}/>
                  {errors.street && (
                    <p id="street-error" className="text-sm text-red-500">
                      {errors.street[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  <Input {...getInputProps("city")} required={false} />
                  {errors.city && (
                    <p id="city-error" className="text-sm text-red-500">
                      {errors.city[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="county" className="text-sm font-medium">
                    County
                  </label>
                  <Input {...getInputProps("county")} required={false} />
                  {errors.county && (
                    <p id="county-error" className="text-sm text-red-500">
                      {errors.county[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="postCode" className="text-sm font-medium">
                    Post Code
                  </label>
                  <Input {...getInputProps("postCode")} required={false}/>
                  {errors.postCode && (
                    <p id="postCode-error" className="text-sm text-red-500">
                      {errors.postCode[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">
                    Country
                  </label>
                  <Input {...getInputProps("country")} required={false} />
                  {errors.country && (
                    <p id="country-error" className="text-sm text-red-500">
                      {errors.country[0]}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      <ModalFooter>
        <Button type="button" onClick={onClose} className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg">
          Discard
        </Button>

        <Button 
          type="submit"
          form="project-form"
          disabled={isLoading} 
          className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentProject ? "Updating..." : "Creating..."}
            </>
          ) : currentProject ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </Button>
      </ModalFooter>
    </>
  )
}