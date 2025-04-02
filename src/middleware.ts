import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
	return await updateSession(request)
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})


	const supabase = createServerClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
					supabaseResponse = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					)
				},
			},
		}
	)

	const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/sign-up')

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (
		!user &&
		!request.nextUrl.pathname.startsWith('/login') &&
		!request.nextUrl.pathname.startsWith('/sign-up')
	) {
		// no user, potentially respond by redirecting the user to the login page
		const url = request.nextUrl.clone()
		url.pathname = '/login'
		return NextResponse.redirect(url)
	}

	if (isAuthRoute && user) {
		// user is already logged in, redirect to homepage
		const url = request.nextUrl.clone()
		url.pathname = '/'
		return NextResponse.redirect(url)
	}



	// check if the request for the '/' page and check if noteId exists in teh search params
	if (request.nextUrl.pathname !== '/') return supabaseResponse;

	const noteId = request.nextUrl.searchParams.get('noteId')

	if (noteId) return supabaseResponse;

	const note = await supabase.from('Note')
		.select('id')
		.eq('authorId', user?.id).order('updatedAt', { ascending: false }).limit(1)

	const latestNoteId = note?.data?.[0]?.id

	if (latestNoteId) return NextResponse.redirect(new URL(`/?noteId=${latestNoteId}`, request.url))

	// create a new note
	const url = request.nextUrl.clone()
	url.pathname = '/api/create-note'
	return NextResponse.redirect(url)

	// (newNoteError) return supabaseResponse;
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.

	// IMPORTANT: DO NOT REMOVE auth.getUser()



	// IMPORTANT: You *must* return the supabaseResponse object as it is.
	// If you're creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!

	return supabaseResponse
}