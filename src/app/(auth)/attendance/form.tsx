"use client";

import { useState } from "react";
import { checkInAction, checkOutAction } from "@/app/actions/attendanceActions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Lock, StickyNote, CheckCircle } from "lucide-react";

export function CheckInOutForm() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    note: "",
    isOnSite: true
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string; note?: string; isOnSite?: boolean }>({});
  const [response, setResponse] = useState<{ success: boolean; message?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(actionType: "checkIn" | "checkOut") {
    setResponse(null);
    setErrors({});
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", formState.email);
    formData.append("password", formState.password);
    formData.append("note", formState.note);
    formData.append("isOnSite", formState.isOnSite.toString());

    const action = actionType === "checkIn" ? checkInAction : checkOutAction;

    console.log(formData);
    const result = await action(formData);

    if (!result.success) {


      const formattedErrors =
        typeof result.error === "object" && result.error !== null
          ? Object.fromEntries(
            Object.entries(result.error).map(([key, value]) => [
              key,
              Array.isArray(value) ? value[0] : value || "Invalid value",
            ])
          )
          : { general: "Something went wrong." };

      setErrors(formattedErrors);
      setResponse({
        success: false,
        message: "Please fix the errors and try again.",
      });

    } else {
      setFormState({
        email: "",
        password: "",
        note: "",
        isOnSite: true
      });
      setResponse(result);
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br via-gray-100 to-gray-200">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Check In / Check Out</h2>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600">Email</Label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className={`pl-10 py-3 w-full bg-transparent border-b-2 
        ${errors.email ? "border-red-500" : "border-gray-300"} 
        focus:border-orange-500 focus:ring-0 outline-none text-gray-800`}
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="off"
                required
              />
              <User
                className={`absolute left-1 top-1/2 transform -translate-y-1/2 
        ${errors.email ? "text-red-500" : "text-gray-400"} 
        peer-focus:text-orange-500`}
                size={18}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="password" className="text-gray-600">Password</Label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={formState.password}
                onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                className={`pl-10 py-3 w-full bg-transparent border-b-2 
                ${errors.password ? "border-red-500" : "border-gray-300"} 
                focus:border-orange-500 focus:ring-0 outline-none text-gray-800`}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <Lock
                className={`absolute left-1 top-1/2 transform -translate-y-1/2 
                ${errors.password ? "text-red-500" : "text-gray-400"} 
                peer-focus:text-orange-500`}
                size={18}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>


          {/* On-Site Checkbox */}
          <div className="flex items-center mt-4 justify-between">
            <Label htmlFor="isOnSite" className="text-gray-700 text-sm font-medium">
              On-Site
            </Label>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isOnSite"
                checked={formState.isOnSite}
                onChange={(e) => setFormState({ ...formState, isOnSite: e.target.checked })}
                className="sr-only peer"
                disabled={isLoading}
              />
              {/* Toggle Background */}
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-orange-500 transition duration-300"></div>
              {/* Toggle Knob */}
              <div className="absolute w-4 h-4 bg-white rounded-full shadow-md left-1 top-1 transition-all duration-300 peer-checked:translate-x-5"></div>
            </label>
          </div>

          {/* Notes Input */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="note" className="text-gray-600">Notes (Optional)</Label>
            <div className="relative">
              <Textarea
                id="note"
                placeholder="Enter any additional notes"
                value={formState.note}
                onChange={(e) => setFormState({ ...formState, note: e.target.value })}
                className={`pl-10 py-3 w-full bg-transparent border-b-2 ${errors.note ? "border-red-500" : "border-gray-300"
                  } focus:border-orange-500 focus:ring-0 outline-none text-gray-800`}
                disabled={isLoading}
                autoComplete="off"
              />
              <StickyNote className="absolute left-1 top-4 text-gray-400" size={18} />
            </div>
            {errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}
          </div>
          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button
              onClick={() => handleSubmit("checkIn")}
              className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-200 py-3"
              disabled={isLoading}
            >
              {isLoading ? "Checking In..." : "Check In"}
            </Button>
            <Button
              onClick={() => handleSubmit("checkOut")}
              className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 py-3"
              disabled={isLoading}
            >
              {isLoading ? "Checking Out..." : "Check Out"}
            </Button>
          </div>

          {/* General Response Message */}
          {response && (
            <div className={`mt-4 p-3 text-center rounded-lg ${response.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {response.message || "An error occurred."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
