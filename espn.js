// Vercel Serverless Function. Private ESPN cookies stay server-side.
const LEAGUE='303336079', TEAM=5, SEASON=2027;
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store, max-age=0');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET')return res.status(405).json({ok:false,message:'Method not allowed'});
 const espnS2=process.env.ESPN_S2, swid=process.env.ESPN_SWID;
 if(!espnS2||!swid)return res.status(503).json({ok:false,message:'Server-side ESPN credentials not configured yet'});
 const endpoint=`https://fantasy.espn.com/apis/v3/games/fba/seasons/${SEASON}/segments/0/leagues/${LEAGUE}?view=mTeam&view=mRoster&view=mStandings`;
 try{
  const response=await fetch(endpoint,{headers:{'Cookie':`espn_s2=${espnS2}; SWID=${swid}`,'Accept':'application/json','User-Agent':'OnlyFranzWebsite/1.0'},signal:AbortSignal.timeout(12000)});
  if(!response.ok)return res.status(502).json({ok:false,message:response.status===401||response.status===403?'ESPN denied access; check session authorization':'ESPN request failed ('+response.status+')'});
  const data=await response.json();
  const team=(data.teams||[]).find(t=>Number(t.id)===TEAM);
  if(!team)return res.status(502).json({ok:false,message:'Team 5 was not returned by ESPN'});
  const overall=team.record?.overall||{};
  const roster=(team.roster?.entries||[]).map(e=>{
   const p=e.playerPoolEntry?.player||e.player||{};
   return {name:p.fullName||p.name||'Unknown player',nbaId:p.id||null,position:p.defaultPositionId!=null?({1:'PG',2:'SG',3:'SF',4:'PF',5:'C',6:'G',7:'F'}[p.defaultPositionId]||'Player'):'Player'};
  });
  return res.status(200).json({ok:true,teamId:TEAM,leagueId:LEAGUE,season:SEASON,wins:overall.wins??0,losses:overall.losses??0,ties:overall.ties??0,rank:team.rankCalculatedFinal??team.rank??team.playoffSeed??null,roster});
 }catch(e){return res.status(502).json({ok:false,message:'ESPN connection temporarily unavailable'});}
};
