
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
      changed:[],
      removed: [],
    }
    commits.forEach((commit) => {
      const messageTitle = commit.commit.message.split('\n\n')[0];
      if (messageTitle.toLowerCase().search(/feature|add|new/) !== -1) {
        draft.added.push('- ' + messageTitle);
      } else if (messageTitle.toLowerCase().search(/change|fix|modif/) !== -1) {
        draft.changed.push('- ' + messageTitle);
      } else if (messageTitle.toLowerCase().search(/remove|delete|destroy/) !== -1) {
        draft.removed.push('- ' + messageTitle);
      }
    });
    reqBody += '## Added\n';
    draft.added.forEach((add)=> {
      reqBody += `${add}\n`;
    });

    reqBody += '## Changed\n';
    draft.changed.forEach((change)=> {
      reqBody += `${change}\n`;
    });

    reqBody += '## Removed\n';
    draft.removed.forEach((remove)=> {
      reqBody += `${remove}\n`;
    });
    return reqBody;
  }
}