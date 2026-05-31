import { z } from "zod";

const CompanyValidationSchema = z.object({
  cik: z
    .string({
      required_error: "CIK is required",
      invalid_type_error: "CIK must be a string",
    })
    .trim()
    .min(1, "CIK cannot be empty")
    .max(20, "CIK cannot exceed 20 characters"),

  name: z
    .string({
      required_error: "Company name is required",
      invalid_type_error: "Company name must be a string",
    })
    .trim()
    .min(1, "Company name cannot be empty")
    .max(255, "Company name cannot exceed 255 characters"),

  manager: z
    .string({
      required_error: "Manager name is required",
      invalid_type_error: "Manager name must be a string",
    })
    .trim()
    .min(1, "Manager name cannot be empty")
    .max(255, "Manager name cannot exceed 255 characters"),

  address: z
    .string({
      invalid_type_error: "Address must be a string",
    })
    .trim()
    .max(500, "Address cannot exceed 500 characters")
    .optional()
    .nullable(),

  link: z
    .string({
      invalid_type_error: "Link must be a string",
    })
    .url("Link must be a valid URL")
    .optional()
    .nullable(),

  state: z
    .string({
      invalid_type_error: "State must be a string",
    })
    .trim()
    .max(100, "State cannot exceed 100 characters")
    .optional()
    .nullable(),
});

export const InsertCompanyValidationSchema = z
  .array(CompanyValidationSchema)
  .min(1, "At least one company record is required");

export const UpdateCompanyValidationSchema = z
  .array(
    CompanyValidationSchema.partial().extend({
      cik: z
        .string({
          required_error: "CIK is required",
          invalid_type_error: "CIK must be a string",
        })
        .trim()
        .min(1, "CIK cannot be empty")
        .max(20, "CIK cannot exceed 20 characters"),
    }),
  )
  .min(1, "At least one company record is required");

export type InsertCompany = z.infer<typeof InsertCompanyValidationSchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanyValidationSchema>;
