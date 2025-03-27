'use server'

import { createClient } from '../app/auth/server'
import { debugAuth, handleError } from '../lib/utils'

export const loginAction = async (email: string, password: string) => {

	try {
		const client = await createClient()
		const { data, error } = await client.auth.signInWithPassword({
			email,
			password,
		})

		debugAuth('Login result: %O', { user: data.user?.email, error: error?.message })

		if (error) throw error

		// Ensure we only return serializable data
		const user = data.user ? {
			id: data.user.id,
			email: data.user.email,
			role: data.user.role,
			created_at: data.user.created_at,
			updated_at: data.user.updated_at
		} : null

		return { errorMessage: null }
	} catch (error) {
		return handleError(error)
	}
}

export const logoutAction = async () => {
	try {
		const client = await createClient()
		const { error } = await client.auth.signOut()

		if (error) throw error

		return { errorMessage: null }
	} catch (error) {
		console.log(error)
		return handleError(error)
	}
}

export const signupAction = async (email: string, password: string) => {
	try {
		const client = await createClient()
		const { data, error } = await client.auth.signUp({
			email,
			password,
		})

		if (error) throw error

		// get userId
		const userId = data.user?.id

		if (!userId) throw new Error('Error creating user')

		// create user in DB
		console.log("🚀 ~ signupAction ~ userId:", userId)

		// Ensure we only return serializable data
		const user = data.user ? {
			id: data.user.id,
			email: data.user.email,
			role: data.user.role,
			created_at: data.user.created_at,
			updated_at: data.user.updated_at
		} : null

		return { errorMessage: null, user }
	} catch (error) {
		console.log(error)
		return handleError(error)
	}
}

