// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
  track_id: undefined,
  player_id: undefined,
  race_id: undefined,
};

// We need our javascript to wait until the DOM is loaded

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await onPageLoad();
    setupClickHandlers();
  } catch (error) {
    console.log("Error during DOMContentLoaded:", error.message);
    console.error(error);
  }
});

async function onPageLoad() {
  try {
    const tracks = await getTracks();
    const htmlTracks = renderTrackCards(tracks);
    renderAt("#tracks", htmlTracks);

    const racers = await getRacers();
    const htmlRacers = renderRacerCars(racers);
    renderAt("#racers", htmlRacers);
  } catch (error) {
    console.log("Problem getting tracks and racers:", error.message);
    throw error;
  }
}

function setupClickHandlers() {
  document.addEventListener(
    "click",
    function (event) {
      const { target } = event;

      // Race track form field
      if (target.matches(".card.track")) {
        handleSelectTrack(target);
      }

      // Podracer form field
      if (target.matches(".card.podracer")) {
        handleSelectPodRacer(target);
      }

      // Submit create race form
      if (target.matches("#submit-create-race")) {
        event.preventDefault();

        // start race
        handleCreateRace();
      }

      // Handle acceleration click
      if (target.matches("#gas-peddle")) {
        handleAccelerate();
      }
    },
    false
  );
}

async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here");
    console.log(error);
  }
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
  // render starting UI

  // TODO - Get player_id and track_id from the store
  const player_id = store.player_id;
  const track_id = store.track_id;

  // const race = TODO - invoke the API call to create the race, then save the result
  try {
    const race = await createRace(player_id, track_id);

    renderAt("#race", renderRaceStartView(race.Track));

    // TODO - update the store with the race id
    store.race_id = +race.ID - 1;
    console.log(store);

    // TODO - call the async function runCountdown
    await runCountdown();

    // TODO - call the async function startRace
    await startRace(store.race_id);

    // TODO - call the async function runRace
    await runRace(store.race_id);
  } catch (error) {
    console.log("Error while handling race creation:", error.message);
    console.error(error);
  }
}

function runRace(raceID) {
  return new Promise((resolve, reject) => {
    // Use Javascript's built-in setInterval method to get race info every 500ms
    const raceInterval = setInterval(async () => {
      try {
        const race = await getRace(raceID);
        if (race.status === "in-progress") {
          console.log(race.status);
          renderAt("#leaderBoard", raceProgress(race.positions));
        } else if (race.status === "finished") {
          clearInterval(raceInterval); // Stop the interval from repeating
          renderAt("#race", resultsView(race.positions)); // Render the results view
          resolve(race); // Resolve the promise with the final race results
        }
      } catch (error) {
        console.log("Error while running the race:", error.message);
        clearInterval(raceInterval); // Stop the interval in case of an error
        reject(error);
      }
    }, 500);
  });
}

async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);
    let timer = 3;

    return new Promise((resolve) => {
      // Use Javascript's built-in setInterval method to count down once per second
      const countdownInterval = setInterval(() => {
        document.getElementById("big-numbers").innerHTML = --timer;
        if (timer === 0) {
          clearInterval(countdownInterval); // Clear the interval
          resolve(); // Resolve the promise when countdown is done
        }
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }
}

function handleSelectPodRacer(target) {
  console.log("selected a pod", target.id);

  // remove class selected from all racer options
  const selected = document.querySelector("#racers .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");

  // TODO - save the selected racer to the store
  store.player_id = target.id;
  console.log(store);
}

function handleSelectTrack(target) {
  console.log("selected a track", target.id);

  // remove class selected from all track options
  const selected = document.querySelector("#tracks .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");

  // TODO - save the selected track id to the store
  store.track_id = target.id;
}

async function handleAccelerate() {
  console.log("accelerate button clicked");

  try {
    // TODO - Invoke the API call to accelerate
    await accelerate(store.race_id);

    // After acceleration, update the race progress
    const race = await getRace(store.race_id);
    renderAt("#leaderBoard", raceProgress(race.positions));
  } catch (error) {
    console.log("Error while handling acceleration:", error.message);
  }
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`;
  }

  const results = racers.map(renderRacerCard).join("");

  return `
		<ul id="racers">
			${results}
		</ul>
	`;
}

function renderRacerCard(racer) {
  console.log(racer);
  const { id, driver_name, top_speed, acceleration, handling } = racer;

  return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>speed: ${top_speed}</p>
			<p>acceleration: ${acceleration}</p>
			<p>handling: ${handling}</p>
		</li>
	`;
}

function renderTrackCards(tracks) {
  console.log(tracks);
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`;
  }

  const results = tracks.map(renderTrackCard).join("");

  return `
		<ul id="tracks">
			${results}
		</ul>
	`;
}

function renderTrackCard(track) {
  const { id, name } = track;

  return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`;
}

function renderCountdown(count) {
  return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;
}

function renderRaceStartView(track, racers) {
  console.log(track);
  return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`;
}

function resultsView(positions) {
  positions.sort((a, b) => (a.final_position > b.final_position ? 1 : -1));

  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`;
}

function raceProgress(positions) {
  let userPlayer = positions.find((e) => e.id === parseInt(store.player_id));
  userPlayer.driver_name += " (you)";

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`;
}

function renderAt(element, html) {
  const node = document.querySelector(element);

  node.innerHTML = html;
}

// ^ Provided code ^ do not remove

// API CALLS ------------------------------------------------

const SERVER = "http://localhost:3001";

function defaultFetchOpts() {
  return {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": SERVER,
    },
  };
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints

async function getTracks() {
  const response = await fetch(`${SERVER}/api/tracks`, defaultFetchOpts());
  if (!response.ok) {
    throw new Error("Failed to fetch tracks");
  }
  return response.json();
}

async function getRacers() {
  const response = await fetch(`${SERVER}/api/cars`, defaultFetchOpts());
  if (!response.ok) {
    throw new Error("Failed to fetch racers");
  }
  return response.json();
}

async function createRace(player_id, track_id) {
  player_id = parseInt(player_id);
  track_id = parseInt(track_id);
  const body = { player_id, track_id };

  return fetch(`${SERVER}/api/races`, {
    method: "POST",
    ...defaultFetchOpts(),
    dataType: "jsonp",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Problem with createRace request::", err));
}

async function getRace(raceID) {
  // GET request to `${SERVER}/api/races/${id}`
  // GET request to `${SERVER}/api/races/${id}`
  // const raceID = parseInt(id) - 1;

  return fetch(`${SERVER}/api/races/${raceID}`, defaultFetchOpts())
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch race");
      }
      return res.json();
    })
    .catch((error) => {
      console.log("Problem with getRace request::", error);
    });
}

async function startRace(raceID) {
  // const raceID = parseInt(id) - 1;
  return fetch(`${SERVER}/api/races/${raceID}/start`, {
    method: "POST",
    ...defaultFetchOpts(),
  }).catch((err) => console.log("Problem with getRace request::", err));
}

async function accelerate(raceID) {
  return fetch(`${SERVER}/api/races/${raceID}/accelerate`, {
    method: "POST",
    ...defaultFetchOpts(),
  }).catch((error) => {
    console.log("Problem with accelerate request::", error);
  });
}
