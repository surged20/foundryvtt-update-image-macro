/*
 * Update 5eTools Images
 *
 * Script performs selectable updates of image urls in world actors, world items, and scene tokens
 * Only Foundry 0.8.x is supported
 *
 * Authored by Surge#5715
 * Incorporated item support, flexible update urls, bug fixes, and numerous refactoring ideas from adorablecoin#5262
 * New UI based on GeekDad's Compendium to Table Script
 */

const MACRO = "Update 5eTools Images"
const VERSION = "0.7.1";

function getScenes() {
  let scenes = [];
  let keys = game.scenes.keys();
  let done = false;
  while (!done) {
    let key = keys.next();
    done = key.done;
    if (!done) {
      let scene = game.scenes.get(key.value);
      scenes.push({ key: key.value, name: scene.name });
    }
  }
  return scenes;
}


async function doActors(replaceUrl, newUrl, logging) {
  let updates = [];
  for (const a of game.actors) {
    let data = {}
    if (a.data?.img?.startsWith(replaceUrl)) {
      const actorImg = a.data.img.replace(replaceUrl, newUrl);
      data.img = actorImg;
      if (logging) console.log("Actor image: " + actorImg);
    }

    if (a.data.token?.img?.startsWith(replaceUrl)) {
      const tokenImg = a.data.token.img.replace(replaceUrl, newUrl);
      data["token.img"] = tokenImg;
      if (logging) console.log("Actor prototype token: " + tokenImg);
    }

    if (Object.keys(data).length != 0) {
      data["_id"] = a.data.document.data._id;
      updates.push(data);
    }
  }
  await Actor.updateDocuments(updates);
}

async function doItems(replaceUrl, newUrl, logging) {
  let updates = [];
  for (const i of game.items) {
    if (i.data?.img?.startsWith(replaceUrl)) {
      const img = i.data.img.replace(replaceUrl, newUrl);
      updates.push({"_id": i.data.document.data._id, "img": img});
      if (logging) console.log("Item image: " + img);
    }
  }
  await Item.updateDocuments(updates);
}

async function doJournals(replaceUrl, newUrl, logging) {
  let updates = [];
  for (const j of game.journal) {
    let data = {};
    if (j.data?.img?.startsWith(replaceUrl)) {
      data.img = j.data.img.replace(replaceUrl, newUrl);
      if (logging) console.log("Journal image: " + img);
    }
    if (j.data?.content?.search(replaceUrl)) {
      data.content = j.data.content.replaceAll(replaceUrl, newUrl);
      if (logging) console.log("Journal content: " + j.name);
    }
    if (Object.keys(data).length != 0) {
      data["_id"] = j.data.document.data._id;
      updates.push(data)
    }
  }
  await JournalEntry.updateDocuments(updates);
}

async function doScenes(updateScenes, replaceUrl, newUrl, logging) {
  for (const sceneKey of updateScenes) {
    const scene = game.scenes.get(sceneKey);
    if (scene.data?.img?.startsWith(replaceUrl)) {
      const sceneImg = scene.data.img.replace(replaceUrl, newUrl);
      await scene.update({img: sceneImg});
      if (logging) console.log("Scene background image: " + sceneImg);
    }
    let updates = [];
    for (const td of scene.tokens) {
      let data = {}
      if (td.data?.img?.startsWith(replaceUrl)) {
        const tokenImg = td.data.img.replace(replaceUrl, newUrl);
        data.img = tokenImg;
        if (logging) console.log("Scene token image: " + tokenImg);
      }
      if (!td.data.actorLink) {
        if (td.data.actorData?.img?.startsWith(replaceUrl)) {
          const actorImg = td.data.actorData.img.replace(replaceUrl, newUrl);
          data["actorData.img"] = actorImg;
          if (logging) console.log("Scene token unlinked actor image: " + actorImg);
        }
      }
      if (Object.keys(data).length != 0) {
        data["_id"] = td.data._id;
        updates.push(data)
      }
    }
    await TokenDocument.updateDocuments(updates, {parent: scene});
  }
}

