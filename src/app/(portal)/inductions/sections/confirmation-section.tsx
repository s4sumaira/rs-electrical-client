import React, { useRef, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { type SiteInduction } from "@/lib/types/induction";
import { cn } from "@/lib/utils";

interface SectionProps {
  formState: SiteInduction;
  errors: Record<string, string[]>;
  getInputProps: (name: string) => any;
  getSelectProps: (name: string) => any;
  setFormState: React.Dispatch<React.SetStateAction<SiteInduction>>;
}

export function ConfirmationSection({
  formState,
  errors,
  setFormState,
}: SectionProps) {
  const signaturePadRef = useRef<SignaturePad>(null);

  useEffect(() => {
    if (formState.inductionCompleted && formState.confirmation?.signature && signaturePadRef.current) {
      signaturePadRef.current.fromDataURL(formState.confirmation.signature);
    }
  }, [formState.inductionCompleted, formState.confirmation?.signature]);
  


  
  useEffect(() => {

    if (formState._id){
      
      setFormState((prev) => ({
        ...prev,
        inductionCompleted: true,
      }));
    }

  }, []);

  const handleConfirmationChange = (checked: boolean) => {
  // Save signature before unchecking
  if (!checked && signaturePadRef.current) {
    const signatureData = signaturePadRef.current.toDataURL();
    setFormState((prev) => ({
      ...prev,
      confirmation: {
        ...prev.confirmation,
        signature: signatureData,  
      },
    }));

  }

  // Update inductionCompleted status
  setFormState((prev) => ({
    ...prev,
    inductionCompleted: checked,
  }));
};


  const handleClearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setFormState((prev) => ({
        ...prev,
        confirmation: {
          ...prev.confirmation,
          signature: "",
          signedAt: new Date(),
        },
      }));
    }
  };

  const handleSaveSignature = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      setFormState((prev) => ({
        ...prev,
        confirmation: {
          ...prev.confirmation,
          signature: signatureData,
          signedAt: new Date(),
        },
      }));
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Declaration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review and confirm your induction details
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Checkbox
              id="inductionCompleted"
              checked={formState.inductionCompleted}
              onCheckedChange={handleConfirmationChange}
              disabled={formState._id?true:false}
              className="mt-1"
            />
            <Label htmlFor="inductionCompleted" className="text-base font-normal flex-1">
              I confirm that I have read, understood and will comply with all the
              requirements detailed in this induction
            </Label>
          </div>
          {errors["inductionCompleted"] && (
            <p className="text-sm text-destructive">
              {errors["inductionCompleted"][0]}
            </p>
          )}
        </div>

        {formState.inductionCompleted && (
          <div className="space-y-4">
            <Label className="text-base font-normal">Signature</Label>
            <div className="rounded-md p-2">
              <SignaturePad
                ref={signaturePadRef}
                canvasProps={{
                  className: cn(
                    "signature-canvas w-full h-40 border border-gray-700 rounded-sm dark:bg-gray-700",
                    errors?.["confirmation.signature"] && "border-destructive"
                  ),
                }}
                onEnd={handleSaveSignature}
              />
            </div>
            {errors?.["confirmation.signature"] && (
              <p className="text-sm text-destructive">
                {errors["confirmation.signature"][0]}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSignature}
              >
                Clear Signature
              </Button>
              {/* <Button
                type="button"
                variant="secondary"
                onClick={handleSaveSignature}
              >
                Save Signature
              </Button> */}
            </div>
          </div>
        )}

        {formState.confirmation?.signedAt && (
          <p className="text-sm text-muted-foreground">
            Signed on: {new Date(formState.confirmation.signedAt).toLocaleString()}
          </p>
        )}

        <div className="rounded-lg border p-4 bg-muted/50">
          <p className="text-sm font-medium">Important Notes:</p>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li>• Your signature confirms acceptance of all induction terms</li>
            <li>• This induction record will be kept on file</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
