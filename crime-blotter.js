/* VICE CITY CRIME BLOTTER — pure satire/parody, not real news.
   A fake "tiktwit" feed of in-universe tabloid headlines: GTA-world
   crime blotter jokes, winking Vice City/Leonida teasers that never
   name the actual protagonists, and Florida-Man-style weird-but-true
   absurdity (UFOs, gators, cryptids) since Leonida IS the parody of
   Florida. Rotates a fresh set every 2 minutes via a time-bucketed
   seed (same set for everyone in that window, changes automatically,
   also re-renders live on an interval without a page reload) — a big
   pool keeps it from feeling repetitive even at that speed. */
(function () {
  var HEADLINES = [
    // ── GTA Online crime blotter satire ──
    { h: "Local Man Punches Woman In Face, Later Claims ‘I Thought She Was An Escaped Gorilla From The Zoo’", s: "@BlaineCoBlotter" },
    { h: "Head Of Local Drug Operation Found Hanging From Flagpole In His Underwear; Coroner Rules It ‘Self-Inflicted, Probably’", s: "@LSCrimeDesk" },
    { h: "Witness Claims Gang Shootout Was Started By A Passerby ‘Just Walking His Dog’; Police Describe Dog As ‘Unusually Large’ And ‘Possibly Armed’", s: "@LSPDScanner" },
    { h: "Man Steals Boat, Drives It Six Miles Down The Interstate Before Realizing His Mistake", s: "@TrafficWatchLS" },
    { h: "Local Zoo Reports Missing Gorilla For Third Time This Year; Residents Urged Not To Punch Any Suspicious Women", s: "@WildlifeWatch" },
    { h: "Bank Robbery Suspects Described As ‘Very Coordinated’ By Witnesses, One Of Whom Says They High-Fived Mid-Heist", s: "@LSCrimeDesk" },
    { h: "Man Arrested For Riding Jet Ski Through Downtown Fountain, Insists He Was ‘Just Testing The Waters’", s: "@BlaineCoBlotter" },
    { h: "Trucking Company Reports Third Vehicle Stolen This Month, All By A Man Described As ‘Oddly Polite’", s: "@LSPDScanner" },
    { h: "Convenience Store Clerk Says Robber ‘Apologized Twice’ Before Fleeing With The Register", s: "@LSCrimeDesk" },
    { h: "Mysterious Explosion Levels Warehouse; Fire Marshal Calls Cause ‘Under Investigation,’ Neighbor Says ‘It Was Definitely On Purpose’", s: "@BreakingLS" },
    { h: "Golf Course Evacuated After Man In Alligator Costume Reportedly ‘Just Wanted To Play A Round’", s: "@LSOddities" },
    { h: "Police Seek Suspect Who Fled A Robbery On A Riding Lawnmower, Described As ‘Surprisingly Fast’", s: "@LSCrimeDesk" },
    { h: "Man Cited For Public Nudity After Losing A Bet He ‘Definitely Would’ Win Again", s: "@BlaineCoBlotter" },
    { h: "Fireworks Warehouse Fire Ruled Accidental Despite Neighbor's Insistence He ‘Heard Someone Yell Cannonball First’", s: "@BreakingLS" },
    { h: "Local Casino Reports ‘Minor Disturbance’ Involving A Forklift; Security Footage Somehow Unavailable", s: "@LSCrimeDesk" },
    { h: "Ice Cream Truck Impounded After Third Report Of ‘Suspiciously Fast’ Getaway Driving", s: "@TrafficWatchLS" },
    { h: "Man Rescued From Billboard After Climbing Up To ‘Fix The Spelling’, Which Was Not Actually Wrong", s: "@LSOddities" },
    { h: "Downtown High-Rise Reports Break-In; Only Item Missing Is A Single Golden Toilet", s: "@LSCrimeDesk" },
    { h: "Local Man Cited For Racing A Freight Train, Says He ‘Had It The Whole Time’", s: "@TrafficWatchLS" },
    { h: "Petting Zoo Llama Goes Missing Same Night As Nearby Bank Alarm; Officials Insist ‘No Connection’", s: "@LSOddities" },
    { h: "Three Men In Matching Tracksuits Detained Near Marina, Released After Insisting They Were ‘Just Jogging’", s: "@LSPDScanner" },
    { h: "Downtown Parking Garage Collapse Blamed On ‘Structural Issues,’ Witness Insists He Saw A Tank", s: "@BreakingLS" },
    { h: "Local Diner Robbed Twice In One Week By What Manager Describes As ‘Two Completely Different Guys, Somehow Identical’", s: "@LSCrimeDesk" },
    { h: "Man Arrested For Attempting To Sell A Fighter Jet On A Local Classifieds Site", s: "@LSOddities" },
    { h: "Storage Facility Fire Investigators Baffled By ‘Unusually Large Number’ Of Empty Weapon Crates", s: "@BreakingLS" },

    // ── Vice City / Leonida teaser satire — never names the actual protagonists ──
    { h: "Couple Wanted In Connection With A String Of Convenience Store Robberies Across Leonida Described As ‘Disturbingly In Sync’", s: "@LeonidaWatch" },
    { h: "Local Gator Farm Reports Break-In; Owner Says ‘Nothing Was Stolen, But Somebody Definitely Rode One’", s: "@ViceCityRoundup" },
    { h: "Vice PD Seeking Man And Woman Last Seen Fleeing A Marina In A Stolen Speedboat, Waving", s: "@LeonidaWatch" },
    { h: "Witnesses Describe Suspects In A String Of South Leonida Heists As ‘Weirdly Charming For Fugitives’", s: "@ViceCityRoundup" },
    { h: "Trailer Park Resident Is ‘Definitely Up To Something,’ Neighbors Agree, Though None Will Elaborate", s: "@LocalTipLine" },
    { h: "Two Persons Of Interest Sought In Connection With A Casino Incident Vice PD Refuses To Discuss On Record", s: "@LeonidaWatch" },
    { h: "Diner Reports A Couple Dined And Dashed, But Left A Generous Cash Tip Anyway", s: "@ViceCityRoundup" },
    { h: "Sunbelt Savings & Loan Reports Break-In; Security Footage ‘Mysteriously Corrupted,’ Says Manager Who Definitely Isn't Hiding Anything", s: "@LeonidaWatch" },
    { h: "Airboat Chase Through The Everglades Ends With Suspects ‘Just Gone,’ Says Visibly Confused Deputy", s: "@ViceCityRoundup" },
    { h: "Motel Manager Says Guests In Room 12 ‘Paid Cash, Left No Names, Tipped Extremely Well’", s: "@LocalTipLine" },
    { h: "Strip Mall Shootout Suspects Fled In A Pink Convertible, Says Witness Who ‘Couldn't Stop Staring At It’", s: "@ViceCityRoundup" },
    { h: "Vice PD Confirms A Recent String Of Robberies Are ‘Likely Connected,’ Declines To Say How They Know That", s: "@LeonidaWatch" },
    { h: "Waterfront Mansion Reports Break-In; Owner ‘Strangely Calm’ About It, Says Neighbor", s: "@ViceCityRoundup" },
    { h: "Local Pawn Shop Owner Describes Recent Customers As ‘Very Specific About Which Guns, Very Vague About Why’", s: "@LocalTipLine" },
    { h: "Two Suspects Fled A Gas Station Robbery On Foot, Then Reappeared Minutes Later In A Different Car Entirely", s: "@LeonidaWatch" },

    // ── Weird-but-true / Florida-Man style tabloid satire, since Leonida = Florida ──
    { h: "Man Fights Alligator Over Last Beer In The Cooler, Reportedly Wins", s: "@SwampGossip" },
    { h: "Local Woman Reports UFO Over The Everglades; Neighbor Says It Was ‘Just My Drone, Sorry Carol’", s: "@LeonidaTabloid" },
    { h: "Iguana Falls From Palm Tree Onto Moving Convertible, Driver Unharmed, Iguana ‘Fine, Just Annoyed’", s: "@SwampGossip" },
    { h: "Bigfoot Sighting Reported Near Rest Stop Turns Out To Be A Man In A Ghillie Suit ‘Practicing’", s: "@LeonidaTabloid" },
    { h: "Man Wrestles Runaway Peacock Off Interstate, Says ‘Somebody Had To’", s: "@SwampGossip" },
    { h: "Mysterious Lights Over The Bay Draw Crowd; Local Astronomer Says ‘That's Just The Casino Sign’", s: "@LeonidaTabloid" },
    { h: "Woman Calls 911 On A Raccoon She Says Was ‘Definitely Casing The Joint’", s: "@SwampGossip" },
    { h: "Local Man Insists He Saw A Chupacabra, Description Matches A Very Wet Dog", s: "@LeonidaTabloid" },
    { h: "Beachgoers Flee After ‘Massive Creature’ Surfaces, Turns Out To Be A Very Large Manatee Named Gerald", s: "@SwampGossip" },
    { h: "Man Arrested For Riding An Ostrich Down Main Street, Says The Ostrich ‘Started It’", s: "@LeonidaTabloid" },
    { h: "Local Report Of ‘Alien Abduction’ Turns Out To Be Man Who Fell Asleep On A Party Boat", s: "@SwampGossip" },
    { h: "Sinkhole Swallows Parked Car Downtown; Owner Says ‘Honestly, Kind Of Saw This Coming’", s: "@LeonidaTabloid" },
    { h: "Flock Of Flamingos Shuts Down Highway For Two Hours, Traffic ‘Weirdly Understanding About It’", s: "@SwampGossip" },
    { h: "Man Claims Government Cover-Up Over ‘Glowing Object’ In The Sky; Object Later Identified As The Moon", s: "@LeonidaTabloid" },
    { h: "Local Woman's ‘Ghost Sighting’ At The Motel Turns Out To Be Ice Machine Malfunction", s: "@SwampGossip" },
    { h: "Shark Reportedly Bites Jet Ski, Rider Uninjured, ‘Kind Of Bragging About It Honestly’", s: "@LeonidaTabloid" },
    { h: "Man Reports ‘Time Slip’ After A Night Out; Bartender Confirms It Was ‘Just Six Hours And Several Drinks’", s: "@SwampGossip" },
    { h: "Wild Boar Wanders Into Grocery Store, Heads Straight For The Bakery Aisle", s: "@LeonidaTabloid" },
    { h: "Fisherman Reels In ‘Sea Monster,’ Turns Out To Be An Old Boat Propeller Covered In Barnacles", s: "@SwampGossip" },
    { h: "Local ‘Crop Circle’ Investigation Concludes It Was Just A Very Determined Lawnmower Enthusiast", s: "@LeonidaTabloid" },
    { h: "Second Iguana-From-A-Tree Incident This Week Prompts Weather Service To Add Official Advisory", s: "@SwampGossip" },
    { h: "Man Says He Saw A ‘Glowing Figure’ In The Marsh; Turns Out To Be A Guy In A Reflective Vest Looking For His Keys", s: "@LeonidaTabloid" },
    { h: "Retiree's Backyard ‘Meteor Strike’ Identified As A Dropped Coconut", s: "@SwampGossip" },
    { h: "Local Bar Reports Regular Customer Is ‘Definitely Not Human, But Also Definitely Pays His Tab’", s: "@LeonidaTabloid" },
    { h: "Golf Course Alligator Named ‘Big Steve’ Now Has His Own Fan Club And A Reserved Parking Spot", s: "@SwampGossip" }
  ];

  var BUCKET_MS = 2 * 60 * 1000; // fresh set every 2 minutes
  var PICK_COUNT = 5;

  function seededShuffle(arr, seed) {
    var out = arr.slice();
    var s = seed;
    for (var i = out.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      var j = Math.floor((s / 233280) * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }

  function fakeAge(index) {
    var mins = [1, 4, 9, 15, 23, 31, 42][index] || (index * 8 + 5);
    return mins < 60 ? mins + 'm' : Math.floor(mins / 60) + 'h';
  }

  function renderCrimeBlotter() {
    var list = document.getElementById('crime-blotter-list');
    if (!list) return;
    var bucket = Math.floor(Date.now() / BUCKET_MS);
    var picks = seededShuffle(HEADLINES, bucket).slice(0, PICK_COUNT);
    list.innerHTML = picks.map(function (item, i) {
      return '<li><span class="blotter-headline">' + item.h + '</span>' +
        '<span class="blotter-source">' + item.s + ' · ' + fakeAge(i) + '</span></li>';
    }).join('');
  }

  renderCrimeBlotter();
  setInterval(renderCrimeBlotter, BUCKET_MS);
})();
