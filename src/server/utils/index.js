
module.exports = {
  /**
   * generateRequestBody - returns a release note string body
   * look through commits and do basic classification for (Added, Changed, and Removed)
   * @param  {array} commits - array of selected commits to generate release notes from
   */
  generateRequestBody(commits) {
    let reqBody = '';
    const draft = {
      added: [],
      changed: [],
      removed: [],
    };
    const { added, changed, removed } = draft;

    commits.forEach((commit) => {
      const messageTitle = commit.commit.message.split('\n\n')[0];
      if (messageTitle.toLowerCase().search(/feature|add|new/) !== -1) {
        added.push(`- ${messageTitle}`);
      } else if (messageTitle.toLowerCase().search(/change|fix|update|modif/) !== -1) {
        changed.push(`- ${messageTitle}`);
      } else if (messageTitle.toLowerCase().search(/remove|delete|destroy/) !== -1) {
        removed.push(`- ${messageTitle}`);
      }
    });

    if (added.length) {
      reqBody += '## Added\n';
      draft.added.forEach((add) => {
        reqBody += `${add}\n`;
      });
    }

    if (changed.length) {
      reqBody += '## Changed\n';
      draft.changed.forEach((change) => {
        reqBody += `${change}\n`;
      });
    }

    if (removed.length) {
      reqBody += '## Removed\n';
      draft.removed.forEach((remove) => {
        reqBody += `${remove}\n`;
      });
    }
    return reqBody;
  }
};
