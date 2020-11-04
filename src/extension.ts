import {
  ExtensionContext,
  languages,
  Disposable,
  commands,
  workspace,
} from "vscode";
import { provideHover } from "./hover";

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
  console.log("activate", { context });

  languages.registerHoverProvider("*", provideHover);
}

export function deactivate() {
  if (disposables) {
    disposables.forEach((item) => item.dispose());
  }
  disposables = [];
}

// const codelensProvider = new CodelensProvider();
// languages.registerCodeLensProvider("*", codelensProvider);
commands.registerCommand("visualize-typescript.enable", () => {
  workspace
    .getConfiguration("visualize-typescript")
    .update("enabled", true, true);
});

commands.registerCommand("visualize-typescript.disable", () => {
  workspace
    .getConfiguration("visualize-typescript")
    .update("enabled", false, true);
});
// commands.registerCommand("colorlens.disableCodeLens", () => {
//   workspace
//     .getConfiguration("colorlens")
//     .update("enableCodeLens", false, true);
// });
// commands.registerCommand("colorlens.codelensAction", (args) => {
//   window.showInformationMessage(`CodeLens action clicked with args=${args}`);
// });
// context.subscriptions.push(disposable);

// languages.registerDefinitionProvider(
//   { pattern: "**/*" },
//   {
//     provideDefinition: (doc, position, token) => {
//       debugger;
//       const range = doc.getWordRangeAtPosition(position);
//       const identifier = doc.getText(range);

//       const result = new Array<DefinitionLink>();

//       for (const openedDoc of workspace.textDocuments) {
//         const text = openedDoc.getText();
//         console.log(text);

//         const regexp = new RegExp(`(def\\W+)` + identifier, "g");
//         do {
//           var m = regexp.exec(text);
//           if (m) {
//             const start = m.index! + m[1].length;
//             const end = m.index! + m[0].length;
//             result.push({
//               targetUri: openedDoc.uri,
//               targetRange: new Range(
//                 openedDoc.positionAt(start),
//                 openedDoc.positionAt(end)
//               ),
//             });
//           }
//         } while (m);
//       }

//       return result;
//     },
//   }
// );
