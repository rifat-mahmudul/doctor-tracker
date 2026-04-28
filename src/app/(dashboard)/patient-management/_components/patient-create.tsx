"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
}

const formSchema = z.object({
  name: z.string().min(2, "Patient name is required"),
  condition: z.string().min(2, "Condition/Symptom is required"),
  doctorId: z.string().min(1, "Please assign a doctor"),
});

type FormValues = z.infer<typeof formSchema>;

const PatientCreate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      condition: "",
      doctorId: "",
    },
  });

  const { data: doctors, isLoading: loadingDoctors } = useQuery<IDoctor[]>({
    queryKey: ["doctors-list"],
    queryFn: async () => {
      const response = await axios.get("/api/doctors?limit=100");
      return response.data.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axios.post("/api/patients", values);
      return data;
    },
    onSuccess: () => {
      toast.success("Patient registered successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.push("/patient-management");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to register patient",
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              New Admission
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Register a patient and assign them to a doctor.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full p-8 bg-white rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="!text-2xl font-bold">
                Patient Information
              </FieldLegend>
              <FieldDescription>
                Provide basic details and symptoms of the patient for admission.
              </FieldDescription>

              <FieldGroup className="mt-8">
                {/* Patient Name */}
                <Field>
                  <FieldLabel htmlFor="patient-name">
                    Patient Full Name
                  </FieldLabel>
                  <Input
                    id="patient-name"
                    placeholder="Enter full name"
                    {...register("name")}
                    className="h-[45px] rounded-sm border-slate-200"
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </Field>

                {/* Condition */}
                <Field>
                  <FieldLabel htmlFor="condition">
                    Condition / Symptoms
                  </FieldLabel>
                  <Input
                    id="condition"
                    placeholder="e.g. Severe Fever, Surgery Prep"
                    {...register("condition")}
                    className="h-[45px] rounded-sm border-slate-200"
                  />
                  {errors.condition && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.condition.message}
                    </p>
                  )}
                </Field>

                {/* Doctor Assignment */}
                <Field>
                  <FieldLabel>Assigned Doctor</FieldLabel>
                  <Select
                    onValueChange={(value: string) =>
                      setValue("doctorId", value)
                    }
                    defaultValue={watch("doctorId")}
                  >
                    <SelectTrigger className="h-[45px] rounded-sm border-slate-200">
                      <SelectValue
                        placeholder={
                          loadingDoctors
                            ? "Loading doctors..."
                            : "Select attending doctor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.map((doctor) => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          <span className="font-medium">{doctor.name}</span>
                          <span className="ml-2 text-muted-foreground text-xs uppercase">
                            ({doctor.specialization})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doctorId && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.doctorId.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Form Actions */}
            <Field orientation="horizontal" className="justify-end pt-8">
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[160px] h-[50px] rounded-sm shadow-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Admit Patient"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default PatientCreate;
