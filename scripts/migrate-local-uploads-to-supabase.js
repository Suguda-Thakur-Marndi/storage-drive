import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import connectToDB from '../config/db.js';
import fileModel from '../models/file.model.js';
import supabase from '../config/supabase.js';

dotenv.config();

const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'user-files';

const sanitizeFileName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '-');

const toStoragePath = (userId, originalName) => {
    return `${userId}/${Date.now()}-${sanitizeFileName(originalName)}`;
};

const resolveLocalPath = (filePathValue) => {
    if (path.isAbsolute(filePathValue)) {
        return filePathValue;
    }
    return path.resolve(process.cwd(), filePathValue);
};

const migrate = async () => {
    await connectToDB();

    const files = await fileModel.find({}).sort({ createdAt: 1 });

    let migratedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const fileDoc of files) {
        try {
            const localPath = resolveLocalPath(fileDoc.filePath);

            let fileBuffer;
            try {
                fileBuffer = await fs.readFile(localPath);
            } catch {
                skippedCount += 1;
                console.log(`SKIP ${fileDoc._id}: local file not found (${localPath})`);
                continue;
            }

            const storagePath = toStoragePath(fileDoc.user.toString(), fileDoc.originalName);

            const { error: uploadError } = await supabase.storage
                .from(storageBucket)
                .upload(storagePath, fileBuffer, {
                    contentType: fileDoc.mimeType || 'application/octet-stream',
                    upsert: false
                });

            if (uploadError) {
                failedCount += 1;
                console.log(`FAIL ${fileDoc._id}: ${uploadError.message}`);
                continue;
            }

            fileDoc.storedName = storagePath;
            fileDoc.filePath = storagePath;
            await fileDoc.save();

            migratedCount += 1;
            console.log(`MIGRATED ${fileDoc._id} -> ${storagePath}`);
        } catch (error) {
            failedCount += 1;
            console.log(`FAIL ${fileDoc._id}: ${error.message}`);
        }
    }

    console.log('Migration complete');
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Failed: ${failedCount}`);
    process.exit(0);
};

migrate().catch((error) => {
    console.error('Migration crashed:', error);
    process.exit(1);
});