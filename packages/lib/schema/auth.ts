import { z } from 'zod'

import type { Provider as AuthProvider } from '../supabase'

const phoneNumberSchema = z.string().transform((val) => (val.length === 10 ? '91' + val : val))
export const userIdentitySchema = z.string().email().or(phoneNumberSchema)
const passwordSchema = z.string().min(6, 'Password must be at-least 6 character long.')

export const signInSchema = z.object({
  userIdentity: userIdentitySchema,
  // For signing in, a password can be anything, we should not constraint it
  password: z.string(),
})
export type signInSchema = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  fullName: z.string().trim().min(3),
  mobileOrEmail: userIdentitySchema,
  password: passwordSchema,
})
export type signUpSchema = z.infer<typeof signUpSchema>

export const verifyOtpSchema = z.object({ mobileOrEmail: userIdentitySchema, otpCode: z.string() })
export type verifyOtpSchema = z.infer<typeof verifyOtpSchema>

export const signInWithProviderSchema = z
  .object({
    provider: z.custom<'google' | 'facebook'>((value) => typeof value === 'string'),
    idToken: z.string(),
  })
  .or(
    z.object({
      provider: z.custom<AuthProvider>((value) => typeof value === 'string'),
      redirectTo: z.string().optional(),
    }),
  )
export type signInWithProviderSchema = z.infer<typeof signInWithProviderSchema>

export const signInWithPhoneSchema = z.object({
  phoneNumber: phoneNumberSchema,
  // For signing in, a password can be anything, we should not constraint it
  password: z.string(),
})
export type signInWithPhoneSchema = z.infer<typeof signInWithPhoneSchema>

export const changePasswordSchema = z.object({
  userId: z.string().uuid().nullish(),
  currentPassword: z.string().nullish(),
  newPassword: passwordSchema,
})
export type changePasswordSchema = z.infer<typeof changePasswordSchema>

export const updateUserSchema = z.object({
  password: z.string().nullish(),
})
export type updateUserSchema = z.infer<typeof updateUserSchema>
