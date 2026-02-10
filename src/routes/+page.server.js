/** @type {import('./$types').PageServerLoad} */
export async function load({ platform }) {
    const db = platform?.env?.DB;

    if (!db) {
        // During local development or if platform is not available, return empty or mock
        return {
            guestbook: []
        };
    }

    try {
        const { results } = await db.prepare(
            'SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 50'
        ).all();

        return {
            guestbook: results
        };
    } catch (error) {
        console.error('Error fetching guestbook:', error);
        return {
            guestbook: [],
            error: 'Failed to load guestbook entries.'
        };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, platform }) => {
        const db = platform?.env?.DB;
        if (!db) {
            return { success: false, error: 'Database not available' };
        }

        const data = await request.formData();
        const name = data.get('name')?.toString();
        const message = data.get('message')?.toString();

        if (!name || !message) {
            return { success: false, error: 'Name and message are required' };
        }

        try {
            await db.prepare(
                'INSERT INTO guestbook (name, message) VALUES (?, ?)'
            ).bind(name, message).run();

            return { success: true };
        } catch (error) {
            console.error('Error inserting into guestbook:', error);
            return { success: false, error: 'Failed to add entry' };
        }
    }
};
