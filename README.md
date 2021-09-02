# Foundry VTT Update 5eTools Images macro

This script is used convert 5eTools site image urls to either a local image path or another image url. It will convert:
1. World actor portrait images
2. World actor prototype token images
3. World item images
4. Scene token images

## Install

1. Open the **Macro Directory**
2. Click **Create Macro**
3. Select **script** macro
4. Enter a name (e.g. *Update 5eTools Images*)
5. Copy and paste the contents of **update-5etools-images.js** into the Command window.
6. Click **Save Macro**

## Use

1. **Back up your world before use!** Anything can happen when mucking with the db.
2. Execute the **Update 5eTools Images** macro.
3. The default settings have everything selected and configured to translate from 5eTools URLs to local image data. Note that the scene selector is multi-select enabled and all scenes are selected by default.
4. Click **Update** to start the update.
5. If *Enable Logging* is checked, a log of the updated images will be written to the console.
