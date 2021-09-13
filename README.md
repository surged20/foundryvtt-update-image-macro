# Foundry VTT Update 5eTools Images macro

This macro is only for **Foundry VTT 0.8.x**.

**STOP! If you are planning to convert your world to use local images then you must install local images within your plutonium module directory/folder before using this macro. Follow the guide at https://github.com/Maravedis/plutonium-issues-doc**

This script is used to convert 5eTools site image urls to 5eTools mirror site url or a local image path. It will convert:
1. World actor portrait images and prototype token images
2. World item images
3. World journal images and content
4. Scene background images, token images and synthetic actor images in an unlinked token

## Install

![Macro Directory](https://raw.githubusercontent.com/wiki/surged20/foundryvtt-update-image-macro/images/macro-directory.png)
1. Open the **Macro Directory**
2. Click **Create Macro**
3. Select **script** macro
4. Enter a name (e.g. *Update 5eTools Images*)
5. Copy and paste the contents of **update-5etools-images.js** into the Command window.
6. Click **Save Macro**

## Use

![Script UI](https://raw.githubusercontent.com/wiki/surged20/foundryvtt-update-image-macro/images/update-5etools-images-dialog.png)
1. **Back up your world before use!** Anything can happen when mucking with the db.
2. Execute the **Update 5eTools Images** macro.
3. The default settings have everything selected and configured to translate from the 5e.tools URL to the current 5eTools mirror URL. If you would like to convert 5e.tools URLs to use local data images, then select **modules/plutonium/** from the *New URL or local path* selector. Note that the scene selector is multi-select enabled and all scenes are selected by default.
4. Click **Update** to start the update.
5. If *Enable Logging* is checked, a log of the updated images will be written to the console.

## Credits

* **adorablecoin#5262** for providing code, bug fixes, and suggestions for some new features.
* **Maravedis#0468** for fixes and help debugging.