async function doUpdate(updateActors, updateItems, updateJournals, updateScenes, replaceUrl, newUrl, logging) {
  if(replaceUrl.endsWith('/') == false) { console.log("appending replaceUrl with '/' for safety"); replaceUrl += '/'; }
  if(newUrl.endsWith('/') == false) { console.log("appending newUrl with '/' for safety"); newUrl += '/'; }
  if(replaceUrl == newUrl) { console.log('urls specified are the same; updating skipped'); return; }

  console.log(MACRO + ': started');
  const t0 = performance.now();
  if (updateActors) await doActors(replaceUrl, newUrl, logging);
  if (updateItems) await doItems(replaceUrl, newUrl, logging);
  if (updateJournals) await doJournals(replaceUrl, newUrl, logging);
  if (updateScenes) await doScenes(updateScenes, replaceUrl, newUrl, logging);
  const t1 = performance.now();
  console.log(MACRO +': finished in ' + (t1-t0) + ' ms');
}

if (!game.data.version.startsWith("0.8.")) {
  ui.notifications.error(MACRO + " only supports Foundry VTT 0.8.x");
  return;
}

let content = `<script>
    function toggleField(hideObj,showObj){
      hideObj.disabled=true;
      hideObj.style.display='none';
      showObj.disabled=false;
      showObj.style.display='inline';
      showObj.focus();
    }
  </script>
  <form><div style="display: inline-block; width: 100%; margin-bottom: 10px">
  <label for="logging">Enable logging</label>
  <input type="checkbox"  id="logging" name="logging" checked><br/>
  <hr>
  <p>The default settings will convert 5e.tools image URLs to use the temporary mirror.</p>
  <p>Set <em>New URL or local path</em> to <strong>modules/plutonium/</strong> to convert to local data images.</p>
  <label for="replaceUrl">Current URL or local path</label>
  <select name="replaceUrl" id="replaceUrl" onchange="if(this.options[this.selectedIndex].value=='customUrl'){toggleField(this,this.nextSibling); this.selectedIndex=this.options.length-1;}">
    <option>https://5e.tools/</option>
    <option>https://5etools-mirror-1.github.io/</option>
    <option>modules/plutonium/</option>
    <option value="customUrl">[type a custom URL]</option>
  </select><input name="replaceUrl" style="display:none;" disabled="disabled" onblur="if(this.value==''){toggleField(this,this.previousSibling);}"><br/>
  <label for="newUrl">New URL or local path</label>
  <select name="newUrl" id="newUrl" onchange="if(this.options[this.selectedIndex].value=='customUrl'){toggleField(this,this.nextSibling); this.selectedIndex=this.options.length-1;}">
    <option>https://5etools-mirror-1.github.io/</option>
    <option>https://5e.tools/</option>
    <option>modules/plutonium/</option>
    <option value="customUrl">[type a custom URL]</option>
  </select><input name="newUrl" style="display:none;" disabled="disabled" onblur="if(this.value==''){toggleField(this,this.previousSibling);}">
  <hr>
  <label for="updateActors">Update world actor images</label>
  <input type="checkbox"  id="updateActors" name="updateActors" checked><br/>
  <label for="updateItems">Update world item images</label>
  <input type="checkbox"  id="updateItems" name="updateItems" checked><br/>
  <label for="updateJournals">Update world journal images</label>
  <input type="checkbox"  id="updateJournals" name="updateJournals" checked><br/>`
content += `</select><br/><label for="updateScenes" style="vertical-align: top; margin-right: 10px;">Update scenes:</label><br />
  <select name="updateScenes" id="updateScenes" multiple>`
getScenes().forEach(scene => {
  content += `<option value='${scene.key}' selected>${scene.name}</option>`;
});
content += `</select><br>
</div><br /></form>`

new Dialog({
  title: `${MACRO} v${VERSION}`,
  content: content,
  buttons: {
    update: {
      icon: "<i class='fas fa-check'></i>",
      label: "Update",
      callback: (html) => {
        let logging = html.find("input[name='logging']:checked").val();
        let updateActors = html.find("input[name='updateActors']:checked").val();
        let updateItems = html.find("input[name='updateItems']:checked").val();
        let updateJournals = html.find("input[name='updateJournals']:checked").val();
        let updateScenes = html.find("select[name='updateScenes']").val();
        let replaceUrl = html.find("select[name='replaceUrl']").val();
        if (replaceUrl === "customUrl")
          replaceUrl = html.find("input[name='replaceUrl']").val();
        let newUrl = html.find("select[name='newUrl']").val();
        if (newUrl === "customUrl")
          newUrl = html.find("input[name='newUrl']").val();
        doUpdate(updateActors, updateItems, updateJournals, updateScenes, replaceUrl, newUrl, logging);
      }
    },
    cancel: {
      icon: "<i class='fas fa-times'></i>",
      label: 'Cancel'
    }
  },
  default: "yes"
}).render(true);
