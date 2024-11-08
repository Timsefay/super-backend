const axios = require('axios');

async function getProfiles(uuid) {
	try {
		// Initialize variables
		let bestNetworth = 0;
		const profiles = { stats: { bestNetworth: "0" }, profiles: {} };
		const url = `https://soopy.dev/api/v2/player_skyblock/${uuid}?networth=true`;

		// API HTTP request
		const response = await axios.get(url);

		// Fetch profile IDs from request data
		const playerData = response.data;
		const profilesDict = playerData.data.profiles;
		const profileIds = Object.keys(profilesDict);

		// Loop through each profile and check networth and gamemode
		for (let profileId of profileIds) {
			let profileInfo = {};

			// Fetch gamemode if profile type isn't normal
			if ('gamemode' in playerData.data.profiles[profileId].stats) {
				profileInfo.gamemode = playerData.data.profiles[profileId].stats.gamemode.replace('island', 'stranded');
			} else {
				profileInfo.gamemode = 'normal';
			}

			// Fetch networth
			const networth = playerData.data.profiles[profileId].members[uuid].nwDetailed.unsoulboundNetworth;
			const unsoulboundNetworth = playerData.data.profiles[profileId].members[uuid].nwDetailed.unsoulboundNetworth;

			if (networth > bestNetworth) {
				bestNetworth = networth;
			}

			// Append information to all profiles dict
			profileInfo.networth = formatNumber(networth);
			profileInfo.unsoulboundNetworth = formatNumber(unsoulboundNetworth);

			profiles.profiles[profileId] = profileInfo;
		}

		// Update best networth
		profiles.stats.bestNetworth = formatNumber(bestNetworth);
		return profiles;

	} catch (error) {
		console.error(`An error occurred while trying to get networth: ${error}`);
		return null;
	}
}

function formatNumber(num) {
	if (num < 1000) {
		return num.toFixed(2);
	} else if (num < 1000000) {
		return (num / 1000).toFixed(2) + 'k';
	} else if (num < 1000000000) {
		return (num / 1000000).toFixed(2) + 'm';
	} else {
		return (num / 1000000000).toFixed(2) + 'b';
	}
}

module.exports = getProfiles;