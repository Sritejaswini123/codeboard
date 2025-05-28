import { uploadImage } from '../service/uploadServices';
import db from '../database/db';
import { userProfiles } from '../database/schemas/userProfiles';
export const handleImageUpload = async (c) => {
    const body = await c.req.parseBody();
    const file = body.file;
    if (!file) {
        return c.json({ error: 'No file provided' }, 400);
    }
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;
    const url = await uploadImage(dataUri);
    await db.insert(userProfiles).values({
        imageUrl: url,
    });
    return c.json({ imageUrl: url });
};
