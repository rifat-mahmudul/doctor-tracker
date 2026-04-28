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
      const response = await axios.get(`/api/doctors/${doctorId}`);
      return response.data.data.doctor || response.data.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (doctorData) {
      reset({
        name: doctorData.name,
        specialization: doctorData.specialization,
        hospital: doctorData.hospital,
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
          ? "Doctor profile updated"
          : "Doctor registered successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      router.push("/doctor-management");
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
      <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-white rounded-xl border">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Fetching doctor records...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Bar */}
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
                ? "Modify the professional details of the registered doctor."
                : "Add a new healthcare professional to the system."}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full p-8 bg-white rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="!text-2xl font-bold">
                Professional Information
              </FieldLegend>
              <FieldDescription>
                Provide the basic details and specialty of the doctor.
              </FieldDescription>

              <FieldGroup className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Doctor Name */}
                  <Field>
                    <FieldLabel htmlFor="doctor-name">Full Name</FieldLabel>
                    <Input
                      id="doctor-name"
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

                  {/* Specialization */}
                  <Field>
                    <FieldLabel htmlFor="specialization">
                      Specialization
                    </FieldLabel>
                    <Input
                      id="specialization"
                      placeholder="e.g. Cardiology"
                      {...register("specialization")}
                      className="h-[45px] rounded-sm border-slate-200"
                    />
                    {errors.specialization && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {errors.specialization.message}
                      </p>
                    )}
                  </Field>
                </div>

                {/* Hospital */}
                <Field>
                  <FieldLabel htmlFor="hospital">
                    Hospital / Clinic Name
                  </FieldLabel>
                  <Input
                    id="hospital"
                    placeholder="Enter current working place"
                    {...register("hospital")}
                    className="h-[45px] rounded-sm border-slate-200"
                  />
                  {errors.hospital && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {errors.hospital.message}
                    </p>
                  )}
                </Field>

                <FieldSeparator className="my-4" />

                {/* Contact Section */}
                <FieldSet>
                  <FieldLegend className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Contact Details
                  </FieldLegend>
                  <FieldGroup className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+880..."
                          {...register("phone")}
                          className="h-[45px] rounded-sm border-slate-200"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="doctor@example.com"
                          {...register("email")}
                          className="h-[45px] rounded-sm border-slate-200"
                        />
                        {errors.email && (
                          <p className="text-sm font-medium text-destructive mt-1">
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
