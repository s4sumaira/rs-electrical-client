// components/induction/sections/project-detail-section.tsx
import React, { useEffect, useState, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { type SiteInduction } from "@/lib/types/induction"
import type { Project } from "@/lib/types/project"
import { useFetch } from "@/hooks/useFetch"
import { getProjects } from "@/app/actions/projectActions"
import { SearchableSelect } from "@/components/searchable-select"
import { SearchableSelectProps } from "@/lib/types"
import { getProject } from "@/app/actions/projectActions"

interface SectionProps {
  formState: SiteInduction
  errors: Record<string, string[]>
  getInputProps: (name: keyof SiteInduction) => any
  getSelectProps: (name: keyof SiteInduction) => SearchableSelectProps
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>
}

export function ProjectDetailsSection({
  formState,
  errors,
  getInputProps,
  getSelectProps,
  setFormState,
}: SectionProps) {


  const [project, setProject] = useState<Project | null>(null);

  const {
    records: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useFetch<Project, { search: string; name: string; postCode: string }>({
    fetchAction: getProjects,
    initialFilters: { search: "", name: "", postCode: "" },
    initialPageSize: 10,
  })


  const projectOptions = useMemo(() => {
    return projects.map((project) => ({
      value: project._id,
      label: project.name,
    }))
  }, [projects])

  const inductedByOptions = useMemo(() => {
    return project?.inductedBy?.map((inductedBy) => ({
      value: inductedBy._id as string,
      label: inductedBy.fullName as string,
    }))
  }, [project])

  const supervisedByOptions = useMemo(() => {
    return project?.supervisedBy?.map((supervisedBy) => ({
      value: supervisedBy._id as string,
      label: supervisedBy.fullName as string,
    }))
  }, [project])



  useEffect(() => {
    const fetchProject = async () => {
      const result = await getProject(formState.project._id);
      if (result.success && result.data) {
        setProject(result.data);
      } else {
        console.log(result.error || 'Failed to load project.');
      }
    };

    fetchProject();

  }, [formState.project._id]);

  const handleChange = (value:any) =>{

    setFormState((prevState) => ({
        ...prevState,
        project: {
          ...prevState.project,
          _id: value,
        },
      
        inductedBy: {
        ...prevState.inductedBy,
        _id: "",
        },

        supervisedBy: {
          ...prevState.supervisedBy,
          _id: "",
          },   
      }));

  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="projectName"

          >
            Project Name
          </Label>



          <SearchableSelect
            {...getSelectProps("project._id")}
            options={projectOptions}
            placeholder="Search project..."
            isLoading={isLoadingProjects}
            // Handle Project Change
            onChange={handleChange}
             
          />

          {errors["project._id"] && (
            <p className="text-sm text-destructive">
              {errors["project._id"][0]}
            </p>
          )}
        </div>

        {inductedByOptions && (
          <div className="space-y-2">
            <Label htmlFor="inductedBy" >
              Inducted By
            </Label>
            <SearchableSelect
              {...getSelectProps("inductedBy._id")}
              options={inductedByOptions}
              placeholder="Search Inducted By..."
              isLoading={isLoadingProjects}
            />
            {errors["inductedBy._id"] && (
              <p className="text-sm text-destructive">
                {errors["inductedBy._id"][0]}
              </p>
            )}
          </div>)
        }

        {supervisedByOptions && (
          <div className="space-y-2">
            <Label htmlFor="supervisedBy" >
              Supervised By
            </Label>
            <SearchableSelect
              {...getSelectProps("supervisedBy._id")}
              options={supervisedByOptions}
              placeholder="Search Supervised By..."
              isLoading={isLoadingProjects}
            />
            {errors["supervisedBy._id"] && (
              <p className="text-sm text-destructive">
                {errors["supervisedBy._id"][0]}
              </p>
            )}
          </div>)
        }

        <div className="text-sm text-muted-foreground">
          All fields are required.
        </div>


      </CardContent>
    </Card>
  )
}