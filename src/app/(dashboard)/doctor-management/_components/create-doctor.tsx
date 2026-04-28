"use client";

import { useEffect } from "react";
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
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  hospital: z.string().min(2, "Hospital name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const CreateDoctor = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  const doctorId = params.id as string;
  const isEditMode = !!doctorId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  const { data: doctorData, isLoading: loadingDoctor } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/doctors/${doctorId}`);
      return data.data.doctor;
    },
    enabled: isEditMode && !!doctorId,
    staleTime: 0,
  });

  useEffect(() => {
    if (doctorData) {
      reset({
        name: doctorData.name || "",
        specialization: doctorData.specialization || "",
        hospital: doctorData.hospital || "",
        phone: doctorData.phone || "",
        email: doctorData.email || "",
      });
    }
  }, [doctorData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (isEditMode) {
        return axios.put(`/api/doctors/${doctorId}`, values);
      }
      return axios.post("/api/doctors", values);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Doctor profile updated successfully"
          : "Doctor registered successfully",
      );

      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["doctor", doctorId] });
      }

      router.push("/doctor-management");
      router.refresh();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  if (isEditMode && loadingDoctor) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium animate-pulse">
          Fetching doctor records...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Bar Header */}
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
              {isEditMode ? "Update Profile" : "Doctor Registration"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditMode
                ? "Modify professional details of the registered specialist."
                : "Add a new healthcare professional to the medical system."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="w-full p-8 bg-white rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="!text-2xl font-bold text-slate-900">
                Professional Information
              </FieldLegend>
              <FieldDescription>
                Provide the basic details and specialty of the doctor.
              </FieldDescription>

              <FieldGroup className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Doctor Name */}
                  <Field>
                    <FieldLabel className="text-slate-700 font-semibold">
                      Full Name
                    </FieldLabel>
                    <Input
                      placeholder="e.g. Dr. John Doe"
                      {...register("name")}
                      className="h-[45px] rounded-sm border-slate-200 focus:ring-primary"
                    />
                    {errors.name && (
                      <p className="text-xs font-bold text-destructive mt-1 uppercase tracking-tighter">
                        {errors.name.message}
                      </p>
                    )}
                  </Field>

                  {/* Specialization */}
                  <Field>
                    <FieldLabel className="text-slate-700 font-semibold">
                      Specialization
                    </FieldLabel>
                    <Input
                      placeholder="e.g. Neurology Specialist"
                      {...register("specialization")}
                      className="h-[45px] rounded-sm border-slate-200 focus:ring-primary"
                    />
                    {errors.specialization && (
                      <p className="text-xs font-bold text-destructive mt-1 uppercase tracking-tighter">
                        {errors.specialization.message}
                      </p>
                    )}
                  </Field>
                </div>

                {/* Hospital */}
                <Field>
                  <FieldLabel className="text-slate-700 font-semibold">
                    Hospital / Clinic Name
                  </FieldLabel>
                  <Input
                    placeholder="Enter medical facility name"
                    {...register("hospital")}
                    className="h-[45px] rounded-sm border-slate-200 focus:ring-primary"
                  />
                  {errors.hospital && (
                    <p className="text-xs font-bold text-destructive mt-1 uppercase tracking-tighter">
                      {errors.hospital.message}
                    </p>
                  )}
                </Field>

                <FieldSeparator className="my-6 border-slate-100" />

                {/* Contact Section */}
                <FieldSet>
                  <FieldLegend className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Contact Channels
                  </FieldLegend>
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field>
                        <FieldLabel className="text-slate-700">
                          Phone Number
                        </FieldLabel>
                        <Input
                          type="tel"
                          placeholder="+880 1XXX-XXXXXX"
                          {...register("phone")}
                          className="h-[45px] rounded-sm border-slate-200"
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="text-slate-700">
                          Email Address
                        </FieldLabel>
                        <Input
                          type="email"
                          placeholder="doctor@medical.com"
                          {...register("email")}
                          className="h-[45px] rounded-sm border-slate-200"
                        />
                        {errors.email && (
                          <p className="text-xs font-bold text-destructive mt-1 uppercase tracking-tighter">
                            {errors.email.message}
                          </p>
                        )}
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </FieldSet>

            {/* Form Actions */}
            <Field orientation="horizontal" className="justify-end pt-10 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-[50px] px-8 rounded-sm border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[180px] h-[50px] rounded-sm shadow-md transition-all"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Registering...</span>
                  </div>
                ) : isEditMode ? (
                  "Update Profile"
                ) : (
                  "Save Doctor"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctor;
