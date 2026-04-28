"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

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

const PatientForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  const patientId = params.id as string;
  const isEditMode = !!patientId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const { data: patientData, isLoading: loadingPatient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const response = await axios.get(`/api/patients/${patientId}`);
      return response.data.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (patientData) {
      reset({
        name: patientData.name,
        condition: patientData.condition,
        doctorId:
          typeof patientData.doctorId === "object"
            ? patientData.doctorId._id
            : patientData.doctorId,
      });
    }
  }, [patientData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (isEditMode) {
        return axios.put(`/api/patients/${patientId}`, values);
      }
      return axios.post("/api/patients", values);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Patient updated successfully"
          : "Patient registered successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.push("/patient-management");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  if (isEditMode && loadingPatient) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-white rounded-xl border">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">
          Fetching patient records...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-sm border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEditMode ? "Update Records" : "New Admission"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditMode
                ? "Update existing patient details and assigned doctor."
                : "Register a new patient to the management system."}
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-8 bg-white rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="!text-2xl font-bold">
                Patient Information
              </FieldLegend>
              <FieldDescription>
                Ensure all details match the admission documents.
              </FieldDescription>

              <FieldGroup className="mt-8">
                {/* Patient Name */}
                <Field>
                  <FieldLabel htmlFor="patient-name">Full Name</FieldLabel>
                  <Input
                    id="patient-name"
                    placeholder="Enter full name"
                    {...register("name")}
                    className="h-[45px] rounded-sm border-slate-200"
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </Field>

                {/* Condition */}
                <Field>
                  <FieldLabel htmlFor="condition">
                    Symptoms / Condition
                  </FieldLabel>
                  <Input
                    id="condition"
                    placeholder="e.g. Chronic Pain, Fever"
                    {...register("condition")}
                    className="h-[45px] rounded-sm border-slate-200"
                  />
                  {errors.condition && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {errors.condition.message}
                    </p>
                  )}
                </Field>

                {/* Doctor Select */}
                <Field>
                  <FieldLabel>Assigned Doctor</FieldLabel>
                  <Select
                    onValueChange={(value: string) =>
                      setValue("doctorId", value)
                    }
                    value={watch("doctorId")}
                  >
                    <SelectTrigger className="h-[45px] rounded-sm border-slate-200">
                      <SelectValue
                        placeholder={
                          loadingDoctors ? "Loading..." : "Assign a doctor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.map((doctor) => (
                        <SelectItem key={doctor._id} value={doctor._id}>
                          <span className="font-medium">{doctor.name}</span>
                          <span className="ml-2 text-[10px] uppercase text-muted-foreground font-bold">
                            ({doctor.specialization})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doctorId && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {errors.doctorId.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Form Actions */}
            <Field orientation="horizontal" className="justify-end pt-8 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-[50px] px-8 rounded-sm border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[160px] h-[50px] rounded-sm shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isEditMode ? (
                  "Update Changes"
                ) : (
                  "Save Patient"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
