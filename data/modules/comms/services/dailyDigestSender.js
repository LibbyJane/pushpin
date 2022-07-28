const nodesModules = require('./../../../notesModule');

/**
 * @param databaseManager
 * @param templateRenderer
 * @param emailSender
 * @param recentNoteCountFetcher
 * @param recentReactionCountFetcher
 * @returns {{sendDigest: sendDigest}}
 */
module.exports.getDigestSender = (databaseManager, templateRenderer, emailSender, recentNoteCountFetcher, recentReactionCountFetcher) => {
    /**
     *  This method returns a map of users that have received at least 1 new note or reaction in the last 24
     *  hours.  The result is returned map object.
     *  The userSummary is a map of objects where the key is U_<userId>, and the value is an object with the
     *  following attributes:
     *  - userId
     *  - displayName
     *  - email
     *  - noteCount (the number of notes received in the last day)
     *  - reactionCount (the number of reactions received in the last day)
     * @returns {Promise<{}>}
     */
    const getUserSummaryMap = async () => {
        /*
        Returns users and how many Notes they've received in the last 24 hours.
        Users are only returned if they have at least 1 new note.
         */
        const recentNotes = await recentNoteCountFetcher.getRecentNotes();

        /*
        Returns users and how many Reactions they've received in the last 24 hours.
        Users are only returned if they have at least 1 new reaction.
         */
        const recentReactions = await recentReactionCountFetcher.getRecentReactions();

        if ((recentNotes.length === 0) && (recentReactions.length === 0)) {
            console.log('No recent notes or reactions found.');
            return {};
        }

        console.log(`Found ${recentNotes.length} notes and ${recentReactions.length} reactions`);

        const userSummaryMap = {};

        for (const note of recentNotes) {
            const userKey = "U_" + note.recipientId;
            userSummaryMap[userKey] = {
                userId: note.recipientId,
                displayName: note.recipientDisplayName,
                email: note.recipientEmail,
                noteCount: note.noteCount,
                reactionCount: 0,
            };
        }

        for (const reaction of recentReactions) {
            const userKey = "U_" + reaction.createdByID;
            if (userSummaryMap.hasOwnProperty(userKey)) {
                userSummaryMap[userKey]['reactionCount'] = reaction.reactionCount;
            } else {
                userSummaryMap[userKey] = {
                    userId: reaction.createdByID,
                    displayName: reaction.displayName,
                    email: reaction.email,
                    noteCount: 0,
                    reactionCount: reaction.reactionCount,
                };
            }
        }

        return userSummaryMap;
    };

    /**
     * This method takes the userSummaryMap, iterates through all the keys, and sends the digest
     * emails to all the users in the map.
     * @param userSummaryMap
     * @returns {Promise<void>}
     */
    const sendDigestEmails = async (userSummaryMap) => {
        for (const key in userSummaryMap) {
            const summary = userSummaryMap[key];

            // Get the HTML and Text versions of the email that we want to send.
            const html = await templateRenderer.renderTemplate('email/dailyDigest/html.twig', summary);
            const text = await templateRenderer.renderTemplate('email/dailyDigest/text.twig', summary);

            // Send the email
            // Send the email.
            const success = await emailSender.sendMessage(summary.email, "PushPin Daily Digest", text, html);
            if (success) {
                console.log('Digest sent successfully to: ', summary.displayName);
            } else {
                const lastError = emailSender.getLastError();
                console.log('Failed to send digest to: ', summary.displayName, lastError.toString());
            }
        }
    }

    return {
        sendDigest: async () => {
            console.log('Daily Digest Sender starting.  Loading recent notes and reactions...');
            const userSummaryMap = await getUserSummaryMap();
            await sendDigestEmails(userSummaryMap);
        }
    }
}