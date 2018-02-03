![Draaft icon](/icon/128.png?raw=true)

A very simple chrome extension adding a context menu to the browser allowing to
transfer the selected text including the current url of the page to
[https://beta.draaft.co](draaft.co).

## Installation

### As extension in chrome browsers

Install the [extension](https://chrome.google.com/webstore/detail/draaft-bookmarker/bdppmhlaopccijpfcnmbmnjgapmcldbm)
from the chrome web store

## Usage

### With text

* Select text on a web page
* Right-click it and select "Create draaft: Your text here"

### Usage within pdfs

This feature is only available from the chrome extension

* Select text on a web page or PDF
* Right click
* and choose "Create draaft: Your text here"


## Contribution

* Fork the project or [download as zip](https://github.com/draaft-io/chrome-extension/archive/master.zip)
* [unzip]
* open [chrome extension page](chrome://extensions/)
* click on load unpacked extension ([more details here](https://developer.chrome.com/extensions/getstarted#unpacked))

## Bit
### Source
bit init
bit remote add ssh://root@localhost:3333:/tmp/scope -g 

```json
{
    "env": {
        "compiler": "none",
        "tester": "none"
    },
    "dependencies": {},
    "structure": {
        "components": "common/{namespace}/{name}",
        "dependencies": "common/.dependencies"
    },
    "dist": {
        "target": "dist"
    }
}
````

### Commit Code
bit add lib/helpers/updatePath.js -i "lib/update-path"
bit add lib/helpers/getDocumentArray.js -i "lib/get-document-array"
bit add lib/helpers/documentToStructure.js -i "lib/document-to-structure"
bit add lib/helpers/extractExpandMappingStructure.js -i "lib/extract-expand-mapping-structure"
bit add lib/helpers/flattenVisibleTree.js -i "lib/flatten-visible-tree"
bit add lib/helpers/getNodeId.js -i "lib/get-node-id"
bit add lib/helpers/updateSectionTree.js -i "lib/update-section-tree"
bit add lib/helpers/autoNumberedSections.js -i "lib/auto-numbered-sections"

bit add graphql/mutations/updateElementTags.js -i "mutations/element-update-tags"
bit add graphql/mutations/elementImport.js -i "mutations/element-import"
bit add graphql/mutations/removeElement.js -i "mutations/element-remove"
bit add graphql/mutations/setShowImportSuccessScreen.js -i "mutations/set-show-import-success-screen"

bit add components/Components/ComponentForm/ComponentForm.js -i "components/component-form"
bit add components/Components/ComponentForm/ComponentForm.css -i "components/component-form"

bit add components/BaseComponents/QuillEditor/QuillEditor.js -i "components/quill-editor"
bit add components/BaseComponents/QuillEditor/QuillEditor.less -i "components/quill-editor"

bit add components/Components/ComponentTagView/ComponentTagView.js -i "components/component-tag-view"
bit add components/Components/ComponentTagView/ComponentTagView.css -i "components/component-tag-view"

bit add components/Components/ComponentAdd/ComponentAdd.js -i "components/component-add"
bit add components/Components/ComponentAdd/ComponentAddDocument.js -i "components/component-add"
bit add components/Components/ComponentAdd/ComponentAddDocument.css -i "components/component-add"
bit add components/Components/ComponentAdd/ComponendAddSection.js -i "components/component-add"

bit add components/Documents/DocumentTreeStructure/DocumentTreeStructure.js -i "components/document-tree-structure"
bit add components/Documents/DocumentTreeStructure/DocumentTreeStructure.css -i "components/document-tree-structure"

bit add components/Documents/DocumentTreeNode/DocumentTreeNode.js -i "components/document-tree-node"
bit add components/Documents/DocumentTreeNode/DocumentTreeNodeDnD.js -i "components/document-tree-node"
bit add components/Documents/DocumentTreeNode/DocumentTreeNodeDnD.css -i "components/document-tree-node"
bit add components/Documents/DocumentTreeNode/DocumentTreeNode.css -i "components/document-tree-node"
bit add components/Documents/DocumentTreeNode/DocumentTreeInput.js -i "components/document-tree-node"
bit add components/Documents/DocumentTreeStructure/handleKeys.js -i "components/document-tree-structure"

bit add components/BaseComponents/LoadingPage/LoadingPage.js -i "components/loading-page"
bit add components/BaseComponents/LoadingPage/LoadingPage.css -i "components/loading-page"

bit add components/Components/ComponentImport/ComponentImportSuccess.js -i "components/component-import-success"
bit add components/Components/ComponentImport/ComponentImportSuccess.css -i "components/component-import-success"

bit add components/Accounts/AccountLogin/AccountLoginGoogle.js -i "components/account-login-google"
bit add components/Accounts/AccountLogin/AccountLoginFacebook.js -i "components/account-login-facebook"
bit add components/Accounts/AccountLogin/AccountLoginPassword.js -i "components/account-login-password"
bit add components/Accounts/AccountLogin/AccountLoginPassword.css -i "components/account-login-password"

### Tag bits
bit tag -am "first commit"

### Export bits
bit export scope

## Target
bit init
bit remote add ssh://root@localhost:3333:/tmp/scope -g 

bit import --force scope/components/quill-editor
bit import --force scope/components/loading-page
bit import --force scope/mutations/element-import
bit import --force scope/mutations/element-remove
bit import --force scope/mutations/set-show-import-success-screen
bit import --force scope/components/component-import-success
bit import --force scope/components/account-login-password
bit import --force scope/components/account-login-facebook
bit import --force scope/components/account-login-google
bit import --force scope/components/component-add
bit import --force scope/components/component-form

## Update
bit tag -am "update" # on source
bit export scope # on source
bit import --force scope/components/component-form # on target
