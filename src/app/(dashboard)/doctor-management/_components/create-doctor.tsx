"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { useRouter } from "next/navigation";

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axios.post("/api/doctors", values);
      return data;
    },
    onSuccess: () => {
      toast.success("Doctor registered successfully");
      reset();
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      router.push("/doctor-management");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create doctor");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl border shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="!text-2xl font-bold">
              Doctor Registration
            </FieldLegend>
            <FieldDescription>
              Provide professional and contact information to add a new doctor.
            </FieldDescription>

            <FieldGroup className="mt-6">
              {/* Professional Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="doctor-name">Full Name</FieldLabel>
                  <Input
                    id="doctor-name"
                    placeholder="Enter full name"
                    {...register("name")}
                    className="h-[45px] rounded-sm"
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="specialization">
                    Specialization
                  </FieldLabel>
                  <Input
                    id="specialization"
                    placeholder="Enter specialization"
                    {...register("specialization")}
                    className="h-[45px] rounded-sm"
                  />
                  {errors.specialization && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.specialization.message}
                    </p>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="hospital">Hospital Name</FieldLabel>
                <Input
                  id="hospital"
                  placeholder="Enter hospital name"
                  {...register("hospital")}
                  className="h-[45px] rounded-sm"
                />
                {errors.hospital && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.hospital.message}
                  </p>
                )}
              </Field>

              <FieldSeparator />

              {/* Contact Info Section */}
              <FieldSet>
                <FieldLegend className="text-sm font-medium text-muted-foreground">
                  Contact Information
                </FieldLegend>
                <FieldGroup className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+8801..."
                        {...register("phone")}
                        className="h-[45px] rounded-sm"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@example.com"
                        {...register("email")}
                        className="h-[45px] rounded-sm"
                      />
                      {errors.email && (
                        <p className="text-sm font-medium text-destructive">
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
          <Field orientation="horizontal" className="justify-end pt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[140px] h-[50px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Save Doctor"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CreateDoctor;
