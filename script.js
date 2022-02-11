async function getTeams(github, context) {
  console.log("getTeams");
  const teamsList = await github.rest.teams.list({
    org: context.repo.owner,
  });

  let teams = [];
  for (let teamsListMember of teamsList.data) {
    teamName = teamsListMember.name;
    const teamMembers = await github.rest.teams.listMembersInOrg({
      org: context.repo.owner,
      team_slug: teamName,
    });
    if (teamMembers.data.length > 0) {
      console.log(
        "Team [%s] has %d members.",
        teamName,
        teamMembers.data.length
      );
      for (let teamMember of teamMembers.data) {
        console.log("member: %s", teamMember.login);
        // console.log(teamMember);
      }
    } else {
      console.log("Team [%s] has no member.", teamName);
    }
    teams.push(teamName);
  }
  return teams;
}

function updateTeamRepo(teams) {
  console.log("updateTeamRepo");
  for (let team in teams) {
    if (teams[team].repos == null) {
      // repos 留空为与team 同名的仓库
      teams[team].repos = [team];
    }
    console.log("%s: %j", team, teams[team]);
  }
  return teams;
}

async function parseYaml() {
  console.log("parseYaml");
  const yaml = require("js-yaml");
  const fs = require("fs");

  let teams;
  try {
    teams = yaml.load(fs.readFileSync("./teams.yaml", "utf-8")).teams;
    console.log("%j", teams);
    teams = updateTeamRepo(teams);
    console.log("%j", teams);

    // console.log(doc.teams.admins.members);
    // console.log(doc.teams["admins"].members);
  } catch (e) {
    console.log(e);
  }
}

async function getRepoNames(github, context) {
  console.log("getRepoNames");
  const reposListForOrg = await github.rest.repos.listForOrg({
    org: context.repo.owner,
  });
  let repoNames = [];
  for (let repo of reposListForOrg.data) {
    repoNames.push(repo.name);
  }
  console.log(repoNames);
  return repoNames;
}

module.exports = async ({ github, context }) => {
  // parse yaml
  await parseYaml();

  // get teams names
  teams = await getTeams(github, context);

  // get repo list
  repoName = await getRepoNames(github, context);
};
