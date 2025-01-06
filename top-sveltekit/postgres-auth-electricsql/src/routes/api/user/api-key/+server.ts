import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In a real application, you would store this in a database
let userApiKeys: Record<string, string> = {};

export const GET: RequestHandler = async ({ locals }) => {
    const session = await locals.getSession();
    if (!session?.user?.email) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = userApiKeys[session.user.email] || '';
    return json({ apiKey });
};

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.getSession();
    if (!session?.user?.email) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey } = await request.json();
    userApiKeys[session.user.email] = apiKey;

    return json({ success: true });
};