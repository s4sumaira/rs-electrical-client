"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type User, Role } from "@/lib/types/user";
import { createUser, updateUser, getRoles } from "@/app/actions/userActions";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { ModalFooter } from "@/components/modal";
import { useForm } from "@/hooks/useForm";
import { useState, useEffect } from "react";
import type { ActionState, ValidationErrors } from "@/lib/types/form";
import { SearchableSelect } from "@/components/searchable-select"
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card";


interface UserFormProps {
  onClose: () => void;
  onSuccess?: (data: User, message: string) => void;
  onError?: (error: string) => void;
  currentUser: Partial<User> | null;
}

export function UserForm({ onClose, onSuccess, onError, currentUser }: UserFormProps) {
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [roleOptions, setRoleOptions] = useState<Array<{ value: string; label: string }>>([]);


  const initialValues: User = {
    _id: currentUser?._id ?? "",
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    role: currentUser?.role ?? ({} as Role),
    contact: currentUser?.contact ?? "",
    password: "",
    isActive: currentUser?.isActive ?? false
  };


  useEffect(() => {

    const fetchRoles = async () => {

      try {

        const roleData = await getRoles();
        if (Array.isArray(roleData)) {
          setRoles(roleData);

          const formattedRoles = roleData.map(role => ({
            value: role._id,
            label: role.name
          }));

          setRoleOptions(formattedRoles);
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }

    fetchRoles();
  }, []);

  useEffect(() => {
    if (roles.length && currentUser?.role) {
      const selectedRole = roles.find(
        (r) => r._id === currentUser.role?._id
      );



      if (selectedRole) setRole(selectedRole);
    }
  }, [roles]);

  // const roleOptions = useMemo(() => {
  //   return roles.map((role) => ({
  //     value: role._id,
  //     label: role?.name,
  //   }))
  // }, [roles])

  const { formState, errors, isLoading, handleSubmit, getInputProps, setFormState, getSelectProps } = useForm<User>({
    initialValues: initialValues,
    submitAction: async (state: ActionState<User>, formData: FormData): Promise<ActionState<User>> => {
      const password = formData.get("password") as string;

      if (!currentUser?._id && !password) {
        setPasswordError("Password is required for new users");
        return {
          success: false,
          message: "Password is required",
          data: null,
          error: {
            password: ["Password is required"],
          } as ValidationErrors,
        };
      }

      setPasswordError("");


      return currentUser?._id ? updateUser(state, formData) : createUser(state, formData);
    },
    onSuccess: (data, message) => {
      onSuccess?.(data, message);
    },
    onError: (error) => {
      onError?.(typeof error === "string" ? error : "Form validation failed");
    },
    resetOnSuccess: !currentUser,
  });

  const handleRoleChange = (value: any) => {
    const selectedRole = roles.find(r => r._id === value) || null;
    setRole(selectedRole);

    // Update form state with full project details if available
    setFormState((prevState) => ({
      ...prevState,
      role: {
        ...prevState.role,
        _id: value
      },

    }));

  };



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>


      <div className="flex-1 overflow-y-auto px-6">
        <form id="user-form" action={handleSubmit} className="space-y-6">
          {currentUser?._id && <input type="hidden" name="id" value={currentUser._id} />}
       {/* <input type="hidden" name="contactId" value={formState.contact} /> */}
          <Input {...getInputProps("name")} className="hidden" />

          <Card>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email (username)
                  </label>
                  <Input {...getInputProps("email")} type="email" required readOnly />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-500">{errors.email[0]}</p>
                  )}
              </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <SearchableSelect
                    {...getSelectProps("role._id")}
                    options={roleOptions}
                    value={formState.role?._id || ""}
                    placeholder="Search roles..."
                    onChange={handleRoleChange}
                  />
                  {errors.role && (
                    <p id="role-error" className="text-sm text-red-500">{errors.role}</p>
                  )}
                </div>
              
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password {currentUser?._id && "(Leave blank to keep current)"}
                    </label>
                    <div className="relative">
                      <Input {...getInputProps("password")} type={showPassword ? "text" : "password"} required={false} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                      </Button>
                    </div>
                    {(errors.password || passwordError) && (
                      <p id="password-error" className="text-sm text-red-500">
                        {errors.password?.[0] || passwordError}
                      </p>
                    )}
                  </div>



                  <div className="flex items-center space-x-4 mt-8">
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-200">
                      Is Active
                    </label>
                    <label className="relative inline-flex cursor-pointer">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formState.isActive}
                        onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                        className="sr-only peer"
                        disabled={isLoading}
                      />
                      <div className={`
                                    relative w-11 h-6 
                                    bg-gray-700 
                                    peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-orange-500 
                                    rounded-full 
                                    peer peer-checked:after:translate-x-full 
                                    peer-checked:bg-orange-500 
                                    after:content-[''] 
                                    after:absolute 
                                    after:top-[2px] 
                                    after:left-[2px] 
                                    after:bg-white 
                                    after:rounded-full 
                                    after:h-5 
                                    after:w-5 
                                    after:transition-all
                                    after:shadow-sm
                                    transition-colors
                                    duration-200
                                  `}>
                      </div>
                    </label>
                  </div>
                </div>
             
            </CardContent>
          </Card>
        </form>
      </div>

      <ModalFooter>
        <Button type="button" onClick={onClose} className="bg-btn-cancel hover:bg-btn-cancel-hover text-btn-cancel-fg">
          {currentUser?._id ? "Cancel" : "Discard"}
        </Button>

        <Button
          type="submit"
          form="user-form"
          disabled={isLoading}
          className="bg-btn-add hover:bg-btn-add-hover text-btn-add-fg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentUser?._id ? "Updating..." : "Creating..."}
            </>
          ) : currentUser?._id ? "Update User" : "Create User"}
        </Button>
      </ModalFooter>
    </>
  );
}
