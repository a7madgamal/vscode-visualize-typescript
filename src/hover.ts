import {
  HoverProvider,
  commands,
  LocationLink,
  MarkdownString,
  Hover,
  workspace,
} from "vscode";
import { colorToBase64String } from "./imageUtils";
import { resolve, dirname } from "path";
const COLOR_REGEX = /color\((.*)\)/;
const IMG_REGEX = /image\("(.*)\"\)/;
const maxHeight = 100;

export const provideHover: HoverProvider = {
  provideHover: async (document, position, _token) => {
    if (
      !workspace.getConfiguration("visualize-typescript").get("enabled", true)
    ) {
      return;
    }

    const executeDefinitionProvider = await commands.executeCommand<
      Array<LocationLink>
    >("vscode.executeDefinitionProvider", document.uri, position);

    // todo: get last one
    const locationLink =
      executeDefinitionProvider && executeDefinitionProvider[0];

    if (!locationLink) {
      return;
    }

    const { targetUri } = locationLink;
    const binaryData = await workspace.fs.readFile(targetUri);
    const textLinesArray = binaryData.toString().split("\n");

    let exactLineText = textLinesArray[locationLink.targetRange.start.line];
    let previousLineText =
      locationLink.targetRange.start.line > 0 &&
      textLinesArray[locationLink.targetRange.start.line - 1];

    let imageRegexResult = IMG_REGEX.exec(exactLineText);
    let colorRegexResult = COLOR_REGEX.exec(exactLineText);

    if (previousLineText) {
      if (!imageRegexResult) {
        imageRegexResult = IMG_REGEX.exec(previousLineText);
      }

      if (!colorRegexResult) {
        colorRegexResult = COLOR_REGEX.exec(previousLineText);
      }
    }

    if (imageRegexResult) {
      const imagePath = imageRegexResult[1];

      if (!imagePath) {
        return;
      }
      const absPath = resolve(dirname(targetUri.path), imagePath);

      let mdString = `![image](${absPath}|height=${maxHeight})`;

      const contents = new MarkdownString(mdString);
      contents.isTrusted = true;

      return new Hover(contents);
    } else if (colorRegexResult) {
      const color = colorRegexResult[1];

      if (!color) {
        return;
      }

      const width = 50;
      const height = 50;

      const base64String = await colorToBase64String(color, width, height);

      let mdString = `![color](data:image/png;base64,${base64String}|height=${height})`;

      const contents = new MarkdownString(mdString);
      contents.isTrusted = true;

      return new Hover(contents);
    }
    return;
  },
};

// const range = document.getWordRangeAtPosition(position);
// const word = document.getText(range);

// const executeDocumentSymbolProvider = await commands.executeCommand(
//   "vscode.executeDocumentSymbolProvider",
//   document.uri
// );
// const targetRangeText = document.getText(locationLink.targetRange);
// const originSelectionRangeText = document.getText(
//   locationLink.originSelectionRange
// );
// const targetSelectionRangeText = document.getText(
//   locationLink.targetSelectionRange
// );
// const imagePath =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABSlBMVEUAAAD28vKlEh7XGyusHSwRAALNEyT2Q0ytFSMyBAh0CBLICx/MKjafDhu9FiaaDhu5EyS6GyqnFSTfIzOiEyJ8CxVuChPNDyLHEiPXJTHpO0TTIy/WKDSuCBvHCh6jCBm8Dx/HDiH2Q0zcOEGLBxXFDiDoND/zPkjQKDSpDRy/CR2lDRtsBxG/EyPqNEDEHy69FSZJBgziJjWNDhmWFiKxEyEFAQGdFyfLFSUAAADYJjLPHyzLHivkMz7GGyjhMTzTKDPgO0TcMj3BGie3Cx24EyHYMDvTKDTWMz23FiPEEiPoNECyFSLiMDzBESLNLDjBEyPpMz/YKTXLIzDsNUHVJjPEHiy/HSzBGSf2Q0vZGSrVEyX6SVDRCyDyPkfmLTniJjPsNEDkKjbcHy3fIjDpMTzvOkPSDyPdJDHaHi3uOUPqNkDpMz3RGChOcHzdAAAAWXRSTlMAA0EdCQj+51IyDf2ZgHNvZWAzKiAeFP37+vn27ejl4+Lc2dTSz8C7t7GwopmFhIR5PDEwKSkjFhQT/Pfv6ejf393c3NrYzsnExLmzs6+moZqRjol8e3dvNh6lMQMAAAFLSURBVCjPXZDVdsJAFEUnAqG4W3F3irbU3d1pcRq8///aezMka9H9MufcPcmaGaLAczYbx5P/lAvJiCBEkq/llTH3JLSWCIUtomBLNFutZlSvP8L1hlP2J5rAZZUQaxTTnfzNcweaV0MYhli8EDtvdP651wHONxkQ9mPMBzVJvMxHo9HsgTAAn5pBmb/jXHvRBxZFSRB9H0nhfWq+hSiK3Q8qil0ROLSDYD1doGemYmOAzWcFodkeABMLFcYetnUWhacHKGKCTRLszg8wlX81xLZbAVHdHwJTIxX5KbYTBx736gvJU/EolVsVAQy/mO8ZhL/GrDYRpBL6BuL0ScKYzxxEwqCGopYe0YzRbSIUZ9o1Ho/jVoZhwxBcWS1Z4kjr2u12IJMJwOLOOomC0xAChehOTbhfQVXKxYJ+fzCWK8FJV0yjvgbUG/L8D1M7VvyP2ng5AAAAAElFTkSuQmCC";
// const imagePath = "file:///Users/hassanein/Downloads/tv.jpg";

// [Reveal in Side Bar](command:revealInExplorer?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2FUsers%2Fhassanein%2FDownloads%2Ftv.jpg%22%2C%22scheme%22%3A%22file%22%7D%5D "Reveal in Side Bar")  \r\n
// \r\n
// [Open Containing Folder](command:revealFileInOS?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2FUsers%2Fhassanein%2FDownloads%2Ftv.jpg%22%2C%22scheme%22%3A%22file%22%7D%5D "Open Containing Folder")  \r\n
// 1300x866

// const executeDeclarationProvider = await commands.executeCommand(
//   "vscode.executeDeclarationProvider",
//   document.uri,
//   position
// );
// const executeTypeDefinitionProvider = await commands.executeCommand(
//   "vscode.executeTypeDefinitionProvider",
//   document.uri,
//   position
// );
// const executeImplementationProvider = await commands.executeCommand(
//   "vscode.executeImplementationProvider",
//   document.uri,
//   position
// );
// const executeHoverProvider = await commands.executeCommand(
//   "vscode.executeHoverProvider",
//   document.uri,
//   position
// );
// const executeDocumentHighlights = await commands.executeCommand(
//   "vscode.executeDocumentHighlights",
//   document.uri,
//   position
// );
// const executeReferenceProvider = await commands.executeCommand(
//   "vscode.executeReferenceProvider",
//   document.uri,
//   position
// );
// const executeSignatureHelpProvider = await commands.executeCommand(
//   "vscode.executeSignatureHelpProvider",
//   document.uri,
//   position
// );

// console.log({
// executeDocumentSymbolProvider,
//   executeDefinitionProvider,
//   executeDeclarationProvider,
// executeTypeDefinitionProvider,
// executeImplementationProvider,
// executeHoverProvider,
// executeDocumentHighlights,
// executeReferenceProvider,
// executeSignatureHelpProvider,
// });

// console.log("provideHover", { document, position, token, word });
