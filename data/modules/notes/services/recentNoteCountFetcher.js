/**
 * @param databaseManager
 * @returns {{getRecentNotes: (function(): Promise<*>)}}
 */
module.exports.get = (databaseManager) => {
    return {
        getRecentNotes: async () => {
            const sql = `
        SELECT n.createdByID, u.displayName as senderDisplayName, r.recipientId,
               u2.displayName as recipientDisplayName, u2.email as recipientEmail, COUNT(n.id) as noteCount
        FROM notes n
        INNER JOIN recipients r ON n.id = r.noteId
        INNER JOIN users u ON n.createdByID = u.id
        INNER JOIN users u2 ON r.recipientId = u2.id
        AND ((r.status is null) OR (r.status <> 'deleted'))
        AND r.createdAt >= ?
        GROUP BY n.createdByID, u.displayName, r.recipientId
        ORDER BY r.recipientId            
            `;

            const timestampThreshold = Math.floor(((new Date().getTime()) / 1000)) - 86_400;
            const params = [timestampThreshold];

            return await databaseManager.getAll(sql, params);
        }
    }
}