const recentNoteCountFetcher = require('./recentNoteCountFetcher');
const recentReactionCountFetcher = require('./recentReactionCountFetcher');

const NoteServiceFactory = function(config, databaseManager) {
    this.recentNoteCountFetcher = () => {
        return recentNoteCountFetcher.get(databaseManager);
    }

    this.recentReactionCountFetcher = () => {
        return recentReactionCountFetcher.get(databaseManager);
    }
}

/**
 * @param config
 * @param databaseManager
 * @returns {NoteServiceFactory}
 */
module.exports.getFactory = function(config, databaseManager) {
    return new NoteServiceFactory(config, databaseManager);
}