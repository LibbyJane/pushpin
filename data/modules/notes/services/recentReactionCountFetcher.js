/**
 * @param databaseManager
 * @returns {{getRecentNotes: (function(): Promise<*>)}}
 */
module.exports.get = (databaseManager) => {
    return {
        getRecentReactions: async () => {
            const sql = `
        SELECT n.createdByID, u.email, u.displayName, COUNT(n.id) as reactionCount
        FROM notes n
        INNER JOIN recipients r ON n.id = r.noteId
        INNER JOIN users u ON n.createdByID = u.id
        AND ((r.status is null) OR (r.status <> 'deleted'))
        AND r.reactionUpdatedAt >= ?
        GROUP BY n.createdByID, u.email, u.displayName         
            `;

            const timestampThreshold = Math.floor(((new Date().getTime()) / 1000)) - 86_400;
            const params = [timestampThreshold];

            return await databaseManager.getAll(sql, params);
        }
    }
}