import { TRPCError, type TRPCRouterRecord } from '@trpc/server'

import {
  changePasswordSchema,
  signInSchema,
  signInWithPhoneSchema,
  signInWithProviderSchema,
  signUpSchema,
  updateUserSchema,
  userIdentitySchema,
  verifyOtpSchema,
} from '@my/lib/schema/auth'
import { withThrowOnError } from '@my/lib/supabase'
import { hasRecentlySignIn } from '@my/lib/utils'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  signUp: publicProcedure.input(signUpSchema).mutation(async ({ ctx: { supabase }, input }) => {
    const metadata = { full_name: input.fullName }

    const { data, error } = await supabase.auth.signUp(
      input.mobileOrEmail.includes('@') ?
        {
          email: input.mobileOrEmail,
          password: input.password,
          options: {
            data: metadata,
          },
        }
      : {
          phone: input.mobileOrEmail,
          password: input.password,
          options: {
            data: metadata,
            channel: 'sms',
          },
        },
    )

    if (error) {
      return {
        success: false,
        code: 'already_in_use' as const,
        message: `That ${'email' in input ? 'email' : 'number'} is already in use.`,
      }
    }

    // If we have a session, the user is authenticated and logged-in, hence verified
    if (data.session) {
      return {
        success: true,
        code: 'verified' as const,
        data: { session: data.session },
      }
    }

    return {
      success: true,
      code: 'otp_sent' as const,
      data: { userId: data.user?.id },
    }
  }),
  sendPasswordRecoveryOtp: publicProcedure
    .input(z.object({ userIdentity: userIdentitySchema }))
    .mutation(async ({ ctx: { origin, supabase }, input }) => {
      await (input.userIdentity.includes('@') ?
        supabase.auth.resetPasswordForEmail(input.userIdentity, {
          redirectTo: origin + '/reset-password',
        })
      : supabase.auth.signInWithOtp({
          phone: input.userIdentity,
          options: {
            shouldCreateUser: false,
            channel: 'sms',
          },
        }))

      return {
        success: true,
        data: {
          mobileOrEmail: input.userIdentity,
        },
      }
    }),
  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(async ({ ctx: { supabase }, input: { mobileOrEmail, otpCode } }) => {
      const { data, error } = await supabase.auth.verifyOtp(
        mobileOrEmail.includes('@') ?
          {
            email: mobileOrEmail,
            token: otpCode,
            type: 'email',
          }
        : {
            phone: mobileOrEmail,
            token: otpCode,
            type: 'sms',
          },
      )
      if (error) throw error

      return { session: data.session }
    }),
  resendOtp: publicProcedure
    .input(z.object({ mobileOrEmail: userIdentitySchema }))
    .mutation(async ({ ctx: { supabase }, input: { mobileOrEmail } }) => {
      const { data, error } = await supabase.auth.resend(
        mobileOrEmail.includes('@') ?
          {
            email: mobileOrEmail,
            type: 'signup',
          }
        : {
            phone: mobileOrEmail,
            type: 'sms',
          },
      )
      if (error) throw error

      return { messageId: data.messageId }
    }),
  signInWithProvider: publicProcedure
    .input(signInWithProviderSchema)
    .mutation(async ({ ctx: { origin, supabase }, input }) => {
      if ('idToken' in input) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: input.provider,
          token: input.idToken,
        })
        if (error) throw error
        return { session: data.session }
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: input.provider,
        options: {
          redirectTo:
            origin + '/api/auth/callback' + (input.redirectTo ? '?next=' + input.redirectTo : ''),
        },
      })
      if (error) throw error
      return { redirectUrl: data.url }
    }),
  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx: { supabase }, input: { userIdentity, password } }) => {
      const { data, error } = await supabase.auth.signInWithPassword(
        userIdentity.includes('@') ?
          { email: userIdentity, password }
        : { phone: userIdentity, password },
      )

      if (error?.message.endsWith('not confirmed')) {
        const { error } = await supabase.auth.signInWithOtp(
          userIdentity.includes('@') ?
            {
              email: userIdentity,
              options: { shouldCreateUser: false },
            }
          : {
              phone: userIdentity,
              options: { channel: 'sms', shouldCreateUser: false },
            },
        )

        if (!error)
          return {
            success: false,
            code: 'otp_sent' as const,
            data: {
              mobileOrEmail: userIdentity,
            },
          }
      }

      return error ?
          {
            success: false,
            code: 'invalid_credentials' as const,
            message: 'Invalid id or password',
            data: { session: null },
          }
        : {
            success: true,
            code: 'verified' as const,
            data: { session: data.session },
          }
    }),
  signInAnonymously: publicProcedure
    .input(z.object({ fullName: z.string() }))
    .mutation(async ({ ctx: { supabase }, input }) => {
      const metadata = { full_name: input.fullName }
      const data = await withThrowOnError(
        supabase.auth.signInAnonymously({ options: { data: metadata } }),
      )

      return data.session
    }),
  signInWithPhone: publicProcedure
    .input(signInWithPhoneSchema)
    .mutation(async ({ ctx: { supabase }, input: { phoneNumber, password } }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password,
      })

      if (!error) return { session: data.session }

      if (error.message === 'Phone not confirmed') {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
          options: { channel: 'sms', shouldCreateUser: false },
        })
        if (error) throw error
        return { toConfirmOtp: true, session: null }
      }

      throw error
    }),
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx: { supabase, session }, input: { currentPassword, newPassword } }) => {
      // Authenticate user if not recently signin
      if (session.user.last_sign_in_at && !hasRecentlySignIn(session.user.last_sign_in_at)) {
        if (!currentPassword) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Please provide your current password',
          })
        }
        const { error } = await supabase.auth.signInWithPassword({
          phone: session.user.phone!,
          password: currentPassword,
        })
        if (error) throw error
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      return true
    }),
  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx: { supabase }, input: { password } }) => {
      if (password) {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        return true
      }

      return false
    }),
  signOut: protectedProcedure.mutation(async ({ ctx: { supabase } }) => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  }),
} satisfies TRPCRouterRecord
