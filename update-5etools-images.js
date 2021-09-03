/*
 * Update 5eTools Images
 *
 * Script performs selectable updates of image urls in world actors, world items, and scene tokens
 *
 * Authored by Surge#5715
 * Incorporated item support, flexible update urls, and numerous refactoring ideas from adorablecoin#5262
 * New UI based on GeekDad's Compendium to Table Script
 */

const VERSION = "0.2.1";

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
  for (const a of game.actors) {
    let data = {}
    if (a.data?.img?.startsWith(replaceUrl)) {
      const actorImg = a.data.img.replaceAll(replaceUrl, newUrl);
      data.img = actorImg;
      if (logging) console.log("Actor image: " + actorImg);
    }

    if (a.data.token?.img?.startsWith(replaceUrl)) {
      const tokenImg = a.data.token.img.replaceAll(replaceUrl, newUrl);
      data["token.img"] = tokenImg;
      if (logging) console.log("Actor prototype token: " + tokenImg);
    }

    if (Object.keys(data).length != 0)
      await a.update(data);
  }
}

async function doItems(replaceUrl, newUrl, logging) {
  for (const i of game.items) {
    if (i.data?.img?.startsWith(replaceUrl)) {
      const img = i.data.img.replaceAll(replaceUrl, newUrl);
      await i.update({"img": img});
      if (logging) console.log("Item image: " + img);
    }
  }
}

async function doScenes(updateScenes, replaceUrl, newUrl, logging) {
  for (const sceneKey of updateScenes) {
    const scene = game.scenes.get(sceneKey);
    for (const td of scene.tokens) {
      if (td.data?.img?.startsWith(replaceUrl)) {
        const img = td.data.img.replaceAll(replaceUrl, newUrl);
        if (logging) console.log("Scene token image: " + img);
        await td.update({"img": img});
      }
    }
  }
}

async function doUpdate(updateActors, updateItems, updateScenes, replaceUrl, newUrl, logging) {
  console.log('Update 5etools Images: started');
  if (updateActors) await doActors(replaceUrl, newUrl, logging);
  if (updateItems) await doItems(replaceUrl, newUrl, logging);
  if (updateScenes) await doScenes(updateScenes, replaceUrl, newUrl, logging);
  console.log('Update 5etools Images: finished');
}

let content = `<form><div style="display: inline-block; width: 100%; margin-bottom: 10px">
  <label for="logging">Enable logging</label>
  <input type="checkbox"  id="logging" name="logging" checked><br/>
  <hr>
  <p>Default converts 5e.tools image URLs to use the Plutonium <strong>Use Local Images</strong> local path.</p>
  <label for="replaceUrl">URL to be replaced</label>
  <input type="text"  id="replaceUrl" name="replaceUrl" value="https://5e.tools"><br/>
  <label for="newUrl">New URL or local path</label>
  <input type="text"  id="newUrl" name="newUrl" value="modules/plutonium"><br/>
  <hr>
  <label for="updateActors">Update world actor images</label>
  <input type="checkbox"  id="updateActors" name="updateActors" checked><br/>
  <label for="updateItems">Update world item images</label>
  <input type="checkbox"  id="updateItems" name="updateItems" checked><br/>`

content += `</select><br/><label for="updateScenes" style="vertical-align: top; margin-right: 10px;">Update scenes:</label><br />
  <select name="updateScenes" id="updateScenes" multiple>`
getScenes().forEach(scene => {
  content += `<option value='${scene.key}' selected>${scene.name}</option>`;
});
content += `</select><br>
</div><br /></form>`

new Dialog({
  title: `Update 5eTools Images v${VERSION}`,
  content: content,
  buttons: {
    update: {
      icon: "<i class='fas fa-check'></i>",
      label: "Update",
      callback: (html) => {
        let logging = html.find("input[name='logging']:checked").val();
        let updateActors = html.find("input[name='updateActors']:checked").val();
        let updateItems = html.find("input[name='updateItems']:checked").val();
        let updateScenes = html.find("select[name='updateScenes']").val();
        let replaceUrl = html.find("input[name='replaceUrl']").val();
        let newUrl = html.find("input[name='newUrl']").val();
        doUpdate(updateActors, updateItems, updateScenes, replaceUrl, newUrl, logging);
      }
    },
    cancel: {
      icon: "<i class='fas fa-times'></i>",
      label: 'Cancel'
    }
  },
  default: "yes"
}).render(true);
