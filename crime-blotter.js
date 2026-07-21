/* VICE CITY CRIME BLOTTER — pure satire/parody, not real news.
   In-universe tabloid-style joke headlines in the spirit of GTA's own
   in-game Weazel News / Bleeter satire. Rotates a themed set every few
   hours using a time-bucketed seed, so all visitors in the same window
   see the same set (consistent, not random-per-load), and it refreshes
   like a real feed over the course of a day. Never names GTA6's actual
   protagonists directly — only winks at them. */
(function () {
  var HEADLINES = [
    { h: "Local Man Punches Woman In Face, Later Claims ‘I Thought She Was An Escaped Gorilla From The Zoo’", s: "Blaine County Gazette" },
    { h: "Head Of Local Drug Operation Found Hanging From Flagpole In His Underwear; Coroner Rules It ‘Self-Inflicted, Probably’", s: "Local Crime" },
    { h: "Witness Claims Gang Shootout Was Started By A Passerby ‘Just Walking His Dog’; Police Describe Dog As ‘Unusually Large’ And ‘Possibly Armed’", s: "Eyewitness Report" },
    { h: "Man Steals Boat, Drives It Six Miles Down The Interstate Before Realizing His Mistake", s: "Traffic & Incidents" },
    { h: "Local Zoo Reports Missing Gorilla For Third Time This Year; Residents Urged Not To Punch Any Suspicious Women", s: "Wildlife Watch" },
    { h: "Bank Robbery Suspects Described As ‘Very Coordinated’ By Witnesses, One Of Whom Says They High-Fived Mid-Heist", s: "Crime Blotter" },
    { h: "Man Arrested For Riding Jet Ski Through Downtown Fountain, Insists He Was ‘Just Testing The Waters’", s: "Local Crime" },
    { h: "Trucking Company Reports Third Vehicle Stolen This Month, All By A Man Described As ‘Oddly Polite’", s: "Property Crime" },
    { h: "Convenience Store Clerk Says Robber ‘Apologized Twice’ Before Fleeing With The Register", s: "Local Crime" },
    { h: "Mysterious Explosion Levels Warehouse; Fire Marshal Calls Cause ‘Under Investigation,’ Neighbor Says ‘It Was Definitely On Purpose’", s: "Breaking" },
    { h: "Golf Course Evacuated After Man In Alligator Costume Reportedly ‘Just Wanted To Play A Round’", s: "Local Oddities" },
    { h: "Police Seek Suspect Who Fled A Robbery On A Riding Lawnmower, Described As ‘Surprisingly Fast’", s: "Crime Blotter" },
    { h: "Man Cited For Public Nudity After Losing A Bet He ‘Definitely Would’ Win Again", s: "Local Crime" },
    { h: "Fireworks Warehouse Fire Ruled Accidental Despite Neighbor's Insistence He ‘Heard Someone Yell Cannonball First’", s: "Breaking" },

    { h: "Couple Wanted In Connection With A String Of Convenience Store Robberies Across Leonida Described As ‘Disturbingly In Sync’", s: "Leonida Watch" },
    { h: "Local Gator Farm Reports Break-In; Owner Says ‘Nothing Was Stolen, But Somebody Definitely Rode One’", s: "Vice City Roundup" },
    { h: "Vice PD Seeking Man And Woman Last Seen Fleeing A Marina In A Stolen Speedboat, Waving", s: "Leonida Watch" },
    { h: "Witnesses Describe Suspects In A String Of South Leonida Heists As ‘Weirdly Charming For Fugitives’", s: "Vice City Roundup" },
    { h: "Trailer Park Resident Is ‘Definitely Up To Something,’ Neighbors Agree, Though None Will Elaborate", s: "Local Tip Line" },
    { h: "Two Persons Of Interest Sought In Connection With A Casino Incident Vice PD Refuses To Discuss On Record", s: "Leonida Watch" },
    { h: "Diner Reports A Couple Dined And Dashed, But Left A Generous Cash Tip Anyway", s: "Vice City Roundup" },
    { h: "Sunbelt Savings & Loan Reports Break-In; Security Footage ‘Mysteriously Corrupted,’ Says Manager Who Definitely Isn't Hiding Anything", s: "Leonida Watch" },
    { h: "Airboat Chase Through The Everglades Ends With Suspects ‘Just Gone,’ Says Visibly Confused Deputy", s: "Vice City Roundup" },
    { h: "Motel Manager Says Guests In Room 12 ‘Paid Cash, Left No Names, Tipped Extremely Well’", s: "Local Tip Line" }
  ];

  var BUCKET_HOURS = 4;
  var PICK_COUNT = 3;

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

  function renderCrimeBlotter() {
    var list = document.getElementById('crime-blotter-list');
    if (!list) return;
    var bucket = Math.floor(Date.now() / (BUCKET_HOURS * 60 * 60 * 1000));
    var picks = seededShuffle(HEADLINES, bucket).slice(0, PICK_COUNT);
    list.innerHTML = picks.map(function (item) {
      return '<li><span class="blotter-headline">' + item.h + '</span><span class="blotter-source">' + item.s + '</span></li>';
    }).join('');
  }

  renderCrimeBlotter();
})();
