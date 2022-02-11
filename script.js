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
module.exports = async ({ github, context }) => {
  // parse yaml
  await parseYaml();

  //// return teams name
  teams = await getTeams(github, context);
  return teams;
};
